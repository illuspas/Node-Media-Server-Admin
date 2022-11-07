import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Redirect, Switch } from "react-router-dom";
import { Icon, Layout, Menu } from 'antd';
import { createBrowserHistory } from 'history';
import Dashboard from "./containers/dashBoard/Dashboard";
import Profile from "./containers/profile/Profile";
import Streams from "./containers/streams/Streams";
import { isAuthenticated } from './utils/Util'

import "./App.css"
import { Login } from './containers/login/Login';
import { PrivateRoute } from './routers/PrivateRoute';
import { LOGOUT_URL } from './config/env';


const { Header, Sider, Content, Footer } = Layout;

class App extends Component {
    

    fullTitle = "NodeMediaServer";

    shortTitle = "NMS";

    state = {
        collapsed: false,
        title: this.fullTitle,
        pathname: "/"
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            title: this.state.collapsed ? this.fullTitle : this.shortTitle,
        });
    }
    logout = () => {
        fetch(LOGOUT_URL, {method: 'POST'})
        sessionStorage.clear()
    }

    UNSAVE_componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps, nextContext);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/admin/login" component={Login} />
                    <PrivateRoute path="/admin">
                        <Layout style={{ minHeight: "100vh" }}>
                            <Sider
                                width={256}
                                trigger={null}
                                collapsible
                                collapsed={this.state.collapsed}>

                                <div className="logo"><h1>{this.state.title}</h1></div>

                                <Menu theme="dark" mode="inline"
                                    defaultSelectedKeys={[createBrowserHistory().location.pathname]}
                                >
                                    <Menu.Item key="/admin/dashboard">
                                        <Link to="/admin/dashboard">
                                            <Icon type="dashboard" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="/admin/streams">
                                        <Link to="/admin/streams">
                                            <Icon type="video-camera" />
                                            <span>Streams</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="/admin/profile">
                                        <Link to="/admin/profile">
                                            <Icon type="profile" />
                                            <span>Profile</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item style={{ backgroundColor: '#6d76b7' }} key="/logout" onClick={this.logout}>
                                        <Link to="/admin/login">
                                            <Icon type="logout" />
                                            <span>logout</span>
                                        </Link>
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
                                <Content style={{
                                    margin: '24px 16px', minHeight: 280,
                                }}>
                                    <Switch>
                                        <Route path="/admin/dashboard" component={Dashboard} />
                                        <Route path="/admin/streams" component={Streams} />
                                        <Route path="/admin/profile" component={Profile} />
                                    </Switch>
                                </Content>
                                <Footer style={{ textAlign: 'center' }}>
                                    Stream-Server
                                </Footer>
                            </Layout>

                        </Layout>
                    </PrivateRoute>
                </Switch>

            </Router>
        );
    }

}

export default App;
