import BaseService from './base-service';
import type {UserResponse} from "./dto/auth-dto";
import type {Contact} from "./dto/contact-dto";

export class UserService extends BaseService {
    USER_BASE_URL = '/users';

    async getUserInfo(): Promise<UserResponse> {
        return this.fetchData<UserResponse>(`${this.USER_BASE_URL}/me`)
            .then(r => r.data)
    }

    async getContacts(): Promise<Contact[]> {
        return this.fetchData<Contact[]>(`${this.USER_BASE_URL}/me/contacts`)
            .then(r => r.data);
    }

    async addContact(contact: Contact): Promise<Contact> {
        return this.postData<Contact>(`${this.USER_BASE_URL}/me/contacts`, contact)
            .then(r => r.data);
    }
}

export const userService = new UserService();