import React, {useState} from 'react'
import type {Contact} from '../../../services/dto/contact-dto'
import {useEffect} from "react";

interface ContactModalProps {
    isModalOpen: boolean
    closeModal: () => void
    addContact: (contact: Contact) => void
    editContact?: (id: string, updatedContact: Contact) => void
    editModalContact: Contact | null
    setEditModalContact?: (contact: Contact | null) => void
}

export const ContactModalForm: React.FC<ContactModalProps> = (props) => {

    const [formData, setFormData] = useState<Contact>({
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

    const [error, setError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validateFormFields = (formData: Contact): boolean => {
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

    const createContact = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateFormFields(formData)) {
            return;
        }

        props.addContact(formData);
    }

    const editContact = (e: React.FormEvent<HTMLFormElement>) => {
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
        <div>
            {error && error != '' && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <form onSubmit={props.editModalContact ? editContact : createContact}>
                <label htmlFor="firstName">
                    Prénom:
                </label>
                <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleInputChange}/>
                <label htmlFor="lastName">
                    Nom:
                </label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}/>
                <label htmlFor="email">
                    Email:
                </label>
                <input type="text" name="email" value={formData.email} onChange={handleInputChange}/>
                <label htmlFor="phone">
                    Téléphone:
                </label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}/>

                <input type="submit" value={
                    props.editModalContact ? 'Modifier le contact' : 'Ajouter le contact'
                }/>
            </form>

            <button onClick={props.closeModal}>
                Annuler
            </button>
        </div>
    );
}

const areAllFieldEmpty = (formData: Contact) => {
    return formData.firstName == '' && formData.lastName == '' && formData.email == '' && formData.phone == '';
}

const validatePhone = (phone: string) => {
    return phone.length >= 10 && phone.length <= 20;
}