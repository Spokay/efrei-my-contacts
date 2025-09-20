import React, {useState} from "react";
import {ClipLoader} from "react-spinners";

export const Loading: React.FC = () => {
    const [loading] = useState(true);
    const [color] = useState("#000000");

    return (
        <div>
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