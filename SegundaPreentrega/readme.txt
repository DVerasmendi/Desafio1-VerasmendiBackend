Ejecutar server: node app.js
http://localhost:3000/products
http://localhost:3000/products/1

http://localhost:3000/products o http://localhost:3000/products/:pid


Primera Pre Entrega: 
Pruebas para el Manejo de Productos:
    VER PRODUCTOS       : GET    http://localhost:8080/api/products/ 
    EJEM:               : GET    http://localhost:8080/api/products

    VER 1 PRODUCTO      : GET    http://localhost:8080/api/products/:pid
    EJEM:               : GET    http://localhost:8080/api/products/1

    CREAR PRODUCTO NUEVO: POST   http://localhost:8080/api/products/
    EJEM:               : POST   http://localhost:8080/api/products/
    Cuerpo (raw, JSON)  :
                            {
                                "id": 5,
                                "title": "Producto 5",
                                "description": "Descripción del Producto 5",
                                "code": "P001",
                                "price": 19.99,
                                "status": true,
                                "stock": 50,
                                "category": "Categoría 5",
                                "thumbnails": [
                                    "/image1.jpg"
                                ]
                            }

    EDIT  PRODUCTO      : PUT    http://localhost:8080/api/products/:pid
    EJEM:               : PUT    http://localhost:8080/api/products/5
    Cuerpo (raw, JSON):
                            {
                                "id": 5,
                                "title": "Producto 5 Editado",
                                "description": "Descripción del Producto 5 Editado",
                                "code": "P001",
                                "price": 19.99,
                                "status": true,
                                "stock": 50,
                                "category": "Categoría 5 Editado",
                                "thumbnails": [
                                    "/image1.jpg"
                                ]
                            }



    BORRAR PRODUCTO     : DELETE http://localhost:8080/api/products/:pid
    EJEM:               : DELETE http://localhost:8080/api/products/5


Pruebas para el Manejo de Carritos:
    CREAR CARRITO        :POST http://localhost:8080/api/carts    
    EJEM:                :POST http://localhost:8080/api/carts

    Consultar un carrito por ID: GET http://localhost:8080/api/carts/:cid
    EJEM                       : GET http://localhost:8080/api/carts/1 


    Agregar un producto a un carrito: POST http://localhost:8080/api/carts/:cid/product/:pid
    EJEM                            : POST http://localhost:8080/api/carts/1/product/2



Para acceder a la vista de productos: http://localhost:8080
Para acceder a la vista de productos en tiempo real: http://localhost:8080/realtimeproducts

/*************************************************************************************************************/
PRIMERA PRACTICA INTEGRADORA: 
- Para cambiar entre FileSystem y MongoAtlas cambiar el flag: TRUE : MONGO ATLAS, FALSE: FILESYSTEM
   - const USE_DB = process.env.USE_DB || true; 

- Todas las pruebas estan en el archivo  Proyecto Node.js Coderhouse.postman_collection.json
   - Para acceder a la vista de chat: http://localhost:8080/chat

Adjunto imagenes de la db creada en Mongo Atlas: 
https://cloud.mongodb.com/
+ DATABASE : https://prnt.sc/ER7OgvENLJaD
    + Productos: https://prnt.sc/ExV1SM2iifW6
    + Carritos : https://prnt.sc/jsBeVZiJXopB
    + Mensajes : https://prnt.sc/cnohB22U9bzh

