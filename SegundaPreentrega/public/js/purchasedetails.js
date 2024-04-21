document.addEventListener("DOMContentLoaded", function() {
// FINALIZAR COMPRA //
function purchaseCart(cartId) {
    fetch(`/carts/${cartId}/purchase`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        showPurchaseDetails(data);
    })
    .catch(error => {
        console.error('Error al realizar la compra:', error);
    });
}

function showPurchaseDetails(data) {
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

const pagarButton = document.getElementById('boton_pagar');
if (pagarButton){
const cartId = pagarButton.dataset.cartid;
pagarButton.addEventListener('click', function() {
    purchaseCart(cartId); 
});
}
//
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
