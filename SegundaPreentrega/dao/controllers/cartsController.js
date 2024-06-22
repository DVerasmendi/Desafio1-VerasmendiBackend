const Cart = require('../db/models/Cart');
const Product = require('../db/models/Product');
const ticketController = require('./ticketController');
const logger = require('../../configuration/winston-config');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Controlador para gestionar operaciones en el carrito
const cartsController = {
// Crear un nuevo carrito
createCart: async (req, res) => {
try {
    const { userId } = req.body;
    const { userEmail } = req.body;
    const newCart = await Cart.create({ userId, userEmail});
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
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
        return res.status(400).json({ status: 'error', message: 'ID de carrito no válido' });
    }
    try {
        const cart = await Cart.findById(cartId).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
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
        
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
},

// Agregar un producto al carrito
addToCart: async (req, res) => {
    try {
        const { cartId } = req.params;
        const { productId, quantity , price} = req.body;
        const cart = await Cart.findById(cartId);

        if (cart) {
            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            
            if (existingProductIndex !== -1) {
                // Si el producto ya existe, aumentar la cantidad
                cart.items[existingProductIndex].quantity += parseInt(quantity, 10);
            } else {
                // Si el producto no existe, agregarlo al carrito
                cart.items.push({ productId, quantity, price }); 
            }

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
    const item = cart.items.find(item => item.productId.toString() === itemId);
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
            cart.items = cart.items.filter(item => item.productId.toString() !== itemId.toString());
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
        const { cartId, productId } = req.params;
        // Buscar el carrito por su ID
        const cart = await Cart.findById(cartId);
        if (!cart) {
            console.error('Carrito no encontrado');
        }
        // Filtrar los elementos del carrito excluyendo el producto que se desea eliminar
        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());

        // Verificar si el producto fue eliminado del carrito
        const finalItemCount = cart.items.length;
        if (initialItemCount === finalItemCount) {
            console.error('Producto no encontrado en el carrito');
        }
        // Guardar el carrito actualizado
        await cart.save();
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
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

// Obtener un carrito por ID de usuario y popular los detalles de los productos
getCartByUserId: async (req, res) => {
    const userId = req.session.user._id;
    const userEmail = req.session.user.email;

    try {
        // Buscar todos los carritos del usuario, tanto activos como completados
        const carts = await Cart.find({ userId }).populate('items.productId');

        // Filtrar los carritos activos y completados
        const activeCarts = carts.filter(cart => cart.status === 'active');
        const completedCarts = carts.filter(cart => cart.status === 'completed');

        // Verificar si hay carritos activos
        if (activeCarts.length > 0) {
            // Devolver el primer carrito activo encontrado
            const activeCart = activeCarts[0];
            return activeCart._id
        }

        // Si no hay carritos activos, crear uno nuevo
        logger.info(`No se encontraron carritos activos. Creando uno nuevo...`);
        const newCart = await Cart.create({ userId, userEmail });
        return newCart._id
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
},

// Controlador para validar los productos en el carrito
validateCart: async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await Cart.findById(cartId).populate('items.productId');
        if (!cart || cart.status !== 'active') {
            return res.status(404).json({ error: 'Carrito no encontrado o no está activo' });
        }

        const purchasedProducts = [];
        const notPurchasedProducts = [];
        let totalPurchasedAmount = 0;
        let totalNotPurchasedAmount = 0;

        for (const item of cart.items) {
            const product = item.productId;
            if (!product || product.stock < item.quantity) {
                notPurchasedProducts.push({
                    name: product.name,
                    quantity: item.quantity,
                    price: item.price,
                    totalAmount: item.quantity * item.price
                });
                totalNotPurchasedAmount += item.quantity * item.price;
            } else {
                purchasedProducts.push({
                    name: product.name,
                    quantity: item.quantity,
                    price: item.price,
                    totalAmount: item.quantity * item.price
                });
                totalPurchasedAmount += item.quantity * item.price;
            }
        }

        return res.status(200).json({
            userEmail: cart.userEmail,
            message: 'Validación realizada con éxito',
            purchasedProducts: purchasedProducts,
            notPurchasedProducts: notPurchasedProducts,
            totalPurchasedAmount: totalPurchasedAmount,
            totalNotPurchasedAmount: totalNotPurchasedAmount,
            cartId: cartId
        });

    } catch (error) {
        console.error('Error al validar el carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
},


// Controlador para crear el intento de pago y confirmar la compra
purchaseCartConfirm: async (req, res) => {
    const { cartId } = req.params;
    const { paymentMethodId, totalPurchasedAmount } = req.body;
    try {
        logger.info(`Total a pagar: ${totalPurchasedAmount}`);
        // Crear el intento de pago con Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalPurchasedAmount * 100, // Stripe acepta el monto en centavos
            currency: 'usd',
            payment_method: paymentMethodId,
            payment_method_types: ['card'],
        });

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            message: 'Intento de pago creado con éxito'
        });

    } catch (error) {
        console.error('Error al crear el intento de pago:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
},

// Controlador para completar la compra
completePurchase: async (req, res) => {
    const { cartId } = req.params;
    const { paymentIntentId } = req.body;
    logger.info(`CART ID: ${cartId}`);
    logger.info(`PAYMENT METHOD ID: ${paymentIntentId}`);
    try {
        const cart = await Cart.findById(cartId).populate('items.productId');
        if (!cart || cart.status !== 'active') {
            return res.status(404).json({ error: 'Carrito no encontrado o no está activo' });
        }

        const purchasedProducts = [];
        const notPurchasedProducts = [];
        let totalPurchasedAmount = 0;
        let totalNotPurchasedAmount = 0;

        for (const item of cart.items) {
            const product = item.productId;
            if (!product || product.stock < item.quantity) {
                notPurchasedProducts.push({
                    name: product.name,
                    quantity: item.quantity,
                    price: item.price,
                    totalAmount: item.quantity * item.price
                });
                totalNotPurchasedAmount += item.quantity * item.price;
            } else {
                purchasedProducts.push({
                    name: product.name,
                    quantity: item.quantity,
                    price: item.price,
                    totalAmount: item.quantity * item.price
                });
                totalPurchasedAmount += item.quantity * item.price;
				product.stock -= item.quantity;
                await product.save();
                await cartsController.removeProductFromCart({ params: { cartId: cartId, productId: product._id } });
            }
        }

        if (purchasedProducts.length !== 0) {
            await ticketController.createTicket(cart, purchasedProducts, totalPurchasedAmount);
        } 
        // Solo se actualiza el estatus del carrito si todos los elementos comprados existen en stock, de lo contrario se mantiene en status='active'
        if (notPurchasedProducts.length === 0) {
            cart.status = 'completed';
        }
        await cart.save();  
        return res.status(200).json({ message: 'Compra completada con éxito' });


    } catch (error) {
        console.error('Error al completar la compra:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
},

}



module.exports = cartsController;