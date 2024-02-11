const Cart = require('../db/models/Cart');

// Controlador para gestionar operaciones en el carrito
const cartsController = {
// Crear un nuevo carrito
createCart: async (req, res) => {
try {
    const { userId } = req.body;
    const newCart = await Cart.create({ userId });
    res.status(201).json(newCart);
} catch (error) {
    console.error('Error al crear el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
}
},

// Obtener todos los carritos
getAllCarts: async (req, res) => {
try {
    const carts = await Cart.find();
    res.status(200).json(carts);
} catch (error) {
    console.error('Error al obtener los carritos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
}
},

// Obtener un carrito por ID
getCartById: async (req, res) => {
try {
    const { cartId } = req.params;
    const cart = await Cart.findById(cartId);
    if (cart) {
    res.status(200).json(cart);
    } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
    }
} catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
}
},

// Agregar un producto al carrito
addToCart: async (req, res) => {
try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;
    const cart = await Cart.findById(cartId);

    if (cart) {
    cart.items.push({ productId, quantity });
    await cart.save();
    res.status(200).json(cart);
    } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
    }
} catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
}
},

// Actualizar la cantidad de un producto en el carrito
updateCartItemQuantity: async (req, res) => {
try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cartId);

    if (cart) {
    const item = cart.items.id(itemId);
    if (item) {
        item.quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
    } else {
        res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }
    } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
    }
} catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
}
},

// Eliminar un producto del carrito
removeItemFromCart: async (req, res) => {
    try {
        const { cartId, itemId } = req.params;
        const cart = await Cart.findById(cartId);

        if (cart) {
            // Filtrar los elementos del carrito excluyendo el que se desea eliminar
            cart.items = cart.items.filter(item => item._id.toString() !== itemId);

            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
},

// Cambiar el estado del carrito (por ejemplo, de 'active' a 'completed')
updateCartStatus: async (req, res) => {
try {
    const { cartId } = req.params;
    const { status } = req.body;
    const cart = await Cart.findById(cartId);

    if (cart) {
    cart.status = status;
    await cart.save();
    res.status(200).json(cart);
    } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
    }
} catch (error) {
    console.error('Error al actualizar el estado del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
}
},
};

module.exports = cartsController;
