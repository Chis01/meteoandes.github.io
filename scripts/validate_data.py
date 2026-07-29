from pathlib import Path
import csv, sys
root=Path(__file__).resolve().parents[1]
checks={
 'assets/data/series/vilcanota_icesat2_trends.csv':5,
 'assets/data/series/vilcanota_hydro_year_changes.csv':6,
 'assets/data/series/insar_vilcanota_summary.csv':8,
 'assets/data/series/al30_preliminary_sessions.csv':3,
 'assets/data/series/glacier_samples_2026.csv':5,
}
errors=[]
for rel,n in checks.items():
 p=root/rel
 if not p.exists(): errors.append(f'Missing {rel}'); continue
 with p.open(encoding='utf-8') as f: rows=list(csv.DictReader(f))
 if len(rows)!=n: errors.append(f'{rel}: expected {n} rows, found {len(rows)}')
if errors:
 print('\n'.join(errors)); sys.exit(1)
print('Research tables: OK')
