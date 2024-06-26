// errorUtils.js

// Define un diccionario de errores comunes y sus mensajes correspondientes
const errorMessages = {
    PRODUCT_NOT_FOUND: 'El producto no se encontró.',
    PRODUCT_ALREADY_IN_CART: 'El producto ya está en el carrito.',
    CART_IS_FULL: 'El carrito está lleno.',
    INVALID_PRODUCT_ID: 'El ID del producto es inválido.'
    // Agrega más errores según sea necesario
};

// Customizador de errores que devuelve el mensaje correspondiente al codigo de error proporcionado
exports.customizeError = (errorCode) => {
    return errorMessages[errorCode] || 'Error desconocido.';
};
