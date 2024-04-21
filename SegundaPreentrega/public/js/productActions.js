async function addProductFromForm() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const category = document.getElementById('category').value;

    if (name !== '' &&  description !== '' &&  price !== '' &&  stock !== '' &&  imageUrl !== ''  &&  category !== '' ){
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
                price,
                stock,
                imageUrl,
                category
            }),
        });

        if (!response.ok) {
            throw new Error('Error al agregar producto');
        }
        const newProduct = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Producto Creado Exitosamente',
            html: `Nombre del Producto: ${name}<br>Stock: ${stock}<br>Price: ${price}<br>Categoria: ${category}`,
            showConfirmButton: true,
            confirmButtonText: 'Confirmar',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });

    } catch (error) {
        console.error('Error al agregar producto:', error);
    }
}else{
    Swal.fire({
        icon: 'error',
        title: 'Por favor llene todos los datos!',
    });
}
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar producto');
        }

        const data = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'Producto Eliminado Exitosamente',
            html: `ID del Producto: ${productId}`,
            showConfirmButton: true,
            confirmButtonText: 'Confirmar',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });


    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}


async function editProduct(productId, name, description, price, stock, imageUrl, uniqueCategories) {
    try {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Producto',
            html:
                `<div style="display: flex; flex-direction: column; align-items: flex-start; margin-left:8%">
                <p for="swal-input-name" class="text-gray-700" style="margin-bottom: 0.1rem; margin-top:5%;">Nombre del producto:</p>
                </div>
                <div style="display: flex; flex-direction: column;">
                <input id="swal-input-name" class="swal2-input" value="${name}" placeholder="Nombre del producto" style="margin-top: 0.5rem;">
                </div>
            
                <div style="display: flex; flex-direction: column; align-items: flex-start; margin-left:8%">
                <label for="swal-input-description" class="text-gray-700" style="margin-bottom: 0.1rem; margin-top:5%;">Descripción del producto:</label>
                </div>
                <div style="display: flex; flex-direction: column;">
                <textarea id="swal-input-description" class="swal2-input" placeholder="Descripción del producto" style="margin-left:8%; margin-top: 0.5rem; height: 120px; border: 1px solid black; width: 84%;">${description}</textarea>
                </div>
            
                <div style="display: flex; flex-direction: column; align-items: flex-start; margin-left:8%">
                <label for="swal-input-price" class="text-gray-700" style="margin-bottom: 0.1rem; margin-top:5%;">Precio:</label>
                </div>
                <div style="display: flex; flex-direction: column;">
                <input id="swal-input-price" class="swal2-input" value="${price}" placeholder="Precio" style="margin-top: 0.5rem;">
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; margin-left:8%">
                <label for="swal-input-stock" class="text-gray-700" style="margin-bottom: 0.1rem; margin-top:5%;">Stock:</label>
                </div>
                <div style="display: flex; flex-direction: column;">
                <input id="swal-input-stock" class="swal2-input" value="${stock}" placeholder="Stock" style="margin-top: 0.5rem;">
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; margin-left:8%">
                <label for="swal-input-imageUrl" class="text-gray-700" style="margin-bottom: 0.1rem; margin-top:5%;">URL de la imagen:</label>
                </div>
                <div style="display: flex; flex-direction: column;">
                <input id="swal-input-imageUrl" class="swal2-input" value="${imageUrl}" placeholder="URL de la imagen" style="margin-top: 0.5rem;">
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; margin-left:8%">
                <label for="swal-input-category" class="text-gray-700" style="margin-bottom: 0.1rem; margin-top:5%;">Categoría:</label>
                </div>
                <div style="display: flex; flex-direction: column;">
                <input id="swal-input-category" class="swal2-input" value="${uniqueCategories}" placeholder="Categoria" style="margin-top: 0.5rem;">
                </div>            
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input-name').value,
                    document.getElementById('swal-input-description').value,
                    document.getElementById('swal-input-price').value,
                    document.getElementById('swal-input-stock').value,
                    document.getElementById('swal-input-imageUrl').value,
                    document.getElementById('swal-input-category').value
                ];
            }
        });

        if (formValues) {
            const [name, description, price, stock, imageUrl, category] = formValues;
            
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    price,
                    stock,
                    imageUrl,
                    category
                }),
            });

            if (!response.ok) {
                throw new Error('Error al editar producto');
            }

            const updatedProduct = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Producto Editado Exitosamente',
                html: `ID del Producto: ${productId}`,
                showConfirmButton: true,
                confirmButtonText: 'Confirmar',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        }
    } catch (error) {
        console.error('Error al editar producto:', error);
    }
}

