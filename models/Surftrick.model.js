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
            type: Number, min= "1", max= "10"
        },
        editor:[{type: Schema.Types.ObjectId, ref: 'User'}]

    }
);

module.exports = model('Surftrick', surftrickSchema)

