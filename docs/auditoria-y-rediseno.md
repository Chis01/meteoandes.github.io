# MeteoAndes — Auditoría de la portada y dirección de rediseño

**Sitio auditado:** https://meteoandes.com/
**Repositorio:** github.com/Chis01/meteoandes.github.io
**Generador detectado:** Quarto 1.10.18
**Fecha de auditoría:** julio de 2026
**Destinatario:** desarrollador front-end profesional
**Naturaleza del documento:** especificación descriptiva. **No contiene código.** Describe qué construir, con qué comportamiento, con qué valores y bajo qué criterios de aceptación. La implementación es decisión del desarrollador.

---

## 0. Alcance y honestidad de la auditoría

**Lo que sí pude examinar:** el HTML entregado por el servidor, la estructura del DOM, los metadatos (Open Graph, Twitter Card, viewport, generador), la jerarquía de encabezados, los atributos de accesibilidad presentes en el marcado, las rutas de los recursos y el contenido textual completo de la portada.

**Lo que no pude examinar:** el renderizado visual real (colores en pantalla, tipografías cargadas, espaciado efectivo), las hojas de estilo compiladas, el JavaScript en ejecución, el comportamiento responsive, las métricas de rendimiento reales y el contenido de las páginas internas.

Los hallazgos marcados **[CONFIRMADO]** son verificables en el HTML entregado. Los marcados **[VERIFICAR]** son inferencias fuertes que el desarrollador debe comprobar antes de actuar.

---

# PARTE I — AUDITORÍA

## 1. Errores críticos

### E-01 · El código fuente de la portada se muestra al visitante [CONFIRMADO] 🔴 CRÍTICO

**Qué ocurre.** Al final de la portada aparece un panel titulado «Ejecutar el código» que despliega el archivo `index.qmd` completo —las 127 líneas, con numeración— incluyendo todo el marcado HTML, los comentarios y la estructura interna. Cualquier visitante ve el andamiaje del sitio en lugar del sitio.

**Causa raíz.** La opción de herramientas de código está activada globalmente en la configuración del proyecto y se aplica también a la portada, que no es un documento computacional.

**Criterio de corrección.** Las herramientas de código deben activarse **exclusivamente** en las páginas que renderizan notebooks (`metodos/`) y desactivarse por defecto en el resto. La activación debe declararse página por página, nunca a nivel de proyecto.

**Verificación de aceptación.** En la portada y en todas las páginas de `glaciares/`, `investigacion/`, `datos/`, `sobre/` y `bitacora/` no debe existir ningún control de código, ningún panel plegable de fuente y ninguna referencia al repositorio dentro del cuerpo del documento.

---

### E-02 · Bloques de HTML se imprimen como código en lugar de renderizarse [CONFIRMADO] 🔴 CRÍTICO

**Qué ocurre.** Dos bloques completos aparecen como texto literal dentro de recuadros de código en mitad de la portada:

1. El bloque del héroe: el `div` del eyebrow, el titular «Medimos el hielo que queda.», el párrafo de entrada y los dos botones.
2. La rejilla de cifras clave: los cuatro contadores con sus etiquetas.

En lugar de ver un titular y cuatro cifras, el visitante ve etiquetas HTML crudas.

**Causa raíz.** Dentro de los bloques de HTML incrustado en el archivo fuente, las líneas anidadas están indentadas con cuatro o más espacios. El procesador de Markdown interpreta cualquier línea con cuatro espacios de sangría como un bloque de código preformateado, y por tanto deja de tratar ese HTML como HTML.

**Criterio de corrección.** Elegir **una** de estas tres estrategias y aplicarla de forma consistente en todo el sitio:

- **Estrategia A (recomendada):** extraer todos los bloques estructurales complejos —héroe, rejilla de cifras, cadena de evidencia, tarjetas, comparador— a archivos parciales incluidos, de modo que el archivo de la portada contenga únicamente contenido editorial y llamadas a esos parciales. Es la única estrategia que escala y la que hace mantenible el sitio.
- **Estrategia B:** usar bloques marcados explícitamente como HTML crudo, que el procesador no reinterpreta.
- **Estrategia C:** eliminar toda sangría dentro de bloques HTML. Funciona, pero deja el archivo fuente ilegible y el error reaparecerá en la siguiente edición.

**Verificación de aceptación.** Ninguna página del sitio debe contener recuadros de código que no sean deliberados. Añadir al proceso de integración continua una comprobación automática que falle si detecta la cadena `<div class=` dentro de un elemento de código en cualquier archivo HTML generado.

---

### E-03 · Dos encabezados de nivel 1 en la misma página [CONFIRMADO] 🔴 CRÍTICO

**Qué ocurre.** La portada emite un primer encabezado de nivel 1 con el texto «MeteoAndes», generado automáticamente a partir del título del documento, y un segundo encabezado de nivel 1 dentro del héroe con el texto «Medimos el hielo que queda.».

**Por qué importa.** Rompe la jerarquía documental, confunde a los lectores de pantalla, y los motores de búsqueda no pueden determinar cuál es el titular real de la página. Es un incumplimiento de WCAG 2.2 en el criterio de encabezados y etiquetas.

**Criterio de corrección.** Un único encabezado de nivel 1 por página. En la portada debe ser el titular del héroe. El título del documento debe suprimirse de la representación visual sin perder su función en la etiqueta del navegador y en los metadatos.

---

### E-04 · La imagen de vista previa social es un SVG [CONFIRMADO] 🔴 CRÍTICO

**Qué ocurre.** Los metadatos Open Graph y Twitter Card apuntan a `assets/img/charts/icesat2-forest.svg`.

**Por qué importa.** Ninguna plataforma social —Facebook, LinkedIn, X, WhatsApp, Slack, Telegram, Bluesky— renderiza SVG en las tarjetas de vista previa. Al compartir el sitio, aparece sin imagen. Para un programa científico que busca difusión y financiación, es una pérdida directa de visibilidad.

**Criterio de corrección.** Producir imágenes de vista previa en JPEG o PNG, de 1 200 × 630 píxeles exactos, peso inferior a 300 kB. Una por sección principal. Cada una debe contener una fotografía de campo a sangre, el nombre del sitio en tipografía grande y legible a tamaño de miniatura, y el logotipo. El texto debe ocupar al menos el 20 % de la altura para seguir siendo legible en una miniatura de 240 píxeles.

---

## 2. Errores de severidad alta

### E-05 · Logotipo duplicado en la barra de navegación [CONFIRMADO] 🟠

El enlace de marca contiene **dos** instancias de la misma imagen de logotipo y, a continuación, el texto «MeteoAndes». Es un artefacto del sistema de tema dual: se emite una variante para modo claro y otra para modo oscuro. Al eliminarse el modo oscuro (§E-06), debe quedar una sola imagen y decidirse si el texto acompaña al símbolo o si el logotipo ya lo contiene.

