from pathlib import Path
import re, sys
try:
    import yaml
except ImportError:
    yaml = None
root=Path(__file__).resolve().parents[1]
errors=[]
qmd=list(root.rglob("*.qmd"))
for p in qmd:
    text=p.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        errors.append(f"Front matter ausente: {p.relative_to(root)}")
        continue
    if yaml is not None:
        try:
            yaml.safe_load(text.split("---",2)[1])
        except Exception as e:
            errors.append(f"YAML invalido {p.relative_to(root)}: {e}")
    if re.search(r'style="[^"]*#[0-9a-fA-F]{3,8}',text):
        errors.append(f"Color inline: {p.relative_to(root)}")
    if "/assets/img/albedo/" in text or "/assets/img/glaciares/" in text:
        errors.append(f"Activo sintetico antiguo: {p.relative_to(root)}")
    fm=text.split("---",2)[1]
    if "code-tools: true" in fm and not ("/metodos/" in "/"+p.relative_to(root).as_posix() or "/en/methods/" in "/"+p.relative_to(root).as_posix()):
        errors.append(f"Code tools fuera de metodos: {p.relative_to(root)}")
for p in (root/"assets/partials").rglob("*.html"):
    text=p.read_text(encoding="utf-8")
    if re.search(r"^ {4,}<div",text,re.M): errors.append(f"HTML con sangria Markdown: {p.relative_to(root)}")
    if "{arrow_svg}" in text: errors.append(f"Placeholder sin resolver: {p.relative_to(root)}")
# referenced local /assets files
for p in qmd + list((root/"assets/partials").rglob("*.html")):
    text=p.read_text(encoding="utf-8")
    for ref in re.findall(r'(?:src|href)="(/assets/[^"?#]+)',text):
        if not (root/ref.lstrip("/")).exists(): errors.append(f"Recurso ausente {ref} en {p.relative_to(root)}")
if errors:
    print("\n".join("ERROR: "+e for e in errors)); sys.exit(1)
print(f"OK: {len(qmd)} QMD y parciales validados")
