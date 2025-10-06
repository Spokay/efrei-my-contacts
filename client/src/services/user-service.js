import BaseService from './base-service';

export class UserService extends BaseService {
    USER_BASE_URL = '/users';

    async getUserInfo() {
        return this.fetchData(`${this.USER_BASE_URL}/me`)
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

    async getContacts(favoriteOnly = false) {
        const url = favoriteOnly
            ? `${this.USER_BASE_URL}/me/contacts?favorite=true`
            : `${this.USER_BASE_URL}/me/contacts`;
        return this.fetchData(url)
            .then(r => r.data);
    }

    async addContact(contact) {
        return this.postData(`${this.USER_BASE_URL}/me/contacts`, contact)
            .then(r => r.data);
    }

    async editContact(id, updatedContact) {
        return this.putData(`${this.USER_BASE_URL}/me/contacts/${id}`, updatedContact)
            .then(r => r.data);
    }

    async deleteContact(id) {
        return this.deleteData(`${this.USER_BASE_URL}/me/contacts/${id}`)
            .then(_ => {});
    }

    async toggleFavorite(id) {
        return this.patchData(`${this.USER_BASE_URL}/me/contacts/${id}/favorite`)
            .then(r => r.data);
    }
}

export const userService = new UserService();