### E-06 · Modo oscuro presente y no deseado [CONFIRMADO] 🟠

Existe un control «Alternar modo oscuro» y la declaración de esquema de color anuncia soporte para ambos modos. **Debe eliminarse por completo:** el control, la variante oscura del tema, la declaración de esquema dual, las variantes duplicadas de logotipo y cualquier regla condicional asociada. El sitio será exclusivamente claro.

### E-07 · Colores fijados en línea que rompen el sistema y probablemente el contraste [CONFIRMADO] 🟠

Al menos dos eyebrows llevan color escrito directamente en el atributo de estilo, con valores de cian muy claro. Sobre un fondo claro, esos valores **no alcanzan** la relación de contraste mínima de 4.5:1. Sobre la sección oscura sí, pero el mecanismo es frágil.

**Criterio de corrección.** Cero colores en atributos de estilo. Todo color procede de variables del sistema. Las variantes por contexto se resuelven con clases, no con valores literales.

### E-08 · Las tarjetas de glaciar usan ilustraciones sintéticas, no fotografías [CONFIRMADO] 🟠

Los seis elementos de la rejilla de sitios apuntan a archivos SVG con textos alternativos que los describen como «ilustración científica». Para un programa de campo, la fotografía real es el activo diferencial y la prueba de que el trabajo existe. Sustituir por fotografías propias (§Parte III).

### E-09 · Posible inversión en el comparador de albedo [VERIFICAR] 🟠

En el marcado, la primera imagen es la superficie oscurecida y la segunda —la que actúa como capa superior del comparador— es la superficie limpia. Las etiquetas fijas, en cambio, sitúan «superficie limpia» a la izquierda y «superficie oscurecida» a la derecha. Debe comprobarse visualmente que al desplazar el control hacia la izquierda se revela efectivamente la superficie limpia. Si no coincide, el componente comunica lo contrario de lo que dice.

### E-10 · Formato numérico incoherente con el idioma [CONFIRMADO] 🟠

En el texto en español aparecen «−1.463 m año⁻¹», «96.5 %» y «254.01 km²», con punto decimal. La convención en español es la coma decimal y el espacio fino como separador de millares. En inglés, punto decimal y coma de millares.

**Criterio de corrección.** Toda cifra publicada debe formatearse según el idioma activo de la página. Esto incluye texto corrido, cifras clave, tablas, etiquetas de gráficos, pies de figura y metadatos. Debe existir una única función de formato numérico, parametrizada por idioma, usada en todo el sitio.

### E-11 · Cambio de idioma incompleto [CONFIRMADO] 🟠

El selector es un enlace suelto con el texto «EN» que conduce siempre al índice en inglés, con independencia de la página en que se encuentre el visitante. No hay declaraciones de alternativa lingüística en los metadatos. Requisito completo en §Parte IV.

---

## 3. Errores de severidad media

| ID | Hallazgo | Estado | Corrección |
|---|---|---|---|
| E-12 | El título de la pestaña es solo «MeteoAndes», sin descriptor | CONFIRMADO | Patrón: «Título de la página — MeteoAndes». En la portada: «MeteoAndes — Glaciares tropicales del Perú» |
| E-13 | El signo menos del atributo de datos del contador es un guion ASCII mientras el texto visible usa el signo menos tipográfico | CONFIRMADO | Unificar en signo menos matemático U+2212 en lo visible; el valor de datos debe ser numérico puro |
| E-14 | Contador animado sobre un valor de tres decimales | CONFIRMADO | Animar solo la parte entera o suprimir la animación en esa cifra; tres decimales en movimiento son ilegibles |
| E-15 | Flechas e iconos como glifos de texto («↓», «↔︎», «→») | CONFIRMADO | Sustituir por SVG en línea. Los glifos varían de forma y peso entre sistemas operativos y rompen la alineación óptica |
| E-16 | La sección de estado científico es oscura dentro de un sitio claro | CONFIRMADO | Rediseñar según §12.5. Puede conservarse un bloque de alto contraste, pero debe estar justificado por el sistema, no ser un residuo del tema dual |
| E-17 | Ausencia de enlace de salto al contenido | VERIFICAR | Primer elemento enfocable de cada página |
| E-18 | Ausencia de página de error personalizada | VERIFICAR | Página 404 con buscador y enlaces de recuperación, en ambos idiomas |
| E-19 | Discrepancia de autoría: el pie firma «Christian Riveros» | CONFIRMADO | Confirmar que el nombre publicado es el correcto y que coincide con el de las publicaciones y el ORCID |
| E-20 | El nombre del repositorio induce a confusión | CONFIRMADO | `meteoandes.github.io` bajo la cuenta `Chis01` no es un sitio de usuario. Funciona, pero conviene documentarlo para evitar errores de despliegue futuros |

---

## 4. Diagnóstico editorial

Más allá de los defectos técnicos, la portada tiene un problema de **jerarquía narrativa**: nueve secciones de peso visual similar compiten entre sí. El visitante no recibe una indicación de qué es lo más importante.

El contenido, en cambio, es excelente y poco común. Dos elementos merecen convertirse en el eje del rediseño:

1. **La cadena de evidencia** (Atmósfera → Meteorología → Depósito → Energía → Respuesta). Es una estructura conceptual clara y propia.
2. **La declaración de madurez epistémica** (Consolidado / Diagnóstico / Preliminar / Pendiente), acompañada de la regla editorial que enumera explícitamente lo que el programa **no** afirma. Esto es infrecuente y genera una credibilidad enorme.

La dirección de rediseño convierte ambos en el sistema visual del sitio.

---

# PARTE II — DIRECCIÓN CREATIVA

## 5. El concepto: «El Espectro Andino»

### 5.1 Idea rectora

El color de este sitio **no decora: es una leyenda.**

Cada eslabón de la cadena de evidencia recibe un color vivo y saturado, tomado de un fenómeno real de la alta montaña andina. Ese color se propaga después a todo lo que pertenece a ese eslabón: el titular de la sección, el filete que lo subraya, el borde de sus tarjetas, la serie en sus gráficos, la capa en el mapa, el marcador en la línea de tiempo, el punto de la miniatura.

El visitante aprende el código cromático en los primeros diez segundos y a partir de ahí **navega por color**. Es exactamente el mecanismo que emplean las revistas de alto impacto para señalar áreas temáticas, pero aquí el código está anclado a la física de la cadena de medición, no a una taxonomía editorial arbitraria.

Esto resuelve la petición de «títulos y subtítulos muy coloridos sin perder el formato científico»: la saturación es alta, pero cada color significa algo. Un titular naranja no es una elección estética: informa de que esa sección trata de balance de energía.

### 5.2 Segundo sistema: la gramática del estado de evidencia

El programa ya clasifica sus afirmaciones en cuatro niveles de madurez. Ese nivel se codifica con **la forma del trazo**, no con el color, para que ambos sistemas sean legibles simultáneamente y sin conflicto:

