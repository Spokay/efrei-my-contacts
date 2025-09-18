

import React, { useState } from 'react';
import { UseAuthContext } from '../../../contexts/auth-context';
import type { RegisterRequest } from '../../../services/dto/auth-dto';
import {Link} from "react-router-dom";

const Register = () => {
    const { authService, handleConnection, loading } = UseAuthContext();
    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.phone) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        authService.register(formData)
            .then(() => {
                console.log('Registration successful');
                return handleConnection();
            })
            .catch(err => {
                console.error('Registration error:', err);
                setError('Erreur lors de l\'inscription, veuillez réessayer');
            });
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h1>Inscription</h1>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="firstName">Prénom:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Nom:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Téléphone:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Inscription en cours' : 'S\'inscrire'}
                    </button>
                    <Link to={"/"}>
                        Vous avez déjà un compte ? Connectez-vous
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Register;