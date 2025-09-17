import { Coffee, Cpu, Flag, Monitor, Odometer, Suitcase } from '@element-plus/icons-vue'

/**
 * 根據使用者角色動態產生導覽選單
 * @param {string} userRole - 使用者的角色，例如 'ADMIN', 'USER'
 * @returns {Array} - 組裝好的選單陣列
 */
export function getNavMenu(userRole) {
  const categories = [
    {
      name: 'products',
      label: '商品相關',
      icon: Monitor,
      clickable: false,
      subs: [
        { name: '', label: '商品介紹', icon: Cpu },
        { name: 'list', label: '商品管理', icon: Cpu },
      ],
    },
    {
      name: 'settings',
      label: '管理相關',
      icon: Odometer,
      clickable: false,
      subs: [{ name: 'options', label: '選項管理', icon: Cpu }],
    },
    {
      name: 'life',
      label: '生活類',
      icon: Coffee,
      clickable: false,
      subs: [
        { name: 'food', label: '美食', icon: Coffee },
        {
          name: 'travel',
          label: '旅遊',
          icon: Suitcase,
          clickable: false,
          subs: [
            { name: 'usa', label: '美國', icon: Flag },
            { name: 'canada', label: '加拿大', icon: Flag },
          ],
        },
      ],
    },
  ]

  // 如果使用者不是 ADMIN，則移除 'settings' 類別
  if (userRole !== 'ADMIN') {
    return categories.filter((category) => category.name !== 'settings')
  }
  // 如果使用者是User，則僅顯示 'products' 類別
  if (userRole === 'USER') {
    return categories.filter((category) => category.name === 'products')
  }

  // 如果使用者是 ADMIN，則返回完整的選單
  return categories
}