| Estado | Trazo | Lectura inmediata |
|---|---|---|
| **Consolidado** | Línea continua, 3 px | Resultado defendible y publicable |
| **Diagnóstico** | Línea discontinua larga, 3 px | Geometría verificada, resultado en proceso |
| **Preliminar** | Línea punteada, 2 px | Datos existentes, control de calidad abierto |
| **Pendiente** | Línea de puntos finos, 1 px, al 40 % de opacidad | Declarado, aún no medido |

Esta gramática se aplica **en todas partes**: subrayado de titulares, borde superior de tarjetas, línea de los gráficos, contorno de los marcadores del mapa, filete de las entradas de la bitácora. Una tarjeta con borde punteado dice «preliminar» antes de que el visitante lea una sola palabra.

**Por qué es el elemento memorable.** Prácticamente ningún sitio científico expone su propia incertidumbre como sistema visual. Hacerlo comunica confianza y rigor de una forma que ninguna declaración textual consigue.

### 5.3 El riesgo asumido

Un fondo casi blanco combinado con seis colores de saturación alta es una decisión arriesgada: mal ejecutada produce un resultado ruidoso y aficionado. Se justifica porque el objeto fotografiado —hielo, cielo de puna, lagunas glaciares, nieve rosada por algas, rocisler del amanecer— **es** de una saturación extrema en la realidad, y porque el color está sometido a una regla estricta (§6.4) que impide su uso arbitrario.

---

## 6. Sistema de color

### 6.1 Base: papel mural ártico

| Rol | Valor | Uso |
|---|---|---|
| Papel | `#FCFCFA` | Fondo dominante de todo el sitio |
| Papel elevado | `#F5F5F1` | Superficies de tarjeta, secciones alternas |
| Papel hundido | `#EDEDE7` | Fondos de bloques de datos, pies de tabla |
| Filete | `#E0E0D8` | Reglas horizontales, bordes de tabla, separadores |
| Tinta | `#12141A` | Texto corrido y titulares neutros |
| Tinta atenuada | `#585D66` | Metadatos, pies de figura, texto secundario |
| Tinta tenue | `#8A9099` | Créditos fotográficos, marcas de eje |

El blanco es **cálido y ligeramente terroso**, no clínico. Esto es deliberado: un blanco puro compite con la nieve de las fotografías y las hace parecer grises. Un papel cálido hace que el hielo azul y el cielo de puna avancen hacia el espectador.

### 6.2 El espectro de la cadena de evidencia

| Eslabón | Nombre del color | Valor | Origen del color |
|---|---|---|---|
| **Atmósfera** | Ultramar de altura | `#2438E8` | El azul profundo del cielo de puna sobre los 5 000 m, donde la columna atmosférica es delgada |
| **Meteorología** | Verde de bofedal | `#00A67E` | El verde saturado de los humedales altoandinos |
| **Depósito** | Magenta de nieve sandía | `#D6006E` | El rosa intenso de la nieve colonizada por algas nivales en las cordilleras tropicales |
| **Energía** | Rosicler | `#FF6A1F` | El naranja incandescente del alpenglow sobre los nevados al amanecer |
| **Respuesta** | Turquesa de laguna | `#00B4D8` | El turquesa de las lagunas proglaciares por harina de roca en suspensión |

Cada color dispone de tres derivados obligatorios que el desarrollador debe generar y documentar:

- **Base:** el valor de la tabla. Uso: titulares, filetes gruesos, líneas de gráfico.
- **Profundo:** oscurecido hasta alcanzar contraste mínimo de 4.5:1 sobre papel. Uso: texto de enlace, texto pequeño en color.
- **Velo:** el mismo tono al 8 % de opacidad sobre papel. Uso: fondos de sección, resaltados, celdas de tabla.

**Regla no negociable:** ningún texto de tamaño de cuerpo o inferior se compone en el valor «base». Solo en «profundo». El valor «base» está reservado a titulares de 28 px o más y a elementos gráficos.

### 6.3 Colores de estado de evidencia

Deliberadamente desaturados, para no competir con el espectro:

| Estado | Valor | Notas |
|---|---|---|
| Consolidado | `#14213D` | Azul tinta, casi negro |
| Diagnóstico | `#3C4A66` | Azul pizarra |
| Preliminar | `#B07600` | Ámbar quemado |
| Pendiente | `#7A7A72` | Gris cálido |

### 6.4 Las cinco reglas del color

1. **Un color por sección.** Cada sección de la página declara su pertenencia a un eslabón de la cadena y hereda ese color. Nunca dos colores del espectro compiten dentro de una misma sección.
2. **El color nunca es la única señal.** Toda información codificada por color debe estar duplicada en texto, forma o posición.
3. **Los colores del espectro no se mezclan ni se degradan entre sí.** No hay gradientes de dos colores del espectro. Los gradientes solo se permiten de un color a transparente, en veladuras sobre fotografía.
4. **El texto corrido siempre es tinta.** Ningún párrafo se compone en color. Solo titulares, eyebrows, cifras y elementos gráficos.
5. **La fotografía manda.** Sobre una fotografía, el único color permitido es el blanco papel y el color del espectro correspondiente a la sección, nunca un tercero.

### 6.5 Escala divergente para gráficos de cambio de elevación

Pérdida → cero → ganancia usa **Rosicler → Papel → Turquesa de laguna**. Es apta para todas las formas de daltonismo (eje azul-naranja), es coherente con el espectro y es físicamente legible: naranja de calor y pérdida, turquesa de agua y ganancia.

---

## 7. Tipografía

### 7.1 ⚠️ Advertencia de licencia previa a cualquier trabajo

La petición especifica **Anthropic Sans, Anthropic Serif y Anthropic Mono**. Estas son tipografías corporativas propietarias de Anthropic, no familias de distribución libre. **Antes de integrarlas debe verificarse que se dispone de una licencia que permita su uso en un sitio web de terceros.** Emplear tipografías corporativas ajenas sin licencia expone al proyecto a un problema legal y de reputación, y es especialmente delicado en un contexto académico.

Este documento define por tanto **tres roles tipográficos**, no tres archivos concretos. Si se obtiene la licencia, se asignan las familias solicitadas. Si no, se emplean las sustitutas indicadas, que están elegidas para producir el mismo carácter. La arquitectura de estilos debe permitir el cambio modificando **una sola declaración por rol**.

### 7.2 Los tres roles

| Rol | Función | Familia solicitada | Sustituta libre recomendada | Alternativa |
|---|---|---|---|---|
| **Sans** | Titulares, eyebrows, navegación, botones, etiquetas de interfaz | Anthropic Sans | **Inter** (variable) | Hanken Grotesk, Public Sans |
| **Serif** | Todo el texto corrido, entradillas, pies de figura, cifras grandes | Anthropic Serif | **Source Serif 4** (variable) | Newsreader, Literata |
| **Mono** | Coordenadas, cotas, unidades, identificadores de instrumento, fechas técnicas, código | Anthropic Mono | **JetBrains Mono** | IBM Plex Mono, Commit Mono |

