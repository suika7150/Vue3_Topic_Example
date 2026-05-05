export const navigationMenu = [
  {
    type: 'dropdown',
    key: 'doubleeleven',
    label: '雙11周年慶典',
    subs: [
      { label: '年度特選回饋', route: { name: 'rewards' } },
      { label: '滿額加碼驚喜', route: { name: 'gifts' } },
    ],
  },
  {
    type: 'dropdown',
    key: 'event',
    label: '活動專區',
    subs: [
      { label: '本週特惠', route: { name: 'flashSale' } },
      { label: '幸運輪盤', route: { name: 'luckyWheel' } },
    ],
  },
  {
    type: 'dropdown',
    key: 'crossover',
    label: '聯名專區',
    subs: [
      { label: '動漫聯名款', route: { name: 'crossover', params: { type: 'anime' } } },
      { label: '電影大聯盟', route: { name: 'crossover', params: { type: 'movie' } } },
      { label: '設計師聯名款', route: { name: 'crossover', params: { type: 'designer' } } },
      { label: '全球限量版', route: { name: 'crossover', params: { type: 'limited' } } },
    ],
  },
  {
    type: 'dropdown',
    key: 'brands',
    label: '品牌專區',
    subs: [
      { label: '食品飲品', route: { name: 'brandFood' } },
      { label: '汽機車用品', route: { name: 'brandVehicle' } },
      { label: '居家生活', route: { name: 'brandLiving' } },
    ],
  },
  {
    type: 'dropdown',
    key: 'seasonal',
    label: '季節限定',
    subs: [
      { label: '季節精選', route: { name: 'seasonalFeatured' } },
      { label: '出遊推薦', route: { name: 'travelPicks' } },
    ],
  },

  {
    type: 'button',
    label: '最新活動',
    route: { name: 'latestNews' },
  },
  {
    type: 'button',
    label: '購買須知',
    route: { name: 'shoppingGuide' },
  },
]
