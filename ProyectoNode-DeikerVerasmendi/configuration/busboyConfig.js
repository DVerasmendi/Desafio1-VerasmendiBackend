const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

const uploadFile = (req, res, next) => {
    const busboy = new Busboy({ headers: req.headers });
    const files = [];
    const userId = req.params.uid; // Obtener el ID del usuario de los parámetros de la URL

    const uploadPath = path.join(__dirname, '../uploads'); // Ruta base para subir los archivos

    // Crear las carpetas de destino si no existen
    const createFolder = (folder) => {
        const dir = path.join(uploadPath, folder);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return dir;
    };

    // Evento 'file' para manejar los archivos subidos
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        let folder = 'documents';
        if (fieldname === 'profile') {
            folder = 'profiles';
        } else if (fieldname === 'product') {
            folder = 'products';
        }

        const saveTo = path.join(createFolder(folder), `${userId}-${Date.now()}-${filename}`);
        file.pipe(fs.createWriteStream(saveTo));
        files.push({ fieldname, filename, path: saveTo, mimetype });
    });

    // Evento 'finish' cuando todos los archivos han sido procesados
    busboy.on('finish', () => {
        req.files = files;
        next();
    });

    // Manejo de errores
    busboy.on('error', (err) => {
        console.error('Error al subir archivo:', err);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    });

    req.pipe(busboy);
};

module.exports = uploadFile;
