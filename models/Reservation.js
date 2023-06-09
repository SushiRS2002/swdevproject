const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    reserveDate : {
        type : Date,
        required : true
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    provider : {
        type : mongoose.Schema.ObjectId,
        ref : "Provider",
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model("Reservation", ReservationSchema);