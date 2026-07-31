import { ROLES } from '@/constants/userConstants'

const ALL_ROLES = [ROLES.GUEST, ROLES.USER, ROLES.ADMIN]
const LOGGED_IN_ROLES = [ROLES.USER, ROLES.ADMIN]
const GUEST_ONLY = [ROLES.GUEST]

export const SYSTEM_MENU = [
  {
    type: 'button',
    key: 'cart',
    label: '購物車',
    route: { name: 'cart' },
    roles: ALL_ROLES,
    usage: ['sidebar'],
  },
  {
    type: 'button',
    key: 'profile',
    label: '個人資料維護',
    route: { name: 'profile' },
    roles: LOGGED_IN_ROLES,
    usage: ['sidebar'],
  },
  {
    type: 'button',
    key: 'setting',
    label: '設定',
    route: { name: 'setting' },
    roles: ALL_ROLES,
    usage: ['sidebar'],
  },
  {
    type: 'button',
    key: 'login',
    label: '登入',
    route: { name: 'login' },
    roles: GUEST_ONLY,
    usage: ['sidebar'],
  },
  {
    type: 'button',
    key: 'register',
    label: '註冊',
    route: { name: 'register' },
    roles: GUEST_ONLY,
    usage: ['sidebar'],
  },
]
