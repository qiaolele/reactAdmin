import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import {Menu,Icon} from 'antd';
import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig';
import memoryUtil from '../../utils/memoryUtil';

const SubMenu = Menu.SubMenu;//菜单和菜单项

class LeftNav extends Component {
  // submenu keys of first level
  constructor() {  
    super();  
    this.state = {
        openKeys: [''],
    };
  }
  onOpenChange(openKeys){
    //反复点击当前一个菜单组
    if(openKeys.length === 1 || openKeys.length === 0){
      this.setState({ openKeys });
      console.log(this.state.openKeys)
      return 
    }
    //二次操作展开最新的菜单['xxx','xxx1']
    const latestOpenKey = openKeys[openKeys.length-1]
    //如果点击的还是同一个
    if(latestOpenKey.includes(openKeys[0])){
      this.setState({ openKeys });
    }else{
      this.setState({
        openKeys:[latestOpenKey]
      });
    }
  }
  //判断当前登录用户对item是否有权限
  hasAuth=(item)=>{
    const {key, isPublic} = item
    const menus = memoryUtil.user.role.menus//当前用户的菜单数组
    const username = memoryUtil.user.username;
    // 1、如果当前用户是admin——不需要判断，直接返回true
    // 2、当前用户有此item的权限：key有没有在menus中
    // 3、如果当前用户有此item的权限，key有没有menus中
    if(username === 'admin' || isPublic || menus.indexOf(key)!==-1){
      return true;
    }else if(item.children){//4、如果当前用户有此item的某个子item的权限——也显示
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)//强制类型转换成布尔值//证明他的子路由出现了，返回ture，否则返回false
    }
    return false;
  }
  //根据menu的数据数组生成对应的标签数组
  //使用map()+递归调用
  getMenuNodes = (menuList)=>{
      const path = this.props.location.pathname;
      return menuList.map(item=>{
        /*
          {
              title: '首页', // 菜单标题名称
              key: '/home', // 对应的path
              icon: 'home', // 图标名称
              isPublic: true, // 公开的
              children:[]//有时候有有时候没有
            }
        */
       //如果当前用户有item对应的权限——才需要显示添加对应的菜单项
        if(this.hasAuth(item)){
          if(!item.children){
              return (
                <Menu.Item key={item.key}>
                  <Link to={item.key}>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                  </Link>
                </Menu.Item>
              )
          }else{
            // const cItem = item.children.find(cItem=> cItem.key === path) 
            const cItem = item.children.find(cItem=> path.indexOf(cItem.key) === 0)//优化上面的，可以让子路由匹配到当前路由下面，刷新后依然高亮
            if(cItem){
              //如果存在，说明当前item的子列表需要展开
              this.setState({
                openKeys: [item.key],
              });
              // this.openKey = item.key
            }
            return(
              <SubMenu
                  key={item.key}
                  title={
                    <span>
                      <Icon type={item.icon} />
                      <span>{item.title}</span>
                    </span>
                  }
                >
                {this.getMenuNodes(item.children)}
                </SubMenu>
            )
          }
        }
      })
  }
  
//在第一次render()之前执行一次，为第一次render()准备数据(同步)
  componentWillMount(){
    this.menuNodes = this.getMenuNodes(menuList);
  }
  render() {
    //得到当前请求的路由路径
    let path = this.props.location.pathname;
    if(path.indexOf('/product') === 0){//他或者他的子路由例如：/product，/product/detail，/product/addUpdate都要匹配
      path = '/product'
    }
    console.log('render()',path)
    //得到需要打开菜单项的key
    // const openKey = this.openKey;
    return (
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
            <img src={logo} alt=""/>
            <h1>管理后台</h1>
        </Link>
        <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[path]}
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange.bind(this)}
          >
          {
            this.menuNodes
          }
          {/* 
            <Menu.Item key="1">
              <Link to="/home">
                <Icon type="home" />
                <span>首页</span>
              </Link>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="mail" />
                  <span>商品</span>
                </span>
              }
            >
              <Menu.Item key="2">
                <Link to="/category">
                  <Icon type="bars" />
                  <span>品类管理</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/product">
                  <Icon type="tool" />
                  <span>商品管理</span>   
                </Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="4">
              <Link to="/user">
                <Icon type="user" />
                <span>用户管理</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/role">
                <Icon type="safety-certificate" />
                <span>角色管理</span>
              </Link>
            </Menu.Item>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="area-chart" />
                  <span>图形图表</span>
                </span>
              }
            >
              <Menu.Item key="7">
                <Link to="/charts/bar">
                  <Icon type="bar-chart" />
                  <span>柱形图</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="8">
                <Link to="/charts/line">
                  <Icon type="line-chart" />
                  <span>折线图</span>   
                </Link>
              </Menu.Item>
              <Menu.Item key="9">
                <Link to="/charts/pie">
                  <Icon type="pie-chart" />
                  <span>饼图</span>  
                </Link>
              </Menu.Item>
            </SubMenu>
            */}
          </Menu>
      </div>
      
    )
  }
}
// withRouter()是高级组件：包装非路由组件，返回一个新的组件，新的组件向非路由组件传递3个属性
//histroy、location、match
export default withRouter(LeftNav)
