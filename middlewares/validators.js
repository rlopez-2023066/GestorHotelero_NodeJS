import {
    body
} from 'express-validator'

import {
    validateErrors,
    validateErrorsWithoutFiles
} from './validate.error.js'

import {
    existEmail,
    existUsername,
    notRequiredField,
    serviceExists
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
  
    validateErrorsWithoutFiles
  ]

  // Event update validations
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