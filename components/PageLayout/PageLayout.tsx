import React, { useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
import 'antd/dist/antd.css'
import './PageLayout.scss'
import Link from 'next/link'
import { getToken, removeToken, removeUser } from '../../helpers/auth.helper'
import { loginWithTokenRequest } from '../../requests/auth.request'
import { useRouter } from 'next/router'
import { IBasicAccountInfo } from '../../types/account.type'
import { INavItem } from '../../types/navigation.type'
import { sideNavItems } from '../../navigation/side.navigation'
import { headerItems } from '../../navigation/header.navigation'
import { pageRoutes } from '../../navigation/page-routes'

interface IProps {
  children: React.ReactNode
  breadCrumb: INavItem[]
}

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const PageLayout = (props: IProps) => {
  const { children, breadCrumb } = props
  const [user, setUser] = useState<IBasicAccountInfo | null>(null)
  const router = useRouter()
  useEffect(() => {
    if (window) {
      const token = getToken()
      if (token) {
        loginWithTokenRequest({ token })
          .then((res) => {
            const user = res.data.result.account
            setUser(user)
          })
          .catch((e) => {
            removeToken()
            removeUser()
            if (router.pathname !== pageRoutes.register) {
              router.push(pageRoutes.login)
            }
          })
      }
    } else {
      console.log('Window not found.')
    }
  }, [])
  const logOut = () => {
    removeToken()
    removeUser()
    window.location.href = pageRoutes.login
  }
  const getDefaultSelectedKeys = () => {
    if (router) {
      const foundNavItem = sideNavItems.find((s) =>
        s.children ? s.children.some((c) => c.url === router.pathname) : false
      )
      if (foundNavItem) {
        if (foundNavItem.children) {
          const foundChild = foundNavItem.children.find(
            (c) => c.url === router.pathname
          )
          if (foundChild) {
            return [foundChild.key]
          }
          return []
        }
        return []
      }
      return []
    }
    return []
  }

  const $headerHeight = '64px'

  return (
    <Layout className="mf-page-layout">
      <Header className="header" style={{ background: '#fff' }}>
        <div className="logo">
          <Link href="/">
            <img src="/mayfantasy.cms.1000.png" />
          </Link>
        </div>
        {user ? (
          <div>
            @{user.username}{' '}
            <small>
              <a onClick={logOut}>Logout</a>
            </small>
          </div>
        ) : (
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: $headerHeight }}
          >
            {headerItems.map((item) => (
              <Menu.Item key={item.key}>
                {item.url ? (
                  <Link href={item.url}>
                    <a>{item.name}</a>
                  </Link>
                ) : (
                  <span>{item.name}</span>
                )}
              </Menu.Item>
            ))}
          </Menu>
        )}
      </Header>
      <Layout>
        <Sider
          width={user ? 200 : 0}
          style={{ background: '#000', height: 'auto' }}
          theme="dark"
        >
          <Menu
            mode="inline"
            theme="dark"
            style={{ height: '100%', borderRight: 0 }}
            defaultSelectedKeys={getDefaultSelectedKeys()}
            defaultOpenKeys={sideNavItems
              .filter((s) => s.open)
              .map((s) => s.key)}
          >
            {user
              ? sideNavItems.map((s) => (
                  <SubMenu key={s.key} title={<b>{s.name}</b>}>
                    {!!s.children &&
                      s.children.map((c) => (
                        <Menu.Item key={c.key}>
                          {c.url ? (
                            <Link href={c.url}>
                              <a>{c.name}</a>
                            </Link>
                          ) : (
                            <span>{c.name}</span>
                          )}
                        </Menu.Item>
                      ))}
                  </SubMenu>
                ))
              : []}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          {!!breadCrumb && (
            <Breadcrumb style={{ margin: '16px 0' }}>
              {breadCrumb.map((b) => (
                <Breadcrumb.Item key={b.key}>
                  {b.url ? (
                    <Link href={b.url}>
                      <a>{b.name}</a>
                    </Link>
                  ) : (
                    <span>{b.name}</span>
                  )}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          )}

          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
              height: `calc(100vh - ${$headerHeight} - 53px - 24px)`,
              overflow: 'scroll'
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default PageLayout
