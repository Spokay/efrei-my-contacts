import {IUser, User, UserResponse} from '../models/user';
import {IContact} from '../models/contact';
import {RegistrationRequest} from '../models/auth/authentication';
import {hashPassword} from '../utils/password-utils';
import {generateToken} from './token-service';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({email: email.toLowerCase()});
};

export const findUserById = async (userId: string): Promise<UserResponse | null> => {
    return User.findById(userId).then(mapToUserResponse);
}

export const createUser = async (param: RegistrationRequest): Promise<string> => {

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

export const getContacts = async (userId: string): Promise<IContact[] | null> => {
    return User.findById(userId).then(mapToContacts);
}

export const userExistsByEmail = async (email: string): Promise<boolean> => {
    return await findUserByEmail(email).then(user => {return !!user})
}

export const addContact = async (user: IUser, contact: IContact): Promise<IContact | null> => {
    user.contacts.push(contact);

    const newUser = await user.save();

    if (!newUser) {
        throw new Error('Failed to add contact');
    }

    return contact;
}

export const estContactExistant = (newContact: IContact, user: IUser) => {
    return user.contacts.map(mapToContactBasicInfo)
        .includes(mapToContactBasicInfo(newContact));
}

const mapToUserResponse = (user: IUser | null): UserResponse | null => {
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

const mapToContacts = (user: IUser | null): IContact[] | null => {
    if (!user) {
        return null
    }
    return user.contacts;
}

const mapToContactBasicInfo = (contact: IContact): IContact => {
    return {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone
    }
}