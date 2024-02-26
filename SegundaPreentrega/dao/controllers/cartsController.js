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

// Obtener un carrito por ID y popular los detalles de los productos
getCartById: async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await Cart.findById(cartId).populate('items.productId');
        if (req.isApiRequest) {
            console.log('ES API')

            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            // Formatear la respuesta para la API
            const formattedResponse = {
                _id: cart._id,
                userId: cart.userId,
                status: cart.status,
                items: cart.items.map(item => ({
                    quantity: item.quantity,
                    productId: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price,
                })),
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt,
                __v: cart.__v,
            };

            return res.status(200).json(formattedResponse);
        }else{
        console.log('ES WEB')
        if (!cart) {
            if (req.isApiRequest) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            } 
        }
        // Obtener solo los datos necesarios para la vista
        const items = cart.items.map(item => ({
            quantity: item.quantity,
            name: item.productId.name,
            price: item.productId.price,
        }));

        // Calcular el precio total del carrito
        const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Enviar la información al renderController
        return {
            items,
            totalPrice,
        };
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

// NUEVOS CONTROLLERS PARA NUEVAS RUTAS //
// Eliminar un producto específico del carrito
removeProductFromCart: async (req, res) => {
    try {
        const { cid, pid } = req.params; // cid es el ID del carrito, pid es el ID del producto
        const cart = await Cart.findById(cid); // Encuentra el carrito por su ID

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Filtrar los ítems para eliminar el producto especificado
        cart.items = cart.items.filter(item => item.productId.toString() !== pid);

        await cart.save(); // Guardar el carrito después de eliminar el producto
        res.status(200).json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
},


// Actualizar el carrito con un arreglo de productos
updateCart: async (req, res) => {
    const { cid } = req.params; // cid es el ID del carrito
    const { products } = req.body; // Asume que esto es un arreglo de productos
    try {
        const cart = await Cart.findById(cid); // Encuentra el carrito por su ID

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.products = products; // Reemplaza los productos existentes con los nuevos

        await cart.save(); // Guarda el carrito actualizado
        res.status(200).json({ message: 'Carrito actualizado con éxito', cart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
},

// Actualizar solo la cantidad de un producto específico
updateProductQuantity: async (req, res) => {
    const { cid, pid } = req.params; // cid es el ID del carrito, pid es el ID del producto
    const { quantity } = req.body; // Cantidad nueva para actualizar

    try {
        const cart = await Cart.findById(cid); // Encuentra el carrito por su ID
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Encuentra el producto en el carrito y actualiza su cantidad
        const productIndex = cart.items.findIndex(item => item.productId.toString() === pid);
        if (productIndex !== -1) {
            cart.items[productIndex].quantity = quantity;
            await cart.save();
            res.status(200).json({ message: 'Cantidad del producto actualizada con éxito', cart });
        } else {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
},

// Eliminar todos los productos del carrito
emptyCart  : async (req, res) => {
    const { cid } = req.params; // cid es el ID del carrito

    try {
        const cart = await Cart.findById(cid); // Encuentra el carrito por su ID
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Vaciar el arreglo de productos
        cart.items = [];

        await cart.save(); // Guarda el carrito actualizado
        res.status(200).json({ message: 'Todos los productos han sido eliminados del carrito', cart });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
},
}





module.exports = cartsController;
