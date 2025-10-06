import React from 'react';
import {Loading} from '../../common/Loading';
import { UseAuthContext } from '../../../contexts/auth-context';
import './Profile.css';

const Profile = () => {
    const { user } = UseAuthContext();

    const locale = 'fr-FR';

    if (!user) {
        return <Loading />;
    }

    const createdAt = user.createdAt.toLocaleDateString(locale);
    const updatedAt = user.updatedAt.toLocaleDateString(locale);

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
                    <p>{createdAt}</p>
                </div>

                <div className="info-group">
                    <label>Dernière modification:</label>
                    <p>{updatedAt}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
