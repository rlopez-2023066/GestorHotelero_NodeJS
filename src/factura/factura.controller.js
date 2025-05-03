import Reservation from '../resevacion/reservacion.model.js'
import Room from '../habitacion/habitacion.model.js'
import Invoice from './factura.model.js'

export const createInvoice = async (req, res) => {
    try{
        const {reservation} = req.body;
        const reservationExist = await Reservation.findById(reservation)

        
        let roomId = reservationExist.room
        let roomData = await Room.findById(roomId)


        

        //Verificar que la reservación exista
        if(!reservationExist){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Reservation not found'
                }
            )
        }

        const newInvoice = new Invoice(
            {
                reservation: reservation,
                user: reservationExist.user,
                hotel: reservationExist.hotel,
                tax: reservationExist.price * 0.12,
                total: reservationExist.price + (reservationExist.price * 0.12),
                status: 'unpaid'
            }
        )

        const savedInvoice = await newInvoice.save()

        roomData.state = 'available'
        await roomData.save()

        res.status(201).send(
            {
                success: true,
                message: 'Invoice created successfully',
                data: savedInvoice
            }
        )

    }catch (error){
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'Error Internal invoice'
            }
        )
    }
}