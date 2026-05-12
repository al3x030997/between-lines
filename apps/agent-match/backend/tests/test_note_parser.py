"""Tests for autoquery.extractor.note_parser (L1 Chunker, verbatim-only)."""
from pathlib import Path

from autoquery.extractor.note_parser import parse

FIXTURE = Path(__file__).parent / "fixtures" / "note_taker_sample.txt"


def test_parse_identity():
    result = parse(FIXTURE.read_text())
    ident = result["identity"]
    assert ident["name"] == "Aashna Avachat"
    assert ident["organization"] == "Neighborhood Literary Agency"
    assert ident["role"] == "Literary Agent"
    assert ident["email"] == "aashna@neighborhoodlit.com"
    assert ident["submission_portal"] == "QueryTracker"
    assert ident["availability"] == "OPEN"


def test_parse_global_conditions_verbatim():
    """L1 keeps global conditions as verbatim bullets — no strength tags."""
    result = parse(FIXTURE.read_text())
    gc = result["global_conditions"]
    assert isinstance(gc, list)
    assert len(gc) == 3
    assert all(isinstance(b, str) for b in gc)
    assert any("authors/illustrators of color" in b for b in gc)
    assert any("own-voices" in b for b in gc)


def test_parse_preference_sections_shape():
    """L1 sections carry verbatim audience/genres + flat excerpts list."""
    result = parse(FIXTURE.read_text())
    sections = result["preference_sections"]
    labels = [s["label"] for s in sections]
    assert labels == ["Picture Books", "Young Adult", "Adult"]

    pb = sections[0]
    assert pb["audience_raw"] == "picture books"
    assert "contemporary" in pb["genres_raw"]
    assert any("Laugh-out-loud" in e for e in pb["excerpts"])
    assert any("Food-based" in e or "food-based" in e for e in pb["excerpts"])

    ya = sections[1]
    assert ya["audience_raw"] == "YA and new adult"
    assert any("forced proximity" in e for e in ya["excerpts"])
    assert any("instalove" in e for e in ya["excerpts"])
    assert any("palace intrigue" in e for e in ya["excerpts"])


def test_parse_hard_nos_flat_list():
    """L1 emits hard-nos as a flat verbatim list — no content/format split."""
    result = parse(FIXTURE.read_text())
    hn = result["hard_nos"]
    assert isinstance(hn, list)
    assert "sexual violence on the page" in hn
    assert "poetry collections" in hn
    assert "non-consensual romance" in hn
    assert "children's non-fiction" in hn


def test_parse_submission_blocks():
    result = parse(FIXTURE.read_text())
    sub = result["submission"]
    cats = [b["category"] for b in sub if b.get("category")]
    assert "Picture Books" in cats
    assert "Young Adult" in cats
    assert "All Submissions" in cats


def test_parse_comps_and_taste_verbatim():
    """L1 keeps comps and taste as flat verbatim bullet lists."""
    result = parse(FIXTURE.read_text())
    comps = result["comp_titles_high_priority"]
    assert any("Clique" in c for c in comps)
    taste = result["taste_references"]
    assert any("Pachinko" in b for b in taste)
    assert any("Yellowjackets" in b for b in taste)
    assert any("Mitski" in b for b in taste)


def test_parse_themes_verbatim():
    result = parse(FIXTURE.read_text())
    themes = result["cross_cutting_themes"]
    assert "found family" in themes
    assert "queer joy" in themes


def test_parse_confidence_flags():
    result = parse(FIXTURE.read_text())
    flags = result["confidence_flags"]
    assert any("country" in f.lower() for f in flags["inferred"])
    assert any("response time" in f.lower() for f in flags["missing"])


def test_parse_empty():
    result = parse("")
    assert result["identity"]["name"] is None
    assert result["preference_sections"] == []
    assert result["hard_nos"] == []
    assert result["global_conditions"] == []


def test_parse_missing_optional_section():
    text = """STEP 1: IDENTITY
-----------------
Name: Solo Agent
Availability: CLOSED
"""
    result = parse(text)
    assert result["identity"]["name"] == "Solo Agent"
    assert result["identity"]["availability"] == "CLOSED"
    assert result["preference_sections"] == []
    assert result["global_conditions"] == []


def test_excerpts_preserve_compound_bullets():
    """Compound bullets stay as a single excerpt — splitting is L2's job."""
    text = """STEP 1: IDENTITY
-----------------
Name: Test Agent

STEP 3: PREFERENCE SECTIONS
-----------------------------
[General]
  Audience: adult
  Genres: mystery
  Excerpts:
    - palace intrigue, not magical, not dystopian, royalty-based
    - mysteries that are not police-focused and not organized-crime-focused
"""
    result = parse(text)
    excerpts = result["preference_sections"][0]["excerpts"]
    assert any("palace intrigue, not magical, not dystopian, royalty-based" == e for e in excerpts)
    assert any("police-focused" in e and "organized-crime" in e for e in excerpts)
