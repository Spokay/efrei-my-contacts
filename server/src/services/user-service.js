import {User} from '../models/user.js';
import {hashPassword} from '../utils/password-utils.js';
import {generateToken} from './token-service.js';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export const findUserByEmail = async (email) => {
    return User.findOne({email: email.toLowerCase()});
};

export const findUserById = async (userId) => {
    return User.findById(userId).then(mapToUserResponse);
}

export const createUser = async (param) => {

    const hashedPassword = hashPassword(param.password);

    const newUser = new User({
        email: param.email.toLowerCase(),
        password: hashedPassword,
        firstName: param.firstName,
        lastName: param.lastName,
        phone: param.phone,
        contacts: []
    });

    const savedUser = await newUser.save();


    return generateToken(savedUser);
};

export const getContacts = async (userId, favoriteOnly = false) => {
    const userObjectId = new ObjectId(userId);
    const result = await User.aggregate([
        { $match: { _id: userObjectId } },
        { $project: {
            contacts: favoriteOnly ? {
                $filter: {
                    input: '$contacts',
                    as: 'contact',
                    cond: { $eq: ['$$contact.isFavorite', true] }
                }
            } : '$contacts'
        } }
    ]);

    return result.length > 0 ? result[0].contacts : null;
}

export const userExistsByEmail = async (email) => {
    return await findUserByEmail(email).then(user => {return !!user})
}

export const addContact = async (user, contact) => {
    const newContact = user.contacts.create(contact);
    user.contacts.push(newContact);

    const savedUser = await user.save();

    if (!savedUser) {
        throw new Error('Failed to add contact');
    }

    return newContact;
}

export const editContact = async (user, contactId, updatedContact) => {
    const contact = user.contacts.id(contactId);

    if (!contact) {
        throw new Error('Contact not found');
    }

    contact.set(updatedContact);

    const savedUser = await user.save();

    if (!savedUser) {
        throw new Error('Failed to edit contact');
    }

    return contact;
}


export const deleteContact = async (user, contactId) => {
    const contactIndex = user.contacts.findIndex(c => c._id?.toString() === contactId);

    if (contactIndex === -1) {
        throw new Error('Contact not found');
    }

    user.contacts.splice(contactIndex, 1);

    const newUser = await user.save();

    if (!newUser) {
        throw new Error('Failed to delete contact');
    }
}

export const toggleFavorite = async (user, contactId) => {
    const contact = user.contacts.id(contactId);

    if (!contact) {
        throw new Error('Contact not found');
    }

    contact.isFavorite = !contact.isFavorite;

    const savedUser = await user.save();

    if (!savedUser) {
        throw new Error('Failed to toggle favorite');
    }

    return contact;
}

export const estContactExistant = (newContact, user) => {
    return user.contacts.map(mapToContactBasicInfo)
        .includes(mapToContactBasicInfo(newContact));
}

export const validateNewContact = (contact) => {

    const validationResult = {
        isValid: true,
        errors: []
    }

    if (contact.phone && !isPhoneValid(contact.phone)){
        validationResult.isValid = false;
        validationResult.errors.push("The phone number must be between 10 and 20 characters")
    }

    return validationResult
}

const mapToUserResponse = (user) => {
    if (!user) {
        return null;
    }
    return {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

const mapToContacts = (user) => {
    if (!user) {
        return null
    }
    return user.contacts;
}

const mapToContactBasicInfo = (contact) => {
    return {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone
    }
}

const isPhoneValid = (phone) => {
    return phone.length >= 10 && phone.length <= 20
}
