# 🧱 Base Backend Express

Proyecto base para desarrollar backends con **Node.js**, **Express**, **TypeORM** y **JWT**, estructurado con capas separadas (controller, service, repository) y soporte para subida de imágenes.

## 🚀 Tecnologías utilizadas

- Node.js + Express
- TypeORM + PostgreSQL
- JWT para autenticación
- Multer para manejo de imágenes
- dotenv para configuración
- bcryptjs para hash de contraseñas
- Estructura modular y escalable

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jvcodeXD/base-backend-express.git
cd base-backend-express
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo de entorno

Copia el archivo `.env.example` y renómbralo como `.env`:

```bash
cp .env.example .env
```

Luego edita los valores según tu configuración local.

---

## ⚙️ Configuración

### Variables de entorno (.env)

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=base_backend
BASE_URL=http://localhost:4000
JWT_SECRET=secreto_super_seguro
```

> Asegúrate de tener PostgreSQL corriendo y que los datos coincidan con tu configuración.

---

## 🧪 Ejecutar en desarrollo

```bash
npm run dev
```

Esto levanta el servidor en `http://localhost:4000`.

---

## 📂 Subida de imágenes

- Las imágenes de perfil de usuario se guardan en la carpeta `/uploads`.
- Se sirven de forma pública desde:
  ```
  http://localhost:4000/uploads/nombre-de-la-imagen.jpg
  ```

---

## 🔐 Endpoints principales

### Autenticación

- `POST /api/auth/login` → Login de usuario
- `POST /api/auth/refresh` → Refrescar token (si está habilitado)
- `POST /api/auth/logout` → Cerrar sesión

### Usuarios

- `GET /api/users` → Obtener todos los usuarios
- `GET /api/users/:id` → Obtener un usuario por ID
- `POST /api/users` → Crear usuario (con imagen opcional)
- `PUT /api/users/:id` → Actualizar usuario (con imagen opcional)
- `DELETE /api/users/:id` → Eliminar usuario (soft delete)

---

## 🧰 Scripts disponibles

```bash
npm run dev       # Ejecuta el servidor en modo desarrollo (con nodemon)
npm run build     # Compila TypeScript a JavaScript
npm start         # Ejecuta el servidor compilado
```

---

## 🧾 Estructura del proyecto

```
src/
├── config/             # Conexión DB, configuración global
├── controllers/        # Rutas y lógica HTTP
├── entities/           # Entidades TypeORM
├── middlewares/        # Middlewares como Multer
├── repositories/       # Consultas a la base de datos
├── response/           # DTOs para las respuestas
├── routes/             # Definición de rutas
├── services/           # Lógica de negocio
├── utils/              # Funciones auxiliares
└── index.ts            # Punto de entrada principal
```

---

## 📬 Contacto

Este proyecto fue creado como base para proyectos personales o empresariales.  
Si tienes dudas o sugerencias, puedes contactarme vía GitHub Issues o colaboraciones.

## 💻 Autor

**[jvcodeXD](https://github.com/jvcodeXD)**  
Proyecto base personal para futuros desarrollos en Express.
