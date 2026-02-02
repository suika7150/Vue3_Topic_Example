import {
  Cpu,
  Flag,
  IceDrink,
  Monitor,
  Odometer,
  Van,
  VideoCameraFilled,
  Brush,
  Star,
  Present,
  Compass,
  Timer,
  GoodsFilled,
  House,
  Connection,
  Calendar,
  Sell,
  MagicStick,
} from '@element-plus/icons-vue'

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
        // { name: '', label: '商品總覽', icon: Cpu },
        // { name: 'list', label: '商品管理', icon: Cpu },
        { name: 'overview', label: '商品總覽', icon: Cpu, route: '/products' },
        { name: 'productManage', label: '商品管理', icon: Cpu, route: '/products/manage' },
      ],
    },

    {
      name: 'event',
      label: '活動專區',
      icon: Calendar,
      clickable: false,
      subs: [
        { name: 'flashSale', label: '本週特惠', icon: Odometer, route: '/event/flashsale' },
        { name: 'luckyWheel', label: '幸運輪盤', icon: Present, route: '/event/luckywheel' },
      ],
    },
    {
      name: 'crossover',
      label: '聯名專區',
      icon: Connection,
      clickable: false,
      subs: [
        {
          name: 'anime',
          label: '動漫聯名款',
          icon: VideoCameraFilled,
          route: '/crossover/anime',
        },
        {
          name: 'movie',
          label: '電影大聯盟',
          icon: Flag,
          route: '/crossover/movie',
        },
        {
          name: 'designer',
          label: '設計師聯名款',
          icon: Brush,
          route: '/crossover/designer',
        },
        { name: 'limited', label: '全球限量版', icon: Star, route: '/crossover/limited' },
      ],
    },
    {
      name: 'brands',
      label: '品牌專區',
      icon: GoodsFilled,
      clickable: false,
      subs: [
        { name: 'brandFood', label: '食品飲品', icon: IceDrink, route: 'brands/food' },
        { name: 'brandVehicle', label: '汽機車用品', icon: Van, route: 'brands/vehicle' },
        { name: 'brandLiving', label: '居家生活', icon: House, route: 'brands/living' },
      ],
    },
    {
      name: 'seasonal',
      label: '季節限定',
      icon: Van,
      clickable: false,
      subs: [
        {
          name: 'seasonalFeatured',
          label: '季節精選',
          icon: Timer,
          route: '/seasonal/featured',
        },
        { name: 'seasonalTravel', label: '出遊推薦', icon: Compass, route: '/seasonal/travel' },
      ],
    },
    {
      name: 'doubleeleven',
      label: '雙11週年盛典',
      icon: Odometer,
      clickable: false,
      subs: [
        { name: 'rewards', label: '年度特選回饋', icon: Sell, route: '/doubleeleven/rewards' },
        { name: 'gifts', label: '滿額加碼驚喜', icon: MagicStick, route: '/doubleeleven/gifts' },
      ],
    },
    {
      name: 'settings',
      label: '管理相關',
      icon: Odometer,
      clickable: false,
      subs: [{ name: 'options', label: '選項管理', icon: Cpu }],
    },
  ]

  // 如果使用者是USER，開放全部功能
  if (userRole === 'USER') {
    return categories
  }

  // 如果使用者是 GUEST ， 移除商品管理、管理相關
  if (userRole === 'GUEST') {
    return categories
      .map((category) => {
        if (category.name === 'products') {
          return {
            ...category,
            subs: category.subs.filter((sub) => sub.name !== 'list'), //移除商品管理
          }
        }
        if (category.name === 'settings') {
          return null //移除管理相關
        }
        return category
      })
      .filter(Boolean)
  }
}
