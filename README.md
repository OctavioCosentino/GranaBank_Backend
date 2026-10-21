# GranaBank Backend

Backend modular, escalable y robusto desarrollado con **Node.js**, **Express**, **TypeScript** e integrado directamente con **Supabase (PostgreSQL & Supabase Auth)**.

---

## Arquitectura del Proyecto

El proyecto sigue una arquitectura en capas modular (Clean N-Tier Layered Architecture). Cada módulo (auth, profiles, cards, transactions) y cualquier módulo futuro a incorporar sigue estrictamente la separación de responsabilidades:

```
src/
├── config/                              # Configuraciones (Variables de entorno con Zod, Clientes Supabase)
│   ├── env.ts
│   └── supabase.ts
├── errors/                              # Clases de error HTTP personalizadas (AppError, BadRequest, NotFound...)
│   └── app.error.ts
├── middlewares/                         # Middlewares globales y reutilizables
│   ├── auth.middleware.ts               # Verificación y extracción de sesión Supabase JWT
│   ├── errorHandler.middleware.ts       # Manejador centralizado de errores
│   ├── notFound.middleware.ts           # Manejador 404
│   └── validate.middleware.ts           # Validador de esquemas Zod (body, query, params)
├── modules/                             # Módulos por dominio / entidad
│   ├── auth/                            # Módulo de Autenticación con Supabase Auth
│   │   ├── auth.dto.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.routes.ts
│   ├── profiles/                        # Módulo de Perfiles de Usuario
│   │   ├── profiles.dto.ts
│   │   ├── profiles.repository.ts
│   │   ├── profiles.service.ts
│   │   ├── profiles.controller.ts
│   │   └── profiles.routes.ts
│   ├── cards/                           # Módulo de Tarjetas
│   │   ├── cards.dto.ts
│   │   ├── cards.repository.ts
│   │   ├── cards.service.ts
│   │   ├── cards.controller.ts
│   │   └── cards.routes.ts
│   └── transactions/                    # Módulo de Transacciones
│       ├── transactions.dto.ts
│       ├── transactions.repository.ts
│       ├── transactions.service.ts
│       ├── transactions.controller.ts
│       └── transactions.routes.ts
├── routes/                              # Enrutador principal de la API (/api/v1)
│   └── index.ts
├── types/                               # Definiciones de tipos globales y esquema de Supabase
│   ├── database.types.ts
│   └── express.d.ts
├── utils/                               # Utilidades y formateo uniforme de respuestas JSON
│   └── response.util.ts
├── app.ts                               # Configuración del servidor Express, middlewares y rutas
└── server.ts                            # Entrypoint del servidor y apagado grácil (graceful shutdown)
```

---

## Flujo de cada Endpoint

1. **Route (`*.routes.ts`)**: Define el path HTTP, el método y encadena los middlewares de validación y autenticación.
2. **Middleware (`validate`, `authenticate`)**:
   - `validate`: Valida que el `body`, `query` o `params` cumplan el esquema Zod del DTO antes de llegar al controlador.
   - `authenticate`: Verifica el token JWT de Supabase, validando la identidad del usuario y adjuntando `req.user`.
3. **Controller (`*.controller.ts`)**: Extrae los parámetros de la solicitud HTTP, invoca el Service correspondiente y formatea la respuesta HTTP usando `sendSuccess`.
4. **Service (`*.service.ts`)**: Contiene la lógica de negocio pura, validaciones de dominio y orquesta las operaciones con repositorios.
5. **Repository (`*.repository.ts`)**: Se comunica directamente con Supabase PostgreSQL utilizando los clientes tipados de Supabase (`supabaseAdmin` / `supabase`).
6. **DTO (`*.dto.ts`)**: Esquemas Zod y tipado TypeScript estricto de entrada y salida para validación en tiempo de ejecución.

---

### Ventajas de la Arquitectura en Capas Modular (Clean N-Tier)

