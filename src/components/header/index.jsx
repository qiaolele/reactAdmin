import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import './index.less'
import {reqWeather} from '../../api/index'
import {formateDate} from'../../utils/dateUtils'
import LinkButton from '../link-button/index'
import menuList from '../../config/menuConfig'
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'
import { Modal } from 'antd'
class Header extends Component {
  state={
    currentTime:formateDate(Date.now()),//当前时间字符串
    dayPictureUrl:'',//天气图片
    weather:''//天气文本
  }
  getTime=()=>{
    //每隔1s去获取当前时间，并更新状态数据currentTime
    this.intervalId = setInterval(()=>{
      const currentTime=formateDate(Date.now())//当前时间字符串
      this.setState({currentTime})
    },1000)
  }
  getWeather=async()=>{
    //调用接口请求异步天气信息
    const {dayPictureUrl,weather} = await reqWeather('北京')
    //更新数据
    this.setState({dayPictureUrl,weather})
  }
  getTitle= () =>{
    //得到当前请求路径
    const path = this.props.location.pathname
    let title
    //去找到对应的title
    menuList.forEach(item => {
      if(item.key === path){//如果当前item对象的key（路径）与path匹配，说明item.title就是要展示的title
        title = item.title
      }else if(item.children){
        //所有子item中查找匹配的
        const cItem = item.children.find(cItem => cItem.key===path);
        //如果有值才说明有匹配的
        if(cItem){
          //取出他的title
          title = cItem.title;
        }
      }
    })
    return title;
  }
  logout =()=>{
    //退出登录——1显示确认框，2清楚缓存
    Modal.confirm({
      title: '',
      content: '确定退出吗？',
      onOk:()=> {
        console.log('确认')
        //去清楚缓存数据user
        storageUtil.removeUser();
        memoryUtil.user={};
        //跳转到login页面
        this.props.history.replace('/login')
      },
      onCancel() {
        console.log('取消')
      },
    });
  }
  //第一次render（）之后执行一次，一般在此执行异步操作——发ajax请求、启动定时器
  componentDidMount(){
      //启动定时器——获取当前时间
      this.getTime()
      //获取当前天气
      this.getWeather()
  }
  //当前组件销毁之前调用
  componentWillUnmount(){
    //清楚定时器
    clearInterval(this.intervalId)
  }
  //不能这样做，这样不会更新显示，每次切换都是老值
  // componentWillMount(){
  //     this.title = this.getTitle();
  // }
  render() {
    const {currentTime,dayPictureUrl,weather} = this.state
    const username = memoryUtil.user.username;
    const title = this.getTitle();//这样会更新显示
    return (
      <div className="header">
          <div className="header-top">
              <span>欢迎，{username}</span>
              <LinkButton onClick={this.logout}>退出</LinkButton>
          </div>
          <div className="header-bottom">
              <div className="header-bottom-left">
                {title}
              </div>
              <div className="header-bottom-right">
                  <span>{currentTime}</span>
                  <img src={dayPictureUrl} alt="weather"/>
                  <span>{weather}</span>
              </div>
          </div>
      </div>
    )
  }
}

export default withRouter(Header)
