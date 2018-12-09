import MapContainer from '../MapContainer/MapContainer';
import Profile from '../Profile/Profile';

const adminMenu = [
    {
        'name': 'Ordenar',
        'icon': 'shopping-cart',
        'component': MapContainer,
    },
    {
        'name': 'Perfil',
        'icon': 'user',
        'component': Profile,
    }
];

export default adminMenu;