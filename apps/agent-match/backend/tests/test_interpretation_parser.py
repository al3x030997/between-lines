"""Tests for autoquery.extractor.interpretation_parser (L2)."""
from pathlib import Path

from autoquery.extractor.interpretation_parser import parse

FIXTURE = Path(__file__).parent / "fixtures" / "interpretation_sample.txt"


def test_identity_pass_through():
    result = parse(FIXTURE.read_text())
    ident = result["identity"]
    assert ident["name"] == "Aashna Avachat"
    assert ident["availability"] == "OPEN"


def test_global_conditions_carry_strength_tags():
    result = parse(FIXTURE.read_text())
    gc = result["global_conditions"]
    assert len(gc) == 3
    strengths = [b["strength"] for b in gc]
    assert "REQUIRED" in strengths
    assert "STRONGLY_PREFERRED" in strengths
    assert "PREFERRED" in strengths
    required = next(b for b in gc if b["strength"] == "REQUIRED")
    assert "authors/illustrators of color" in required["text"]


def test_preference_sections_audience_enum_and_verbatim():
    result = parse(FIXTURE.read_text())
    sections = result["preference_sections"]
    labels = [s["label"] for s in sections]
    assert labels == ["Picture Books", "Young Adult", "Adult"]

    pb = sections[0]
    assert pb["audience"] == ["picture_books"]
    assert pb["audience_raw"] == "picture books"

    ya = sections[1]
    assert ya["audience"] == ["young_adult", "new_adult"]
    assert ya["audience_raw"] == "YA and new adult"


def test_preference_sections_wants_dnw_split():
    result = parse(FIXTURE.read_text())
    pb = result["preference_sections"][0]
    wants_text = [e["text"] for e in pb["wants"]]
    dnw_text = [e["text"] for e in pb["does_not_want"]]
    assert any("Laugh-out-loud" in w for w in wants_text)
    assert "food-based books" in dnw_text
    assert "biographies" in dnw_text


def test_preference_section_conditions_have_strength():
    result = parse(FIXTURE.read_text())
    pb = result["preference_sections"][0]
    assert len(pb["conditions"]) == 1
    cond = pb["conditions"][0]
    assert cond["strength"] == "REQUIRED"
    assert cond["text"] == "Fiction only"


def test_preference_section_tropes_buckets():
    result = parse(FIXTURE.read_text())
    ya = result["preference_sections"][1]
    tw = [e["text"] for e in ya["tropes_wanted"]]
    te = [e["text"] for e in ya["tropes_excluded"]]
    assert "forced proximity" in tw
    assert "enemies to lovers" in tw
    assert "instalove" in te


def test_compound_expressions_attached_to_bullet():
    """A `→` line after a bullet becomes the bullet's compound field."""
    result = parse(FIXTURE.read_text())
    ya = result["preference_sections"][1]
    romcom = next(e for e in ya["wants"] if "Romantic comedies" in e["text"])
    assert romcom["compound"] == "romcom WHERE both_leads=POC"

    palace = next(e for e in ya["compound"] if "palace intrigue" in e["text"])
    assert palace["compound"] is not None
    assert "palace_intrigue" in palace["compound"]
    assert "NOT magical" in palace["compound"]


def test_hard_nos_classified_into_buckets():
    result = parse(FIXTURE.read_text())
    hn = result["hard_nos"]
    content_texts = [e["text"] for e in hn["content"]]
    format_texts = [e["text"] for e in hn["format"]]
    trope_texts = [e["text"] for e in hn["trope"]]
    category_texts = [e["text"] for e in hn["category"]]

    assert "sexual violence on the page" in content_texts
    assert "poetry collections" in format_texts
    assert "non-consensual romance" in trope_texts
    assert "children's non-fiction" in category_texts


def test_hard_nos_compound_on_exception_bullet():
    result = parse(FIXTURE.read_text())
    fantasy = next(
        e for e in result["hard_nos"]["category"]
        if "fantasy" in e["text"].lower()
    )
    assert fantasy["compound"] is not None
    assert "exceptions" in fantasy["compound"]
    assert "fantasy_elements=very_light" in fantasy["compound"]


def test_audience_unmapped_sentinel():
    text = """STEP 3: PREFERENCE SECTIONS
-----------------------------
[Weird Niche]
  Audience: (unmapped)
  Audience (verbatim): something unclassifiable
  Genres: mystery
  Wants:
    - A mystery
"""
    result = parse(text)
    sec = result["preference_sections"][0]
    assert sec["audience"] == []
    assert sec["audience_raw"] == "something unclassifiable"


def test_parse_empty():
    result = parse("")
    assert result["identity"]["name"] is None
    assert result["preference_sections"] == []
    assert result["hard_nos"] == {"content": [], "format": [], "trope": [], "category": []}
    assert result["global_conditions"] == []
