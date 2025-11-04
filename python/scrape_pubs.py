from scholarly import scholarly
import json, time

def fetch_by_id(author_id, max_pubs=50):
    author = scholarly.search_author_id(author_id)
    author_filled = scholarly.fill(author, sections=["publications"])

    pubs = {}
    for i, pub in enumerate(author_filled["publications"][:max_pubs], start=1):
        pub = scholarly.fill(pub)
        bib = pub.get("bib", {})
        pubs[f"pub{i}"] = {
            "title": bib.get("title", ""),
            "authors": bib.get("author", ""),
            "year": bib.get("pub_year", ""),
            "venue": bib.get("venue", bib.get("journal", "")),
            "abstract": bib.get("abstract", ""),
            "scholar": pub.get("pub_url", ""),
            "doi": bib.get("doi", "")
        }
        time.sleep(1.5)
    return pubs

if __name__ == "__main__":
    author_id = "MzkdGtsAAAAJ&hl=en"  # ← replace with your ID
    pubs = fetch_by_id(author_id)
    with open("publications.json", "w", encoding="utf-8") as f:
        json.dump(pubs, f, indent=2, ensure_ascii=False)
    print(f"Exported {len(pubs)} publications.")
