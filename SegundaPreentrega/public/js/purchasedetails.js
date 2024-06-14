// public/js/purchasedetailsStripe.js
document.addEventListener("DOMContentLoaded", function() {
    const form_ = document.getElementById('card-element');
    if (form_) {
        const stripe = Stripe('pk_test_51PRMNIEDjy4qZIbftbly3GJ46DIwA7EU9jrCPfGgAtdYRN7C6k0KyIRJtN7AvPy3Vf7HXDYw1CC8Rc6FlILTVtWQ00eGx1j8H4');
        const elements = stripe.elements();
        const cardElement = elements.create('card', { hidePostalCode: true });
        cardElement.mount('#card-element');

        async function handleStripePayment(cartId) {
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
                const response = await fetch(`/carts/${cartId}/purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ paymentMethodId: paymentMethod.id })
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
                        showPurchaseDetails(data, result.paymentIntent.id);
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

        const pagarStripeButton = document.getElementById('boton_pagar_stripe');
        if (pagarStripeButton) {
            const cartId = pagarStripeButton.dataset.cartid;
            pagarStripeButton.addEventListener('click', function(event) {
                Swal.fire({
                    title: 'Procesando pago',
                    html: 'Por favor espera unos momentos mientras procesamos el pago',
                    allowOutsideClick: false,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                });

                event.preventDefault();
                handleStripePayment(cartId);
            });
        }
    }

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
});

function showPurchaseDetails(data, paymentIntentId) {
    const content = document.createElement('div');
    const userSubtitle = document.createElement('h4');
    userSubtitle.textContent = `Email: ${data.userEmail}`;
    content.appendChild(userSubtitle);

    const purchasedTable = createTableWithTotalAmount(data.purchasedProducts, 'Elementos Comprados');
    content.appendChild(purchasedTable);

    const totalPurchasedAmount = data.purchasedProducts.reduce((total, product) => total + product.totalAmount, 0);
    const totalPurchasedElement = document.createElement('div');
    totalPurchasedElement.textContent = `Total de elementos comprados: $${totalPurchasedAmount.toFixed(2)}`;
    content.appendChild(totalPurchasedElement);

    const notPurchasedTable = createTableWithTotalAmount(data.notPurchasedProducts, 'Elementos No Comprados');
    content.appendChild(notPurchasedTable);

    const totalNotPurchasedAmount = data.notPurchasedProducts.reduce((total, product) => total + product.totalAmount, 0);
    const totalNotPurchasedElement = document.createElement('div');
    totalNotPurchasedElement.textContent = `Total de elementos no comprados: $${totalNotPurchasedAmount.toFixed(2)}`;
    content.appendChild(totalNotPurchasedElement);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirmar';
    confirmButton.classList.add('btn', 'btn-primary', 'mt-3');
    confirmButton.addEventListener('click', () => {
        window.location.href = '/';
    });
    content.appendChild(confirmButton);

    const paymentStatus = document.createElement('h1');
    paymentStatus.textContent = 'Pago Exitoso';
    content.appendChild(paymentStatus);

    const paymentIntentIdElement = document.createElement('p');
    paymentIntentIdElement.textContent = `ID de Transacción: ${paymentIntentId}`;
    content.appendChild(paymentIntentIdElement);

    Swal.fire({
        title: 'Detalles de la Compra',
        html: content,
        width: '800px',
        showConfirmButton: false
    });
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
