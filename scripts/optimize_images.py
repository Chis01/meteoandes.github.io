from pathlib import Path
from PIL import Image
import sys
if len(sys.argv)<3:
    raise SystemExit('Usage: python scripts/optimize_images.py input.jpg output-base')
src=Path(sys.argv[1]); base=Path(sys.argv[2]); base.parent.mkdir(parents=True,exist_ok=True)
with Image.open(src) as im:
    im=im.convert('RGB')
    for width in (480,800,1200,1600,2400):
        if im.width<width: continue
        h=round(im.height*width/im.width); out=im.resize((width,h),Image.Resampling.LANCZOS)
        out.save(base.with_name(base.name+f'-{width}.webp'),format='WEBP',quality=78,method=6)
        out.save(base.with_name(base.name+f'-{width}.jpg'),format='JPEG',quality=82,optimize=True,progressive=True)
