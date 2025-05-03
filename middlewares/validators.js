import {
    body,
    param
} from 'express-validator'

import {
    validateErrors,
    validateErrorsWithoutFiles
} from './validate.error.js'

import {
    existEmail,
    existRoomNumberInHotel,
    existUsername,
    isValidHotelId,
    notRequiredField,
    preventHotelUpdate,
    preventRoomNumberUpdate,
    validateNoEmptyUpdates,
    validateNoSalesField,
    validateRoomId
} from '../utils/db.validators.js'

/* Observación: Colocar comentario acerca de la Validación */


// Validaciones para el registro de usuario
export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password must be strong')
        .isLength({min: 8})
        .withMessage('Password must be 8 characters'),
    body('phone', 'Phone cannot be empty')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

//Validaciones para que el usuario actualice su perfil.
export const updateUserValidator = [
    body('username', 'Name cannot be empty')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom((username, {req}) => existUsername(username, req.user)),
    body('email', 'Email cannot be empty')
        .optional()
        .notEmpty()
        .isEmail()
        .custom((email, {req})=> existEmail(email, req.user)),
    body('password')
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    body('role')
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    validateErrorsWithoutFiles
]

//Validaciones para que el usuario elimine su perfil.
export const deleteUserValidator = [
    body('password', 'Password cannot be empty')
        .notEmpty(),
    validateErrors
]


//Validaciones para que el usuario actualice su contraseña.
export const updatePasswordValidator = [
    body('oldPassword', 'Old password cannot be empty')
        .notEmpty(),
    body('newPassword', 'New password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('New password must be strong')
        .isLength({min: 8, max: 20})
        .withMessage('Enter your password again'),
    validateErrors
]

//Validaciones para agregar Hotel
export const registerHotelValidator = [
    body('name')
        .notEmpty()
        .isLength({min: 8, max: 50 })
        .withMessage('Enter name again'),
    body('direction')
        .notEmpty()
        .isLength({min: 5, max: 90})
        .withMessage('Enter direction again'),
    body('category')
        .notEmpty(),
    body('description')
        .notEmpty()
        .isLength({min: 10, max: 200})
        .withMessage('Enter description again'),
    body('telephone')
        .notEmpty()
        .isMobilePhone(),
    validateErrorsWithoutFiles
]

//Validciones para actualizar el Hotel
export const updateHotelValidator = [
    body('name')
        .optional()
        .notEmpty(),
    body('direction')
        .optional()
        .notEmpty(),
    body('category')
        .optional()
        .notEmpty(),
    body('description')
        .optional()
        .notEmpty(),
    body('telephone')
        .optional()
        .notEmpty(),
    validateErrorsWithoutFiles
]

//Validaciones para agregar HABITACION
export const saveRoomValidator = [
    body('no_room')
        .notEmpty().withMessage('Room number is required')
        .isNumeric().withMessage('Room number must be a number')
        .toInt() // Convert to integer
        .custom(existRoomNumberInHotel)
        .withMessage('Room number already exists in this hotel'),
    
    body('type')
        .notEmpty().withMessage('Room type is required')
        .isIn(['Individual', 'Double', 'Double Deluxe', 'Presidential Suite', 'Living_room'])
        .withMessage('Invalid room type'),
    
    body('description')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Description cannot exceed 200 characters'),
    
    body('capacity')
        .notEmpty().withMessage('Capacity is required')
        .isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    
    body('state')
        .optional()
        .isIn(['available', 'busy'])
        .withMessage('Invalid room state'),
    
    body('sales')
        .custom(validateNoSalesField),
    
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
    
    body('hotel')
        .notEmpty().withMessage('Hotel ID is required')
        .isMongoId().withMessage('Invalid Hotel ID format')
        .custom(isValidHotelId)
        .withMessage('Hotel does not exist'),
    
    validateErrors
]

//Validaciones para actualizar HABITACION
export const updateRoomValidator = [
    param('id')
        .custom(validateRoomId)
        .withMessage('Invalid room ID or room does not exist'),
    body()
        .custom(validateNoEmptyUpdates),
    body('no_room')
        .optional()
        .custom(preventRoomNumberUpdate),
    body('type')
        .optional()
        .isIn(['Individual', 'Double', 'Double Deluxe', 'Presidential Suite', 'Living_room'])
        .withMessage('Invalid room type'),
    body('description')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Description cannot exceed 200 characters'),
    body('capacity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Capacity must be at least 1'),
    body('state')
        .optional()
        .isIn(['available', 'busy'])
        .withMessage('Invalid room state'),
    
    body('sales')
        .custom(validateNoSalesField),
    
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price cannot be negative'),
    
    body('hotel')
        .optional()
        .custom(preventHotelUpdate),
    
    validateErrors
]

export const deleteRoomValidator = [
    param('id')
        .notEmpty().withMessage('ID parameter is required')
        .isMongoId().withMessage('Invalid ID format')
        .custom(validateRoomId),
    validateErrors
]