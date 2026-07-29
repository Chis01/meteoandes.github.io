# MeteoAndes

Sitio científico estático de Christian Riveros sobre glaciares tropicales, meteorología de alta montaña, carbono negro, ICESat‑2, Sentinel‑1 InSAR y energía superficial.

## Inicio rápido en Windows

```bat
VISTA_PREVIA.cmd
PUBLICAR.cmd
```

`PUBLICAR.cmd` evita la restricción de ejecución de PowerShell, renderiza con Quarto, ejecuta controles, crea el commit y envía los cambios a GitHub.

## Arquitectura

- Quarto, tema claro único.
- Español en `/`; inglés en `/en/`.
- Diseño «Espectro Andino»: el color codifica la cadena de evidencia y el trazo codifica la madurez.
- Interactividad con JavaScript nativo, sin framework.
- GitHub Pages mediante `gh-pages` y dominio `meteoandes.com`.

## Fotografías

Las imágenes se derivan del ZIP de campo proporcionado. Como los archivos no incluían metadata completa verificable, la relación exacta sitio–fecha–autoría debe completarse en `assets/data/photo-metadata.csv` antes de una publicación formal.

## Licencias

Código: MIT. Contenido: CC BY 4.0, sujeto a derechos y créditos específicos de fotografías y datasets.
