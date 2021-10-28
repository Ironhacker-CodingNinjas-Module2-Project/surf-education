const {Schema, model} = require('mongoose');

const surftrickSchema = new Schema(
    {
        name: {
            type:String, 
            required: true
        },
        image: {
            type: String,
        },
        description: {
            type: String,
            required: true
        },
        rateOfDifficulty: {
            type: Number, 
        },
        author:{
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        }

    }
);

module.exports = model('Surftrick', surftrickSchema)

