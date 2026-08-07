import { NAVIGATION_SCHEMA } from '@/config/navigationMenu'
import { SYSTEM_MENU } from '@/config/systemMenu'

// 檢查使用者角色是否符合選單權限
const roleFilter = (role) => (item) =>
  Array.isArray(item.roles) ? item.roles.includes(role) : true

// 選單型態對應的過濾條件
const typeFilterMap = {
  all: () => true,
  dropdown: (item) => item.type === 'dropdown',
  button: (item) => item.type === 'button',
}

// 統合角色、型態與使用場景來過濾選單
function filterMenu(menu, role, typeFilter, usage) {
  return menu
    .filter(roleFilter(role))
    .filter(typeFilter)
    .filter((item) => !usage || item.usage?.includes(usage))
}

// 產生最終的導覽選單
export function getNavMenu(userRole, { type = 'all', includeSystem = false, usage } = {}) {
  const typeFilter = typeFilterMap[type] || typeFilterMap.all

  // 篩選主要選單
  const main = filterMenu(NAVIGATION_SCHEMA, userRole, typeFilter, usage)

  // 是否包含系統選單
  const system = includeSystem ? filterMenu(SYSTEM_MENU, userRole, typeFilter, usage) : []

  return [...main, ...system]
}
