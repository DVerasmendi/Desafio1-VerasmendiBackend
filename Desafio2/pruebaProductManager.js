const ProductManager = require('./ProductManager');

// Ruta del archivo donde se almacenaran los productos
const filePath = './productos.json';

// Crear una instancia de ProductManager con la ruta del archivo
const manager = new ProductManager(filePath);

// Agregar algunos productos de ejemplo
manager.addProduct({
    title: 'Producto de Prueba 1',
    description: 'Descripcion del Producto 1',
    price: 29.99,
    thumbnail: '/image1.jpg',
    code: 'P001',
    stock: 50
});
manager.addProduct({
    title: 'Producto de Prueba 2',
    description: 'Descripcion del Producto 2',
    price: 39.99,
    thumbnail: '/image2.jpg',
    code: 'P002',
    stock: 40
});
manager.addProduct({
    title: 'Producto de Prueba 3',
    description: 'Descripcion del Producto 3',
    price: 49.99,
    thumbnail: '/image3.jpg',
    code: 'P003',
    stock: 30
});
manager.addProduct({
    title: 'Producto de Prueba 4',
    description: 'Descripcion del Producto 4',
    price: 59.99,
    thumbnail: '/image4.jpg',
    code: 'P004',
    stock: 20
});

// Obtener todos los productos y mostrarlos
const allProducts = manager.getProducts();
console.log('Todos los productos:', allProducts);

// Obtener un producto por ID y mostrarlo
const productIdToFind = 2;
const foundProduct = manager.getProductById(productIdToFind);
console.log(`Producto encontrado con ID ${productIdToFind}:`, foundProduct);

// Actualizar un producto
const productIdToUpdate = 1;
const updatedProductData = {
    title: 'Producto Actualizado',
    price: 49.99,
    stock: 60
};
const isUpdated = manager.updateProduct(productIdToUpdate, updatedProductData);
if (isUpdated) {
    console.log(`Producto con ID ${productIdToUpdate} actualizado.`);
} else {
    console.log(`No se encontro ningún producto con ID ${productIdToUpdate}.`);
}

// Eliminar un producto
const productIdToDelete = 2;
const isDeleted = manager.deleteProduct(productIdToDelete);
if (isDeleted) {
    console.log(`Producto con ID ${productIdToDelete} eliminado.`);
} else {
    console.log(`No se encontro ningún producto con ID ${productIdToDelete}.`);
}
