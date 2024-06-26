// MongoDBMock.js

class MongoDBMock {
constructor() {
    // Inicializar "datos" de prueba aqui si es necesario
}

async connect() {
    // Simula la conexion a la base de datos MongoDB
    console.log("Simulando conexión a MongoDB (mock)");
}

async find(collection, query) {
    // Simula la consulta a la base de datos MongoDB
    console.log(`Simulando búsqueda en la colección ${collection} con la consulta:`, query);
    // Retorna datos de prueba
    return [{ id: 1, name: "Mocked Document 1" }, { id: 2, name: "Mocked Document 2" }];
}

}

module.exports = MongoDBMock;
