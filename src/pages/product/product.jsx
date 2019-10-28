import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './product.less'
// 首页路由
export default class Product extends Component {
  render() {
    return (
      <Switch>
          {/* exact路径完全匹配 */}
          <Route path="/product" component={ProductHome} exact></Route> 
          <Route path="/product/addUpdate" component={ProductAddUpdate} exact></Route> 
          <Route path="/product/detail" component={ProductDetail} exact></Route> 
          <Redirect to="/product"></Redirect>
      </Switch>
    )
  }
}