**Requisitos de entrega:** las tres familias se autoalojan en el repositorio en formato WOFF2, con subconjunto latino extendido más los símbolos científicos necesarios (superíndices, signo menos matemático, micro, grados, flechas). Se precarga únicamente el peso variable de la Sans y el peso regular de la Serif. Todas declaran intercambio inmediato durante la carga.

### 7.3 Reparto de roles: la decisión clave

La **Serif conduce el contenido**; la **Sans conduce la estructura**. Esto invierte el uso convencional en sitios científicos y produce el aire de publicación impresa que se busca:

- Los párrafos, entradillas, pies de figura y citas van en Serif.
- Los titulares van en **Sans, en peso alto y con espaciado entre letras ligeramente negativo**, coloreados según el espectro.
- Los eyebrows van en **Mono, en mayúsculas, tamaño muy pequeño y espaciado entre letras muy abierto**, del color del espectro de la sección.
- Las cifras clave van en **Serif a tamaño enorme**, con la unidad adosada en **Mono a tamaño pequeño**. Este contraste —cifra editorial, unidad instrumental— es una de las firmas visuales del sitio.

### 7.4 Escala tipográfica

Base 17 px para el cuerpo. Razón de 1,26 con ajustes ópticos.

| Nivel | Tamaño de referencia | Comportamiento fluido | Rol |
|---|---|---|---|
| Titular de héroe | 92 px | Fluido entre 44 y 108 px | Sans, peso 700, interletra −0,03 em, interlínea 0,98 |
| Titular de sección | 46 px | Fluido entre 30 y 52 px | Sans, peso 650, interletra −0,02 em, interlínea 1,08 |
| Subtítulo | 27 px | Fluido entre 22 y 30 px | Sans, peso 550 |
| Entradilla | 22 px | Fluido entre 19 y 23 px | Serif, peso 400, interlínea 1,5 |
| Cuerpo | 17 px | Fijo | Serif, peso 400, interlínea 1,68 |
| Cifra clave | 76 px | Fluido entre 48 y 88 px | Serif, peso 600, cifras tabulares |
| Metadato | 14 px | Fijo | Mono, peso 400 |
| Eyebrow | 11,5 px | Fijo | Mono, mayúsculas, interletra 0,16 em |
| Crédito fotográfico | 11 px | Fijo | Mono, peso 400, tinta tenue |

### 7.5 Reglas de composición

- Medida de línea del cuerpo entre **64 y 72 caracteres**. Nunca superior a 76.
- Los titulares se componen con **saltos de línea controlados manualmente** en las páginas principales. Un titular no debe partirse dejando una palabra huérfana. El desarrollador debe habilitar un mecanismo para forzar el punto de corte en los cinco titulares más visibles.
- Todas las cifras en tablas, contadores y gráficos usan **numeración tabular**.
- Las unidades se separan de la cifra con **espacio fino irrompible** y se componen en Mono, un escalón por debajo del tamaño de la cifra.
- Los exponentes negativos se escriben con superíndice real, nunca con el signo de acento circunflejo.
- **Nunca** se centra un párrafo de más de dos líneas.
- Las comillas son angulares en español e inglesas en inglés. Los guiones largos llevan espacios finos a ambos lados.

---

## 8. Retícula, ritmo y maquetación

### 8.1 Estructura de anchos

Cuatro anchos disponibles, que el desarrollador debe implementar como clases de utilidad:

| Ancho | Medida | Uso |
|---|---|---|
| Texto | 68 caracteres (≈ 640 px) | Párrafos, listas, citas |
| Contenido | 1 060 px | Figuras, tablas, tarjetas |
| Ancho | 1 400 px | Rejillas de tarjetas, cadena de evidencia |
| Sangre | 100 % de la ventana | Fotografías de apertura de sección, transecto |

La alternancia entre estos anchos es el principal generador de ritmo de la página. Una sección de texto seguida de una figura a ancho de contenido y luego una fotografía a sangre produce la respiración característica de una publicación impresa.

### 8.2 Retícula editorial de tres columnas asimétricas

En pantallas de 1 200 px o más, el contenido se dispone en tres franjas:

- **Franja izquierda, 120 px:** vacía en la mayoría de los casos. Alberga el número de sección, el marcador de estado de evidencia y los anclajes de navegación. Su vacío es deliberado: es lo que produce el aire de página impresa.
- **Franja central, 640 px:** el texto.
- **Franja derecha, 240 px:** la **marginalia científica** (§8.3).

Por debajo de 1 200 px, las franjas laterales se pliegan bajo el texto y la marginalia se convierte en bloques intercalados.

### 8.3 Marginalia científica

Es el recurso que dota al sitio de densidad científica sin saturar el texto. En la franja derecha, alineadas con el párrafo que las motiva, aparecen anotaciones breves compuestas en Mono a 12 px, en el color profundo del espectro de la sección:

- La incertidumbre de la cifra mencionada en el párrafo.
- El instrumento y su modelo.
- Las coordenadas y la cota del punto de medición.
- El identificador del conjunto de datos y su DOI.
- El enlace al notebook que produjo el resultado.

Cada anotación va precedida de un filete corto de 24 px del color de la sección. En pantallas estrechas se integran en el flujo como bloques discretos con fondo de papel hundido.

### 8.4 Ritmo vertical

Escala de espaciado basada en 8 px: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.

- Separación entre secciones: 128 px en escritorio, 72 px en móvil.
- Las secciones a sangre con fotografía no llevan separación: cuelgan directamente de la anterior.
- Toda sección arranca con su eyebrow, seguido de 12 px, el titular, 24 px y la entradilla.

---

# PARTE III — LA PORTADA, SECCIÓN POR SECCIÓN

## 9. ⭐ El elemento firma: el Transecto

### 9.1 Qué es

El héroe no es una fotografía estática con un titular encima. Es un **transecto fotográfico horizontal**: una cinta continua de fotografías de expedición, unidas lateralmente, que el visitante recorre desplazándose. Reproduce la experiencia de caminar el glaciar de cota baja a cota alta.

### 9.2 Comportamiento detallado

**Composición.** De cinco a siete fotografías apaisadas se unen en una cinta horizontal continua de altura igual al 100 % de la ventana. Las uniones entre fotografías se disimulan con una veladura suave de 120 px de ancho, de modo que la cinta se perciba como un paisaje continuo y no como una galería.

**Recorrido.** Al hacer scroll vertical en los primeros 250 % de altura de ventana, la cinta se desplaza horizontalmente. La página no avanza verticalmente durante ese tramo: el scroll se traduce en movimiento lateral. Al terminar la cinta, el desplazamiento vertical se reanuda con normalidad.

