// 应用的根组件
import React, { Component } from 'react'
// import { Button,message,Input } from 'antd';
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Login from './pages/login/login';
import Admin from './pages/admin/admin';

export default class App extends Component{
  // handleClick = ()=>{
  //   message.info('成功啦……');
  // }
  render(){
    return (
      // <div><Button type="primary" onClick={this.handleClick}>Primary</Button><Input placeholder="Basic usage" /></div>
      <BrowserRouter>
        <Switch>{/*只匹配一个 */}
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }

}