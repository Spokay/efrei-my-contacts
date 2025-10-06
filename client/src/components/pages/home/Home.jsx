import React, {useEffect} from 'react';
import {Loading} from "../../common/Loading";
import {ContactModalForm} from "./ContactModal";
import {useContacts} from "./hooks/Contact.hooks";
import './Home.css';

const Home = () => {

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
        <div className="home-container">
            <div className="home-header">
                <h1>Contacts</h1>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <button className="add-contact-btn" onClick={() => openModal()}>
                        + Ajouter un contact
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="contacts-table">
                        <thead>
                            <tr>
                                <th>Nom Prénom</th>
                                <th>Email</th>
                                <th>Téléphone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {(contacts && contacts.length > 0) ? contacts.map((contact, index) =>
                            (
                                <tr key={index}>
                                    <td>{contact.firstName} {contact.lastName}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.phone}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="edit-btn" onClick={() => openModal(contact)}>
                                                Modifier
                                            </button>
                                            <button className="delete-btn" onClick={
                                                () =>
                                                    confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")
                                                    && deleteContact(contact._id)
                                            }>
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        ) : error ? (
                            <tr><td colSpan={4} className="error-cell">{error}</td></tr>
                        ) : (
                            <tr><td colSpan={4} className="empty-cell">Aucun contact</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

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
        </div>
    );
}

export default Home;
