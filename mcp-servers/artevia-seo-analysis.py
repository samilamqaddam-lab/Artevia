#!/usr/bin/env python3
"""
Artevia B2B SEO Analysis
Analyse complète pour produits promotionnels d'entreprise
"""

import json
from serpapi import GoogleSearch

SERPAPI_API_KEY = "172f997ef4ef33b74125204b44d1e8bc026349f79ac7e426b32ae4cfe73f986e"

# Mots-clés stratégiques B2B pour Artevia
KEYWORDS_B2B = {
    "Génériques B2B": [
        "objets publicitaires personnalisés maroc",
        "cadeaux d'entreprise personnalisés",
        "goodies entreprise maroc",
        "articles promotionnels maroc",
        "communication par l'objet maroc",
    ],
    "Catégories Produits": [
        "stylos personnalisés entreprise",
        "bloc notes personnalisé entreprise",
        "carnets personnalisés logo",
        "chemises personnalisées entreprise",
        "fournitures bureau personnalisées",
    ],
    "Occasions B2B": [
        "cadeaux fin d'année entreprise maroc",
        "cadeaux clients fidélité",
        "goodies événement entreprise",
        "kit bienvenue employé",
        "cadeaux séminaire entreprise",
    ],
    "Secteur & Services": [
        "imprimerie corporate maroc",
        "fournisseur objets publicitaires maroc",
        "personnalisation produits entreprise",
        "impression logo entreprise",
    ]
}

def search_keyword(query, location="Morocco", num=10):
    """Recherche SERPAPI pour un mot-clé."""
    params = {
        "q": query,
        "location": location,
        "num": num,
        "hl": "fr",
        "api_key": SERPAPI_API_KEY
    }

    try:
        search = GoogleSearch(params)
        results = search.get_dict()

        organic_results = results.get("organic_results", [])
        formatted = []

        for idx, result in enumerate(organic_results[:num], 1):
            formatted.append({
                "position": idx,
                "title": result.get("title", ""),
                "link": result.get("link", ""),
                "domain": result.get("link", "").split("/")[2] if "//" in result.get("link", "") else "",
                "snippet": result.get("snippet", "")
            })

        return formatted
    except Exception as e:
        print(f"Erreur pour '{query}': {e}")
        return []

def analyze_competitor_presence(results):
    """Analyse la présence des concurrents dans les résultats."""
    competitors = {}

    for result in results:
        domain = result.get("domain", "")
        if domain and domain not in competitors:
            competitors[domain] = {
                "domain": domain,
                "positions": [],
                "titles": []
            }
        if domain:
            competitors[domain]["positions"].append(result["position"])
            competitors[domain]["titles"].append(result["title"])

    return competitors

