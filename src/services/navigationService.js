import { NAVIGATION_SCHEMA } from '@/data/navigationMenu'
import { SYSTEM_MENU } from '@/data/systemMenu'

const roleFilter = (role) => (item) =>
  Array.isArray(item.roles) ? item.roles.includes(role) : true

const typeFilterMap = {
  all: () => true,
  dropdown: (item) => item.type === 'dropdown',
  button: (item) => item.type === 'button',
}

function filterMenu(menu, role, typeFilter, usage) {
  return menu
    .filter(roleFilter(role))
    .filter(typeFilter)
    .filter((item) => !usage || item.usage?.includes(usage))
}

export function getNavMenu(userRole, { type = 'all', includeSystem = false, usage } = {}) {
  const typeFilter = typeFilterMap[type] || typeFilterMap.all

  const main = filterMenu(NAVIGATION_SCHEMA, userRole, typeFilter, usage)

  const system = includeSystem ? filterMenu(SYSTEM_MENU, userRole, typeFilter, usage) : []

  return [...main, ...system]
}