- **Separación Estricta de Responsabilidades (SoC)**: Cada capa tiene un único rol definido. Cambiar una consulta SQL solo afecta al Repository; modificar reglas de negocio solo impacta al Service; y ajustar una validación de entrada solo involucra al DTO.
- **Alta Mantenibilidad y Escalabilidad**: La organización modular por dominio (`auth`, `profiles`, `cards`, `transactions`) permite que el proyecto crezca orgánicamente. Incorporar un nuevo módulo no altera el código existente.
- **Desacoplamiento de Infraestructura**: La lógica de negocio (`Service`) no conoce los detalles de la base de datos ni de las peticiones HTTP; si en el futuro se reemplaza Supabase o Express, las reglas de negocio permanecen intactas.
- **Facilidad de Testing**: Cada capa es testeable de forma aislada. Los Services se pueden probar unitariamente mockeando los Repositories sin requerir una conexión real a la base de datos.
- **Seguridad y Validación Preventiva**: Gracias a los DTOs con Zod, cualquier dato inválido o malicioso es rechazado en la puerta de entrada antes de consumir recursos de la aplicación.

---

## Esquema de Base de Datos (Supabase)

El backend está configurado para reflejar las tablas de la base de datos Supabase:

### 1. `profiles`

- `id`: `uuid` (Primary Key, vinculado a Supabase Auth `auth.users.id`)
- `created_at`: `timestamp with time zone`
- `name`: `text`

### 2. `cards`

- `id`: `uuid` (Primary Key)
- `created_at`: `timestamp with time zone`
- `cardholder`: `text`
- `user_id`: `uuid` (Foreign Key -> `profiles.id`)
- `expiration_date`: `text`
- `last_four`: `text`

### 3. `transactions`

- `id`: `uuid` (Primary Key)
- `created_at`: `timestamp with time zone`
- `name`: `text`
- `type`: `USER-DEFINED` (e.g. `INCOME`, `EXPENSE`, etc.)
- `amount`: `integer`
- `user_id`: `uuid` (Foreign Key -> `profiles.id`)

---

## Variables de Entorno

> **Plantilla de Entorno**:
> Se incluye un archivo [`.env.example`](.env.example) en la raíz del proyecto para que cualquier desarrollador que desee recrear el entorno localmente sepa con exactitud qué variables y API Keys necesita configurar. Solo basta con duplicarlo y rellenar las credenciales correspondientes.

- `PORT=5000`
- `NODE_ENV=development`
- `CORS_ORIGIN=*`

- `SUPABASE_URL=https://proyecto.supabase.co`
- `SUPABASE_ANON_KEY=clave_publica_anon_de_supabase`
- `SUPABASE_SERVICE_ROLE_KEY=clave_privada_service_role_de_supabase`

> **Validación Estricta con Zod al Iniciar**:
>
> - Las variables de entorno son parseadas y validadas estrictamente con un esquema de **Zod** (`src/config/env.ts`).
> - Si falta alguna variable obligatoria (como `SUPABASE_URL`, `SUPABASE_ANON_KEY` o `SUPABASE_SERVICE_ROLE_KEY`) o tiene un formato incorrecto, el proceso se detiene inmediatamente (`process.exit(1)`) mostrando un log con el detalle de los campos faltantes, evitando que el servidor se inicialice en un estado inválido o inconsistente.

> **Nota sobre `NODE_ENV` y Logging con Morgan**:
>
> - Al correr el backend de forma local con `NODE_ENV=development`, la aplicación utiliza automáticamente **Morgan** en formato `dev`. Esto imprime en la terminal los logs detallados de cada petición HTTP en tiempo real (método HTTP, ruta consultada, código de estado coloreado y tiempo de respuesta en milisegundos), facilitando la depuración local.
> - Si se define `NODE_ENV=production`, Morgan pasa al formato estándar `combined` y se ocultan los detalles internos de error (`stack trace`) para mayor seguridad.

> **Nota de Seguridad**: `SUPABASE_SERVICE_ROLE_KEY` SÓLO reside en este backend ya que tiene permisos administrativos de servidor.

---

## Scripts Disponibles

- **`npm run dev`**: Inicia el servidor en modo desarrollo con recarga en tiempo real utilizando `tsx watch`.
- **`npm run build`**: Compila todo el código TypeScript a JavaScript en la carpeta `dist/`.
- **`npm start`**: Inicia el servidor compilado en producción desde `dist/server.js`.
- **`npm run typecheck`**: Valida todos los tipos TypeScript del proyecto sin emitir archivos.

---

## Endpoints de la API

La API se encuentra bajo el prefijo `/api/v1`.

### Documentación Swagger UI (`/doc`)

