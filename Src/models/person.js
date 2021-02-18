const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    id : String,
    firstname:{
        type:String,
        required:false
    },
    lastname:String
});

module.exports = mongoose.model('persons',personSchema);