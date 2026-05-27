"""Shared HTTP client for Reddit's public .json endpoints.

Enforces the politeness, retry, and User-Agent rules in
docs/REQUIREMENTS.md § Shared non-functional requirements so packages 01 and 02
share one implementation.
"""

from __future__ import annotations

import os
import random
import signal
import time
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Any, Callable, Iterator

import httpx

RequestEvent = dict[str, Any]
OnEvent = Callable[[RequestEvent], None]

OWNER = os.environ.get("REDDIT_OWNER", "betweenlines")
UA = f"between-reads-research/0.1 (by /u/{OWNER})"

RETRY_STATUSES = {429, 500, 502, 503, 504}
PERMANENT_STATUSES = {403, 404}
# Longer backoffs because Reddit's anon rate-limit ban can last 60-120s
BACKOFFS_SECONDS = (5, 15, 30, 60, 120)  # delay AFTER each failed attempt
MAX_ATTEMPTS = len(BACKOFFS_SECONDS)  # 5 attempts total

# Reddit's unauthenticated rate limit is ~10 req/min; default to 2s/req with
# REDDIT_MIN_INTERVAL=<seconds> override for slower-paced runs.
MIN_INTERVAL_SECONDS = float(os.environ.get("REDDIT_MIN_INTERVAL", "2.0"))
JITTER_SECONDS = 0.2


class RateLimitedClient:
    """httpx.Client wrapper that paces requests and retries transient failures."""

    def __init__(
        self,
        timeout: float = 30.0,
        on_event: OnEvent | None = None,
    ) -> None:
        self._client = httpx.Client(
            headers={"User-Agent": UA},
            timeout=timeout,
            follow_redirects=True,
        )
        self._last_request_monotonic: float = 0.0
        self._on_event = on_event

    def __enter__(self) -> "RateLimitedClient":
        return self

    def __exit__(self, *_exc: Any) -> None:
        self.close()

    def close(self) -> None:
        self._client.close()

    def _pace(self) -> None:
        elapsed = time.monotonic() - self._last_request_monotonic
        target = MIN_INTERVAL_SECONDS + random.uniform(-JITTER_SECONDS, JITTER_SECONDS)
        sleep_for = target - elapsed
        if sleep_for > 0:
            time.sleep(sleep_for)

    def get_json(self, url: str, params: dict[str, Any] | None = None) -> dict[str, Any] | None:
        """GET a JSON endpoint. Returns the parsed body, or None on 403/404."""

        full_url = str(httpx.URL(url).copy_merge_params(params or {}))
        last_exc: Exception | None = None
        retries = 0
        for attempt in range(MAX_ATTEMPTS):
            if attempt > 0:
                time.sleep(BACKOFFS_SECONDS[attempt - 1])
            self._pace()
            try:
                response = self._client.get(url, params=params)
            except httpx.RequestError as exc:
                last_exc = exc
                retries += 1
                self._last_request_monotonic = time.monotonic()
                continue
            self._last_request_monotonic = time.monotonic()

            if response.status_code in PERMANENT_STATUSES:
                self._emit(full_url, response.status_code, retries)
                return None
            if response.status_code in RETRY_STATUSES:
                retries += 1
                continue
            response.raise_for_status()
            self._emit(full_url, response.status_code, retries)
            return response.json()

        self._emit(full_url, "exhausted", retries)
        if last_exc is not None:
            raise last_exc
        raise httpx.HTTPError(f"Exhausted {MAX_ATTEMPTS} attempts for {url}")

    def _emit(self, url: str, status: int | str, retries: int) -> None:
        if self._on_event is None:
            return
        self._on_event(
            {
                "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "url": url,
                "status": status,
                "retries": retries,
            }
        )


@contextmanager
def graceful_sigint() -> Iterator[dict[str, bool]]:
    """Catch SIGINT so a long crawl can finish the in-flight request and exit.

    Usage:
        with graceful_sigint() as flag:
            while work and not flag["stopped"]:
                ...
    """

    state = {"stopped": False}
    previous = signal.getsignal(signal.SIGINT)

    def _handler(_sig: int, _frame: Any) -> None:
        state["stopped"] = True

    signal.signal(signal.SIGINT, _handler)
    try:
        yield state
    finally:
        signal.signal(signal.SIGINT, previous)
