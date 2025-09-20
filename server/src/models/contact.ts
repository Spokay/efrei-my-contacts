import {Schema} from 'mongoose';

export interface IContact {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export interface ContactValidation {
    isValid: boolean,
    errors: string[]
}

export const ContactSchema: Schema = new Schema({
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
    }
}, {
    timestamps: false
});
