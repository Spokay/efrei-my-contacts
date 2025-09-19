import React, {useState} from 'react'
import type {Contact} from '../services/dto/contact-dto'

interface AddContactModalProps {
    addContact: (contact: Contact) => void
    closeModal: () => void
    isModalOpen: boolean
}

export const AddContactModal: React.FC<AddContactModalProps> = (props) => {

    const [formData, setFormData] = useState<Contact>({
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        });

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

    return (
        <div>
            {error && error != '' && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <form onSubmit={createContact}>
                <label htmlFor="firstName">
                    Prénom:
                </label>
                <input type="text" name="firstName" id="firstName" onInput={handleInputChange}/>
                <label htmlFor="lastName">
                    Nom:
                </label>
                <input type="text" name="lastName" onInput={handleInputChange}/>
                <label htmlFor="email">
                    Email:
                </label>
                <input type="text" name="email" onInput={handleInputChange}/>
                <label htmlFor="phone">
                    Téléphone:
                </label>
                <input type="tel" name="phone" onInput={handleInputChange}/>

                <input type="submit" value="Ajouter le contact"/>
            </form>

            <button onClick={props.closeModal}>
                Annuler
            </button>
        </div>
    );
}

const areAllFieldEmpty = (formData: Contact) => {
    console.log(formData);
    return formData.firstName == '' || formData.lastName == '' || formData.email == '' || formData.phone == '';
}

const validatePhone = (phone: string) => {
    return phone.length >= 10 && phone.length <= 20;
}