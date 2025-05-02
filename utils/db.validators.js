
import {
    isValidObjectId
} from 'mongoose'


import User from '../src/user/user.model.js'

/* Observación: Identificar en Español el 
validador, para evitar problemas a futuros. */


//Validar si el Username (Usuario) existe
export const existUsername = async(username, user) => {
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername && alreadyUsername._id != user._id){
        console.error(`Username ${username} is already taken`)
        throw new Error (`Username ${username} is already taken`) 
    }
}

//Validar si el Email (Correo) existe
export const existEmail = async(email, user) => {
    const alreadyEmail = await User.findOne({email})
    if(alreadyEmail && alreadyEmail._id != user._id){
        console.error(`Email ${email} is already taken`)
        throw new Error (`Email ${email} is already taken`) 
    }
}

//No requiere el campo lleno
export const notRequiredField = (value, { req, path }) => {
    if (value !== undefined) {
        throw new Error(`The field '${path}' should not be sent in the request body`)
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