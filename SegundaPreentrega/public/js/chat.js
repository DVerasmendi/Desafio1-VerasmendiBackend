document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const userInput = document.getElementById('userInput');
    const messageInput = document.getElementById('messageInput');
    const messagesList = document.getElementById('messages');

    if (form){
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = userInput.value;
        const message = messageInput.value;

        if (user && message) {
            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, message }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Mensaje enviado:', data);
                // Añadir el mensaje a la lista después de recibir la respuesta del servidor
                const li = document.createElement('li');
                li.textContent = `${user}: ${message}`;
                messagesList.appendChild(li);
                userInput.value = '';
                messageInput.value = '';
            })
            .catch((error) => {
                console.error('Error al enviar el mensaje:', error);
            });
        }
    });
}
});
