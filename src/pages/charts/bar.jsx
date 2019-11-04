import React, { Component } from 'react'
// 柱形图路由
export default class Bar extends Component {
  state ={
    count: 0,
  }
  componentDidMount(){
    this.setState({count: this.state.count + 1})
    console.log(this.state.count)//2--> 0
    this.setState({count: this.state.count + 1})
    console.log(this.state.count)//2--> 0

    // this.setState(state => ({count: state.count + 1}))
    // this.setState(state => ({count: state.count + 1}))
    // console.log(this.state.count)//3--> 0

    setTimeout(()=>{
      this.setState({count: this.state.count + 1})
      console.log('timeout', this.state.count)//10--> 6

      this.setState({count: this.state.count + 1})
      console.log('timeout',this.state.count)//12--> 7
    },0)

    // Promise.resolve().then(value => {//Promise是同步的
    //   this.setState({count: this.state.count + 1})
    //   console.log('promise :', this.state.count)//6--> 4

    //   this.setState({count: this.state.count + 1})
    //   console.log('promise :', this.state.count)//8--> 5
    // })
  }
  render() {
    return null
    // const count = this.state.count
    // console.log('render', count)//1--> 0  //4--> 3  //5--> 4  //7--> 5  //9--> 6  //11--> 7
    // return (
    //   <div>
    //   <p>{count}</p>
    //   </div>
    // )
  }
}
