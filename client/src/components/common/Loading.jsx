import React, {useState} from "react";
import {ClipLoader} from "react-spinners";
import './Loading.css'

export const Loading = () => {
    const [loading] = useState(true);
    const [color] = useState("#000000");

    return (
        <div className="loading-container">
            <ClipLoader
                color={color}
                loading={loading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};
