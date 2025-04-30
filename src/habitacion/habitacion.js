import { model, Schema } from "mongoose";

const roomSchema = new Schema(
    {
        no_room: {
            type: Number,
            required: [true, 'Room number is required'],
            unique: true
        },
        type: {
            type: String,
            enum: ['Individual', 'Double', 'Double Deluxe', 'Presidential Suite', 'Living room'],
            required: [true, 'Room type is required']
        },
        description: {
            type: String,
            maxLength: [200, `Description can't exceed 200 characters`]
        },
        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [1, `Capacity can't be less than 1`]
        },
        state: {
            type: String,
            enum: ['available', 'busy'],
            default: 'available',
            required: true
        },
        sales:{
            type:Number,
            default:0
        },
        hotel: {
            type: Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true
        }
    },
    {
        versionKey: false, //Deshabilitar el __v(Versión del documento)
        timestamps: true //Agrega propiedades de fecha (Fecha de creación y de ultima actualización)
    }
)

//Modificar el toJSON -> toObject para excluir datos en la respuesta
roomSchema.methods.toJSON = function(){
    const { __v, ...room } = this.toObject() //Sirve para convertir un documento de MongoDB a Objeto de JS
    return room
}

export default model('Room', roomSchema);