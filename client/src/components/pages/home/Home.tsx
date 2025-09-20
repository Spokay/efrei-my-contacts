import React, {useEffect} from 'react';
import type {Contact} from '../../../services/dto/contact-dto';
import {Loading} from "../../common/Loading";
import {ContactModalForm} from "./ContactModal";
import {useContacts} from "./hooks/Contact.hooks";

const Home: React.FC = () => {

    const {
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
    } = useContacts();

    useEffect(() => {
        userServiceInstance.getContacts()
            .then((contacts: Contact[]) => {
                setContacts(contacts);
            })
            .catch((err: any) => {
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
            <button onClick={() => openModal()}>
                Ajouter un contact
            </button>
            {isModalOpen && (
                <ContactModalForm
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    addContact={addContact}
                    editContact={editContact}
                    editModalContact={editModalContact}
                    setEditModalContact={setEditModalContact}
                />
            )}
            <table>
                <thead>
                    <tr>
                        <th>Nom Prénom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Modifier</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody>
                {(contacts && contacts.length > 0) ? contacts.map((contact: Contact, index: number) =>
                    (
                        <tr key={index}>
                            <td>{contact.firstName} {contact.lastName}</td>
                            <td>{contact.email}</td>
                            <td>{contact.phone}</td>
                            <td>
                                <button onClick={() => openModal(contact)}>Modifier</button>
                            </td>
                            <td>
                                <button onClick={
                                    () =>
                                        confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")
                                        && deleteContact(contact._id)
                                }>Supprimer</button>
                            </td>
                        </tr>
                    )
                ) : error ? (
                    <tr><td>{error}</td></tr>
                ) : (
                    <tr><td>Aucun contact</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Home;