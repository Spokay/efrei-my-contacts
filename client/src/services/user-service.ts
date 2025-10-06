import BaseService from './base-service';
import type {UserResponse} from "./dto/auth-dto";
import type {Contact} from "./dto/contact-dto";

export class UserService extends BaseService {
    USER_BASE_URL = '/users';

    async getUserInfo(): Promise<UserResponse> {
        return this.fetchData<any>(`${this.USER_BASE_URL}/me`)
            .then(r => {
                return {
                    _id: r.data._id,
                    email: r.data.email,
                    firstName: r.data.firstName,
                    lastName: r.data.lastName,
                    phone: r.data.phone,
                    createdAt: new Date(r.data.createdAt),
                    updatedAt: new Date(r.data.updatedAt),
                };
            })
    }

    async getContacts(): Promise<Contact[]> {
        return this.fetchData<Contact[]>(`${this.USER_BASE_URL}/me/contacts`)
            .then(r => r.data);
    }

    async addContact(contact: Contact): Promise<Contact> {
        return this.postData<Contact>(`${this.USER_BASE_URL}/me/contacts`, contact)
            .then(r => r.data);
    }

    async editContact(id: string, updatedContact: Contact): Promise<Contact> {
        return this.putData<Contact>(`${this.USER_BASE_URL}/me/contacts/${id}`, updatedContact)
            .then(r => r.data);
    }

    async deleteContact(id: string): Promise<void> {
        return this.deleteData(`${this.USER_BASE_URL}/me/contacts/${id}`)
            .then(_ => {});
    }
}

export const userService = new UserService();