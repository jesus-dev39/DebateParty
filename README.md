# 🎭 DebateParty

> Aplicación web interactiva de dilemas y toma de decisiones en tiempo real, con ambientación sonora y soporte multi-idioma.

🌐 **Demo en vivo:** [debateparty.web.app](https://debateparty.web.app/)  
📱 **Compatibilidad:** 100% Responsive (Mobile & Desktop)

---

## 🚀 Características principales

- **Soporte Multi-idioma (i18n):** Arquitectura desacoplada con carga asíncrona de datos para español e inglés (`preguntas_es.json` / `preguntas_en.json`).
- **Control de estado dinámico (SPA):** Flujo de preguntas, rondas y alternancia de dilemas sin recarga de página.
- **Ambientación sonora:** Integración y reproducción de pistas de audio contextuales para dinamizar las partidas.
- **Diseño Mobile-First:** Interfaz táctil optimizada para pantallas móviles mediante CSS moderno.
- **Enrutamiento y fallback:** Gestión de errores con página personalizada `404.html`.

---

## 🛠️ Tecnologías utilizadas

- **Frontend:** HTML5 semántico, CSS3 (diseño responsive, transiciones dinámicas).
- **Lógica:** JavaScript vanilla (ES6+) — Carga de JSONs vía Fetch API, eventos y manipulación del DOM.
- **Despliegue e infraestructura:** Firebase Hosting (Google Cloud Platform).
- **Control de versiones:** Git & GitHub.

---

## 📁 Estructura del proyecto

```text
juego-dilemas/
├── music/               # Pistas de audio y efectos para las partidas
├── 404.html             # Página de error y fallback para Firebase Hosting
├── app.js               # Lógica del juego, estados y consumo de datos
├── index.html           # Estructura principal de la aplicación
├── preguntas_en.json    # Banco de dilemas en inglés
├── preguntas_es.json    # Banco de dilemas en español
├── style.css            # Estilos globales y maquetación responsive
├── firebase.json        # Configuración de despliegue en Firebase
└── README.md            # Documentación del proyecto