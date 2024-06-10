const multer = require('multer');
const path = require('path');

// Definir el almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = '';
        if (file.fieldname === 'product') {
            folder = 'products';
        } else if (file.fieldname === 'documents') {
            folder = 'documents';
        } else if (file.fieldname === 'profile') {
            folder = 'profiles';
        }
        cb(null, path.join(__dirname, `../uploads/${folder}`));
    },
    filename: function (req, file, cb) {
        const userId = req.params.uid;
        const documentType = req.body.documentType || 'document'; // Usar el tipo de documento seleccionado
        cb(null, `${userId}-${Date.now()}-${documentType}-${file.originalname}`);
    }
});

// Filtro de archivos para asegurarse de que solo se suban imágenes y documentos permitidos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes y documentos'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limitar a 5MB por archivo
}).fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 1 },
    { name: 'documents', maxCount: 10 } // Permitir hasta 10 documentos
]);

module.exports = upload;
