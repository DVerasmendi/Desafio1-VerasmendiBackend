// script.js

async function addToCart(productId, productName, productPrice, cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId,
                quantity: 1,
            }),
        });

        if (!response.ok) {
            console.error('Error al agregar producto al carrito:', response.statusText);
            // Puedes mostrar un mensaje de error al usuario si lo prefieres
            return;
        }

        const cart = await response.json();

        // Mostrar una alerta de SweetAlert con la información del producto y el carrito
        Swal.fire({
            icon: 'success',
            title: 'Producto Agregado al Carrito',
            html: `Nombre del Producto: ${productName}<br>Cantidad: 1<br>Carrito ID: ${cartId}`,
        });

    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        // Puedes mostrar un mensaje de error al usuario si lo prefieres
    }
}
