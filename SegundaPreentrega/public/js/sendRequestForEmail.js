document.getElementById('boton_envio_data_resetEmail').addEventListener('click', async function() {
    const form = document.getElementById('resetEmailForm');
    const email = form.elements['email'].value;

    if (!email) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe llenar el campo de correo electrónico.'
        });
        return;
    }

    // SweetAlert de cargando
    Swal.fire({
        title: 'Procesando datos',
        html: 'Por favor espera unos momentos mientras enviamos el correo.',
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        }
    });

    try {
        const response = await fetch('/api/auth/request-password-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json(); // Procesar la respuesta como JSON

        Swal.close(); // Cerrar el SweetAlert de cargando

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: data.message,
            });
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo enviar el email de recuperación. Por favor, intenta de nuevo.',
        });
    }
});
