import { getCurrentUserRole, getMenuItemsByRole, getRoleByPathname, USER_ROLES } from './roleMenus';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = getMenuItemsByRole(getCurrentUserRole());

export default menuItems;
export { getCurrentUserRole, getMenuItemsByRole, getRoleByPathname, USER_ROLES };
