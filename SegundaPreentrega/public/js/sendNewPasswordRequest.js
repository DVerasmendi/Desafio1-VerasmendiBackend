document.getElementById('boton_sendNewPassword').addEventListener('click', async function() {
    const form = document.getElementById('resetPasswordForm');
    const newPassword = form.elements['newPassword'].value;
    const confirmPassword = form.elements['confirmPassword'].value;
    const token = form.getAttribute('data-token');
    console.log('Token:',token)
    if (!newPassword || !confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ambos campos de contraseña deben ser llenados.'
        });
        return;
    }

    if (newPassword !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden.'
        });
        return;
    }

    Swal.fire({
        title: 'Procesando datos',
        html: 'Por favor espera unos momentos mientras cambiamos tu contraseña.',
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        }
    });

    try {
        const response = await fetch(`/api/auth/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword: newPassword , token: token})
        });

        const data = await response.json();
        Swal.close();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: data.message,
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/';
                }
            });
            
        } else {
            throw new Error(data.message || 'Error en la respuesta del servidor');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo cambiar la contraseña. Por favor, intenta de nuevo.',
        });
    }
});
