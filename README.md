# Where is Waldo

Aplicación web para jugar a encontrar a Waldo en una imagen y registrar cuánto tarda cada jugador.

El proyecto está pensado como práctica de desarrollo full stack: API con Express, PostgreSQL en Neon, Prisma como ORM y React + Vite en el cliente.

> **Estado actual:** el backend, la conexión a Neon, el modelo `Score` y la integración entre React y Express están funcionando. La interfaz está en construcción: Tailwind CSS v4 ya está configurado y existe un header inicial; la pantalla del juego y el flujo de puntuaciones están pendientes.

## Índice

- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Assets SVG](#assets-svg)
- [Requisitos](#requisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Scripts](#scripts)
- [API](#api)
- [Base de datos](#base-de-datos)
- [Decisiones de arquitectura](#decisiones-de-arquitectura)
- [Cómo se construyó el proyecto](#cómo-se-construyó-el-proyecto)
- [Problemas encontrados](#problemas-encontrados)
- [Buenas prácticas](#buenas-prácticas)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

## Stack

| Capa | Tecnología | Uso |
|---|---|---|
| Runtime | Node.js 22.18+ (probado con 26.7.0) | Ejecuta Express y el servidor |
| Lenguaje | TypeScript | Servidor y cliente |
| Servidor | Express 5 | API HTTP y archivos estáticos |
| ORM | Prisma 7 | Acceso a PostgreSQL |
| Base de datos | PostgreSQL en Neon | Persistencia de puntuaciones |
| Frontend | React 19 | Interfaz de usuario |
| Bundler | Vite 8 | Servidor de desarrollo y build |
| Package manager | pnpm 12 | Workspace del proyecto |
| Lint | ESLint | Reglas del cliente |
| Estilos | Tailwind CSS v4 | Utilidades de estilo del cliente |

## Arquitectura

La aplicación usa una arquitectura **SPA + API**:

- React se encarga de toda la interfaz.
- Express expone la API y, en producción, sirve el build del cliente.
- Prisma es la única capa que habla con la base de datos.

### Desarrollo

```text
Navegador
   │
   ├── http://localhost:5173 ──> Vite (React + HMR)
   │        │
   │        └── /api/* ──proxy──> http://localhost:3000
   │
   └── http://localhost:3000 ──> Express (solo API)
```

En desarrollo hay dos procesos:

1. Vite sirve el frontend y recarga al guardar.
2. Express sirve la API.
3. Vite redirige `/api` y `/health` hacia Express para evitar CORS.

### Producción

```text
Navegador
   │
   └── http://localhost:3000
          ├── /api/* ──> Express ──> Prisma ──> Neon
          └── /* ─────> client/dist (HTML, JS, CSS)
```

En producción hay un solo proceso: Express sirve la API y el build de React.

## Estructura del proyecto

```text
.
├── client/                     # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   └── header.tsx      # Header inicial de la interfaz
│   │   ├── App.tsx             # Layout principal
│   │   ├── main.tsx            # Punto de entrada de React
│   │   ├── index.css           # @import "tailwindcss"
│   │   └── assets/
│   │       └── waldo/
│   │           ├── waldo-character.svg
│   │           ├── waldo-logo.svg
│   │           ├── waldo-badge.svg
│   │           └── waldo-badge-full.svg
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json           # Solution file: referencia a app y node
│   ├── tsconfig.app.json       # Configuración del código React
│   ├── tsconfig.node.json      # Configuración de vite.config.ts
│   └── package.json
│
├── controllers/                # Controladores HTTP
│   └── indexController.ts
├── routes/                     # Definición de rutas
│   └── indexRouter.ts
├── db/                         # Infraestructura de base de datos
│   └── prisma.ts
│
├── prisma/
│   ├── schema.prisma           # Modelo de datos
│   └── migrations/             # Migraciones versionadas
│
├── generated/                  # Cliente Prisma generado (ignorado por git)
├── server.ts                   # Entrada del servidor Express
├── prisma.config.ts            # Configuración del CLI de Prisma
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json               # Configuración TypeScript del servidor
├── .env.example
└── README.md
```

### Por qué `client/` y no `src/`

El servidor corre en Node y el cliente corre en el navegador. Son dos entornos distintos:

- El servidor necesita tipos de Node y no necesita DOM.
- El cliente necesita DOM y JSX, y no debería importar Prisma ni variables privadas.

Separarlos en `client/` y raíz evita mezclar configuraciones, dependencias y responsabilidades.

## Assets SVG

Los assets del juego están en `client/src/assets/waldo/`:

| Archivo | Dimensiones | Uso |
|---|---|---|
| `waldo-character.svg` | 736 × 1517 | Personaje completo, fondo transparente |
| `waldo-logo.svg` | 595 × 292 | Logo horizontal, fondo transparente |
| `waldo-badge.svg` | 503 × 503 | Insignia circular sin el wordmark de DreamWorks; funciona en fondos claros y oscuros |
| `waldo-badge-full.svg` | 503 × 552 | Insignia completa con el wordmark de DreamWorks; pensada para fondos claros |

### Cómo usarlos en React

Vite importa los SVG como URL por defecto. No hace falta `vite-plugin-svgr`:

```tsx
import waldoCharacter from "../assets/waldo/waldo-character.svg";
import waldoLogo from "../assets/waldo/waldo-logo.svg";
import waldoBadge from "../assets/waldo/waldo-badge.svg";

export function Header() {
  return (
    <header>
      <img src={waldoLogo} alt="Where's Waldo" className="h-16 w-auto" />
      <img src={waldoBadge} alt="Insignia de Where's Waldo" className="h-20 w-auto" />
    </header>
  );
}

export function Waldo() {
  return (
    <img
      src={waldoCharacter}
      alt="Waldo saludando"
      className="h-72 w-auto"
    />
  );
}
```

Si necesitas cambiar colores o animar partes del SVG desde React, importa el SVG como componente con `vite-plugin-svgr`; para mostrarlo como imagen, la importación por URL es suficiente.

### Notas de conversión

- El fondo gris de las imágenes 1 y 2 se eliminó con un flood fill desde las esquinas, no con un `transparent` global, para no borrar blancos internos (ojos, franjas, letras).
- La vectorización se hizo con VTracer en modo color, curvas spline y jerarquía `cutout`, limitando la cantidad de colores para reducir el tamaño.
- `waldo-badge.svg` recorta el wordmark de DreamWorks porque en el PNG original mide unos pocos píxeles y no se vectoriza limpio. `waldo-badge-full.svg` conserva la composición completa.
- El logo horizontal no incluye la línea de copyright del PNG original porque está a ~5 px y se convertiría en ruido. Si publicas el proyecto, agrega la atribución como texto en el footer.
- Los SVG se optimizaron con SVGO en modo multipass; se conservaron `viewBox`, `<title>` y atributos ARIA.
- Los SVG tienen `viewBox` y fondo transparente. Se pueden escalar sin pérdida.
- Peso total de los cuatro assets: ~140 KB.

> **Uso de marca:** Where's Waldo y DreamWorks son marcas de sus respectivos dueños. Estos assets son para uso personal/educativo; si publicas el proyecto, revisa los permisos correspondientes.

## Requisitos

- Node.js 22.18 o superior.
  - El script `start` ejecuta `node server.ts` usando el type stripping nativo de TypeScript.
  - Si usas una versión anterior, cambia `start` a `tsx server.ts` o compila el servidor.
- pnpm 12.
- Una base de datos PostgreSQL en Neon.
- Git.

## Puesta en marcha

### 1. Clonar e instalar

```bash
git clone <url-del-repositorio>
cd Where-is-Waldo
pnpm install
```

`pnpm install` instala las dependencias de la raíz y del workspace `client`.

### 2. Configurar variables de entorno

Copia el ejemplo:

```bash
cp .env.example .env
```

Completa `.env` con tus datos de Neon:

```env
DATABASE_URL="postgresql://usuario:password@host-pooler.../neondb?sslmode=require"
DIRECT_URL="postgresql://usuario:password@host.../neondb?sslmode=require"
```

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Conexión pooled que usa la aplicación en tiempo de ejecución |
| `DIRECT_URL` | Conexión directa que usa el CLI de Prisma para migraciones |
| `PORT` | Opcional. Puerto del servidor; por defecto `3000` |

`.env` está ignorado por git. Nunca subas credenciales reales.

### 3. Generar el cliente de Prisma y migrar

`generated/` está ignorado, así que en un clon limpio hay que generarlo:

```bash
pnpm db:generate
```

Si la base de datos está vacía, aplica las migraciones:

```bash
pnpm exec prisma migrate deploy
```

Para desarrollo, si vas a crear una migración nueva:

```bash
pnpm exec prisma migrate dev --name nombre-de-la-migracion
pnpm db:generate
```

### 4. Arrancar en desarrollo

```bash
pnpm dev
```

Esto inicia:

- API: <http://localhost:3000>
- Frontend: <http://localhost:5173>

Abre `http://localhost:5173`. La API directa en `http://localhost:3000` no sirve React en desarrollo; eso es intencional.

### Estilos con Tailwind CSS

El cliente usa Tailwind CSS v4 con el plugin oficial de Vite:

- `client/vite.config.ts` registra `tailwindcss()` junto a React.
- `client/src/index.css` contiene `@import "tailwindcss";`.
- No hay `tailwind.config.js` ni `postcss.config.js`; en v4 la configuración se hace desde el CSS con `@theme` si hace falta.

Para comprobar que está activo, usa clases como `bg-amber-200`, `flex` o `h-screen` en un componente y abre `http://localhost:5173`.

### 5. Probar producción en local

```bash
pnpm serve
```

`serve` hace el build del cliente y arranca Express en modo producción. Abre <http://localhost:3000>.

Si ya tienes el build hecho y solo quieres arrancar:

```bash
pnpm start
```

`pnpm start` no compila; espera que `client/dist` exista.

### Verificación rápida

```bash
pnpm -C client build
pnpm exec tsc --noEmit
pnpm -C client lint
pnpm exec prisma validate
```

Y con el servidor corriendo:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/status
curl http://localhost:3000/api/prisma/test
```

## Scripts

### Raíz

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Arranca API y Vite juntos con `concurrently` |
| `pnpm dev:api` | Arranca solo Express con `tsx watch` |
| `pnpm dev:web` | Arranca solo Vite |
| `pnpm db:generate` | Genera el cliente de Prisma en `generated/` |
| `pnpm build` | Genera Prisma y compila el cliente en `client/dist` |
| `pnpm start` | Arranca Express en modo producción |
| `pnpm serve` | Ejecuta `build` y luego `start` |

### Cliente

| Comando | Qué hace |
|---|---|
| `pnpm -C client dev` | Servidor de desarrollo de Vite |
| `pnpm -C client build` | Typecheck y build de producción |
| `pnpm -C client lint` | ESLint |
| `pnpm -C client preview` | Previsualiza el build; no es el servidor de producción |

## API

Todas las rutas de negocio viven bajo `/api`.

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| `GET` | `/health` | Health check del servidor | Listo |
| `GET` | `/api/status` | Estado básico de la API | Listo |
| `GET` | `/api/prisma/test` | Consulta de prueba a la tabla `Score` | Temporal |

Ejemplos:

```bash
curl http://localhost:3000/health
# {"status":"ok"}

curl http://localhost:3000/api/status
# {"status":"runing"}

curl http://localhost:3000/api/prisma/test
# {"id":"...","name":"Luis","timeMs":36000,"createdAt":"..."}
```

> `runing` es el valor actual; queda pendiente corregirlo a `running`.

Cualquier ruta desconocida bajo `/api` devuelve JSON:

```json
{ "error": "Not found" }
```

Esto es importante para que un `fetch` no reciba HTML por accidente.

### Endpoints propuestos para el juego

Todavía no están implementados:

| Método | Ruta | Uso propuesto |
|---|---|---|
| `GET` | `/api/scores` | Listar las mejores puntuaciones |
| `POST` | `/api/scores` | Guardar una puntuación |
| `GET` | `/api/scores/:id` | Consultar una puntuación |

El `POST` debería validar el nombre, el tiempo y, idealmente, que la partida haya sido válida. No se debe confiar en un tiempo enviado directamente por el navegador.

## Base de datos

El modelo actual es:

```prisma
generator client {
  provider            = "prisma-client"
  output              = "../generated/prisma"
  moduleFormat        = "esm"
  importFileExtension = "ts"
}

datasource db {
  provider = "postgresql"
}

model Score {
  id        String   @id @default(cuid())
  name      String   @db.VarChar(20)
  timeMs    Int
  createdAt DateTime @default(now())

  @@index([timeMs])
}
```

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `String` | Identificador único generado con `cuid()` |
| `name` | `String` | Nombre del jugador, máximo 20 caracteres |
| `timeMs` | `Int` | Tiempo en milisegundos |
| `createdAt` | `DateTime` | Fecha de creación |

El índice `@@index([timeMs])` prepara la tabla para ordenar puntuaciones por tiempo.

### Prisma 7 y Neon

- El cliente se genera con el nuevo proveedor `prisma-client`.
- Se genera en `generated/prisma` para mantenerlo fuera de `node_modules`.
- El formato es ESM y las importaciones usan extensión `.ts`.
- La aplicación usa `@prisma/adapter-neon` con `DATABASE_URL`.
- El CLI de Prisma usa `DIRECT_URL` para migraciones.

### Migraciones

```bash
# Desarrollo: crea y aplica una migración
pnpm exec prisma migrate dev --name descripcion-del-cambio

# Producción: aplica migraciones existentes
pnpm exec prisma migrate deploy

# Regenerar el cliente después de cambiar el schema
pnpm db:generate
```

Las migraciones sí se versionan en git. El cliente generado no.

## Decisiones de arquitectura

### 1. SPA en lugar de `views/` de Express

Se eligió React como SPA, no como motor de plantillas de Express.

- `views/` y `res.render()` son para EJS, Pug o Handlebars.
- React se compila a HTML, CSS y JS estáticos.
- Express solo entrega `index.html` y los assets; React maneja las rutas del cliente.

**Ventaja:** separación clara entre interfaz y API, y recarga rápida en desarrollo.

**Alternativa descartada:** SSR con `react-dom/server` o un framework como Next/Remix. Es más complejo y no era necesario para un juego principalmente interactivo.

### 2. API bajo `/api`

Inicialmente la API vivía en `/`. Eso choca con la SPA, porque React también necesita `/`.

Se movió todo a `/api`:

```ts
app.use("/api", indexRouter);
```

Y se dejó `/health` en la raíz para monitoreo.

### 3. Cliente separado en `client/`

El frontend vive en `client/`, no dentro del servidor.

- Evita mezclar dependencias de Node y del navegador.
- Permite tener un `tsconfig` distinto para cada entorno.
- Facilita que Vite tenga su propio `package.json` y su propio build.

### 4. Workspace de pnpm y un solo lockfile

`pnpm-workspace.yaml` declara:

```yaml
packages:
  - client
```

La raíz y `client` son proyectos del mismo workspace. El lockfile real es el de la raíz; no debe haber un `client/pnpm-lock.yaml` separado.

Esto permite:

```bash
pnpm install
pnpm -C client dev
```

con una sola instalación y una sola resolución de dependencias.

### 5. Prisma 7 + adaptador de Neon

Se usa Prisma 7 con `@prisma/adapter-neon`.

- `DATABASE_URL` apunta al pooler de Neon y lo usa la aplicación.
- `DIRECT_URL` apunta a la conexión directa y la usa el CLI para migraciones.
- El cliente generado se guarda en `generated/prisma`, no en `node_modules`.

**Ventaja:** funciona bien con PostgreSQL serverless y mantiene las migraciones separadas del tráfico de la aplicación.

### 6. ESM y TypeScript nativo

El proyecto usa `"type": "module"` y extensiones `.ts` en las importaciones.

- En desarrollo: `tsx watch server.ts`.
- En producción: `node server.ts`, usando el type stripping de Node.

`tsconfig.json` incluye `erasableSyntaxOnly` para evitar sintaxis que Node no pueda ejecutar directamente, como enums o namespaces.

**Tradeoff:** `pnpm start` requiere una versión moderna de Node. Si se despliega en una versión anterior, hay que usar `tsx` o compilar el servidor.

### 7. Express sirve el build en producción

En producción no se ejecuta Vite. El flujo es:

```bash
pnpm build   # genera client/dist
pnpm start   # Express sirve client/dist + /api
```

Ventajas:

- Un solo proceso y un solo puerto.
- No hace falta CORS.
- El deploy es más simple.

El bloque de producción está protegido por `NODE_ENV`:

```ts
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}
```

`/{*splat}` es la sintaxis correcta en Express 5. `app.get("*")` lanza un error porque el wildcard debe tener nombre.

### 8. Proxy de Vite en desarrollo

Vite redirige las rutas de API a Express:

```ts
server: {
  proxy: {
    "/api": "http://localhost:3000",
    "/health": "http://localhost:3000",
  },
},
```

Así el navegador siempre habla con `localhost:5173` y no hay CORS. En el código React se usa:

```ts
fetch("/api/status");
```

Nunca se hardcodea `http://localhost:3000` en el cliente.

## Cómo se construyó el proyecto

### 1. Base del servidor

Se inicializó el proyecto con Node, TypeScript y Express.

- `server.ts` crea la aplicación, registra los middlewares y arranca el puerto.
- `express.json()` y `express.urlencoded()` permiten recibir JSON y formularios.
- `/health` sirve como comprobación básica.

### 2. Prisma y Neon

Se configuró Prisma con PostgreSQL y el adaptador de Neon.

- `prisma/schema.prisma` define el modelo `Score`.
- `prisma.config.ts` centraliza el schema, las migraciones y la URL directa.
- `db/prisma.ts` crea el cliente singleton que usan los controladores.
- La primera migración crea la tabla `Score` y su índice por `timeMs`.

### 3. Organización del backend

Se separó el backend en capas:

```text
routes/       -> define endpoints
controllers/  -> recibe Request/Response
db/           -> infraestructura de Prisma
```

`db/prisma.ts` se movió desde `models/db.ts` porque no es un modelo de dominio: es configuración de infraestructura. Los modelos de negocio viven en el schema de Prisma.

### 4. Cliente con React y Vite

Se creó `client/` con el template de React + TypeScript.

- `client/index.html` es el punto de entrada.
- `client/src/main.tsx` monta React en `#root`.
- `client/src/App.tsx` contiene el layout principal.
- `client/src/components/header.tsx` es el primer componente de la interfaz.
- `client/src/index.css` importa Tailwind CSS v4.
- `vite.config.ts` configura los plugins de React y Tailwind, y el proxy.

Al principio el scaffold se generó dentro de `client/`, creando `client/client`. Se corrigió moviendo el contenido y eliminando la carpeta anidada.

### 5. Integración de desarrollo

Se agregó el proxy de Vite para que el frontend pudiera llamar a `/api` sin CORS.

También se ajustó la API para que todas las rutas de negocio estuvieran bajo `/api` y `/` quedara libre para React.

### 6. Integración de producción

Se agregó el servicio de archivos estáticos y el fallback de SPA en `server.ts`.

El orden es importante:

1. Rutas de API.
2. 404 JSON para `/api`.
3. Archivos estáticos de `client/dist`.
4. Fallback a `index.html` para rutas del cliente.

### 7. Scripts y workspace

Se agregó `client` al workspace de pnpm y se unificó el lockfile en la raíz.

Se instaló `concurrently` en la raíz para poder arrancar API y Vite con un solo comando:

```bash
pnpm dev
```

### 8. Ajustes de calidad

- `strict: true` en el TypeScript del cliente.
- `tsconfig` separado para app y para Vite.
- ESLint en el cliente.
- `pnpm db:generate` agregado al script de build.
- Un solo lockfile.
- Limpieza de dependencias duplicadas.

## Problemas encontrados

| Problema | Causa | Solución |
|---|---|---|
| Se creó `client/client` | `pnpm create vite client` se ejecutó dentro de `client/` | Ejecutarlo desde la raíz o usar `pnpm create vite .` dentro de una carpeta vacía |
| La API ocupaba `/` | `app.use("/", indexRouter)` | Montar la API en `/api` |
| `app.get("*")` falla en Express 5 | El wildcard debe tener nombre | Usar `/{*splat}` |
| `__dirname` no existe | El proyecto es ESM | Usar `import.meta.dirname` |
| `fetch` a la API daba 502 en desarrollo | Express no estaba corriendo | Arrancar `pnpm dev:api` o `pnpm dev` |
| `concurrently: command not found` | Estaba instalado en `client`, no en la raíz | `pnpm add -Dw concurrently` |
| Lockfile duplicado | Se instaló dentro de `client` antes del workspace | Un solo `pnpm-lock.yaml` en la raíz |
| Prisma no encontraba el cliente generado | `generated/` está ignorado | Ejecutar `pnpm db:generate` |
| `EADDRINUSE` en el puerto 3000 | Ya había otro servidor corriendo | Detener el proceso anterior o usar `PORT=otro` |
| Vite no responde en `127.0.0.1` | Se ata a `localhost`/IPv6 | Usar `http://localhost:5173` |
| pnpm ignora scripts de esbuild | `allowBuilds` los bloquea | Ejecutar `pnpm approve-builds` o habilitar `esbuild` si el build falla |

## Buenas prácticas

- No importar Prisma ni código del servidor dentro de React.
- Usar siempre rutas relativas (`/api/...`) en el cliente.
- No commitear `.env`, `generated/` ni `client/dist`.
- Validar los datos de las puntuaciones en el servidor.
- Mantener las rutas de API antes del fallback de la SPA.
- Devolver JSON en los errores de `/api`.
- Agregar un middleware de errores para no devolver HTML en fallos inesperados.
- Escribir tests de API y de componentes antes de agregar autenticación o ranking público.

### Agregar una ruta nueva

1. Crear la función del controlador en `controllers/`.
2. Registrarla en `routes/indexRouter.ts`.
3. Consumirla desde React con `fetch("/api/...")`.
4. Probar en desarrollo con Vite y en producción con `pnpm serve`.

### Cambiar el schema de Prisma

1. Editar `prisma/schema.prisma`.
2. Crear la migración:

   ```bash
   pnpm exec prisma migrate dev --name descripcion-del-cambio
   ```

3. Regenerar el cliente:

   ```bash
   pnpm db:generate
   ```

4. Actualizar controladores y tipos si hace falta.

## Roadmap

- [x] Configurar Express + TypeScript
- [x] Configurar Prisma + Neon
- [x] Crear el modelo `Score` y su migración
- [x] Separar rutas, controladores y acceso a datos
- [x] Crear el cliente React + Vite
- [x] Configurar el proxy de desarrollo
- [x] Servir el build desde Express en producción
- [x] Configurar el workspace de pnpm
- [x] Unificar los scripts de desarrollo y build
- [x] Instalar Tailwind CSS v4
- [x] Convertir el personaje y los logos a SVG
- [ ] Reemplazar el template de Vite por la interfaz del juego
- [ ] Implementar la imagen y la detección de clics
- [ ] Implementar el temporizador
- [ ] Crear `POST /api/scores`
- [ ] Crear `GET /api/scores`
- [ ] Validar nombre y tiempo en el servidor
- [ ] Agregar tests de API y de React
- [ ] Preparar el deploy
- [ ] Definir y documentar las reglas del juego

## Licencia

ISC.
