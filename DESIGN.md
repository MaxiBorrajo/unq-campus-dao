# Estilo de diseño

Sobrio, institucional, con poco ruido. Si dudás entre agregar algo o no, no lo agregues.

## Reglas

1. **Un solo radio:** `rounded-lg` en todo (cards, inputs, botones, diálogos, barras). Únicas excepciones: avatares y switches, que son círculos.
2. **Color con intención:** el bordó (`primary`) solo va en la barra superior, el botón principal, los links y el item activo. Todo lo demás es neutro (`surface`, `ink`, `line`).
3. **Sin decoración:** no hay íconos de adorno, emojis, chips de colores ni degradados. Un ícono solo aparece si reemplaza texto (cerrar, buscar) o es una acción sin etiqueta.
4. **Estado = texto:** los estados (votación abierta, ejecutada…) se muestran como texto con color, sin fondo ni borde. Los mensajes (`Alert`) son cajas neutras con borde de color, sin ícono.
5. **Una columna:** el contenido va centrado en un ancho máximo de `max-w-4xl`. La navegación vive en la barra superior; no hay sidebars.
6. **Poca información:** cada pantalla tiene un título, una línea de contexto como máximo, y su contenido. Los datos técnicos (direcciones de contratos, hashes) van en pequeño y al final.
7. **Mayúsculas:** no se usa `uppercase` ni `tracking-wider` salvo en el nombre institucional. Labels y títulos en formato oración.

## Tokens (`tailwind.config.js`)

| Token | Uso |
|---|---|
| `primary` (`#7a1827`) | Navbar, botón principal, links, tab activo |
| `surface` / `surface-card` / `surface-muted` | Fondo de página / cards / bloques secundarios |
| `ink` / `ink-muted` / `ink-subtle` | Texto principal / secundario / ayudas |
| `line` | Bordes y separadores |
| `success` `danger` `warning` | Solo texto de estado y bordes de `Alert` |

## Tipografía

Raleway. `text-sm` para cuerpo y controles, `text-xs` para ayudas y metadatos, `text-2xl font-bold` para el título de página, `text-base font-semibold` para títulos de card. Direcciones y hashes en `font-mono text-xs`.

## Componentes

Todo se construye con `src/components/ui` (sobre Base UI). Si una pantalla necesita algo que no está, se agrega ahí en vez de escribir clases sueltas.
