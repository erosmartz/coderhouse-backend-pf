# PelisExpress - Backend para una Página Ecommerce de Películas

"PelisExpress" es una página de comercio electrónico que emula un sitio para comprar películas.

## Usuarios con Roles [Autenticación y Autorización].
Puedes utilizar estos usuarios a la hora de hacer log-in para probar los diferentes niveles de autorización de la app.

### Administrador

- Email: admin@gmail.com
- Contraseña: 1234

### Usuario Premium

- Email: maxi-vip@gmail.com
- Contraseña: 1234

### Usuario Normal

- Email: gonza-user@gmail.com
- Contraseña: 1234

## Variables de Entorno Utilizadas en el Proyecto

- `PORT`: El número de puerto en el que el servidor debe escuchar las solicitudes entrantes. Espera un número entero, en este caso, '8080'
- `NODE_ENV`: Indica el entorno en el que se está ejecutando la aplicación (desarrollo, producción, prueba, etc.). Espera una cadena de texto como `DEVELOPMENT`, `production`, `test`, etc.
- `MONGO_URL`: La URL de conexión a la base de datos MongoDB. Debe ser una cadena de conexión válida para la base de datos MongoDB o Atlas.
- `COOKIE_NAME`: El nombre utilizado para las cookies en la aplicación. Espera una cadena de texto como `session_id`.
- `COOKIE_SECRET`: Una clave secreta utilizada para firmar las cookies, a menudo también usada para JWT (JSON Web Tokens). Espera una cadena de texto segura y compleja.
- `GITHUB_CLIENT_ID`: El ID del cliente proporcionado por GitHub para la autenticación OAuth. Espera una cadena de texto proporcionada por GitHub.
- `GITHUB_CLIENT_SECRET`: El secreto del cliente proporcionado por GitHub para la autenticación OAuth. Espera una cadena de texto proporcionada por GitHub.
- `GITHUB_CALLBACK_URL`: La URL a la que GitHub redirige después de la autenticación. Espera una URL válida, en este caso, para seguir con el proceso de autenticación.
- `MAILING_USER`: El nombre de usuario utilizado para autenticarse con el servicio de SMTP, que envía correos a los usuarios. Espera una cadena de texto.
- `MAILING_PASS`: La contraseña utilizada para autenticarse en el servicio SMTP. Espera una cadena de texto segura.
- `MAILING_SERVICE`: El servicio de correo electrónico que se utilizará (por ejemplo, Gmail, Mailtrap). Espera una cadena de texto con el nombre del servicio, en este caso, utiliza Mailtrap.
- `LOG_INFO`: Configuración para información de registro en la aplicación. Puede ser un booleano (`true`/`false`) o una cadena de texto para especificar el nivel de registro deseado (por ejemplo, `debug`, `info`, `warn`, `error`).


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
