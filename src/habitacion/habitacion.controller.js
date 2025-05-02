import Room from "./habitacion.model.js"

export const saveRoom = async(req, res) => {
    const data = req.body
    try {
        const room = new Room(data)
        await room.save()

        return res.send(
            {
                success: true,
                message: 'Room saved successfully'
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
            const rooms = await Room.find()
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
