import Room from "./habitacion.model.js"

export const saveRoom = async(req, res) => {
    const data = req.body
    try {

        let hotelIdJwt = req.user.hotel
        
        if(!hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not the hotel manager.'
                }
            )
        }
        
        if( data.hotel.toString() !== hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify this service'
                }
            )
        }

        const room = new Room(data)
        await room.save()

        return res.send(
            {
                success: true,
                message: 'Room saved successfully',
                data
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when adding room',
                err
            }
        )
    }
}


export const getAll = async (req, res) => {
    const { limit, skip } = req.query
    try {

        const hotelIdJwt = req.user.hotel
        const rooms = await Room.find({hotel: hotelIdJwt})
            .populate(
                {
                    path: 'hotel',  
                    select: '_id name'   
                }
            )
            .skip(skip)
            .limit(limit)
            if (rooms.length === 0) {
                            return res.status(404).send(
                                {
                                    success: false,
                                    message: 'No rooms found'
                                }
                            )
            }
            return res.send(
                {
                    success: true,
                    message: 'Rooms found:',
                    total: rooms.length,
                    rooms
                }
            )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error when getting rooms',
                err
            }
        )
    }
}

export const getRoomById = async (req, res) => {
    try {
        
        const { id } = req.params
        
        
        const room = await Room.findById(id)
            .populate(
                {
                    path: 'hotel',
                    select: '_id name'
                }
            )

        if (!room) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'Room not found'
                }
            )
        }

        return res.json(
            {
                success: true,
                message: 'Room found',
                room
            }
        )

    } catch (err) {
        console.error('Error getting the room:', err)
        return res.status(500).json(
            {
                success: false,
                message: 'Failed to get the room',
                err
            }
        )
    }
}

export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params
        let data = req.body
        let roomData = await Room.findById(id)
        let roomIdHotelData = roomData.hotel
        let hotelIdJwt = req.user.hotel

        if(!hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not the hotel manager.'
                }
            )
        }
        
        if( roomIdHotelData.toString()!== hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify this service'
                }
            )
        }

        
        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            data,
            { new: true } 
        )

        if (!updatedRoom) {
            return res.status(404).json(
                {   
                    success: false,
                    message: 'Room not found'
                }
            )
        }

        return res.json(
            {
                success: true,
                message: 'Room updated correctly',
                room: updatedRoom
            }
        )

    } catch (err) {
        console.error('Error:', err)
        return res.status(500).json(
            {
                success: false,
                message: 'Failed to update the room',
                err
            }
        )
    }
}

export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params

        let hotelIdJwt = req.user.hotel
        let roomData = await Room.findById(id)
        let roomIdHotelData = roomData.hotel

        if(!hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not the hotel manager.'
                }
            )
        }
        
        if( roomIdHotelData.toString()!== hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify this service'
                }
            )
        }


        const deletedRoom = await Room.findByIdAndDelete(id)

        if (!deletedRoom) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            })
        }

        return res.json({
            success: true,
            message: 'Room successfully deleted',
            room: deletedRoom
        })

    } catch (err) {
        console.error('Error deleting room:', err)

        return res.status(500).json({
            success: false,
            message: 'Error deleting the room',
            error: err.message
        })
    }
}

//Buscar habitaciones por estado
export const getRoomByState = async (req, res) => {
    const { limit = 10, skip = 0 } = req.query 
    const { state, hotel } = req.body 
    const  hotelIdJwt = req.user.hotel
    try {
        
        if(!hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You are not the hotel manager.'
                }
            )
        }
        
        if(hotel.toString() !== hotelIdJwt){
            return res.status(403).send(
                {
                    success: false,
                    message: 'You do not have permission to modify this service'
                }
            )
        }


        // Validaciones básicas
        if (!state || !hotel) {
            return res.status(400).send({
                success: false,
                message: 'Missing required parameters: state and hotel',
            }) 
        }

        // Búsqueda filtrada
        const rooms = await Room.find({
            state: state,
            hotel: hotel,
        })
            .populate({
                path: 'hotel',
                select: '_id name',
            })
            .skip(Number(skip))
            .limit(Number(limit)) 

        if (rooms.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No rooms found for the given state and hotel',
            }) 
        }

        return res.send({
            success: true,
            message: 'Rooms found:',
            total: rooms.length,
            rooms,
        }) 

    } catch (error) {
        console.error(error) 
        return res.status(500).send({
            success: false,
            message: 'Internal server error',
        }) 
    }
}
