import React, { PureComponent, Fragment } from 'react'
import { Menu } from 'antd'
import { NavLink, withRouter } from 'umi'
import { pathToRegexp } from 'path-to-regexp'
import { arrayToTree, queryAncestors } from 'utils'
import iconMap from 'utils/iconMap'
import store from 'store'
import { SiderMenuProps } from '@/types'

const { SubMenu } = Menu

@withRouter
class SiderMenu extends PureComponent<SiderMenuProps, Object> {
  state = {
    openKeys: store.get('openKeys') || [],
  }

  onOpenChange = (openKeys: any) => {
    const { menus } = this.props
    const rootSubmenuKeys = menus.filter(_ => !_.menuParentId).map(_ => _.id)

    const latestOpenKey = openKeys.find(
      (key: any) => this.state.openKeys.indexOf(key) === -1,
    )

    let newOpenKeys = openKeys
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : []
    }

    this.setState({
      openKeys: newOpenKeys,
    })
    store.set('openKeys', newOpenKeys)
  }

  generateMenus = (data: any) => {
    return data.map((item: any) => {
      if (item.children) {
        return (
          <SubMenu
            key={item.id}
            title={
              <Fragment>
                {item.icon && iconMap[item.icon]}
                <span>{item.name}</span>
              </Fragment>
            }
          >
            {this.generateMenus(item.children)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <NavLink to={item.route || '#'}>
            {item.icon && iconMap[item.icon]}
            <span>{item.name}</span>
          </NavLink>
        </Menu.Item>
      )
    })
  }

  render() {
    const {
      collapsed,
      theme,
      menus,
      location,   // location is from @withRouter not this.props
      isMobile,
      onCollapseChange,
    } = this.props

    // Generating tree-structured data for menu content.
    const menuTree = arrayToTree(menus, 'id', 'menuParentId')

    // Find a menu that matches the pathname.
    const currentMenu = menus.find(
      _ => _.route && pathToRegexp(_.route).exec(location.pathname),
    )

    // Find the key that should be selected according to the current menu.
    const selectedKeys = currentMenu
      ? queryAncestors(menus, currentMenu, 'menuParentId').map(_ => _.id)
      : []

    const menuProps = collapsed
      ? {}
      : {
        openKeys: this.state.openKeys,
      }

    return (
      <Menu
        mode='inline'
        theme={theme}
        onOpenChange={this.onOpenChange}
        selectedKeys={selectedKeys}
        onClick={
          isMobile
            ? () => {
              onCollapseChange(true)
            }
            : undefined
        }
        {...menuProps}
      >
        {this.generateMenus(menuTree)}
      </Menu>
    )
  }
}


export default SiderMenu
