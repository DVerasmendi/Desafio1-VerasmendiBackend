
# Ecommerce: Chicken with rice

![Ecommerce Banner](http://160.20.190.228/chickenwithrice.png)

## Descripción General
**Ecommerce: Chicken with rice** es una tienda en línea especializada en la venta de arroz con pollo, ofreciendo diferentes presentaciones y opciones de cuentas para usuarios y usuarios premium. Los usuarios pueden administrar varias opciones en la página. Este proyecto se presenta como requisito para aprobar el curso de Node.js de Coderhouse.

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Requisitos de Instalación](#requisitos-de-instalación)
- [Instrucciones de Instalación](#instrucciones-de-instalación)
- [Uso](#uso)
- [Documentación](#documentación)
- [Contribuidores](#contribuidores)
- [Licencia](#licencia)

## Requisitos de Instalación
Este proyecto requiere Node.js y las siguientes dependencias:
\`\`\`json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "busboy": "^1.6.0",
    "dotenv": "^16.4.5",
    "exphbs": "^1.2.0",
    "express": "^4.19.2",
    "express-handlebars": "^7.1.2",
    "express-session": "^1.18.0",
    "googleapis": "^137.1.0",
    "jsonwebtoken": "^9.0.2",
    "moment": "^2.30.1",
    "mongodb": "^6.3.0",
    "mongoose": "^8.1.1",
    "mongoose-paginate-v2": "^1.8.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.13",
    "passport": "^0.7.0",
    "passport-github2": "^0.1.12",
    "serve-favicon": "^2.5.0",
    "sinon": "^17.0.1",
    "socket.io": "^4.7.4",
    "stripe": "^15.11.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "winston": "^3.13.0"
  },
  "devDependencies": {
    "chai": "^5.1.1",
    "mocha": "^10.4.0",
    "supertest": "^7.0.0"
  }
}
\`\`\`

## Instrucciones de Instalación
1. Clona el repositorio:
    \`\`\`bash
    git clone https://github.com/tu_usuario/ecommerce-chicken-with-rice.git
    cd ecommerce-chicken-with-rice
    \`\`\`

2. Instala las dependencias:
    \`\`\`bash
    npm install
    \`\`\`

3. Configura las variables de entorno en un archivo \`.env\`.

4. Ejecuta el proyecto:
    - Modo test:
      \`\`\`bash
      npm test
      \`\`\`
    - Modo producción:
      \`\`\`bash
      npm start
      \`\`\`

## Uso
### Como cliente
1. Regístrate en: [http://localhost:8080/registerForm](http://localhost:8080/registerForm) 

2. O usa un usuario ya creado:
    - **Usuario**: peluchin
    - **Contraseña**: peluchin

3. Puede usar como user premium:
    - **Usuario**: d
    - **Contraseña**: d

4. Para pasar de user común a user premium es necesario subir 3 archivos:
    - Documento de identidad.
    - Domicilio.
    - Estado de cuenta.

    Una vez subido estos archivos, el admin puede hacer el cambio a user premium.

### Como admin
1. Accede con el admin ya creado:
    - **Usuario**: admin

### Tarjetas de prueba
- **Pago aprobado**: 4242424242424242 11/25 123
- **Pago rechazado**: 4000000000000002
- **Sin fondos**: 4000000000009995
- **Tarjeta perdida**: 4000000000009987
- **Tarjeta robada**: 4000000000009979

## Documentación
- Documentación de rutas de API: [http://localhost:8080/api-docs/](http://localhost:8080/api-docs/)

## Contribuidores
- **Deiker Verasmendi** - Desarrollador principal