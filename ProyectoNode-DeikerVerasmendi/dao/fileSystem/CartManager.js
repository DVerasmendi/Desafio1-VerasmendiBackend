const fs = require('fs');

class CartManager {
    constructor(path) {
        this.path = path;
        this.cartIdCounter = 1;
        this.carts = [];
    }

    saveToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts));
        } catch (err) {
            console.error('Error al guardar el archivo de carritos:', err);
            throw new Error('Error al guardar el archivo');
        }
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.carts = JSON.parse(data);
        } catch (err) {
            console.error('Error al cargar el archivo de carritos:', err);
            this.carts = [];
        }
    }

    createCart(newCart) {
        this.loadFromFile();
        newCart.id = this.cartIdCounter++;
        newCart.products = newCart.products || [];
        this.carts.push(newCart);
        this.saveToFile();
        return newCart.id;
    }

    getCart(cartId) {
        this.loadFromFile();
        return this.carts.find(cart => cart.id == cartId);
    }

    addProductToCart(cartId, productId, quantity) {
        this.loadFromFile();
        const cart = this.carts.find(cart => cart.id == cartId);
        if (cart) {
            const product = cart.products.find(p => p.id == productId);
            if (product) {
                product.quantity += quantity;
            } else {
                cart.products.push({ id: productId, quantity });
            }
            this.saveToFile();
            return true;
        }
        return false;
    }
}

module.exports = CartManager;
