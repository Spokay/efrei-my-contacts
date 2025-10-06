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
        toggleFavorite,
        editModalContact,
        setEditModalContact,
        showFavoritesOnly,
        toggleShowFavoritesOnly
    } = useContacts();

    useEffect(() => {
        userServiceInstance.getContacts(showFavoritesOnly)
            .then((contacts) => {
                setContacts(contacts);
            })
            .catch((err) => {
                console.error(err);
                setError('Erreur lors de la récupération des contacts');
            });
    }, [showFavoritesOnly]);

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
                    <button
                        className={`favorites-filter-btn ${showFavoritesOnly ? 'active' : ''}`}
                        onClick={toggleShowFavoritesOnly}
                    >
                        {showFavoritesOnly ? 'Afficher tous les contacts' : 'Afficher seulement les favoris'}
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="contacts-table">
                        <thead>
                            <tr>
                                <th>Favori</th>
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
                                    <td>
                                        <button
                                            className="star-btn"
                                            onClick={() => toggleFavorite(contact._id)}
                                            aria-label={contact.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                                        >
                                            <img
                                                src={
                                                    contact.isFavorite
                                                        ? "/assets/images/star-filled.svg"
                                                        : "/assets/images/star.svg"
                                                }
                                                alt="Icone d'étoile"
                                                className="star-icon"
                                            />
                                        </button>
                                    </td>
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
                            <tr><td colSpan={5} className="error-cell">{error}</td></tr>
                        ) : (
                            <tr><td colSpan={5} className="empty-cell">Aucun contact</td></tr>
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
