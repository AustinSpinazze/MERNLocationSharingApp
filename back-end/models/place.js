const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema(
    {
        placeId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        address: { type: String, required: true },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        creator: { type: String, required: true }
    },
    {
        toObject: { virtuals: true }
    }
);

placeSchema.virtual('creatorRelation', {
    ref: 'User',
    localField: 'creator',
    foreignField: 'userId',
    justOne: true
});

module.exports = mongoose.model("Place", placeSchema);