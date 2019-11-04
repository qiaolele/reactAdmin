import React, { Component,PureComponent } from 'react'
import { Button } from 'antd'
// 折现图路由
export default class Line extends Component {
  state={
    m1: {count: 1}
  }
  test1 = ()=>{
    // this.setState(state=>({
    //   m1: {count:state.m1.count + 1}
    // }))
    // const m1 = this.state.m1
    // m1.count = 2;
    // // this.setState({m1})//浅复制
    // this.setState({m1:{...m1}})//深拷贝了一个对象m1
    this.setState({})
  }
  
  render() {
    console.log('A render()')
    return (
      <div>
        <h1>A组件：m1={this.state.m1.count}</h1>
        <Button type="primary" onClick={this.test1}>A 测试1</Button>
        <B m1={this.state.m1}></B>
      </div>
    )
  }
}

class B extends PureComponent {
  state={
    m2:1
  }
  test2 = ()=>{
    this.setState({})
  }
  // 用来决定当前组件是否应该重新render()更新，如果返回true：会重新render(),否则结束
  // shouldComponentUpdate(nextProps,nextState){//接收的属性，状态数据
  //   console.log(nextProps,nextState)
  //   //比较新旧props中的和state中的数据，如果没有一个变化的返回false，否则返回true
  //   if(this.props.m1 === nextProps.m1 && this.state.m2 === nextState.m2){
  //     return false;
  //   }else{
  //     return true//shouldComponentUpdate——默认返回true——总是会进行更新
  //   }
  // }
  render() {
    console.log('B render()')
    return (
      <div>
        <h1>B组件：m2={this.state.m2},m1.count={this.props.m1.count}</h1>
        <Button type="primary" onClick={this.test2}>B 测试2</Button>
      </div>
    )
  }
}
