from pathlib import Path
import re,sys
root=Path(__file__).resolve().parents[1]
site=root/'_site'; errors=[]
if not site.exists(): print('_site not found'); sys.exit(1)
for p in site.rglob('*.html'):
 text=p.read_text(encoding='utf-8',errors='ignore')
 for href in re.findall(r'href=["\']([^"\']+)["\']',text):
  if href.startswith(('http:','https:','mailto:','#','javascript:')): continue
  target=(site/href.lstrip('/').split('#')[0]) if href.startswith('/') else (p.parent/href.split('#')[0])
  if href.endswith('/'): target=target/'index.html'
  if target.suffix=='': target=target.with_suffix('.html')
  if not target.exists() and href.split('#')[0]: errors.append(f'{p.relative_to(site)} -> {href}')
if errors:
 print('\n'.join(errors[:100])); sys.exit(1)
print('Internal links: OK')
