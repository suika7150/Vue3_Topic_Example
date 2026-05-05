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
      name: 'doubleeleven',
      label: '雙11週年盛典',
      icon: Odometer,
      clickable: false,
      subs: [
        { routeName: 'rewards', label: '年度特選回饋', icon: Sell },
        { routeName: 'gifts', label: '滿額加碼驚喜', icon: MagicStick },
      ],
    },
    {
      name: 'event',
      label: '活動專區',
      icon: Calendar,
      clickable: false,
      subs: [
        { routeName: 'flashSale', label: '本週特惠', icon: Odometer },
        { routeName: 'luckyWheel', label: '幸運輪盤', icon: Present },
      ],
    },
    {
      name: 'products',
      label: '商品相關',
      icon: Monitor,
      clickable: false,
      subs: [
        { routeName: 'overview', label: '商品總覽', icon: Cpu },
        { routeName: 'productManage', label: '商品管理', icon: Cpu },
      ],
    },
    {
      name: 'crossover',
      label: '聯名專區',
      icon: Connection,
      clickable: false,
      subs: [
        {
          key: 'anime',
          routeName: { name: 'crossover', params: { type: 'anime' } },
          label: '動漫聯名款',
          icon: VideoCameraFilled,
        },
        {
          key: 'movie',
          routeName: { name: 'crossover', params: { type: 'movie' } },
          label: '電影大聯盟',
          icon: Flag,
        },
        {
          key: 'designer',
          routeName: { name: 'crossover', params: { type: 'designer' } },
          label: '設計師聯名',
          icon: Brush,
        },
        {
          key: 'limited',
          routeName: { name: 'crossover', params: { type: 'limited' } },
          label: '全球限量',
          icon: Star,
        },
      ],
    },
    {
      name: 'brands',
      label: '品牌專區',
      icon: GoodsFilled,
      clickable: false,
      subs: [
        { routeName: 'brandFood', label: '食品飲品', icon: IceDrink },
        { routeName: 'brandVehicle', label: '汽機車用品', icon: Van },
        { routeName: 'brandLiving', label: '居家生活', icon: House },
      ],
    },
    {
      name: 'seasonal',
      label: '季節限定',
      icon: Van,
      clickable: false,
      subs: [
        {
          routeName: 'seasonalFeatured',
          label: '季節精選',
          icon: Timer,
        },
        { routeName: 'travelPicks', label: '出遊推薦', icon: Compass },
      ],
    },

    {
      name: 'settings',
      label: '管理相關',
      icon: Odometer,
      clickable: false,
      subs: [{ routeName: 'options', label: '選項管理', icon: Cpu }],
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
        if (category.name === 'settings') return null
        return category
      })
      .filter(Boolean)
  }
}
