/* eslint-disable @typescript-eslint/naming-convention */

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requireAuth?: boolean
    layout?: string
    allowedRoles?: TUserRole[]
  }
}

// TODO: Here you define you global vue definitions. Uncomment if needed
// declare module 'vue' {
// interface ComponentCustomProperties {
// }
// }

export { }
