# PelisExpress - Backend para una Página Ecommerce de Películas

"PelisExpress" es una página de comercio electrónico que emula un sitio para comprar películas.

## Usuarios con Roles [Autenticación y Autorización]

### Administradores

- Email: admin@gmail.com
- Contraseña: 1234

### Usuario Premium

- Email: maxi-vip@gmail.com
- Contraseña: 1234

### Usuario Normal

- Email: gonza-user@gmail.com
- Contraseña: 1234

## Variables de Entorno Utilizadas en el Proyecto

- `PORT`
- `NODE_ENV`
- `MONGO_URL`
- `COOKIE_NAME`
- `COOKIE_SECRET` (utilizado para JWT también)
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL`
- `MAILING_USER`
- `MAILING_PASS`
- `MAILING_SERVICE`
- `LOG_INFO`

## Correr con git clone

- **npm start** - Es suficiente con este comando para correr el entorno en modo development.

## Características del Sitio Web

- **Inicio de sesión con GitHub:** Permite a los usuarios iniciar sesión utilizando sus cuentas de GitHub.
- **Ingreso Premium y Gratuito:** Diferencia entre usuarios premium y usuarios regulares para acceder a diferentes funcionalidades.
- **Panel de Administración:** Permite a los administradores cargar nuevos productos (películas), editar otros usuarios y administrar la plataforma.
- **Carrito de Compras:** Genera un ticket para las compras realizadas por los usuarios.

## Notas Adicionales

Este repositorio contiene la lógica del backend para la plataforma "PelisExpress". Se recomienda revisar la documentación detallada del API con Swagger para obtener información adicional sobre las rutas, controladores y modelos utilizados en este proyecto.

---
