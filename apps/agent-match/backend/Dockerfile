FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl wget ca-certificates && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-unifont libglib2.0-0 libnss3 libnspr4 libdbus-1-3 libatk1.0-0 \
    libatk-bridge2.0-0 libcups2 libdrm2 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 \
    libxshmfence1 libx11-xcb1 libxkbcommon0 && rm -rf /var/lib/apt/lists/* && \
    playwright install chromium
COPY . .
ENV PYTHONPATH=/app

# NOTE: betweenlines_canon (packages/canon/python) is not yet baked into
# this image. Runtime code does not import it; only dev scripts do.
# When canon becomes a runtime dep, expand build.context to apps/agent-match
# and add: COPY ../packages/canon /opt/canon && pip install -e /opt/canon/python
