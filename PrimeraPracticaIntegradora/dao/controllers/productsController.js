const Product = require('../db/models/Product');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Agregar un producto
exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.send(newProduct);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Editar un producto
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedProduct);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).send(error);
    }
};
