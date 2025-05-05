import {
    body
} from 'express-validator'

import {
    validateErrors,
    validateErrorsWithoutFiles
} from './validate.error.js'

import {
    existName,  
    existEmail,
    existRoomNumberInHotel,
    existUsername,
    isValidHotelId,
    notRequiredField,
    preventRoomNumberUpdate,
    validateNoEmptyUpdates,
    serviceExists,
    duplicateServiceHotel,
    duplicateServiceHotelUpdate
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
    body('username')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom((username, {req}) => existUsername(username, req.user)),
    body('email')
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
        .withMessage('Enter name again')
        .custom(existName),
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
    validateErrors
]

//Validaciones para actualizar el Hotel
export const updateHotelValidator = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Enter a valid name')
        .custom((name,{req})=> existName(name, req.params?.id)),
    body('direction')
        .optional()
        .notEmpty()
        .withMessage('Enter a valid direction'),
    body('category')
        .optional()
        .notEmpty()
        .withMessage('Enter a valid category'),
    body('description')
        .optional()
        .notEmpty()
        .withMessage('Enter a valid description'),
    body('telephone')
        .optional()
        .notEmpty()
        .withMessage('Enter a valid telephone'),
    validateErrorsWithoutFiles
]


//Validaciones para crear una reservación de Habitación 
export const registerReservationValidator = [
    body('room', 'Room cannot be empty')
        .notEmpty(),
    body('description', 'Description cannot be empty')
        .notEmpty()
        .isLength({min: 10, max: 200})
        .withMessage('Enter description again'),
    body('startTime', 'Start date cannot be empty')
        .notEmpty()
        .withMessage('Enter start date again'),
    body('endTime', 'End date cannot be empty')
        .notEmpty()
        .withMessage('Enter end date again'),
    validateErrors
]

//Validacion para actualizar la reservación de habitación
export const updateReservationValidator = [
    body('room')
        .optional()
        .notEmpty(),
    body('description')
        .optional()
        .notEmpty(),
    body('startTime')
        .optional()
        .notEmpty(),
    body('endTime')
        .optional()
        .notEmpty(), 
    validateErrorsWithoutFiles
]

export const registerEventValidator = [
    body('room', 'Room cannot be empty')
        .notEmpty(),
    body('event', 'Event cannot be empty')
        .notEmpty(),
    validateErrors
    
]

//validaciones para agregar servicios
export const serviceCreateValidator = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage("Service name's is required")
    .isLength({min: 3}).withMessage('The name must have at least 3 characters')
    .isLength({max: 20}).withMessage('The name cannot have more than 20 characters')
    .custom(duplicateServiceHotel),

    body('amount')
    .notEmpty()
    .withMessage('Amount is required'),

    body('priceOne')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price got to be number'),

    body('description')
    .notEmpty()
    .withMessage("Description is required").withMessage('Description cannot have more than 20 characters')
    .isLength({max: 300}),

    body('hotel')
    .notEmpty()
    .withMessage('Hotel ID is required')
    .isMongoId().withMessage('Invalid Hotel ID format'),

    validateErrorsWithoutFiles
]
//validaciones para actualizar serivicio
export const serviceUpdateValidator = [
    body('name')
    .optional()
    .notEmpty()
    .withMessage("Service name's is required")
    .isLength({min: 3}).withMessage('The name must have at least 3 characters')
    .isLength({max: 20}).withMessage('The name cannot have more than 20 characters')
    .custom(duplicateServiceHotelUpdate),

    body('amount')
    .optional()
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount got to be number'),

    body('priceOne')
    .optional()
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price got to be number'),

    body('description')
    .optional()
    .notEmpty().withMessage("Description is required").withMessage('Description cannot have more than 20 characters')
    .isLength({max: 300}),

    body('hotel')
    .optional()
    .notEmpty()
    .custom(notRequiredField),

    

    validateErrorsWithoutFiles
]

//Validaciones para agregar HABITACION
export const saveRoomValidator = [
    body('no_room')
        .notEmpty().withMessage('Room number is required')
        .isNumeric().withMessage('Room number must be a number')
        .toInt() 
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
    
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
    
    body('hotel')
        .notEmpty().withMessage('Hotel ID is required')
        .isMongoId().withMessage('Invalid Hotel ID format')
        .custom(isValidHotelId)
        .withMessage('Hotel does not exist'),

    body('state')
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    
    body('sales')
        .optional() 
        .notEmpty()
        .custom(notRequiredField),
    
    validateErrors
]

//Validaciones para actualizar HABITACION
export const updateRoomValidator = [
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

    
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price cannot be negative'),
    
   
    
    validateErrors
]



export const createEventValidator = [
    body('name', 'Name is required')
      .notEmpty()
      .isLength({ min: 3 }),
  
    body('description', 'Description is required')
      .notEmpty()
      .isLength({ min: 10 }),
  
    body('type', 'Type is required')
      .notEmpty(),
  
    body('startTime', 'Start time is required and must be a valid date')
      .notEmpty()
      .isISO8601(),
  
    body('endTime', 'End time is required and must be a valid date')
      .notEmpty()
      .isISO8601()
      .custom((endTime, { req }) => {
        if (new Date(endTime) <= new Date(req.body.startTime)) {
          throw new Error('End time must be after start time')
        }
        return true
      }),
  
    body('services', 'Services must be an array')
      .isArray(),
  
    body('services.*.serviceId', 'Invalid service ID')
      .isMongoId()
      .custom(serviceExists),
  
    body('services.*.quantity', 'Quantity must be a positive integer')
      .isInt({ min: 1 }),

    body('hotel')
        .notEmpty()
        .withMessage('Hotel ID is required'),
    
    body('room')
      .notEmpty()
      .withMessage('Room ID is required'),

    body('user')
        .notEmpty()
        .withMessage('User ID is required'),
    
    validateErrorsWithoutFiles
  ]


  export const updateEventValidator = [
    body('name')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters'),
  
    body('description')
      .optional()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters'),
  
    body('type')
      .optional()
      .notEmpty()
      .withMessage('Type cannot be empty'),
  
    body('startTime')
      .optional()
      .isISO8601()
      .withMessage('Start time must be a valid date'),
  
    body('endTime')
      .optional()
      .isISO8601()
      .withMessage('End time must be a valid date')
      .custom((endTime, { req }) => {
        if (req.body.startTime && new Date(endTime) <= new Date(req.body.startTime)) {
          throw new Error('End time must be after start time')
        }
        return true
      }),
  
    body('services')
      .optional()
      .isArray()
      .withMessage('Services must be an array'),
  
    body('services.*.serviceId')
      .optional()
      .isMongoId()
      .withMessage('Invalid service ID')
      .custom(serviceExists),
  
    body('services.*.quantity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
  
    validateErrorsWithoutFiles
]

export const createInvoiceValidator = [
    body('event')
        .notEmpty()
        .withMessage('Event ID is required')
        .isMongoId()
        .withMessage('Invalid Event ID format'),
    body('reservation')
        .optional()
        .custom(notRequiredField),
    validateErrorsWithoutFiles
]