// public/js/purchasedetailsStripe.js
document.addEventListener("DOMContentLoaded", function() {

const pagarStripeButton = document.getElementById('boton_pagar_stripe');
if (pagarStripeButton) {
    const cartId = pagarStripeButton.dataset.cartid;
    pagarStripeButton.addEventListener('click', async function(event) {
        event.preventDefault();
        Swal.fire({
            title: 'Validando carrito',
            html: 'Por favor espera unos momentos mientras validamos los productos',
            allowOutsideClick: false,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
            }
        });

        try {
            const response = await fetch(`/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            Swal.close();

            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la validación',
                    text: data.error,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            } else {
                showPurchaseDetails(data, cartId);
            }
        } catch (error) {
            console.error('Error al validar el carrito:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al validar el carrito',
                text: 'Por favor, intenta nuevamente más tarde',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        }
    });
}


function showPurchaseDetails(data, cartId) {
    const content = document.createElement('div');

    const purchasedTable = createTableWithTotalAmount(data.purchasedProducts, 'Elementos Stock');
    content.appendChild(purchasedTable);

    const totalPurchasedAmount = data.purchasedProducts.reduce((total, product) => total + product.totalAmount, 0);
    const totalPurchasedElement = document.createElement('div');
    totalPurchasedElement.textContent = `Total de elementos en stock: $${totalPurchasedAmount.toFixed(2)}`;
    content.appendChild(totalPurchasedElement);

    const notPurchasedTable = createTableWithTotalAmount(data.notPurchasedProducts, 'Elementos Sin Stock');
    content.appendChild(notPurchasedTable);

    const totalNotPurchasedAmount = data.notPurchasedProducts.reduce((total, product) => total + product.totalAmount, 0);
    const totalNotPurchasedElement = document.createElement('div');
    totalNotPurchasedElement.textContent = `Total de elementos sin stock: $${totalNotPurchasedAmount.toFixed(2)}`;
    content.appendChild(totalNotPurchasedElement);

    const stripeLabel1 = document.createElement('p');
    stripeLabel1.innerHTML = `<strong>Total a pagar: $${totalPurchasedAmount.toFixed(2)}</strong>`;
    stripeLabel1.classList.add('mt-5', 'mb-1');
    content.appendChild(stripeLabel1);

    const stripeLabel2 = document.createElement('p');
    stripeLabel2.innerHTML  = '<strong>Ingrese su tarjeta</strong>';
    stripeLabel2.classList.add('mt-2', 'mb-3'); 
    content.appendChild(stripeLabel2);

    const stripeForm = document.createElement('div');
    stripeForm.id = 'card-element';
    stripeForm.classList.add('mb-3', 'mt-1'); 
    content.appendChild(stripeForm);

    const payButton = document.createElement('button');
    payButton.textContent = 'Pagar Productos con Stripe';
    payButton.classList.add('btn', 'btn-primary', 'mt-3');
    payButton.addEventListener('click', () => handleStripePayment(cartId, data.totalPurchasedAmount));
    content.appendChild(payButton);

    const backButton = document.createElement('button');
    backButton.textContent = 'Volver';
    backButton.classList.add('btn', 'btn-secondary', 'mt-3', 'ml-2');
    backButton.addEventListener('click', () => {
        window.location.href = `/carts/${cartId}`;
    });
    content.appendChild(backButton);

    Swal.fire({
        title: 'Detalles de la Compra',
        html: content,
        width: '800px',
        showConfirmButton: false
    });

    // Inicializar Stripe
    const stripe = Stripe('pk_test_51PRMNIEDjy4qZIbftbly3GJ46DIwA7EU9jrCPfGgAtdYRN7C6k0KyIRJtN7AvPy3Vf7HXDYw1CC8Rc6FlILTVtWQ00eGx1j8H4');
    const elements = stripe.elements();
    const cardElement = elements.create('card', { hidePostalCode: true });
    cardElement.mount('#card-element');

    async function handleStripePayment(cartId, totalPurchasedAmount) {
        try {

            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear el método de pago',
                    text: error.message,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                return;
            }
            Swal.fire({
                title: 'Procesando pago',
                html: 'Por favor espera unos momentos mientras procesamos tu pago.',
                allowOutsideClick: false,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            const response = await fetch(`/carts/${cartId}/purchaseConfirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethodId: paymentMethod.id, totalPurchasedAmount })
            });
            const data = await response.json();

            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Pago Rechazado',
                    text: data.error,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            } else {
                const { clientSecret } = data;
                const result = await stripe.confirmCardPayment(clientSecret);
                if (result.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Pago Rechazado',
                        text: result.error.message,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                    });
                } else if (result.paymentIntent.status === 'succeeded') {
                    completePurchase(cartId, result.paymentIntent.id);
                }
            }
        } catch (error) {
            console.error('Error al procesar el pago con Stripe:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al procesar el pago',
                text: 'Por favor, intenta nuevamente más tarde',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        }
    }
}

async function completePurchase(cartId, paymentIntentId) {
    try {
        const response = await fetch(`/carts/${cartId}/completePurchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ paymentIntentId })
        });
        const data = await response.json();

        if (data.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al completar la compra',
                text: data.error,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Compra Completa',
                text: 'La compra se ha realizado con éxito',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/';
            });
        }
    } catch (error) {
        console.error('Error al completar la compra:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al completar la compra',
            text: 'Por favor, intenta nuevamente más tarde',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    }
}

function createTableWithTotalAmount(products, title) {
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'mt-3');

    const thead = document.createElement('thead');
    thead.classList.add('thead-dark');
    const headerRow = document.createElement('tr');
    ['Nombre del Producto', 'Cantidad', 'Precio', 'Total'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    products.forEach(product => {
        const row = document.createElement('tr');
        ['name', 'quantity', 'price', 'totalAmount'].forEach(prop => {
            const td = document.createElement('td');
            td.textContent = product[prop];
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    const caption = document.createElement('caption');
    caption.textContent = title;
    table.appendChild(caption);

    return table;
}

});



// VACIAR CARRITO //
const vaciarCarritoBtn = document.getElementById('vaciarCarrito');
if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const cartId = vaciarCarritoBtn.getAttribute('data-cartid');
        fetch(`/api/carts/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Carrito vaciado con éxito',
                    showConfirmButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            } else {
                console.error('Error al vaciar el carrito:', response.statusText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al vaciar el carrito',
                    text: 'Por favor, intenta nuevamente más tarde',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            console.error('Error al vaciar el carrito:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al vaciar el carrito',
                text: 'Por favor, intenta nuevamente más tarde',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        });
    });
}