def generate_b2b_seo_report():
    """Génère un rapport SEO complet B2B pour Artevia."""
    print("\n" + "="*80)
    print("🎯 RAPPORT SEO B2B - ARTEVIA")
    print("Business Model: Produits Promotionnels Personnalisés pour Entreprises")
    print("="*80 + "\n")

    all_competitors = {}
    category_insights = {}

    for category, keywords in KEYWORDS_B2B.items():
        print(f"\n📊 CATÉGORIE: {category}")
        print("-" * 80)

        category_competitors = {}

        for keyword in keywords:
            print(f"\n🔍 Mot-clé: {keyword}")

            results = search_keyword(keyword, num=10)

            if not results:
                print("   ⚠️  Aucun résultat")
                continue

            # Top 3
            print(f"   Top 3:")
            for i, result in enumerate(results[:3], 1):
                print(f"   #{i} {result['domain']}: {result['title'][:60]}...")

            # Analyse concurrents
            competitors = analyze_competitor_presence(results)

            # Agrégation
            for domain, data in competitors.items():
                if domain not in all_competitors:
                    all_competitors[domain] = {
                        "domain": domain,
                        "appearances": 0,
                        "keywords": [],
                        "avg_position": 0,
                        "positions": []
                    }

                all_competitors[domain]["appearances"] += 1
                all_competitors[domain]["keywords"].append(keyword)
                all_competitors[domain]["positions"].extend(data["positions"])

                if domain not in category_competitors:
                    category_competitors[domain] = 0
                category_competitors[domain] += 1

        # Top concurrents par catégorie
        top_category = sorted(category_competitors.items(), key=lambda x: x[1], reverse=True)[:5]
        category_insights[category] = top_category

        print(f"\n   🏆 Top 5 Concurrents - {category}:")
        for domain, count in top_category:
            print(f"      {domain}: {count} apparitions")

    # Calcul moyennes
    for domain, data in all_competitors.items():
        if data["positions"]:
            data["avg_position"] = sum(data["positions"]) / len(data["positions"])

    # Rapport final
    print("\n" + "="*80)
    print("📈 ANALYSE GLOBALE DES CONCURRENTS")
    print("="*80 + "\n")

    # Top 10 concurrents globaux
    top_competitors = sorted(
        all_competitors.items(),
        key=lambda x: (x[1]["appearances"], -x[1]["avg_position"]),
        reverse=True
    )[:10]

    print("🥇 TOP 10 CONCURRENTS B2B (par fréquence d'apparition):\n")
    for idx, (domain, data) in enumerate(top_competitors, 1):
        print(f"{idx}. {domain}")
        print(f"   - Apparitions: {data['appearances']}/{len([k for cat in KEYWORDS_B2B.values() for k in cat])} recherches")
        print(f"   - Position moyenne: {data['avg_position']:.1f}")
        print(f"   - Mots-clés: {', '.join(data['keywords'][:3])}{'...' if len(data['keywords']) > 3 else ''}")
        print()

    # Insights stratégiques
    print("\n" + "="*80)
    print("💡 INSIGHTS STRATÉGIQUES ARTEVIA")
    print("="*80 + "\n")

    print("1. POSITIONNEMENT B2B")
    print("   ✓ Cible: Entreprises (B2B)")
    print("   ✓ Produits: Fournitures de bureau personnalisées, objets publicitaires")
    print("   ✓ USP: Personnalisation + Qualité + Service B2B\n")

    print("2. MOTS-CLÉS PRIORITAIRES")
    print("   🎯 High Intent B2B:")
    print("      - 'cadeaux entreprise personnalisés maroc'")
    print("      - 'objets publicitaires personnalisés'")
    print("      - 'goodies entreprise maroc'")
    print("      - 'fournisseur objets publicitaires'\n")

    print("3. OPPORTUNITÉS")
    print("   📌 Longue traîne B2B:")
    print("      - 'bloc notes personnalisé logo entreprise'")
    print("      - 'stylos personnalisés avec logo maroc'")
    print("      - 'chemise rabat personnalisée corporate'")
    print("      - 'kit bienvenue employé personnalisé'\n")

    print("4. STRATÉGIE DE CONTENU")
    print("   📝 Pages à créer:")
    print("      - /entreprises/objets-publicitaires")
    print("      - /entreprises/cadeaux-clients")
    print("      - /entreprises/kits-employee-welcome")
    print("      - /occasions/fin-annee-entreprise")
    print("      - /secteurs/banque-assurance")
    print("      - /secteurs/tech-startups\n")

    print("5. DIFFÉRENCIATION")
    print("   🌟 Angles uniques Artevia:")
    print("      - 'Designer en ligne + Livraison express'")
    print("      - 'Petites quantités acceptées (vs concurrence)'")
    print("      - 'Catalogue produits haut de gamme'")
    print("      - 'Service client dédié entreprises'")
    print("      - 'Factures B2B / Paiement à terme'\n")

    # Sauvegarde JSON
    report_data = {
        "date": "2025-10-13",
        "keywords_analyzed": sum(len(v) for v in KEYWORDS_B2B.values()),
        "top_competitors": [
            {
                "rank": idx,
                "domain": domain,
                "appearances": data["appearances"],
                "avg_position": round(data["avg_position"], 1),
                "keywords": data["keywords"]
            }
            for idx, (domain, data) in enumerate(top_competitors, 1)
        ],
        "category_insights": {
            cat: [{"domain": d, "appearances": c} for d, c in comps]
            for cat, comps in category_insights.items()
        }
    }

    with open("artevia-seo-report-b2b.json", "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)

    print("="*80)
    print("✅ Rapport sauvegardé: artevia-seo-report-b2b.json")
    print("="*80 + "\n")

if __name__ == "__main__":
    generate_b2b_seo_report()
