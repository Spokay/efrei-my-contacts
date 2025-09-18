import mongoose, { Document, Schema } from 'mongoose';
import { IContact, ContactSchema } from './Contact';

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    contacts: IContact[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    contacts: [ContactSchema]
}, {
    timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema, 'users');