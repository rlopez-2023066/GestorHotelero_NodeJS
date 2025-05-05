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
        
        const roomData = await Room.findById(reservationExist.room) 
        let hotelIdJwt = req.user.hotel
        
        
        if(!hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not the hotel manager.'
                }
            )
        }
        
        if( reservationExist.hotel.toString()!== hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify this service'
                }
            )
        }

        // Verificar que la reservación esté confirmada
        if (reservationExist.status !== 'confirmed') {
            return res.status(400).send({
                success: false,
                message: 'Reservation not confirmed or cancelled'
            }) 
        }

        //Verificar que la habitacion sea un room
        if(roomData.type === 'Living_room'){
            return res.status(404).send(
                {
                    success: false,
                    message: 'This is not a room'
                }
            )
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


export const createInvoiceEvent = async (req, res) => {
    try {
        const { event } = req.body 
        const dataEvent = await Event.findById(event) 
        
        
        let hotelIdJwt = req.user.hotel
        
        
        if(!hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not the hotel manager.'
                }
            )
        }
        
        if( dataEvent.hotel.toString()!== hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify this service'
                }
            )
        }

        // Verificar que el evento exista
        if (!dataEvent) {
            return res.status(404).send({
                success: false,
                message: 'Event not found'
            }) 
        }

        // Verificar que el evento esté confirmado
        if (dataEvent.status !== 'Scheduled') {
            return res.status(400).send({
                success: false,
                message: 'Only confirmed events can be invoiced'
            }) 
        }

        // Verificar que la habitación exista
        const roomData = await Room.findById(dataEvent.room) 
        if (!roomData) {
            return res.status(404).send({
                success: false,
                message: 'Room not found for the event'
            }) 
        }

        // Calcular el costo total de los servicios adicionales
        let servicesTotal = 0 
        if (dataEvent.services && dataEvent.services.length > 0) {
            servicesTotal = dataEvent.services.reduce((total, service) => {
                return total + (service.price * service.quantity) 
            }, 0) 
        }

        // Calcular total (servicios + habitación)
        const priceRoom = roomData.price 
        const subtotal = servicesTotal + priceRoom 
        const tax = subtotal * 0.12 
        const total = subtotal + tax 

        // Crear factura (usando campo `event`, no `reservation`)
        const newInvoice = new Invoice({
            user: dataEvent.user,
            hotel: dataEvent.hotel,
            tax,
            total,
            event: dataEvent._id,
            status: 'unpaid',
            issueDate: new Date()
        }) 

        const savedInvoice = await newInvoice.save() 

        // Cambiar estado de la habitación
        roomData.state = 'available' 
        await roomData.save() 

        // Devolver el stock de los servicios utilizados
        if (dataEvent.services && dataEvent.services.length > 0) {
            for (const serviceItem of dataEvent.services) {
                try {
                    // Encontrar el servicio por ID
                    const serviceData = await Service.findById(serviceItem.serviceId) 
                    if (serviceData) {
                        // Devolver el stock incrementando la cantidad disponible
                        serviceData.amount += serviceItem.quantity 
                        await serviceData.save() 
                        console.log(`Stock devuelto para servicio ${serviceData.name}: ${serviceItem.quantity} unidades`) 
                    }
                } catch (serviceError) {
                    console.error(`Error al devolver stock del servicio ${serviceItem.serviceId}:`, serviceError) 
                    // Continuar con otros servicios aunque uno falle
                }
            }
        }

        // Cambiar estado del evento
        dataEvent.status = 'Completed' 
        await dataEvent.save() 

        return res.status(201).send({
            success: true,
            message: 'Invoice created successfully',
            data: savedInvoice
        }) 

    } catch (error) {
        console.error('Error creating invoice:', error) 
        return res.status(500).send({
            success: false,
            message: 'Internal server error while creating invoice'
        }) 
    }
} 