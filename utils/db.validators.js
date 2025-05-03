import {
    isValidObjectId
} from 'mongoose'


import User from '../src/user/user.model.js'
import Room from '../src/habitacion/habitacion.model.js'
import Hotel from '../src/hotel/hotel.model.js'

/* Observación: Identificar en Español el 
validador, para evitar problemas a futuros. */


//Validar si el Username (Usuario) existe
export const existUsername = async(username, user) => {
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername && alreadyUsername._id != user._id){
        console.error(`Username ${username} is already taken`)
        throw new Error (`Username ${username} is already taken`);
    }
}

//Validar si el Email (Correo) existe
export const existEmail = async(email, user) => {
    const alreadyEmail = await User.findOne({email})
    if(alreadyEmail && alreadyEmail._id != user._id){
        console.error(`Email ${email} is already taken`)
        throw new Error (`Email ${email} is already taken`);
    }
}

//No requiere el campo lleno
export const notRequiredField = (field)=>{
    if(field){
        throw new Error(`${field} is not required`)
    }
}


//Validar si el ID es válido
export const findUser = async(id)=>{
    try{
        const userExist = await User.findById(id)
        if(!userExist) return false
        return userExist
    }catch(err){
        console.error(err)
        return false
    }
}

// Validar que el nunero de habitacion no exista en el mismo hotel
export const existRoomNumberInHotel = async (no_room, { req }) => {
    const { hotel } = req.body

    const existingRoom = await Room.findOne({ 
        no_room: Number(no_room),
        hotel: hotel
    })

    if (existingRoom) {
        console.error(`Room number ${no_room} already exists in this hotel`)
        throw new Error(`Room number ${no_room} already exists in this hotel`)
    }
    
    return true
}

// Validar que el campo sales no sea proporcionado
export const validateNoSalesField = (sales) => {
    if (sales !== undefined) {
        console.error(
            'Sales field should not be provided'
        )
        throw new Error(
            'Sales field should not be provided as it is auto-generated'
        )
    }
    return true
}

//Valida que sean id correctos
export const isValidHotelId = async (hotelId) => {
    // Verificar si es un MongoID válido
    if (!isValidObjectId(hotelId)) {
        console.error(`Invalid Hotel ID format: ${hotelId}`)
        throw new Error('The provided Hotel ID has an invalid format')
    }

    // Verificar si el hotel existe en la base de datos
    const hotelExists = await Hotel.findById(hotelId)
    if (!hotelExists) {
        console.error(`Hotel with ID ${hotelId} not found`)
        throw new Error('The provided Hotel ID does not exist in our records')
    }

    return true
}

//valida id de la habitacion exits
export const validateRoomId = async (id, { req }) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid room ID format')
    }
    
    const roomExists = await Room.findById(id)
    if (!roomExists) {
        throw new Error('Room not found')
    }
    
    req.existingRoom = roomExists
    return true
}

//No actualiza el numero de habitacion
export const preventRoomNumberUpdate = (value, { req }) => {
    if (req.body.no_room !== undefined) {
        throw new Error('Room number cannot be updated')
    }
    return true
}
//No actualiza el numero de habitacion
export const preventHotelUpdate = (value, { req }) => {
    if (req.body.hotel !== undefined) {
        throw new Error('Hotel association cannot be changed')
    }
    return true
}
//campos que no sean vacios
export const validateNoEmptyUpdates = (value, { req }) => {
    const updates = Object.keys(req.body)
    const allowedFields = ['type', 'description', 'capacity', 'state', 'price']
    
    for (const field of updates) {
        if (req.body[field] === '' || req.body[field] === null) {
            throw new Error(`Field '${field}' cannot be empty`)
        }
    }
    
    const invalidFields = updates.filter(field => 
        ![...allowedFields, 'sales'].includes(field)
    )
    
    if (invalidFields.length > 0) {
        throw new Error(`Invalid fields for update: ${invalidFields.join(', ')}`)
    }
    
    return true
}

