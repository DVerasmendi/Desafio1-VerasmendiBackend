const readline = require('readline');

class ProductManager {
constructor() {
this.products = [];
this.productIdCounter = 1;
this.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
}

addProduct() {
this.rl.question('Ingrese el nombre del producto: ', (title) => {
    this.rl.question('Ingrese la descripción del producto: ', (description) => {
    this.rl.question('Ingrese el precio del producto: ', (price) => {
        this.rl.question('Ingrese la ruta de la imagen: ', (thumbnail) => {
        this.rl.question('Ingrese el código del producto: ', (code) => {
            this.rl.question('Ingrese el stock disponible: ', (stock) => {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.error('Todos los campos son obligatorios');
                this.rl.close();
                return;
            }
            if (this.products.some((product) => product.code === code)) {
                console.error('El código del producto ya existe');
                this.rl.close();
                return;
            }
            const newProduct = {
                id: this.productIdCounter++,
                title,
                description,
                price: parseFloat(price),
                thumbnail,
                code,
                stock: parseInt(stock),
            };
            this.products.push(newProduct);
            console.log(`Producto agregado: ${newProduct.title}`);
            this.rl.close();
            });
        });
        });
    });
    });
});
}

getProducts() {
return this.products;
}

getProductById(id) {
const product = this.products.find((product) => product.id === id);
if (!product) {
    console.error('Producto no encontrado');
    return;
}
return product;
}
}

const manager = new ProductManager();

function addProductsWithPrompt() {
manager.addProduct();
}


function displayProducts() {
const products = manager.getProducts();
console.log('Productos agregados:');
console.log(products);
}

addProductsWithPrompt();
// Espera un momento para que se ingresen los productos
setTimeout(displayProducts, 5000); // Ejemplo: Espera 5 segundos antes de mostrar los productos



addProductsWithPrompt();
