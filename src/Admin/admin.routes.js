import { Router } from 'express' 

import {
    updateUser,
    getAllUsers,
    deleteUser,
    getUserById,
    getUserByRole
} from './admin.controller.js'

import  {
    validateJwt,
    isAdmin
} from './../../middlewares/validate.jwt.js'

const api = Router()

//Actualizar usuario
api.put('/updateUser/:id', validateJwt, isAdmin, updateUser)

//Eliminar usuario
api.delete('/deleteUser/:id', validateJwt, isAdmin, deleteUser)

//Listar todos los usuarios
api.get('/getAllUsers', validateJwt, isAdmin, getAllUsers)

//Listar usuario por id
api.get('/getUserById/:id', validateJwt, isAdmin, getUserById)

//Listar usuario por ROLE
api.get('/getUserByRole', validateJwt, isAdmin, getUserByRole)

export default api