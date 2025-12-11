import {
  Bicycle,
  Coffee,
  Cpu,
  Flag,
  Food,
  IceDrink,
  Loading,
  LocationFilled,
  Mic,
  Monitor,
  Odometer,
  Smoking,
  Suitcase,
  Van,
  VideoCameraFilled,
} from '@element-plus/icons-vue'
import { faShirt } from '@fortawesome/free-solid-svg-icons'

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
        { name: '', label: '商品總覽', icon: Cpu },
        { name: 'list', label: '商品管理', icon: Cpu },
        { name: 'overview', label: '商品總覽', icon: Cpu, route: '/products' },
        { name: 'list', label: '商品管理', icon: Cpu, route: '/products/list' },
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
      label: '生活',
      icon: Coffee,
      clickable: false,
      subs: [
        {
          name: 'travel',
          label: '旅遊',
          icon: LocationFilled,
          clickable: false,
          subs: [
            { name: 'usa', label: '美國', icon: Flag, route: '/life/travel/usa' },
            { name: 'canada', label: '加拿大', icon: Flag, route: '/life/travel/canada' },
          ],
        },
        { name: 'Clean', label: '清潔', icon: Loading, route: '/life/clean' },
      ],
    },
    {
      name: 'clothing',
      label: '服飾',
      icon: Coffee,
      clickable: false,
      subs: [
        {
          name: 'travel',
          label: '旅遊',
          icon: LocationFilled,
          clickable: false,
          subs: [
            { name: 'usa', label: '美國', icon: Flag, route: '/life/travel/usa' },
            { name: 'canada', label: '加拿大', icon: Flag, route: '/life/travel/canada' },
          ],
        },
        { name: 'Clean', label: '清潔', icon: Loading, route: '/life/clean' },
      ],
    },
    {
      name: 'food',
      label: '美食',
      icon: Food,
      clickable: false,
      subs: [
        { name: 'drinks', label: '飲品', icon: IceDrink, route: '/food/drinks' },
        { name: 'snacks', label: '零食', icon: Suitcase, route: '/food/snacks' },
        { name: 'smoking', label: '香菸', icon: Smoking, route: '/food/smoking' },
      ],
    },
    {
      name: 'vehicles',
      label: '汽車',
      icon: Van,
      clickable: false,
      subs: [
        { name: 'cars', label: '轎車', icon: Odometer, route: '/vehicles/cars' },
        { name: 'motorcycles', label: '摩托車', icon: Bicycle, route: '/vehicles/motorcycles' },
      ],
    },
    {
      name: 'entertainment',
      label: '娛樂',
      icon: Odometer,
      clickable: false,
      subs: [
        { name: 'movies', label: '電影', icon: VideoCameraFilled, route: '/entertainment/movies' },
        { name: 'music', label: '音樂', icon: Mic, route: '/entertainment/music' },
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
