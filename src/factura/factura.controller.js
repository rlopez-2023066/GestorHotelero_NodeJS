import Reservation from '../resevacion/reservacion.model.js'
import Room from '../habitacion/habitacion.model.js'
import Invoice from './factura.model.js'
import Event from '../evento/event.model.js'
import Service from '../servicio/servicio.model.js'

export const createInvoice = async (req, res) => {
    try {
        const { reservation } = req.body 
        const reservationExist = await Reservation.findById(reservation) 

        // Verificar que la reservación exista
        if (!reservationExist) {
            return res.status(404).send({
                success: false,
                message: 'Reservation not found'
            }) 
        }

        // Verificar que la reservación esté confirmada
        if (reservationExist.status !== 'confirmed') {
            return res.status(400).send({
                success: false,
                message: 'Reservation not confirmed or cancelled'
            }) 
        }

        // Obtener datos de la habitación
        const roomData = await Room.findById(reservationExist.room) 

        // Verificar si la reservación está vinculada a un evento
        if (reservationExist.event) {
            const eventData = await Event.findById(reservationExist.event) 

            // Restaurar stock de servicios del evento
            if (eventData && Array.isArray(eventData.services)) {
                for (const item of eventData.services) {
                    const service = await Service.findById(item.serviceId) 
                    if (service) {
                        service.amount += item.quantity 
                        await service.save() 
                    }
                }
            }

            // Actualizar estado del evento
            if (eventData) {
                eventData.status = 'Finished' 
                await eventData.save() 
            }
        }

        // Crear la factura
        const newInvoice = new Invoice({
            reservation: reservationExist._id,
            user: reservationExist.user,
            hotel: reservationExist.hotel,
            tax: reservationExist.price * 0.12,
            total: reservationExist.price + (reservationExist.price * 0.12),
            status: 'unpaid'
        }) 

        const savedInvoice = await newInvoice.save() 

        // Cancelar reservación
        reservationExist.status = 'cancelled' 
        await reservationExist.save() 

        // Liberar habitación
        if (roomData) {
            roomData.state = 'available' 
            await roomData.save() 
        }

        res.status(201).send({
            success: true,
            message: 'Invoice created successfully',
            data: savedInvoice
        }) 

    } catch (error) {
        console.error(error) 
        return res.status(500).send({
            success: false,
            message: 'Internal Error creating invoice'
        }) 
    }
} 
