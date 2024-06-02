const Message = require('../db/models/Message');

exports.getAllMessages = async () => {
    try {
        const messages = await Message.find();
        // Convertir los ObjectId a strings
        const formattedMessages = messages.map(message => {
            return {
                ...message.toObject(),
                _id: message._id.toString()
            };
        });
        return formattedMessages;
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        throw new Error('Error interno del servidor');
    }
};


exports.addMessage = async (req, res) => {
    try {
        const { user, message } = req.body;
        const newMessage = new Message({ user, message });
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error al agregar mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        await Message.findByIdAndDelete(messageId);
        res.status(200).json({ message: 'Mensaje eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar mensaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
