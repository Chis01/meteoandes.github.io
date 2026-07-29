from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
errors=[]
for p in root.rglob('*'):
 if p.suffix.lower() not in {'.qmd','.html'} or '_site' in p.parts: continue
 text=p.read_text(encoding='utf-8',errors='ignore')
 for m in re.finditer(r'<img\b[^>]*>',text,re.I):
  tag=m.group(0); alt=re.search(r'\balt=["\']([^"\']*)["\']',tag,re.I)
  if not alt: errors.append(f'{p.relative_to(root)}: img without alt')
  elif len(alt.group(1).strip())<15: errors.append(f'{p.relative_to(root)}: short alt: {alt.group(1)!r}')
  if not re.search(r'\bwidth=["\'][0-9]+["\']',tag,re.I) or not re.search(r'\bheight=["\'][0-9]+["\']',tag,re.I): errors.append(f'{p.relative_to(root)}: img without intrinsic dimensions')
if errors:
 print('\n'.join(errors)); sys.exit(1)
print('Image alt text: OK')
