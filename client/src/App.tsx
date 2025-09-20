import './App.css'
import {AppAuthContextProvider, UseAuthContext} from "./contexts/auth-context.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/pages/home/Home.tsx";
import Profile from "./components/pages/Profile.tsx";
import Layout from "./components/layout/Layout.tsx";
import {Loading} from "./components/common/Loading.tsx";
import Register from "./components/pages/auth/Register.tsx";
import Login from "./components/pages/auth/Login.tsx";

const AuthenticatedApp = () => {
    return (
        <Layout>
            <Routes>
                <Route index={true} path="/" element={<Home />} />
                <Route path="/profile"  element={<Profile />} />
            </Routes>
        </Layout>
    );
};

const UnAuthenticatedApp = () => {
    return (
        <Routes>
            <Route index={true} path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
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
    <BrowserRouter>
        <AppAuthContextProvider>
            <AppContent />
        </AppAuthContextProvider>
    </BrowserRouter>
);

export default App
