// mockingUtils.js

// Genera un ID aleatorio de 24 caracteres hexadecimal
const generateRandomId = () => {
    const chars = 'abcdef0123456789';
    let randomId = '';
    for (let i = 0; i < 24; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomId += chars[randomIndex];
    }
    return randomId;
};

// Funcion para generar productos simulados con una estructura similar a la proporcionada
exports.generateMockProducts = () => {
    const mockProducts = [];
    for (let i = 0; i < 100; i++) {
        const product = {
            _id: generateRandomId(),
            name: `Product ${i + 1}`,
            description: `Delicious description for product ${i + 1}`,
            price: Math.floor(Math.random() * 100) + 1, // Precio aleatorio entre 1 y 100
            stock: Math.floor(Math.random() * 100), // Stock aleatorio entre 0 y 100
            imageUrl: 'https://www.example.com/image.jpg', // URL de imagen de ejemplo
            category: 'exampleCategory' // Categoria de ejemplo
        };
        mockProducts.push(product);
    }
    return mockProducts;
};
