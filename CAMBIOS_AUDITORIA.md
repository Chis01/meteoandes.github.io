# Implementación de la auditoría de MeteoAndes

## Corregido

- Herramientas de código desactivadas globalmente y habilitadas solo en páginas de métodos.
- Bloques complejos de portada extraídos a parciales HTML sin sangría Markdown.
- Un único H1 en la portada; `title: false` y `pagetitle` específico.
- Open Graph en JPEG 1200 × 630 px.
- Tema exclusivamente claro y un solo logotipo.
- Fotografías reales del ZIP suministrado en transecto, tarjetas, albedo y secciones.
- Formato numérico localizado en páginas científicas principales.
- Selector de idioma con equivalencia de rutas, `hreflang` y páginas obligatorias bilingües.
- Transecto, espectro cromático, gramática de evidencia, matriz de madurez, filtros, gráfico interactivo y comparador de albedo accesible.
- 404 bilingüe, enlace de salto, movimiento reducido y controles de calidad.

## Requiere validación del investigador

El ZIP de fotografías no incluía una tabla confiable de sitio, fecha exacta, coordenadas, cota y autoría por archivo. Para no inventar metadatos, `assets/data/photo-metadata.csv` marca esos campos como pendientes. Deben completarse antes de usar las fotografías como evidencia citable de un sitio específico.

La traducción científica inglesa es funcional para publicación, pero debe recibir revisión especializada antes de citarse como versión definitiva.
