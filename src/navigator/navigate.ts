import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext";

export const useNavigation = () => {
    const [key, setKey] = useState<number>(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const curPage = location.pathname;
    
    const handleNavigation = (page: string) => {

        if (location.pathname === page) {
            setKey(prev => prev + 1);
        } else {
            if (user && Object.keys(user).length > 0 && user.is_new_user && page !== '/welcome' && page !== '/about') {
                navigate('/welcome');
            } else {
                navigate(page);
            }
        }
    }

    return { handleNavigation, key, curPage };
}

export default useNavigation;
