from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]
limits={'.png':500_000,'.jpg':500_000,'.jpeg':500_000,'.webp':300_000,'.avif':250_000,'.svg':300_000}
errors=[]
for p in (root/'assets/img').rglob('*'):
    if p.is_file() and p.suffix.lower() in limits and p.stat().st_size>limits[p.suffix.lower()]:
        errors.append(f"{p.relative_to(root)}: {p.stat().st_size/1024:.1f} KB")
if errors:
    print('Images above repository budget:'); print('\n'.join(errors)); sys.exit(1)
print('Image budgets: OK')
