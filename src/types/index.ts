// Component props type
export interface MenuOption {
  name: string
  key: string | number
}

export interface DropOptionProps {
  onMenuClick?: object
  menuOptions: MenuOption[]
  buttonStyle?: object
  dropdownProps?: object
}

export interface FilterItemProps {
  label: string
  children: any
}

export interface BreadProps<T> {
  routeList: Array<T>
}

export interface paths {
  id: string
  icon?: string
  name: string
  zh?: any
  pt_br?: any
  route: string
}

export interface HeaderProps<T> {
  fixed: boolean
  user: object
  username: string
  avatar: string
  menus: Array<T>
  collapsed: boolean
  onSignOut: Function
  notifications: Array<T>
  onCollapseChange: object
  onAllNotificationsRead: object
}

export interface SiderMenuProps {
  menus: MenuProps[]
  theme: MenuTheme
  isMobile: boolean
  onCollapseChange: Function
  collapsed: boolean
}

// location is from @withRouter not parent component.
export interface Location {
  pathname: string
  search?: string
  hash?: string
  query: object
  state: object
}

export interface MenuProps {
  id: string
  icon?: string
  name: string
  route: string
  breadcrumbParentId: string
  menuParentId: any
}

export declare type MenuTheme = 'light' | 'dark';

export interface SiderProps {
  menus: MenuProps[]
  theme: MenuTheme
  isMobile: boolean
  collapsed: boolean
  onThemeChange: Function
  onCollapseChange: Function
}

export interface LoaderProps {
  spinning?: boolean
  fullScreen?: boolean
}

export interface PageProps {
  className: string
  children: any
  loading: boolean
  inner: boolean
}


// Layout Props
export interface BaseLayoutProps {
  loading: object
}

export interface PrimaryLayoutProps {
  children: any
  location: object
  dispatch: any
  app: object
  loading: object
}
