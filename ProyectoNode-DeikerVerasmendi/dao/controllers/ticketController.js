const Ticket = require('../db/models/Ticket');


function generateUniqueCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}


exports.getAllTickets = async () => {
    try {
        const tickets = await Ticket.find();
        // Convertir los ObjectId a strings
        const formattedTickets = tickets.map(ticket => {
            return {
                ...ticket.toObject(),
                _id: ticket._id.toString()
            };
        });
        return formattedTickets;
    } catch (error) {
        console.error('Error al obtener los tickets:', error);
        throw new Error('Error interno del servidor');
    }
};

exports.getTicketsByPurchaser = async (purchaserEmail) => {
    try {
        const tickets = await Ticket.find({ purchaser: purchaserEmail });
        // Convertir los ObjectId a strings
        const formattedTickets = tickets.map(ticket => {
            return {
                ...ticket.toObject(),
                _id: ticket._id.toString()
            };
        });
        return formattedTickets;
    } catch (error) {
        console.error('Error al obtener los tickets del comprador:', error);
        throw new Error('Error interno del servidor');
    }
};


exports.createTicket = async (cart, purchasedProducts, totalPurchasedAmount) => {
    try {
        const ticketCode = generateUniqueCode();

        const ticket = new Ticket({
            code: ticketCode,
            purchase_datetime: new Date(),
            amount: totalPurchasedAmount,
            purchaser: cart.userEmail,
            cartId: cart._id,
            userId: cart.userId,
            purchasedProducts: purchasedProducts
        });

        await ticket.save();

        return ticket;
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        throw new Error('Error interno del servidor');
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        await Ticket.findByIdAndDelete(ticketId);
        res.status(200).json({ message: 'Ticket eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el ticket:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
