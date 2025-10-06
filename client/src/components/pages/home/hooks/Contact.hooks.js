import {userService} from "../../../../services/user-service";
import {useState} from 'react';

export const useContacts = () => {

    const [contacts, setContacts] = useState(null);

    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editModalContact, setEditModalContact] = useState(null);

    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const openModal = (contact) => {
        if (contact)
            setEditModalContact(contact);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setEditModalContact(null);
        setIsModalOpen(false);
    };

    const userServiceInstance = userService;

    const addContact = (contact) => {
        userServiceInstance.addContact(contact)
            .then((newContact) => {
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

    const editContact = (id, updatedContact) => {
        userServiceInstance.editContact(id, updatedContact)
            .then((newContact) => {
                if (!contacts) return;
                const newContacts = contacts.map(contact =>
                    contact._id === id ? newContact : contact
                );
                setContacts(newContacts);
                closeModal();
            })
            .catch(err => {
                console.error(err)
                setError('Erreur lors de la modification du contact')
            })
    }

    const deleteContact = (id) => {

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

    const toggleFavorite = (id) => {
        if (!id) {
            return;
        }

        userServiceInstance.toggleFavorite(id)
            .then((updatedContact) => {
                if (!contacts) return;
                const newContacts = contacts.map(contact =>
                    contact._id === id ? updatedContact : contact
                );
                setContacts(newContacts);
            })
            .catch(err => {
                console.error(err)
                setError('Erreur lors de la modification du favori')
            })
    }

    const toggleShowFavoritesOnly = () => {
        setShowFavoritesOnly(prev => !prev);
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
        toggleFavorite,
        editModalContact,
        setEditModalContact,
        showFavoritesOnly,
        toggleShowFavoritesOnly
    }
}
