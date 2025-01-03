export const getMenuItemClass = (currentPath, targetPath) => {
    return currentPath === targetPath
        ? 'sidebar-menu-item active-menu'
        : 'sidebar-menu-item';
};