**Lectura instrumental.** Fija en la esquina inferior izquierda, una lectura compuesta en Mono muestra tres valores que **cambian de forma continua** conforme avanza el transecto:

- La cota, de 4 700 a 5 700 m, con incrementos de 10 m.
- La coordenada, en grados decimales con cuatro cifras.
- El nombre del sitio y la fecha de la fotografía.

La lectura debe animarse con incrementos numéricos, no con saltos entre fotografías. Es lo que convierte el recurso en un instrumento y no en un carrusel.

**Anotaciones.** Sobre puntos concretos de la cinta se sitúan marcadores: la posición de una estación meteorológica, un punto de muestreo de nieve, el frente glaciar. Cada marcador aparece con una animación de trazado cuando alcanza el centro de la ventana, y muestra una etiqueta breve. Los marcadores usan la gramática de estado de evidencia (§5.2).

**Titular.** Permanece fijo en el tercio izquierdo durante todo el recorrido, reversado en blanco papel sobre una veladura vertical de tinta al 45 % que garantiza el contraste. No se mueve ni se desvanece: es el punto de anclaje mientras el paisaje se desplaza detrás.

**Indicación de progreso.** En el borde inferior, una regla horizontal de 2 px muestra el avance por el transecto, segmentada en los cinco colores del espectro en proporción a la longitud de cada tramo. Es simultáneamente barra de progreso y presentación de la leyenda cromática.

### 9.3 Degradaciones obligatorias

| Condición | Comportamiento |
|---|---|
| Ancho menor de 900 px | La cinta se sustituye por **una sola fotografía a sangre** con el titular encima y un movimiento lento de acercamiento. El scroll es vertical normal |
| Movimiento reducido activado | Fotografía única y estática. Sin desplazamiento lateral, sin acercamiento, sin animación de cifras |
| JavaScript no disponible | Fotografía única con titular. Debe ser legible y funcional |
| Conexión lenta detectada | Se carga únicamente la primera fotografía de la cinta; el resto en diferido |

**Presupuesto estricto.** El transecto completo no debe superar **900 kB** sumando todas sus fotografías. La primera debe estar visible en menos de 1,5 s en conexión 4G simulada.

---

## 10. Segundo momento: la leyenda del espectro

Inmediatamente después del transecto, ocupando el ancho completo y con solo 96 px de altura, se sitúa **la barra del espectro**: cinco segmentos de color contiguos, cada uno con su nombre en Mono debajo.

No es decoración: es la **leyenda del sitio y su navegación primaria**. Al pasar el cursor sobre un segmento, este se expande ligeramente y muestra los instrumentos asociados. Al hacer clic, lleva a la sección o página correspondiente.

Esta barra reaparece **fija bajo la barra de navegación** en todas las páginas interiores, reducida a 4 px de altura, con el segmento correspondiente a la página actual iluminado. Es el hilo conductor de todo el sitio.

---

## 11. Las cifras clave

Cuatro cifras, dispuestas en una fila en escritorio y en rejilla de dos por dos en tableta.

**Composición de cada una:**
- La cifra en Serif a 76 px, en tinta, con numeración tabular.
- La unidad adosada, en Mono a 20 px, en el color del espectro correspondiente.
- Debajo, un filete de 3 px de ancho igual a la cifra, con la **gramática de estado de evidencia** de esa cifra.
- Bajo el filete, la etiqueta en Serif a 15 px, en tinta atenuada, con un máximo de dos líneas.

**Animación:** las cifras cuentan al entrar en vista, una sola vez, escalonadas 120 ms entre sí, durante 1 200 ms. El valor final debe estar presente en el documento antes de la animación, de modo que sea correcto sin JavaScript y para lectores de pantalla.

**Corrección respecto a la versión actual:** la cifra de −1,463 m año⁻¹ debe animarse **solo en su parte entera**, mostrando los decimales al finalizar. Y debe llevar, adosado en Mono a 13 px, su intervalo de confianza. Una cifra sin incertidumbre es una cifra incompleta en un sitio científico.

---

## 12. Secciones del cuerpo

### 12.1 Apertura de sección

Toda sección principal abre con la misma estructura invariable:

1. **Filete horizontal de 3 px** en el color del espectro, a ancho de contenido.
2. **Eyebrow** en Mono, mayúsculas, del mismo color, con el número de sección en cifras romanas pequeñas a la izquierda.
3. **Titular** en Sans, en el color base del espectro, a ancho de texto.
4. **Entradilla** en Serif a 22 px, en tinta, a ancho de texto.
5. **Dateline** opcional en Mono a 12 px, tinta tenue: coordenadas, rango de cotas y periodo cubierto por la sección. Es el recurso que da a cada sección aire de despacho de campo.

### 12.2 Resultado central — Vilcanota

Color: **Turquesa de laguna** (Respuesta).

Maqueta de dos columnas asimétricas: a la izquierda, a 45 % de ancho, el texto y la cifra principal con su intervalo. A la derecha, a 55 %, el gráfico de estimadores.

**El gráfico debe rehacerse.** El actual es un SVG estático. Debe convertirse en **interactivo**: al pasar el cursor sobre cada estimador se despliega una anotación con el método, el número de observaciones y el intervalo exacto. Al entrar en vista, las cinco líneas de intervalo se trazan de izquierda a derecha en secuencia escalonada, y los puntos aparecen al final de cada trazo. La línea vertical del cero se dibuja primero.

El bloque de incertidumbre residual se compone como **marginalia**, no como recuadro de aviso: en la franja derecha, en Mono, con filete corto. Integrarlo en el margen en lugar de aislarlo en una caja transmite que la incertidumbre forma parte del resultado y no es una advertencia añadida.

### 12.3 Cadena de evidencia

Es la sección que enseña el sistema de color. **No debe ser una fila de cinco tarjetas iguales.**

Propuesta: una **cinta horizontal continua** de cinco tramos, cada uno con su color, unidos por conectores en punta de flecha. Cada tramo contiene su eyebrow, los instrumentos en Mono y una descripción de una línea en Serif.

**Interacción:** al pasar el cursor o al enfocar con teclado, el tramo se expande, los otros cuatro se atenúan al 35 % y aparece un panel con la lista completa de instrumentos, la variable física medida, su unidad y el enlace a la página correspondiente.

**Detalle que eleva la sección:** bajo cada tramo, una microserie temporal —de 60 px de altura, sin ejes, en el color del tramo— con datos reales de esa parte del sistema. Cinco gráficos diminutos que muestran que detrás de cada eslabón hay mediciones y no una declaración de intenciones.

### 12.4 Sitios y campañas

Color: **Magenta de nieve sandía** (Depósito), por ser la sección de muestreo.

Rejilla de tres columnas en escritorio, dos en tableta, una en móvil. **Fotografías reales, no ilustraciones.**

