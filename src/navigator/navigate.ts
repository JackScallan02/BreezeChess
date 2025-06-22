import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from '../constants/router/route'; // update path as needed

export const useNavigation = () => {
    const [key, setKey] = useState<number>(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const curPage = location.pathname;

    const handleNavigation = (page: string) => {
        const isLoggedIn = user && Object.keys(user).length > 0;
        const route = ROUTES.find(r => r.path === page);
        const requiresAuth = route?.requiresAuth;

        const allowedNewUserPages = ['/welcome', '/about', '/contact'];

        // Redirect if route is protected and user is not logged in
        if (requiresAuth && !isLoggedIn) {
            navigate('/');
            return;
        }

        // Redirect new users if they try to bypass welcome
        if (user?.is_new_user && !allowedNewUserPages.includes(page)) {
            navigate('/welcome');
            return;
        }

        // If already on the target page, just trigger a refresh
        if (location.pathname === page) {
            setKey(prev => prev + 1);
            return;
        }

        // Otherwise navigate normally
        navigate(page);
    };

    return { handleNavigation, key, curPage };
};

export default useNavigation;
