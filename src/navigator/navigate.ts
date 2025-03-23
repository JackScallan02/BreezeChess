import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

export const useNavigation = () => {
    const [key, setKey] = useState<number>(0);
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = (page: string) => {

        if (location.pathname === page) {
            // window.location.reload();
            setKey(prev => prev + 1);
        } else {
            navigate(page);
        }
    }

    return { handleNavigation, key };
}

export default useNavigation;