**Anatomía de la tarjeta:**
- Fotografía en proporción 3:2, con recorte de foco declarado por imagen.
- Filete superior de 3 px con la gramática de estado de evidencia de ese sitio.
- Eyebrow en Mono con la región y la cordillera.
- Nombre del sitio en Sans a 27 px.
- Descripción en Serif a 15 px, máximo dos líneas.
- Pie de metadatos en Mono a 13 px: rango de cotas, superficie, periodo.
- Puntos de color indicando qué eslabones del espectro están representados en ese sitio.

**Interacción al pasar el cursor:** la tarjeta se eleva 6 px, la fotografía se amplía un 4 % dentro de su recorte, y una **veladura del color de la sección barre la fotografía de abajo arriba** en 320 ms. Aparece una flecha en la esquina inferior derecha. Todo debe replicarse en el estado de foco por teclado.

**Añadido recomendado:** un control de filtrado por cordillera y por eslabón de la cadena, con recuento vivo y estado reflejado en la dirección para que sea compartible.

### 12.5 Estado científico

Color: sin color del espectro. Esta sección usa **exclusivamente la gramática de estado** (§5.2).

Sustituir el bloque oscuro actual por una **matriz de madurez**: cuatro filas, una por nivel, sobre papel hundido. Cada fila lleva a la izquierda su marcador de trazo, en el centro el nombre de la línea de trabajo, y a la derecha una barra de progreso segmentada que indica qué falta: adquisición, control de calidad, análisis, validación, publicación. Los segmentos completados se rellenan; los pendientes quedan huecos.

Esta sección es el corazón de la credibilidad del sitio y debe ser la más disciplinada visualmente de toda la página. Cero color, cero movimiento superfluo.

### 12.6 Albedo

Color: **Rosicler** (Energía).

Conservar el comparador de cortina, pero con **fotografías reales**: hielo limpio de alta reflectancia frente a superficie de ablación oscurecida por partículas. Ambas tomas deben tener idéntica proporción, iluminación comparable y estar declaradas como conceptuales si no proceden del mismo punto y fecha.

**Correcciones obligatorias:** resolver la posible inversión (§E-09); sustituir el glifo del tirador por un elemento SVG; garantizar el control por teclado con las flechas al 5 % y las teclas de inicio y fin a los extremos; añadir a cada lado la etiqueta del valor de albedo representado.

**Añadido:** conforme se desplaza el control, un indicador numérico muestra la radiación de onda corta absorbida resultante bajo 600 W m⁻². El visitante **manipula la física**, no solo dos imágenes.

### 12.7 Transparencia

Color: **Ultramar de altura** (Atmósfera), por ser la sección sobre atribución.

La regla editorial —la lista de lo que el programa no afirma— debe presentarse como **cuatro enunciados negativos**, cada uno en su propia línea, precedido de un símbolo de prohibición y compuesto en Serif a 19 px. No dentro de un recuadro de aviso.

Es, probablemente, el contenido más distintivo del sitio. Debe tener el mismo peso tipográfico que un resultado.

### 12.8 Cierre

Fotografía a sangre de expedición, oscurecida con veladura, con tres accesos reversados en blanco: el catálogo de datos, las publicaciones y el contacto. Sobre ella, en Mono, la firma: *Ciencia abierta desde los Andes*.

---

## 13. Fotografía

### 13.1 Especificación de entrega del material

Para cada fotografía, el fotógrafo debe entregar:

| Campo | Obligatorio | Ejemplo |
|---|---|---|
| Archivo original | Sí | WebP o JPEG, lado mayor ≥ 3 000 px |
| Sitio | Sí | Quelccaya |
| Coordenadas | Sí | −13,9310 / −70,8250 |
| Cota | Sí | 5 380 m |
| Fecha | Sí | 2026-06-14 |
| Orientación de la toma | Recomendado | Vista al noroeste |
| Autoría | Sí | — |
| Descripción científica | Sí | Texto de 15 a 200 caracteres |
| Punto focal | Sí | Coordenada relativa del sujeto principal |
| Clasificación | Sí | Paisaje / instrumento / equipo / detalle de superficie / muestreo |
| Eslabón del espectro | Sí | Depósito |

### 13.2 Derivados a generar

De cada original: **WebP y AVIF**, en anchos de 480, 800, 1 200, 1 600 y 2 400 px, más una miniatura de 24 px para el marcador de posición. JPEG de respaldo únicamente para las imágenes de vista previa social.

**Presupuestos de peso máximo, en AVIF:** transecto 180 kB por fotografía · apertura de sección 140 kB · tarjeta 55 kB · figura 90 kB · miniatura 25 kB. El proceso de integración continua debe rechazar cualquier imagen que los supere.

### 13.3 Tratamiento visual unificado

Todas las fotografías del sitio deben compartir un mismo tratamiento para que la página se lea como una publicación y no como un álbum:

- **Temperatura:** ligeramente fría en las sombras, neutra en las luces. El hielo debe leerse azul, nunca gris.
- **Contraste:** curva suave. Prohibido el aplastamiento de negros: en fotografía de nieve destruye la información de textura.
- **Saturación:** conservada, no aumentada. Los colores del sistema ya aportan la saturación; las fotografías aportan la veracidad.
- **Sin viñeteado, sin grano añadido, sin filtros de aspecto cinematográfico.**
- **Cielos:** no recuperar en exceso. Un cielo quemado en el borde superior es preferible a un cielo con halo artificial.

### 13.4 Reglas de uso

- Toda fotografía informativa lleva **texto alternativo científico**, descriptivo del contenido real. Un alternativo de menos de 15 caracteres o genérico debe hacer fallar la construcción del sitio.
- Toda fotografía visible lleva **crédito y fecha** en Mono a 11 px, en tinta tenue.
- Las fotografías a sangre llevan, adicionalmente, una **tira de nota de campo** en el borde inferior: coordenadas, cota, fecha e instrumento, en Mono sobre veladura. Es el recurso que convierte una fotografía bonita en un dato.
- Toda fotografía declara dimensiones intrínsecas para evitar saltos de maquetación.
- Solo la primera fotografía del transecto tiene prioridad de carga alta. Todas las demás se cargan en diferido.

---

## 14. Movimiento e interactividad

### 14.1 Principio rector

El movimiento debe **revelar estructura**, no llamar la atención sobre sí mismo. Un sitio científico que se mueve demasiado pierde autoridad. Toda animación de esta lista debe poder justificarse respondiendo: *¿qué comprende mejor el visitante gracias a esto?*

### 14.2 Inventario cerrado

**Ninguna animación fuera de esta lista.** Cualquier adición requiere aprobación explícita.

