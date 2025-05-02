import { model,Schema } from "mongoose" 

const serviceSchema = Schema(
    {
        name:{
            type:String,
            required: [true, 'Name is required'],
            maxLength: [50, `Can't be overcome 50 characters`]
        },
        description:{
            type:String,
            required: [true, 'description is required'],
            maxLength: [120, `Can't be overcome 90 characters`]
        },
        amount:{
            type:Number,
            required:[true,'amount is required']
        },
        priceOne:{
            type:Number,
            required:[true,'price is requried']
        },
        hotel:{
            type:Schema.Types.ObjectId,
            ref:'Hotel'
        }
    }
    
)

export default model('Service',serviceSchema)