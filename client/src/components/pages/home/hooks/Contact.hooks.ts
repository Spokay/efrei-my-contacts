import type {Contact} from "../../../../services/dto/contact-dto";
import {userService} from "../../../../services/user-service";
import {useState} from 'react';

export const useContacts = () => {

    const [contacts, setContacts] = useState<Array<Contact> | null>(null);

    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [editModalContact, setEditModalContact] = useState<Contact | null>(null);

    const openModal = (contact?: Contact) => {
        if (contact)
            setEditModalContact(contact);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const userServiceInstance = userService;

    const addContact = (contact: Contact) => {
        userServiceInstance.addContact(contact)
            .then((newContact: Contact) => {
                setContacts(
                    prevContacts => prevContacts
                        ? [...prevContacts, newContact]
                        : [newContact]
                );
                closeModal();
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de l\'ajout du contact');
            });
    }

    const editContact = (id: string, updatedContact: Contact) => {
        userServiceInstance.editContact(id, updatedContact)
            .then((newContact: Contact) => {
                if (!contacts) return;
                const newContacts = contacts.map(contact =>
                    contact._id === id ? newContact : contact
                );
                setContacts(newContacts);
            })
            .catch(err => {
                console.error(err)
                setError('Erreur lors de la modification du contact')
            })
    }

    const deleteContact = (id: string | undefined) => {

        if (!id) {
            return;
        }

        userServiceInstance.deleteContact(id)
            .then(() => {
                if (!contacts) return;
                const newContacts = contacts.filter(contact => contact._id !== id);
                setContacts(newContacts);
            })
            .catch(err => {
                console.error(err)
                setError('Erreur lors de la suppression du contact')
            })
    }

    return {
        userServiceInstance,
        addContact,
        contacts,
        setContacts,
        error,
        setError,
        isModalOpen,
        openModal,
        closeModal,
        editContact,
        deleteContact,
        editModalContact,
        setEditModalContact
    }
}