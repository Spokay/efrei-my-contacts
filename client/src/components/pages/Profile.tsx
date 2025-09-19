import React from 'react';
import {Loading} from './Loading';
import { UseAuthContext } from '../../contexts/auth-context';

const Profile: React.FC = () => {
    const { user } = UseAuthContext();

    const locale = 'fr-FR';

    if (!user) {
        return <Loading />;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Mon Profil</h1>
            </div>

            <div className="profile-info">
                <div className="info-group">
                    <label>Nom complet:</label>
                    <p>{user.firstName} {user.lastName}</p>
                </div>

                <div className="info-group">
                    <label>Email:</label>
                    <p>{user.email}</p>
                </div>

                <div className="info-group">
                    <label>Téléphone:</label>
                    <p>{user.phone}</p>
                </div>

                <div className="info-group">
                    <label>Compte créé le:</label>
                    <p>{user.createdAt.toLocaleDateString(locale)}</p>
                </div>

                <div className="info-group">
                    <label>Dernière modification:</label>
                    <p>{user.updatedAt.toLocaleDateString(locale)}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;