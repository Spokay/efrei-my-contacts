import './App.css'
import {AppAuthContextProvider, UseAuthContext} from "./contexts/auth-context.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/pages/Home.tsx";
import {Loading} from "./components/pages/Loading.tsx";
import Register from "./components/pages/auth/Register.tsx";
import Login from "./components/pages/auth/Login.tsx";

const AuthenticatedApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index={true} path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
};

const UnAuthenticatedApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index={true} path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

const AppContent = () => {
    const { isAuthenticated, isAuthReady, loading } = UseAuthContext();

    if (!isAuthReady) {
        return <Loading />;
    }

    if (loading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return <UnAuthenticatedApp />;
    }

    return <AuthenticatedApp />;
};

const App = () => (
        <AppAuthContextProvider>
            <AppContent />
        </AppAuthContextProvider>
);

export default App
