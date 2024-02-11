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