const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.productIdCounter = 1;
        this.products = [];
        this.loadFromFile(); // Carga inicial de datos
    }

    saveToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products));
        } catch (err) {
            console.error('Error al guardar el archivo de productos:', err);
            throw new Error('Error al guardar el archivo');
        }
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (err) {
            console.error('Error al cargar el archivo:', err);
            this.products = [];
        }
    }

    addProduct(newProduct) {
        console.log('EN LA CLASE',newProduct)
        this.loadFromFile();
        this.products.push(newProduct);
        this.saveToFile();
    }

    getProducts(limit) {
        this.loadFromFile();
        return limit ? this.products.slice(0, limit) : this.products;
    }

    getProductById(id) {
        this.loadFromFile();
        return this.products.find(product => product.id === id);
    }

    updateProduct(productId, updatedProduct) {
        this.loadFromFile();
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct, id: productId };
            this.saveToFile();
            return true;
        }
        return false;
    }

    deleteProduct(productId) {
        this.loadFromFile();
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveToFile();
            return true;
        }
        return false;
    }

    // Método adicional para obtener la lista de productos
    getProductList() {
        return this.getProducts(); // Llama a getProducts sin límite
    }
}

module.exports = ProductManager;
