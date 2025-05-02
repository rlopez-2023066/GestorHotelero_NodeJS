import { model, Schema } from "mongoose" 

const hotelSchema = Schema(
    {
        name:{
            type:String,
            required: [true, 'Name is required'],
            maxLength: [50, `Can't be overcome 50 characters`]
        },
        direction:{
            type:String,
            required: [true, 'Direction is required'],
            maxLength: [90, `Can't be overcome 90 characters`]
        },
        category:{
            type:Number,
            max: [10, `Can't be overcome 10`],
            min: [0, `Can't be less than 0 `]
        },
        description:{
            type:String,
            required: [true, 'Description is required'],
            maxLength: [200, `Can't be overcome 200 characters`]
        },
        telephone:{
            type:String,
            required: [true, 'Telephone is required'],
            maxLength: [14, `Can't be overcome 14 characters`]
        }
    }
)

export default model('Hotel',hotelSchema)