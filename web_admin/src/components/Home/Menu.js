import Orders from '../Orders/Orders';
import Slots from '../Slots/Slots';
import UsersSystem from '../UsersSystem/UsersSystem';
import Users from '../Users/Users';

const adminMenu = [
    {
        'name': 'Ordenes',
        'icon': 'shopping-cart',
        'component': Orders,
    },
    {
        'name': 'Usuarios',
        'icon': 'user',
        'component': Users,
    },
    {
        'name': 'Cajones',
        'icon': 'environment',
        'component': Slots,
    },
    {
        'name': 'Usuarios De Sistema',
        'icon': 'user',
        'component': UsersSystem,
    }
];

export default adminMenu;