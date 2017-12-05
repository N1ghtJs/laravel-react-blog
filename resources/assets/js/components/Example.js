import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon } from 'antd';
const { Header, Sider, Content } = Layout;
import styles from "./Example.css"

class SiderLayout extends React.Component {
  state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    return (
      <Layout className="sider-layout">
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="edit" />
              <span>文章管理</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="user" />
              <span>用户管理</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="setting" />
              <span>网站管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            Content
          </Content>
        </Layout>
      </Layout>
    );
  }
}

if (document.getElementById('example')) {
    ReactDOM.render(<SiderLayout />, document.getElementById('example'));
}
