import {IUser, User} from '../models/User';
import {RegistrationRequest} from '../models/auth/Authentication';
import {hashPassword} from '../utils/password-utils';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({email: email.toLowerCase()});
};

export const createUser = async (param: RegistrationRequest): Promise<IUser> => {
    const existingUser = await findUserByEmail(param.email);
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    const hashedPassword = hashPassword(param.password);

    const newUser = new User({
        email: param.email.toLowerCase(),
        password: hashedPassword,
        firstName: param.firstName,
        lastName: param.lastName,
        phone: param.phoneNumber,
        contacts: []
    });

    return newUser.save();
};