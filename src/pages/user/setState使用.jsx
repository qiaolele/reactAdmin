import React, { Component } from 'react'
import {Button} from 'antd'
// 用户管理路由
export default class User extends Component {
  state = {
    count: 0
  }
  //函数方式调用——如果新状态依赖原状态
  test1= () =>{
    this.setState(state => ({count:state.count+1}))
    console.log('test1 setState()之后',this.state.count)//此时state里面的count还是之前的，没有及时更新
  }
  //对象方式调用——如果新状态不依赖原状态
  test2= () =>{
    // const count = this.state.count+1;
    // this.setState({ count })
    this.setState({
      count: 3
    })
    console.log('test2 setState()之后',this.state.count)//此时state里面的count还是之前的，没有及时更新
  }
  test3= () =>{
    this.setState(state => ({count:state.count+1}), ()=>{//在状态更新且界面更新之后回调
      console.log('test3 setState()之后 callBack调用的',this.state.count)//此时state里面的count已经更新成最新的值了
    })
  }
  //react事件监听回调中——setState()是异步更新状态
  update1= ()=>{
    console.log('update1 setState()之前',this.state.count)
    this.setState(state => ({count:state.count+1}))
    console.log('update1 setState()之后',this.state.count)
  }
  // 定时器回调函数、原生事件监听回调、promise回调
  update2 = ()=>{
    setTimeout(()=>{
      console.log('setTimeout setState()之前',this.state.count)
      this.setState(state => ({count:state.count+1}))
      console.log('setTimeout setState()之后',this.state.count)
    })
  }
  update3 = ()=>{
    const h2 = this.refs.count
    h2.onclick = ()=>{
      console.log('onclick setState()之前',this.state.count)
      this.setState(state => ({count:state.count+1}))
      console.log('onclick setState()之后',this.state.count)
    }
  }
  update4 = ()=>{
    Promise.resolve().then(value=>{
      console.log('Promise setState()之前',this.state.count)
      this.setState(state => ({count:state.count+1}))
      console.log('Promise setState()之后',this.state.count)
    })
  }
  update5 = ()=>{
    console.log('函数方式调用 setState()之前',this.state.count)
    this.setState(state => ({count: state.count + 1}))
    console.log('函数方式调用 setState()之后',this.state.count)
    console.log('函数方式调用 setState()之前2',this.state.count)
    this.setState(state => ({count: state.count + 1}))
    console.log('函数方式调用 setState()之后2',this.state.count)
  }
  update6 = ()=>{
    console.log('对象方式调用 setState()之前',this.state.count)
    this.setState({count: this.state.count + 1})
    console.log('对象方式调用 setState()之后',this.state.count)
    console.log('对象方式调用 setState()之前2',this.state.count)
    this.setState({count: this.state.count + 1})
    console.log('对象方式调用 setState()之后2',this.state.count)
  }
  update7 = ()=>{
    console.log('对象方式调用 setState()之前',this.state.count)
    this.setState({count: this.state.count + 1})
    console.log('对象方式调用 setState()之后',this.state.count)
  }
  //react生命周期回调函数中(钩子)——setState()是异步更新状态
  componentDidMount(){//——第一次render之后调用
    console.log('update1 setState()之前',this.state.count)
    this.setState(state => ({count:state.count+1}))
    console.log('update1 setState()之后',this.state.count)
  }
  
  render() {
    const {count} = this.state;
    console.log('A render()', count)
    return (
      <div>
        <h1 ref="count">count值为：{count}</h1>
        <Button type="primary" onClick={this.test1}>A 测试1 函数方式</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={this.test2}>A 测试2 对象方式</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={this.test3}>A 测试3</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <br/>
        <br/>
        <Button type="primary" onClick={this.update1}>更新1</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={this.update2}>更新2</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={this.update3}>更新3</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={this.update4}>更新4</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <br/>
        <br/>
        <Button type="primary" onClick={this.update5}>更新5</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={this.update6}>更新6</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" onClick={this.update7}>更新7</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;



      </div>
    )
  }
}
