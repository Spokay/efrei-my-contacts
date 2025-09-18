import {IUser, User, UserResponse} from '../models/User';
import {RegistrationRequest} from '../models/auth/Authentication';
import {hashPassword} from '../utils/password-utils';
import {generateToken} from './token-service';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({email: email.toLowerCase()});
};

export const findUserById = async (id: string): Promise<UserResponse | null> => {
    return User.findById(id).then(mapToResponse);
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

export const userExistsByEmail = async (email: string): Promise<boolean> => {
    return await findUserByEmail(email).then(user => {return !!user})
}

const mapToResponse = (user: IUser | null): UserResponse | null => {
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