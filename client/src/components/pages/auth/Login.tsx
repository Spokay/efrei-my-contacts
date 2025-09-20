
import React, { useState } from 'react';
import { UseAuthContext } from '../../../contexts/auth-context';
import type { AuthDto } from '../../../services/dto/auth-dto';
import {Link} from "react-router-dom";

const Login = () => {
    const { authService, handleConnection, loading } = UseAuthContext();
    const [formData, setFormData] = useState<AuthDto>({
        email: '',
        password: ''
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

        if (!formData.email || !formData.password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        authService.authenticate(formData)
            .then(() => {
                console.log('Login successful');
                return handleConnection();
            })
            .catch(err => {
                console.error('Login error:', err);
                setError('Le nom d\'utilisateur ou le mot de passe est invalide');
            });
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
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
                        {loading ? 'Connexion en cours' : 'Se connecter'}
                    </button>
                </form>
                <Link to={"/register"}>
                    Pas encore de compte ? Inscrivez-vous
                </Link>
            </div>
        </div>
    );
}

export default Login;