import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'

export const useNavigation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = (page) => {

        if (location.pathname === page) {
            window.location.reload();
        } else {
            navigate(page);
        }
    }

    return handleNavigation;
}

export default useNavigation;
