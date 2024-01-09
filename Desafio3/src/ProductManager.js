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

    async getProducts(limit) {
        try {
            await this.loadFromFile();
            if (limit) {
                return this.products.slice(0, limit);
            } else {
                return this.products;
            }
        } catch (error) {
            throw new Error('Error al obtener productos: ' + error.message);
        }
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
            return true;
        }
        return false;
    }

    deleteProduct(productId) {
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveToFile();
            return true;
        }
        return false;
    }
}

module.exports = ProductManager;
