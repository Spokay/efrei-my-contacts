import {IUser, User} from '../models/User';
import {RegistrationRequest} from '../models/auth/Authentication';
import {hashPassword} from '../utils/password-utils';
import {generateToken} from './token-service';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({email: email.toLowerCase()});
};

export const createUser = async (param: RegistrationRequest): Promise<string> => {

    const hashedPassword = hashPassword(param.password);

    const newUser = new User({
        email: param.email.toLowerCase(),
        password: hashedPassword,
        firstName: param.firstName,
        lastName: param.lastName,
        phone: param.phoneNumber,
        contacts: []
    });

    const savedUser = await newUser.save();


    return generateToken(savedUser);
};

export const userExistsByEmail = (email: string): boolean => {
    const existingUser = findUserByEmail(email);
    return !!existingUser;
}