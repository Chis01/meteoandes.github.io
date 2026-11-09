# MeteoAndes

Sitio científico estático de **Christian Riveros** sobre glaciares tropicales del Perú,
meteorología de alta montaña, cambio de elevación con ICESat-2, dinámica InSAR y carbono negro.

## Publicación rápida

Este paquete se diseñó para copiarse sobre el repositorio local existente sin reemplazar la carpeta oculta `.git`.

```powershell
cd C:\MeteoAndes\meteoandes-web
quarto preview
quarto render
git add -A
git commit -m "Publish complete MeteoAndes scientific website"
git push
```

El workflow `.github/workflows/publish.yml` renderiza y despliega automáticamente a `gh-pages`.

## Dominio

El archivo `CNAME` contiene `meteoandes.com`. En Cloudflare deben existir cuatro registros A para el dominio raíz y un CNAME `www` hacia `chis01.github.io`. Véase `DNS_CLOUDFLARE.md`.

## Niveles de evidencia

- **Consolidado/auditado:** cifras reproducibles y sustentadas por salidas revisadas.
- **Diagnóstico avanzado:** flujo y controles disponibles, pero sin estimación regional final.
- **Preliminar:** campañas o laboratorio pendientes de QA/QC consolidado.
- **Pendiente:** módulo metodológico sin producto empírico final.

El sitio evita convertir resultados preliminares en afirmaciones causales.
