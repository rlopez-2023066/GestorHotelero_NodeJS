import Reservation from './reservacion.model.js'
import Room from '../habitacion/habitacion.model.js'
import Hotel from '../hotel/hotel.model.js'

//Create Reservartion (Room)
export const createReservationRoom = async (req, res) =>{
    try{
        //Verificar que el ID User exista
        let userId = req.user.uid

        const {room, description, startTime, endTime} = req.body
        const roomData = await Room.findById(room)
        
        if(!userId){
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        //Verificar si la habitacion exista
        if(!roomData){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Room not found'
                }
            )
        }

        if(roomData.type === 'Living_room'){
            return res.status(404).send(
                {
                    success:false,
                    message:' The room is like a living room.'
                }
            )
        }

        //Verificar si la habitacion esta disponible
        if(roomData.state === 'busy'){
            return res.status(400).send(
                {
                    success: false,
                    message: 'Room is not available'
                }
            )
        }

        const newReservation = new Reservation(
            {
                user: userId,
                room,
                hotel: roomData.hotel,
                description,
                startTime,
                endTime,
                status: 'confirmed',
                price: roomData.price                
            }
        )

        const savedReservation = await newReservation.save()

        roomData.state = 'busy'
        await roomData.save()

        res.status(201).send(
            {
                success: true,
                message: 'Reservation created successfully',
                savedReservation
            }
        )

    }catch(error){
        console.error(error) 
        res.status(500).send(
            {
                success: false,
                message: 'Internal Error Reservation (Room)'
            }
        )
    }

}


// Update Reservation (Room)
export const updateReservationRoom = async (req, res) => {
    try {
        const { id } = req.params 
        const reservation = await Reservation.findById(id)

        

        // Verificar si la reservación es del usuario
        const userId = req.user.uid 
        if (reservation.user.toString() !== userId) {
            return res.status(403).send({
                success: false,
                message: 'You are not authorized to update this reservation'
            }) 
        }

        

        // Verificar si la reservación ya está asociada a un evento
        
        const {
            room: newRoomId,
            description,
            startTime,
            endTime,
        } = req.body 

        let roomToUpdate = reservation.room 

        // Si se intenta cambiar de habitación
        if (newRoomId && newRoomId !== reservation.room.toString()) {
            const newRoom = await Room.findById(newRoomId) 
            console.log(newRoom);
            if (!newRoom) {
                return res.status(404).send({
                    success: false,
                    message: 'New room not found'
                }) 
            }

            if(newRoom.type === 'Living_room'){
                return res.status(404).send({
                    success: false,
                    message: 'New room is not a Living room'
                    }
                )
            }

            if (newRoom.state === 'busy') {
                return res.status(400).send({
                    success: false,
                    message: 'New room is not available'
                }) 
            }

            // Liberar la habitación anterior
            const oldRoom = await Room.findById(reservation.room) 
            oldRoom.state = 'available' 
            await oldRoom.save() 

            // Ocupa la nueva habitación
            newRoom.state = 'busy' 
            await newRoom.save() 

            roomToUpdate = newRoomId 
        }

        // Actualizar la reservación
        reservation.room = roomToUpdate 
        reservation.description = description || reservation.description 
        reservation.startTime = startTime || reservation.startTime 
        reservation.endTime = endTime || reservation.endTime 

        // Extraer el hotel nuevamente desde la nueva habitación
        const updatedRoomData = await Room.findById(roomToUpdate) 
        reservation.hotel = updatedRoomData.hotel 
        reservation.price = updatedRoomData.price 

        const updatedReservation = await reservation.save() 

        res.status(200).send({
            success: true,
            message: 'Reservation updated successfully',
            reservation: updatedReservation
        }) 

    } catch (error) {
        console.error(error) 
        res.status(500).send({
            success: false,
            message: 'Internal Error Update Reservation'
        }) 
    }
} 

// Delete Reservation (Room and Event)
export const deleteReservationRoom = async (req, res) => {
    try {
        const { id } = req.params 

        // Verificar si la reservación existe
        const reservation = await Reservation.findById(id) 
        if (!reservation) {
            return res.status(404).send({
                success: false,
                message: 'Reservation not found'
            }) 
        }

        // Verificar si la reservación pertenece al usuario
        const userId = req.user.uid 
        if (reservation.user.toString() !== userId) {
            return res.status(403).send({
                success: false,
                message: 'You are not authorized to cancel this reservation'
            }) 
        }

        // Verificar si ya está cancelada
        if (reservation.status === 'cancelled') {
            return res.status(400).send({
                success: false,
                message: 'Reservation is already cancelled'
            }) 
        }

        // Cambiar estado de la reservación
        reservation.status = 'cancelled' 
        await reservation.save() 

        // Liberar habitación
        const room = await Room.findById(reservation.room) 
        if (room) {
            room.state = 'available' 
            await room.save() 
        }

        res.status(200).send({
            success: true,
            message: 'Reservation cancelled successfully',
            reservation
        }) 

    } catch (error) {
        console.error(error) 
        res.status(500).send({
            success: false,
            message: 'Internal Error Cancel Reservation'
        }) 
    }
} 

//Listar Reservaciones por Hotel
export const getReservationsByHotel = async (req, res) => {
    try {
        const { id } = req.params 
        const hotelExists = await Hotel.findById(id) 
        const hotelIdJwt = req.user.hotel
        
        if(!hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not the hotel manager.'
                }
            )
        }
        
        if( id.toString() !== hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify this service'
                }
            )
        }

    
        if (!hotelExists) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Hotel not found'
                }
            ) 
        }

        const reservations = await Reservation.find()
            .populate(
                {
                    path: 'room',
                    match: { hotel: id },
                    populate: {
                        path: 'hotel',
                        model: 'Hotel' 
                    }
                }
            )
            .populate('user', 'name email')

        const filteredReservations = reservations.filter(res => res.room !== null) 

        res.status(200).send({
            success: true,
            reservations: filteredReservations
        }) 

    } catch (error) {
        console.error(error) 
        res.status(500).send({
            success: false,
            message: 'Internal Error while fetching reservations by hotel'
        }) 
    }
} 



//Listar Reservaciones por Usuario
export const getReservationsByUser = async (req, res) => {
    try {
        const userId = req.user.uid 

        const reservations = await Reservation.find({ user: userId })
            .populate('room', 'name description price')
            .populate('user', 'name email')
            .populate('hotel', 'name direction')

        res.status(200).send({
            success: true,
            reservations
        }) 

    } catch (error) {
        console.error(error) 
        res.status(500).send({
            success: false,
            message: 'Internal Error while fetching reservations by user'
        }) 
    }
}

