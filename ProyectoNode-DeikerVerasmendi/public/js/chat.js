document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const userInput = document.getElementById('userInput');
    const messageInput = document.getElementById('messageInput');
    const enviarButton = document.getElementById('enviarButton');
    if (enviarButton){
        enviarButton.addEventListener('click', function(e) {
            e.preventDefault();

            const user = userInput.value.trim();
            const message = messageInput.value.trim();

            if (!user || !message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, completa todos los campos',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                return;
            }

            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, message }),
            })
            .then(response => response.json())
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: '¡Su mensaje ha sido enviado a la tienda! Pronto le responderemos.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/products';
                    }
                });
            })
            .catch((error) => {
                console.error('Error al enviar el mensaje:', error);
            });
        });
    }
});
