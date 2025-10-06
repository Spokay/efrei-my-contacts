import {Schema} from 'mongoose';

export const ContactSchema = new Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: false
});
