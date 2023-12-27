class ProductManager {
constructor() {
    this.products = [];
    this.productIdCounter = 1;
}

// Metodo para agregar un producto al conjunto de productos
addProduct(title, description, price, thumbnail, code, stock) {
    // Validar campos obligatorios y duplicados
    if (!title || !description || !price || !thumbnail || !code || !stock) {
    console.error('Todos los campos son obligatorios');
    return;
    }

    if (this.products.some((product) => product.code === code)) {
    console.error('El código del producto ya existe');
    return;
    }

    const newProduct = {
    id: this.productIdCounter++,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    };

    this.products.push(newProduct);
    console.log(`Producto agregado: ${newProduct.title}`);
}

// Metodo para obtener todos los productos
getProducts() {
    return this.products;
}

// Metodo para buscar un producto por su ID
getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
    console.error('Producto no encontrado');
    return;
    }
    return product;
}
}

// Ejemplo de uso:
const manager = new ProductManager();

// Agregar productos
manager.addProduct('Producto 1', 'Descripción del Producto 1', 19.99, '/image1.jpg', 'P001', 50);
manager.addProduct('Producto 2', 'Descripción del Producto 2', 29.99, '/image2.jpg', 'P002', 30);
manager.addProduct('Producto 3', 'Descripción del Producto 3', 39.99, '/image3.jpg', 'P003', 40);
manager.addProduct('Producto 4', 'Descripción del Producto 4', 49.99, '/image4.jpg', 'P004', 60);
manager.addProduct('Producto 5', 'Descripción del Producto 5', 59.99, '/image5.jpg', 'P005', 70);

// Obtener todos los productos
const allProducts = manager.getProducts();
console.log('Todos los productos:', allProducts);

// Buscar un producto por ID
const productIdToFind = 6;
const foundProduct = manager.getProductById(productIdToFind);
console.log('Producto encontrado:', foundProduct);
