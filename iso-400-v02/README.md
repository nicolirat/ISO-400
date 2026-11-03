# ISO 400 v02 — Galería 3D + presentación de proyectos

Prototipo independiente dentro de nicolirat/ISO-400. No se publica ni modifica TSS.

## Abrir

Desde esta carpeta:

```sh
python3 -m http.server 4175 --directory dist
```

Abrir http://localhost:4175 en el mismo computador. Requiere navegador con WebGL. Si WebGL no está disponible, se ofrece una galería estática accesible.

La primera pantalla usa una escena Three.js ortográfica: scroll vertical, arrastre y flechas cambian el proyecto; clic o Enter abre la ventana editorial. Home vuelve al primero; Escape cierra la ventana. La ventana conserva los 11 proyectos y sus textos, imágenes, videos y audio ES/EN; las portadas del escenario usan imágenes/posters sin recorte. El identificador de la ventana es ISO 400.

Three.js 0.170.0 se incluye localmente con su licencia. No hay dependencias remotas de ejecución ni proyecto de hosting configurado. `.openai/hosting.json` solo configura el directorio para la prueba interna; no contiene identidad ni destino de publicación.

## Aislamiento

La versión inicial queda en `../iso-400-v01/dist/`, como copia exacta del árbol original de GitHub. Los archivos originales de la raíz permanecen intactos. La v02 tiene sus propios archivos y copias de los mismos recursos; no depende de la web o del hosting de TSS. No se ha accedido a las carpetas del Mac. Los manifiestos locales publicacion.json y copia-inicial.json no estaban en el repositorio consultado.

Los estilos se limitan a `#iso400-portfolio`, los handlers de navegación al canvas y los estados a módulos ES. Los observadores y listeners globales necesarios para visibilidad/admisión se eliminan al desmontar. Para desmontar: emitir `iso400:destroy` en el contenedor. En un iframe del mismo origen, enviar `{type:'still-active',active:true}` para admitir la escena; `false` la pausa. Se verifican origen y ventana emisora. Se emiten `website-ready` y heartbeats `still-active`. `?gallery` permite una marcha lenta sin interacción; reduced-motion impide esa marcha y la flexión.

## Validación

- `node tests/motion.mjs`: wrap continuo, equivalencia 60/120 Hz, dt limitado y reposo exacto con velocidad cero.
- Sintaxis de los módulos comprobada.
- Los 77 recursos referenciados por los 11 proyectos se conservan por su SHA original en GitHub.
- Navegador: fallback por WebGL deshabilitado, apertura de proyecto y cambio ES/EN comprobados.
- Pendiente en navegador con WebGL: apariencia 3D, scroll/arrastre, tacto móvil, flechas/Home/Enter sobre canvas, pausa fuera de pantalla, reduced motion y liberación efectiva de GPU. No se presentan estas pruebas como realizadas.
