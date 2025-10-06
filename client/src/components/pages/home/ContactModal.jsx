import React, {useState} from 'react'
import {useEffect} from "react";
import './ContactModal.css';

export const ContactModalForm = (props) => {

    const [formData, setFormData] = useState({
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        });

    useEffect(() => {
        if (props.editModalContact) {
            setFormData(props.editModalContact);
        }
    }, [props.editModalContact]);

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validateFormFields = (formData) => {
        setError('');
        if (areAllFieldEmpty(formData)) {
            setError('Veuillez remplir au moins un champ');
            return false;
        }
        if (formData.phone && !validatePhone(formData.phone)) {
            setError('Le numéro de téléphone doit contenir entre 10 et 20 caractères');
            return false;
        }
        return true;
    }

    const createContact = (e) => {
        e.preventDefault();

        if (!validateFormFields(formData)) {
            return;
        }

        props.addContact(formData);
    }

    const editContact = (e) => {
        e.preventDefault();

        if (!props.editModalContact || !props.editModalContact._id || !props.editContact) {
            setError('Erreur lors de la modification du contact');
            return;
        }

        if (!validateFormFields(formData)) {
            return;
        }

        props.editContact(props.editModalContact._id, formData);
    }

    return (
        <div className="modal-overlay" onClick={props.closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{props.editModalContact ? 'Modifier le contact' : 'Ajouter un contact'}</h2>

                {error && error != '' && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={props.editModalContact ? editContact : createContact}>
                    <div>
                        <label htmlFor="firstName">Prénom:</label>
                        <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleInputChange}/>
                    </div>

                    <div>
                        <label htmlFor="lastName">Nom:</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}/>
                    </div>

                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="text" name="email" value={formData.email} onChange={handleInputChange}/>
                    </div>

                    <div>
                        <label htmlFor="phone">Téléphone:</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}/>
                    </div>

                    <div className="modal-buttons">
                        <button type="submit">
                            {props.editModalContact ? 'Modifier le contact' : 'Ajouter le contact'}
                        </button>
                        <button type="button" onClick={props.closeModal}>
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const areAllFieldEmpty = (formData) => {
    return formData.firstName == '' && formData.lastName == '' && formData.email == '' && formData.phone == '';
}

const validatePhone = (phone) => {
    return phone.length >= 10 && phone.length <= 20;
}