/*************************************************************************************************************/
Segunda pre entrega del PF 27/02/2024
- Se agrega manejo de API todas las solicitudes propuestas para las rutas de CART, se pueden ver en el cartRoutes.js
- Se crea una vista general de productos : http://localhost:8080/products
- Se crea una vista detallada por producto ID: (Click a cada boton de producto en la web http://localhost:8080/products)
- Se crea la vista detallada de un carrito por ID: http://localhost:8080/api/carts/65c9326dffef98faa42dee08
    El carrito esta seteado por defecto, hay q hacer la logica para crear y llenar el carrito del cliente q visite la web

PlUS:
- Se crea la vista home: http://localhost:8080
- Se crean las diferentes carpetas para las vistas (layouts, partials) 
    + layouts.
    + partials.
    + products.
    + carts.

    Con sus respectivos archivos, logrando la integración de vistas con elementos como header, footer y colocando la importación de los diferentes elementos que ayudan a estilar y al funcionamiento del sitio web, como bootstrap, archivos js, google fonts y diferentes archivos css que dan brillo y enriquecen  el sitio web.

- Se edita el archivo app.js ajustando las nuevas configuraciones.
- Se ajustan los controllers de cart y product para lograr la integración de solicitudes API y SITIO WEB.
/*************************************************************************************************************/
Ajustes varios y colocacion de LOGIN 04/03/2024

- Se realizan ajustes solicitados por la profe.
    - Se coloca categoria a productos, se ajusta precio y stock en cada producto.
    - Se agrega filtrado por categoria.
    - Se ajusta alert de éxito al agregar al carrito.

- Se coloca vista de login general.
    - Se ajusta header segun loggeo o desloggeo de usuarios.
    - Se crea vista de registro de usuario.
        - Formulario básico con diferentes datos de registro.
        - El select de ROL se bloquea netamente para permitir la opcion de user. (La opcion de admin se debe setear en Atlas por seguridad).

    - Se crea validación de usuarios con Atlas.
    - Se crea registro de usuarios a Atlas.
    - Se crea perfil de admin para Coder.
        - USER: adminCoder@coder.com
        - PASS: adminCod3r123
    - Se crean diferentes perfiles de usuario.
        - USER: Jose Sanchez
        - PASS: 123456

    - Se coloca "cerrar sesión" para destruir la sesión almacenada por cada user.

+ PLUS 
    - Se hicieron mejoras en cuanto al front.
    - Se mejoro la interfaz de usuario, en cuanto a la administracion de la info.
    - Se ajustaron detalles en cuanto a redirección y manejo de info.
    - Se agrega el ico para la pagina web.

/*************************************************************************************************************/
Se agrega hash y autenticacion por github  12/03/2024
    - Se instala npm install bcrypt
    - Se implementa el hash.
        - Se ajusta el almacenado y la comparación de pass con la nueva implementación de hash.
    - Se crea la app en página de github para enlazar el loggeo.
        - Se crean las diferentes rutas para enlazar todo.
        - Se agrega botones en Register y Login para acceder con github.

    - En la vista Register:
        - Se coloca "Registrarse con Github".
        - Se crea la lógica para registrar usuario proveniente de github.
    - En la vista Login:
        - Se coloca "Inicia sesión con Github".

    Ambos Botones redireccionan a las mismas rutas, pero a efectos del user no percibe esto. De igual forma se crea un registro de usuario para control interno de la tienda.

/*************************************************************************************************************/
Desafio complementario  21/03/2024
    - Se agrega la ruta app.get('/api/sessions/current', renderController); 
        La cual entrega la info de si existe un usuario autenticado o no, entregando la info por Json.
        - Se adquiere la info al hacer un GET a : http://localhost:8080/api/sessions/current

/*************************************************************************************************************/
Reestructura de nuestro servidor  02/04/2024
    - Se reafirma el uso de capas.
        - Routing.
        - Controlador.
        - Dao.
        - Vistas.
    - Se crea el archivo .env 
        + Se instala el paquete npm install dotenv
        + Se pasa al archivo .env las credenciales de mongoDB y passport de Github.
/*************************************************************************************************************/
Mejorando la arquitectura del servidor  23/04/2024
    PRODUCTOS
    - Se agrega vista de administrador para crear actualizar y eliminar productos (realTimeProducts)
	    - Se agrega validación de agregar producto  
	    - Se puede editar toda la info de cada producto.
        - Se puede eliminar un producto.
	CARRITO
    - Se agrega botón para vaciar el carrito.
    - Únicamente cada user crea carritos, el admin no crea carritos. Ni tiene acceso a la vista de carrito de user.
        - Se agrega la creación de carrito automática al crear un user nuevo, el carrito queda asociado al userId.

        COMPRAS - /:cid/purchase
        - Se crea controller para tickets (Creación, getAll, getUser, deleteTicket)
        - Se agrega creación de tickets con la compra relizada y se descuentan los productos del stock de la DB.
        - Se indica en la compra final a través de una tabla los productos que se lograron comprar y los que no, con su cantidad, precio y total.
        - Se agrega vista para ver tickets tanto para admin y users.

        Posibles situaciones con la compra:
            - Si la compra se realiza de forma exitosa (Todos los elementos están en stock) el carrito pasa a estatus COMPLETED, se crea TICKET y se crea un nuevo carrito vacio para el user.
            - Si la compra contiene productos que no estan en stock y productos que estan en stock, se procesa la compra con los elementos que si estan en stock, se crea TICKET con dichos elementos, pero los productos sin stock se mantienen en el carrito y el estatus del carrito se mantiene en ACTIVE.
            - Si todos los productos en el carrito NO tienen stock, la compra se procesa, pero no se crea ticket, se mantienen los productos en el carrito.


    CHATS 
    - Se agrega el link para la vista del chat unicamente del user con un boton en header para enviar mensajes a la tienda.
    - Se crea la vista de chats para administradores para poder leer los mensajes enviados por los usuarios.
    - Se crea la vista de chats para users y enviar mensajes a la tienda.

/*************************************************************************************************************/
Optimización: Jueves 02-05-2023
Ruta para /users/:uid: Se implementa ruta para validar user segun uid válido o inválido.
Se utiliza la expresión if (uid.length !== 24 || !/^[0-9a-fA-F]+$/.test(uid)) para validar formato del uid enviado por GET ya que los IDs generados por MongoDB son del tipo ObjectId, y estos tienen una estructura específica, por tanto se valida si el UID tiene la longitud correcta y si es una cadena hexadecimal.

    Solicitudes:
        - UID INCORRECTO: http://localhost:8080/users/6628488c47f4e46cd4b41a5g
        - UID CORRECTO:  http://localhost:8080/users/6628488c47f4e46cd4b41a5f

    Se envia como respuesta:
        - NEGATIVA: return res.status(400).json({ error: 'INVALID_PARAM' });
        - POSITIVA: res.json({ user: userDTO });

   

Se implementa el endpoint: http://localhost:8080/api/products/mockingproducts
Para generar 100 Productos

MANEJO DE ERRORES:
Se implementa la administración de UsersErrors, ProductsErrors y CartError con la creación de 
    - errorUtils.js (Errores en producto y en carritos)
    - En el UsersController.js (errores de user).



/*************************************************************************************************************/
Implementación de logger: Jueves 09/05-2023
- Se instala winston.
- Se crean los archivos de configuración y administración de logger.
- Se sustituyen diferentes console.log que mostraban el estatus de corrida de la app por logger, se comprueba funcionamiento.
- Se agrega la ruta: http://localhost:8080/loggerTest para probar los logger.

/*************************************************************************************************************/
Tercera práctica integradora: Jueves 21/05-2023
- Se instalan las diferentes herramientas para hacer el envio de emails: mailer, google apis.
- Se realiza la configuración para enviar email con : https://console.cloud.google.com y https://developers.google.com
- Se crean las rutas, render y vistas necesarias para procesar este requerimiento de cambio de clave.
- NOTA IMPORTANTE: Tener en cuenta que el parametro OAUTH_REFRESH_TOKEN se vence, al vencerse no se puede enviar email.

- Usuario premium creado: 
    - user: bello
    - pass: bello

- Se crea una vista para usuario premium.
- Se hacen ajustes en base a lo solicitado en la vista premium para poder crear, editar, eliminar el producto del usuario, mas los otros no.
- Se pueden agregar al carrito del premium unicamente los productos que no son del owner.
- Unicamente los usuarios premium y admin pueden crear productos.
- Se crea el endpoint /api/users/premium/:uid dentro del panel de admin para seleccionar usuario y cambiar el rol como se desee.


NOTAS IMPORTANTES:
Para poder probar la app.
    - Como cliente: 
        - Crear un user nuevo en Registrarse: http://localhost:8080/registerForm
        - O sino usar un user ya creado previamente: 
            user: peluchin
            pass: peluchin

    - Como admin:
        - Acceder con el admin ya creado, ya que a través del sitio web no esta habilitado para crear administradores.
            user:admin
            pass:admin

Envio de emails: 
https://console.cloud.google.com/apis/credentials
https://developers.google.com/oauthplayground