- `GET /doc`: Interfaz interactiva de Swagger UI cargada desde la especificación OpenAPI (`swagger.yaml`). Solo está activa y accesible cuando `NODE_ENV=development`. En producción retorna 404 por seguridad.

### Health Check

- `GET /api/v1/health`: Estado de salud de la API.

### Autenticación (`/api/v1/auth`)

- `POST /api/v1/auth/register`: Registra un usuario en Supabase Auth y crea automáticamente su perfil en `profiles`.
  - Body: `{ "email": "usuario@ejemplo.com", "password": "password123", "name": "Octavio Cosentino" }`
- `POST /api/v1/auth/login`: Autentica credenciales en Supabase y devuelve tokens de sesión (`access_token`, `refresh_token`, etc.) y el perfil.
  - Body: `{ "email": "usuario@ejemplo.com", "password": "password123" }`
- `POST /api/v1/auth/refresh`: Renueva el `access_token` usando el `refresh_token`.
  - Body: `{ "refreshToken": "<refresh_token>" }`
- `POST /api/v1/auth/logout`: Cierra la sesión activa _(Requiere Bearer Token)_.
- `GET /api/v1/auth/me`: Retorna los datos de autenticación y perfil del usuario autenticado _(Requiere Bearer Token)_.

### Perfiles (`/api/v1/profiles`)

- `GET /api/v1/profiles/me`: Obtiene el perfil del usuario autenticado _(Requiere Bearer Token)_.
- `PATCH /api/v1/profiles/me`: Actualiza el nombre del perfil _(Requiere Bearer Token)_.
  - Body: `{ "name": "Nuevo Nombre" }`

### Tarjetas (`/api/v1/cards`)

- `GET /api/v1/cards`: Lista todas las tarjetas del usuario autenticado _(Requiere Bearer Token)_.
- `POST /api/v1/cards`: Registra una nueva tarjeta _(Requiere Bearer Token)_.
  - Body: `{ "cardholder": "OCTAVIO COSENTINO", "expiration_date": "12/28", "last_four": "4242" }`
- `GET /api/v1/cards/:id`: Obtiene el detalle de una tarjeta por UUID _(Requiere Bearer Token)_.
- `DELETE /api/v1/cards/:id`: Elimina una tarjeta _(Requiere Bearer Token)_.

### Transacciones (`/api/v1/transactions`)

- `GET /api/v1/transactions?page=1&limit=15&search=Adobe&type=CASH_IN`: Lista paginada para scroll infinito con filtros y búsqueda insensible a mayúsculas _(Requiere Bearer Token)_.
  - Query Params:
    - `page` (opcional, default 1)
    - `limit` (opcional, default 15)
    - `search` (opcional, búsqueda parcial con ILIKE)
    - `type` (opcional, "SUS", "CASH_IN", "CASH_OUT", o "ALL")
  - Retorna `data` con `{ id, type, title, subtitle, amount, created_at }` y `pagination` con `{ page, limit, total_items, total_pages, has_next_page }`.
- `POST /api/v1/transactions`: Registra una nueva transacción _(Requiere Bearer Token)_.
  - Body: `{ "title": "Supermercado", "type": "CASH_OUT", "amount": 15000 }`
- `GET /api/v1/transactions/:id`: Obtiene el detalle de una transacción por UUID _(Requiere Bearer Token)_.

---

## Guía para Crear Futuros Módulos

Para agregar cualquier nueva entidad en el futuro, crear una carpeta dentro de `src/modules/<tu-modulo>/` con los 5 archivos:

1. `<modulo>.dto.ts`: Define los esquemas Zod (`z.object({...})`) e infiere los tipos (`z.infer<typeof ...>`).
2. `<modulo>.repository.ts`: Encapsula las consultas a Supabase (`supabaseAdmin.from('mi_tabla')`).
3. `<modulo>.service.ts`: Implementa la lógica de negocio llamando al repositorio.
4. `<modulo>.controller.ts`: Recibe las peticiones HTTP, llama al service y responde con `sendSuccess(res, data)`.
5. `<modulo>.routes.ts`: Configura el `Router()`, valida con `validate({ body, query, params })` y monta los middlewares.

Luego hay que registrarlo en [src/routes/index.ts](file:///c:/Users/octav/OneDrive/Documents/Repositories/GranaBank_Backend/src/routes/index.ts):

```ts
router.use("/nuevo-modulo", nuevoModuloRoutes);
```
