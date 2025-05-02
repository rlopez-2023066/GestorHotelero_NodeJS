import Reservation from './reservacion.model.js'
import Room from '../habitacion/habitacion.model.js'
import Hotel from '../hotel/hotel.model.js'
import Event from '../evento/event.model.js'

//Create Reservartion (Room)
export const createReservationRoom = async (req, res) =>{
    try{
        const {room, description, startTime, endTime} = req.body

        //Verificar que el ID User exista
        let userId = req.user.uid
        
        if(!userId){
            return res.status(404).send(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        //Verificar si la habitacion exista
        const roomData = await Room.findById(room)
        if(!roomData){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Room not found'
                }
            )
        }

        //Verificar si la habitacion esta disponible
        if(roomData.state !== 'available'){
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

        // Verificar si la reservación existe
        const reservation = await Reservation.findById(id) 
        if (!reservation) {
            return res.status(404).send({
                success: false,
                message: 'Reservation not found'
            }) 
        }

        // Verificar si la reservación es del usuario
        const userId = req.user.uid 
        if (reservation.user.toString() !== userId) {
            return res.status(403).send({
                success: false,
                message: 'You are not authorized to update this reservation'
            }) 
        }

        // Verificar si la reservación ya está asociada a un evento
        if (reservation.event) {
            return res.status(400).send({
                success: false,
                message: 'This reservation is already associated with an event'
            }) 
        }

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
            if (!newRoom) {
                return res.status(404).send({
                    success: false,
                    message: 'New room not found'
                }) 
            }

            if (newRoom.state !== 'available') {
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
export const deleteReservationRoomAndEvent = async (req, res) => {
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

        console.log(id)
        const hotelExists = await Hotel.findById(id) 
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
            .populate('event') 

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

//Create Reservartion (Event)
export const createReservationEvent = async (req, res) => {
  try {
    const { room, description, startTime, endTime, event } = req.body 

    // Obtener el ID del usuario
    const userId = req.user.uid 
    if (!userId) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      }) 
    }

    // Verificar existencia del evento
    const eventData = await Event.findById(event) 
    if (!eventData) {
      return res.status(404).send({
        success: false,
        message: 'Event not found'
      }) 
    }

    //Verificar si el evento ya esta finalizado
    if (eventData.status === 'Finished') {
        return res.status(400).send({
            success: false,
            message: 'Event is already finished'
        })
    }
    

    // Verificar existencia de la habitación
    const roomData = await Room.findById(room) 
    if (!roomData) {
      return res.status(404).send({
        success: false,
        message: 'Room not found'
      }) 
    }

    // Verificar que la habitación sea tipo 'Living-room' (para eventos)
    if (roomData.type !== 'Living_room') {
      return res.status(400).send({
        success: false,
        message: 'Room is not suitable for events'
      }) 
    }

    // Verificar si la habitación está disponible
    if (roomData.state !== 'available') {
      return res.status(400).send({
        success: false,
        message: 'Room is not available'
      }) 
    }

    // Calcular el total del precio de los servicios del evento
    const totalServiceAdd = eventData.services.reduce((sum, service) => {
      const price = service.price || 0 
      const quantity = service.quantity || 1 
      return sum + price * quantity 
    }, 0) 
    console.log(totalServiceAdd)



    // Crear la reservación
    const newReservation = new Reservation({
      user: userId,
      room,
      hotel: roomData.hotel,
      description: eventData.description,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      status: 'confirmed',
      price: roomData.price + totalServiceAdd,
      event
    }) 

    const savedReservation = await newReservation.save() 

    // Cambiar estado de la habitación a ocupada
    roomData.state = 'busy' 
    await roomData.save() 

    res.status(201).send({
      success: true,
      message: 'Reservation created successfully',
      savedReservation
    }) 

  } catch (error) {
    console.error(error) 
    res.status(500).send({
      success: false,
      message: 'Internal Error Reservation (Event)'
    }) 
  }
} 


// Update Reservation (Event)
export const updateReservationEvent = async (req, res) => {
    try {
        const { id } = req.params 

        // Buscar la reservación
        const reservation = await Reservation.findById(id) 
        if (!reservation) {
            return res.status(404).send({
                success: false,
                message: 'Reservation not found'
            }) 
        }

        // Validar usuario
        const userId = req.user.uid 
        if (reservation.user.toString() !== userId) {
            return res.status(403).send({
                success: false,
                message: 'You are not authorized to update this reservation'
            }) 
        }

        // Validar que sea una reservación con evento
        if (!reservation.event) {
            return res.status(400).send({
                success: false,
                message: 'This reservation is not associated with an event'
            }) 
        }

        // Obtener datos del body
        const {
            room: newRoomId,
            description,
            startTime,
            endTime
        } = req.body 

        // Usar la habitación actual por defecto
        let roomToUpdate = reservation.room 

        // Si se envía un nuevo ID de habitación y es diferente, cambiarla
        if (newRoomId && newRoomId !== reservation.room.toString()) {
            const newRoom = await Room.findById(newRoomId) 
            if (!newRoom || newRoom.type !== 'event') {
                return res.status(404).send({
                    success: false,
                    message: 'New room not found or not suitable for events'
                }) 
            }

            if (newRoom.state !== 'available') {
                return res.status(400).send({
                    success: false,
                    message: 'New room is not available'
                }) 
            }

            // Liberar la habitación anterior
            const oldRoom = await Room.findById(reservation.room) 
            if (oldRoom) {
                oldRoom.state = 'available' 
                await oldRoom.save() 
            }

            // Ocupar la nueva habitación
            newRoom.state = 'busy' 
            await newRoom.save() 

            roomToUpdate = newRoomId 
        }

        // Recalcular precio desde los servicios del evento
        const eventData = await Event.findById(reservation.event) 
        const totalPrice = eventData.services.reduce((sum, service) => {
            const price = service.price || 0 
            const quantity = service.quantity || 1 
            return sum + price * quantity 
        }, 0) 

        //Busca la habitación para obtener el precio
        const roomPrice = await Room.findById(roomToUpdate)

        // Actualizar la reservación
        reservation.room = roomToUpdate 
        reservation.hotel = (await Room.findById(roomToUpdate)).hotel 
        reservation.description = description || reservation.description 
        reservation.startTime = startTime || reservation.startTime 
        reservation.endTime = endTime || reservation.endTime 
        reservation.price = totalPrice + roomPrice.price

        const updatedReservation = await reservation.save() 

        res.status(200).send({
            success: true,
            message: 'Event reservation updated successfully',
            reservation: updatedReservation
        }) 

    } catch (error) {
        console.error(error) 
        res.status(500).send({
            success: false,
            message: 'Internal Error while updating event reservation'
        }) 
    }
} 
