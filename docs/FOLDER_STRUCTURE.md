# Frontend Structure

Phase 1 uses two plain, independent React + Vite applications. This is intentionally not a workspace or monorepo tool setup.

~~~text
apps/
├── web/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/{common,feedback,navigation}/
│   │   ├── layouts/
│   │   ├── pages/{auth,admin,dlh}/
│   │   ├── data/mock/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── constants/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── mobile/
    ├── src/
    │   ├── assets/
    │   ├── components/{common,feedback,navigation}/
    │   ├── layouts/
    │   ├── pages/{auth,industry}/
    │   ├── data/mock/
    │   ├── services/
    │   ├── routes/
    │   ├── constants/
    │   ├── utils/
    │   ├── styles/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
~~~

## Ownership

- apps/web owns Administrator and DLH shells, pages, services, and mock fixtures. It must not expose Industry operational screens.
- apps/mobile owns Industry shells, pages, services, and mock fixtures. It must not expose Admin or DLH screens. This is a browser web app, not React Native.
- Each app owns its presentation and service boundary; do not create a shared package until repeated code and a measured maintenance need justify it.
- components/common and components/feedback contain only proven reusable primitives.
- layouts owns role navigation/frame; pages owns screen composition; services is the presentation data boundary; data/mock is deterministic fixture input.
- routes, constants, utils, and styles stay app-local to preserve role and deployment isolation.
