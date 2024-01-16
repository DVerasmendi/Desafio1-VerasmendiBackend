const fs = require('fs');

class CartManager {
constructor(path) {
this.path = path;
this.cartIdCounter = 1;
this.carts = [];
}

saveToFile() {
fs.writeFileSync(this.path, JSON.stringify(this.carts));
}

loadFromFile() {
try {
    const data = fs.readFileSync(this.path, 'utf8');
    this.carts = JSON.parse(data);
} catch (err) {
    console.error('Error al cargar el archivo de carritos:', err);
}
}

async createCart(newCart) {
try {
    await this.loadFromFile();
    newCart.id = this.cartIdCounter++;
    this.carts.push(newCart);
    this.saveToFile();
    return newCart.id;
} catch (error) {
    throw new Error('Error al crear el carrito: ' + error.message);
}
}

async getCart(cartId) {
try {
    await this.loadFromFile();
    const cart = this.carts.find(cart => cart.id == cartId);
    return cart;
} catch (error) {
    throw new Error('Error al obtener el carrito: ' + error.message);
}
}

async addProductToCart(cartId, productId, quantity) {
try {
    await this.loadFromFile();
    const cartIndex = this.carts.findIndex(cart => cart.id == cartId);
    const productIndex = this.carts[cartIndex]?.products.findIndex(product => product.id == productId);

    if (cartIndex !== -1) {
    if (productIndex !== -1) {
        this.carts[cartIndex].products[productIndex].quantity += quantity;
    } else {
        // Agregar un nuevo producto al carrito si no existe
        const newProduct = {
        id: productId,
        quantity: quantity
        };
        this.carts[cartIndex].products.push(newProduct);
    }
    this.saveToFile();
    return true;
    } else {
    return false;
    }
} catch (error) {
    throw new Error('Error al agregar producto al carrito: ' + error.message);
}
}
}

module.exports = CartManager;
