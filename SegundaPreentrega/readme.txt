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

