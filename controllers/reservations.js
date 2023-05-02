const Reservation = require("../models/Reservation");
const Provider = require("../models/Provider");

//@desc Get all reservations.
//@route GET /api/v1/reservations
//@access Public
exports.getReservations = async (req, res, next) => {
    let query;

    //Normal users can see only their reservations. Admins can see all reservations.
    if (req.user.role != "admin") {
        query = Reservation.find({user : req.user.id}).populate({
            path : "provider",
            select : "name province tel"
        });
    } else {
        query = Reservation.find().populate({
            path : "provider",
            select : "name province tel"
        });
    }
    try {
        const reservations = await query;
        res.status(200).json({success : true, count : reservations.length, data : reservations});
    } catch(error) {
        console.log(error.stack);
        return res.status(500).json({success : false, message : "Cannot find reservation"});
    }
};

//@desc Get single reservation.
//@route GET /api/v1/reservations/:id
//@access Public
exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path : "provider",
            select : "name description tel"
        });
        if(!reservation) {
            res.status(404).json({success : false, message : `No reservation with the id of ${req.params.id}`});
        }
        res.status(200).json({success : true, data : reservation});
    } catch(error) {
        console.log(error.stack);
        return res.status(500).json({success : false, message : "Cannot find reservation"});
    }
};

//@desc Add reservation
//@route GET /api/v1/providers/:providersId/reservation
//@access Private
exports.addReservation = async (req, res, next) => {
    try {
        req.body.provider = req.params.providersId;
        const provider = await Provider.findById(req.params.providersId);
        if(!provider) {
            res.status(404).json({success : false, message : `No provider with the id of ${req.params.id}`});
        }

        //Add user ID to req.body
        req.body.user = req.user.id;

        //Check for existed reservation
        const existedReservation = await Reservation.find({user : req.user.id});

        //If the user is not an admin, they can only create up to 3 reservations.
        if (existedReservation.length >= 3 && req.user.role !== "admin") {
            return res.status(400).json({success : false, message : `The user with ID ${req.user.id} has already made 3 reservations`});
        }

        const reservation = await Reservation.create(req.body);
        res.status(200).json({success : true, data : reservation});
    } catch(error) {
        console.log(error.stack);
        return res.status(500).json({success : false, message : "Cannot create reservation"});
    }
};

//@desc Update reservation
//@route GET /api/v1/reservations/:id
//@access Private
exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation) {
            res.status(404).json({success : false, message : `No reservation with the id of ${req.params.id}`});
        }

        //The user must be the reservation owner
        if (reservation.user.toString() !== req.user.id && req.user.role !== "admin") {
            res.status(401).json({success : false, message : `User ${req.user.id} is not authorized to update this reservation`});
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });
        res.status(200).json({success : true, data : reservation});
    } catch(error) {
        console.log(error.stack);
        return res.status(500).json({success : false, message : "Cannot update reservation"});
    }
};

//@desc Delete reservation
//@route GET /api/v1/reservations/:id
//@access Private
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if(!reservation) {
            res.status(404).json({success : false, message : `No reservation with the id of ${req.params.id}`});
        }

        //The user must be the reservation owner
        if (reservation.user.toString() !== req.user.id && req.user.role !== "admin") {
            res.status(401).json({success : false, message : `User ${req.user.id} is not authorized to delete this reservation`});
        }

        await reservation.remove()
        res.status(200).json({success : true, data : {}});
    } catch(error) {
        console.log(error.stack);
        return res.status(500).json({success : false, message : "Cannot delete reservation"});
    }
};