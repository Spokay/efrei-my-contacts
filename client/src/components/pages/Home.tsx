import React, {useEffect, useState} from 'react';
import type {Contact} from '../../services/dto/contact-dto';
import {userService} from '../../services/user-service';
import {Loading} from "./Loading";
import {AddContactModal} from "../AddContactModal";

const Home: React.FC = () => {

    const [contacts, setContacts] = useState<Array<Contact> | null>(null);

    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = () => setIsModalOpen(true);
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

    useEffect(() => {
        userServiceInstance.getContacts()
            .then((contacts) => {
                setContacts(contacts);
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de la récupération des contacts');
            });
    }, []);

    if (!contacts) {
        return <Loading />;
    }

    return (
        <div>
            <h1>Contacts</h1>
            <button onClick={openModal}>
                Ajouter un contact
            </button>
            {isModalOpen && (
                <AddContactModal
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    addContact={addContact}
                />
            )}
            <table>
                <thead>
                    <tr>
                        <th>Nom Prénom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                    </tr>
                </thead>
                <tbody>
                {(contacts && contacts.length > 0) ? contacts.map((contact: Contact, index: number) =>
                    (
                        <tr key={index}>
                            <td>{contact.firstName} {contact.lastName}</td>
                            <td>{contact.email}</td>
                            <td>{contact.phone}</td>
                        </tr>
                    )
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <div>Aucun contact</div>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Home;