| # | Animación | Disparador | Duración | Qué revela |
|---|---|---|---|---|
| M-01 | Recorrido del transecto | Scroll vertical | Continua | La extensión real del terreno estudiado |
| M-02 | Lectura de cota y coordenada | Scroll en transecto | Continua | Que el recorrido es un transecto medido |
| M-03 | Aparición de marcadores | Centro de ventana | 600 ms | Dónde hay instrumentos y muestras |
| M-04 | Barra del espectro | Al cargar | 900 ms | La leyenda cromática del sitio |
| M-05 | Contadores de cifras | Entrada en vista, una vez | 1 200 ms | La magnitud del esfuerzo de campo |
| M-06 | Aparición por scroll | Entrada en vista, una vez | 420 ms | Jerarquía de lectura |
| M-07 | Trazado del gráfico de estimadores | Entrada en vista | 1 400 ms | La convergencia de estimadores independientes |
| M-08 | Microseries de la cadena | Entrada en vista | 800 ms | Que cada eslabón tiene datos |
| M-09 | Expansión de tramo de cadena | Cursor o foco | 300 ms | La composición interna de cada eslabón |
| M-10 | Elevación y veladura de tarjeta | Cursor o foco | 320 ms | Que la tarjeta es navegable |
| M-11 | Comparador de albedo | Arrastre, táctil o teclado | Inmediata | El mecanismo físico del oscurecimiento |
| M-12 | Contracción de la barra de navegación | Scroll > 96 px | 240 ms | Recuperación de espacio de lectura |
| M-13 | Filtrado de la rejilla de sitios | Clic en filtro | 300 ms | Qué queda tras aplicar un criterio |
| M-14 | Barra de progreso de lectura | Scroll | Continua | La longitud restante del documento |
| M-15 | Transición entre páginas | Navegación | 300 ms | Continuidad entre secciones |

### 14.3 Curvas y tiempos

- Salida suave para toda entrada de elemento.
- Curva simétrica para transformaciones de estado.
- Curva con rebote mínimo, solo en los marcadores del transecto.
- Escalonamiento máximo acumulado en una lista: **400 ms**. Superarlo produce sensación de lentitud, no de elegancia.

### 14.4 Restricciones técnicas

- Solo se animan desplazamiento, escala y opacidad. Nunca dimensiones, posiciones absolutas ni márgenes.
- Los observadores de entrada en vista dejan de observar tras dispararse una vez.
- Los manejadores de scroll se ejecutan dentro del ciclo de repintado del navegador.
- Ninguna animación en bucle infinito por encima del pliegue, salvo el acercamiento lento de la fotografía única en la versión móvil.
- El hilo principal no debe bloquearse más de 50 ms en ningún momento.
- **Con movimiento reducido activado, la página debe seguir siendo completamente comprensible y navegable.** Se comprueba desactivando todas las animaciones y recorriendo el sitio íntegro.

---

# PARTE IV — BILINGÜISMO COMPLETO

## 15. Alcance de la traducción

La petición es explícita: el cambio de idioma debe alcanzar **todo el contexto, incluidos los encabezados**. Esto significa que absolutamente todo lo siguiente existe en español y en inglés:

| Elemento | Estado actual | Requisito |
|---|---|---|
| Titulares y subtítulos | Solo español | Ambos |
| Eyebrows y etiquetas de sección | Solo español | Ambos |
| Texto corrido y entradillas | Solo español | Ambos |
| Elementos de menú y submenús | Solo español | Ambos |
| Rótulos de botones y llamadas a la acción | Solo español | Ambos |
| Pies de figura y créditos | Solo español | Ambos |
| Textos alternativos de imagen | Solo español | Ambos |
| Ejes, leyendas y anotaciones de gráficos | Solo español | Ambos |
| Encabezados de tabla y notas al pie | Solo español | Ambos |
| Marginalia científica | Solo español | Ambos |
| Etiquetas de estado de evidencia | Solo español | Ambos |
| Textos del pie de página | Solo español | Ambos |
| Mensajes de estado vacío y de error | Solo español | Ambos |
| Etiquetas de accesibilidad | Solo español | Ambos |
| Metadatos de página y vista previa social | Solo español | Ambos |
| Página 404 | No existe | Ambos |
| Formato de fechas | Solo español | Según idioma |
| Formato numérico | Punto decimal en ambos | Coma en español, punto en inglés |
| Unidades | Abreviatura española | Según idioma |

## 16. Arquitectura de traducción

**Principio.** Ninguna cadena de texto visible debe estar escrita directamente en una plantilla. Toda cadena de interfaz procede de un **archivo de cadenas por idioma**, identificada por una clave. El contenido editorial largo vive en archivos paralelos por idioma.

**Estructura.** El español ocupa la raíz del sitio; el inglés vive bajo un prefijo de idioma. Cada página declara explícitamente cuál es su equivalente en el otro idioma.

**Comportamiento del selector de idioma.** Debe cumplir simultáneamente cinco condiciones:

1. Conducir a la **página equivalente**, no al índice. Si el visitante está leyendo la página de Quelccaya en español, el selector lo lleva a la página de Quelccaya en inglés.
2. Si la traducción no existe, el control aparece **deshabilitado** con una explicación accesible, nunca conduce a un error 404.
3. **Recordar la elección** del visitante para futuras visitas.
4. En la primera visita, puede **sugerir** el idioma según la preferencia del navegador, mediante un aviso discreto y descartable. Nunca redirigir automáticamente.
5. Mostrar el idioma **de destino**, no el actual, y estar etiquetado para lectores de pantalla.

**Declaraciones para buscadores.** Cada página debe declarar sus versiones alternativas en ambos idiomas más una versión predeterminada. Sin esto, los motores de búsqueda tratarán ambas versiones como contenido duplicado.

**Idioma del documento.** Cada página declara su idioma real. Los fragmentos en otro idioma dentro de una página —un título de artículo en inglés dentro de un texto en español— deben declararlo, para que el lector de pantalla cambie de pronunciación.

## 17. Prioridad de traducción

- **Bloque 1, obligatorio antes de publicar:** portada, cinco páginas de sitio, catálogo de datos, publicaciones, panorama de investigación, contacto, página 404, y la totalidad de la interfaz.
- **Bloque 2:** las seis páginas temáticas de investigación y el índice de métodos.
- **Bloque 3:** notebooks —admiten permanecer en inglés en ambas versiones, por convención científica— y bitácora de campo.

## 18. Localización más allá de la traducción

- **Números:** coma decimal y espacio fino de millares en español; punto decimal y coma de millares en inglés.
- **Fechas:** «14 de junio de 2026» frente a «14 June 2026».
- **Unidades:** «m año⁻¹» frente a «m yr⁻¹»; «5 200–5 680 m» conserva el espacio fino en ambos.
- **Comillas:** angulares en español, inglesas en inglés.
- **Nombres propios de sitios:** no se traducen. Quelccaya es Quelccaya. Los descriptores sí: «Campo de hielo regional» / «Regional ice field».
- **Términos técnicos:** debe elaborarse y mantenerse un **glosario bilingüe** de treinta a cincuenta términos, para que la traducción sea coherente entre páginas. Es responsabilidad del investigador, no del desarrollador.

---

# PARTE V — CALIDAD

