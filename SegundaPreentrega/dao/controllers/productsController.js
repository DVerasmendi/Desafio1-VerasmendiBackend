const Product = require('../db/models/Product');

// Obtener todos los productos
exports.getAllProducts = async (req, res, next) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    let filter = {};
    if (query) {
        filter = { name: new RegExp(query, 'i') };
    }

    try {
        // Logica para obtener todos los productos paginados
        const result = await Product.paginate(filter, options);

        // Convertir ObjectIds a cadenas antes de enviar los datos a la vista
        const products = result.docs.map(product => {
            return {
                ...product._doc,
                _id: product._id.toHexString(),
            };
        });

        console.log('FLAG:', req.isApiRequest)
        if (req.isApiRequest) {
            // Si es una solicitud API, responde en formato JSON
            console.log('ES API')
            const response = {
                status: 'success',
                payload: products,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
            };
            res.status(200).json(response);
        } else {
            console.log('ES WEB')
            // Si es una solicitud de renderizacion, renderiza la vista
            res.locals.productsData = {
                payload: products,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
            };
            next();
        }
    } catch (error) {
        next(error);
    }
};

// Agregar un producto
exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.send(newProduct);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Editar un producto
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedProduct);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).send(error);
    }
};


// Obtener detalles de un producto por ID
exports.getProductDetails = async (productId) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            // Puedes manejar el caso en el que el producto no se encuentre
            return null;  // O lanza una excepcion si prefieres
        }

        return {
            ...product._doc,
            _id: product._id.toHexString(),
        };
    } catch (error) {
        throw error;
    }
};
