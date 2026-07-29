from pathlib import Path
import yaml
root=Path(__file__).resolve().parents[1]
data=yaml.safe_load((root/'datos/_catalog.yml').read_text(encoding='utf-8'))
print(f"Catalog contains {len(data.get('datasets',[]))} datasets")
