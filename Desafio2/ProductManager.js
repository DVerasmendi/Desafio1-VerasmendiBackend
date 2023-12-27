const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.productIdCounter = 1;
        this.products = [];
    }

    saveToFile() {
        fs.writeFileSync(this.path, JSON.stringify(this.products));
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (err) {
            console.error('Error al cargar el archivo:', err);
        }
    }

    addProduct(newProduct) {
        newProduct.id = this.productIdCounter++;
        this.products.push(newProduct);
        this.saveToFile();
    }

    getProducts() {
        this.loadFromFile();
        return this.products;
    }

    getProductById(id) {
        this.loadFromFile();
        return this.products.find(product => product.id === id);
    }

    updateProduct(productId, updatedProduct) {
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct, id: productId };
            this.saveToFile();
            return true; // Indicar que se actualizo correctamente
        }
        return false; // Indicar que no se encontro el producto
    }

    deleteProduct(productId) {
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveToFile();
            return true; // Indicar que se elimino correctamente
        }
        return false; // Indicar que no se encontro el producto
    }
}

module.exports = ProductManager;
