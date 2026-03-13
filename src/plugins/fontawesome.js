import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faMagnifyingGlass,
  faBell as fasBell,
  faUser,
  faShirt,
} from '@fortawesome/free-solid-svg-icons'
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons'

library.add(faMagnifyingGlass, fasBell, farBell, faUser, faShirt)

export default (app) => {
  app.component('font-awesome-icon', FontAwesomeIcon)
}
