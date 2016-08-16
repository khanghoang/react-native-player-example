export const SELECT_MENU_ITEM = 'SELECT_MENU_ITEM';

export function selectMenuItem(menuLink) {
  return {
    type: SELECT_MENU_ITEM,
    data: menuLink,
  };
}
