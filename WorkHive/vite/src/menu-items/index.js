import { getCurrentUserRole, getMenuItemsByRole, USER_ROLES } from './roleMenus';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = getMenuItemsByRole(getCurrentUserRole());

export default menuItems;
export { getCurrentUserRole, getMenuItemsByRole, USER_ROLES };