## 19. Accesibilidad — WCAG 2.2 nivel AA

| Requisito | Criterio verificable |
|---|---|
| Contraste de texto | 4,5:1 mínimo; 3:1 para texto de 24 px o superior. Verificar **cada** color del espectro sobre papel y sobre fotografía |
| Contraste de componentes | 3:1 para bordes de control y estados de foco |
| Foco visible | Anillo de 3 px del color de la sección, con separación de 2 px. Nunca suprimir el indicador sin sustituto equivalente |
| Objetivo táctil | Mínimo 24 × 24 px; recomendado 44 × 44 px |
| Teclado | Transecto, cadena, filtros, comparador y mapa completamente operables. El transecto debe poder recorrerse con las teclas de dirección |
| Enlace de salto | Primer elemento enfocable de toda página |
| Encabezados | Un solo nivel 1 por página, sin saltos de nivel |
| Textos alternativos | Descriptivos y científicos en toda imagen informativa |
| Movimiento | Preferencia de movimiento reducido respetada sin excepción |
| Idioma | Declarado en el documento y en los fragmentos de otro idioma |
| Color | Nunca única vía de información |
| Zoom | Utilizable al 200 % sin pérdida de contenido ni scroll horizontal |
| Orientación | Funcional en vertical y horizontal |

**Verificación obligatoria antes de la entrega:** auditoría automática sin infracciones críticas ni graves, recorrido completo con teclado, y prueba con lector de pantalla de la portada y de una página de sitio.

## 20. Rendimiento

| Métrica | Objetivo | Límite |
|---|---|---|
| Mayor elemento visible | < 1,8 s | 2,5 s |
| Desplazamiento acumulado de maquetación | < 0,05 | 0,10 |
| Latencia de interacción | < 150 ms | 200 ms |
| Peso total de la portada | < 1,1 MB | 1,6 MB |
| JavaScript propio comprimido | < 18 kB | 28 kB |
| Auditoría automática, las cuatro categorías | ≥ 95 | 90 |

**Técnicas obligatorias:** tipografías autoalojadas con precarga selectiva; estilos críticos del transecto en línea; mapas y bibliotecas de gráficos cargados bajo demanda al entrar en vista; marcador de posición de 24 px en toda fotografía; dimensiones declaradas en todas las imágenes.

## 21. Criterios de aceptación

**Corrección de errores**
- [ ] No aparece ningún bloque de código no deliberado en ninguna página
- [ ] No existe panel de código fuente fuera de las páginas de métodos
- [ ] Un solo encabezado de nivel 1 por página
- [ ] Imágenes de vista previa social en JPEG o PNG, de 1 200 × 630 px, verificadas en tres plataformas
- [ ] Un solo logotipo en la barra de navegación
- [ ] Sin control ni rastro de modo oscuro
- [ ] Cero colores escritos en atributos de estilo
- [ ] Comparador de albedo verificado visualmente y operable con teclado
- [ ] Formato numérico correcto según idioma en todo el sitio

**Sistema de diseño**
- [ ] Los cinco colores del espectro implementados con sus tres derivados
- [ ] La gramática de estado de evidencia aplicada en titulares, tarjetas, gráficos y marcadores
- [ ] Los tres roles tipográficos intercambiables desde una sola declaración por rol
- [ ] Licencia de tipografía resuelta y documentada
- [ ] Marginalia científica funcionando en escritorio y plegándose correctamente en móvil

**Elemento firma**
- [ ] Transecto operativo con lectura continua de cota y coordenada
- [ ] Las cuatro degradaciones implementadas y probadas
- [ ] Presupuesto de 900 kB respetado

**Bilingüismo**
- [ ] El bloque 1 completo en ambos idiomas, encabezados incluidos
- [ ] El selector conduce a la página equivalente en todos los casos
- [ ] Declaraciones de alternativa lingüística presentes en todas las páginas
- [ ] Ninguna cadena de interfaz escrita directamente en una plantilla

**Contenido**
- [ ] Cero ilustraciones sintéticas: solo fotografías propias
- [ ] Toda fotografía con crédito, fecha y texto alternativo científico
- [ ] Toda cifra publicada acompañada de su incertidumbre
- [ ] Toda figura de datos propios enlazada a su conjunto de datos y a su notebook

## 22. Lo que no debe hacerse

Prohibiciones explícitas, para evitar que el rediseño derive hacia lo genérico:

1. **No** usar imágenes de banco. Todas las fotografías son de campo propio.
2. **No** aplicar gradientes entre dos colores del espectro.
3. **No** usar sombras difusas y grandes. Las elevaciones se resuelven con sombras cortas y filetes.
4. **No** introducir un cuarto tipo de letra.
5. **No** usar animación de partículas, nieve cayendo, ni fondos animados abstractos.
6. **No** usar iconografía genérica de biblioteca para los instrumentos. Si se requieren iconos, deben dibujarse a partir de la forma real de cada instrumento.
7. **No** redondear los contenedores más de 6 px. La estética es de publicación impresa, no de aplicación móvil.
8. **No** añadir una ventana emergente de suscripción.
9. **No** presentar una cifra sin su incertidumbre.
10. **No** traducir automáticamente el contenido científico sin revisión del investigador.

---

## 23. Fases de ejecución

| Fase | Contenido | Criterio de salida |
|---|---|---|
| **0** | Corrección de los cuatro errores críticos | La portada no muestra código y valida en accesibilidad básica |
| **1** | Sistema de color, tipografía, retícula, marginalia | Contraste verificado en los cinco colores; los tres roles intercambiables |
| **2** | Entrega y procesado del material fotográfico | Todos los derivados generados dentro de presupuesto, con metadatos completos |
| **3** | Transecto y barra del espectro | Las cuatro degradaciones probadas; presupuesto respetado |
| **4** | Rediseño de las siete secciones de la portada | Inventario de movimiento cerrado y verificado con movimiento reducido |
| **5** | Bilingüismo del bloque 1 | Selector equivalente en todas las páginas; alternativas declaradas |
| **6** | Páginas interiores con el nuevo sistema | Coherencia verificada en las cinco páginas de sitio |
| **7** | Auditoría final | Lista de §21 completa al 100 % |

---

## 24. Preguntas que el desarrollador debe resolver antes de empezar

1. ¿Se dispone de licencia para las tipografías corporativas solicitadas? Si no, ¿se aprueban las sustitutas?
2. ¿Cuántas fotografías hay disponibles por sitio, y cubren las cinco categorías necesarias?
3. ¿Existe material fotográfico apto para el comparador de albedo, o se declara conceptual?
4. ¿Quién realiza y valida la traducción al inglés del contenido científico?
5. ¿Existe una versión vectorial editable del logotipo, o solo el archivo actual?
6. ¿Se conserva el modelo de publicación actual, o se migra a un flujo con revisión previa?
7. ¿El nombre publicado del autor es el que figura en el pie actual?
