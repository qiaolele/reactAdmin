import React, { Component } from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import {Layout} from 'antd';
import memoryUtil from '../../utils/memoryUtil'
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Home from '../home/home';
import Category from '../category/category';
import Role from '../role/role';
import Product from '../product/product';
import User from '../user/user';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';

const {Footer,Sider,Content} = Layout;
//  后台管理的路由组件
 export default class Admin extends Component{
   render (){
    const user = memoryUtil.user
    // 如果内存中没有存储user====》没有登录——自动跳转到登录页面
    if(!user || !user._id){
      // 自动跳转到登录页面——在render()中
      return <Redirect to='/login' />
    }
     return (
       <Layout style={{height:'100%'}}>
          <Sider>
            <LeftNav />
          </Sider>
          <Layout>
            <Header>Header</Header>
            <Content style={{backgroundColor:'#fff',margin:'20px'}}>
                <Switch>
                    <Route path="/home" component={Home}></Route> 
                    <Route path="/category" component={Category}></Route> 
                    <Route path="/product" component={Product}></Route> 
                    <Route path="/user" component={User}></Route> 
                    <Route path="/role" component={Role}></Route> 
                    <Route path="/charts/bar" component={Bar}></Route> 
                    <Route path="/charts/line" component={Line}></Route> 
                    <Route path="/charts/pie" component={Pie}></Route> 
                    <Redirect to="/home" />
                </Switch>
            </Content>
            <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
          </Layout>
        </Layout>
     )
   }
 }