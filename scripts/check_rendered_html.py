from pathlib import Path
from bs4 import BeautifulSoup
import re, sys
root=Path(__file__).resolve().parents[1]
site=root/"_site"
if not site.exists(): raise SystemExit("_site no existe; ejecute quarto render")
errors=[]
for p in site.rglob("*.html"):
    rel=p.relative_to(site).as_posix(); text=p.read_text(encoding="utf-8",errors="ignore"); soup=BeautifulSoup(text,"html.parser")
    if len(soup.find_all("h1")) != 1 and rel not in {"search.html"}:
        errors.append(f"{rel}: {len(soup.find_all('h1'))} H1")
    for code in soup.select("pre code"):
        if "<div class=" in code.get_text(): errors.append(f"{rel}: HTML crudo dentro de codigo")
    if soup.select_one(".quarto-code-tools") and not (rel.startswith("metodos/") or rel.startswith("en/methods/")):
        errors.append(f"{rel}: code tools fuera de metodos")
    for meta in soup.select('meta[property="og:image"],meta[name="twitter:image"]'):
        if (meta.get("content") or "").lower().endswith(".svg"): errors.append(f"{rel}: OG/Twitter SVG")
    if re.search(r'style="[^"]*#[0-9a-fA-F]{3,8}',text): errors.append(f"{rel}: color hexadecimal inline")
if errors:
    print("\n".join("ERROR: "+e for e in errors)); sys.exit(1)
print("OK: HTML renderizado supera controles de auditoria")
