 import React, { Component } from 'react'
 import { 
   Form, 
   Icon, 
   Input, 
   Button,
   message
  } from 'antd';
 import './login.less'
 import logo from '../../assets/images/logo.png'
 import {reqLogin} from '../../api/index';
 import {Redirect} from 'react-router-dom'
 import memoryUtil from '../../utils/memoryUtil';
 import storageUtil from '../../utils/storageUtil'
 
 const Item = Form.Item;//不能写在import之前
//  登录的路由组件
 class Login extends Component{
  handleSubmit = (event)=>{
    //阻止事件的默认行为
    event.preventDefault();
    //对所有的表单字段进行校验——values是表单输入的数据（对象）
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        //如果校验成功
        // console.log('提交登录的ajax请求 ', values);
        // 请求登录
        const {username,password} = values;//解构赋值
        // reqLogin(username,password).then(response=>{
        //   console.log('成功了',response.data)
        // }).catch(error=>{
        //   console.log('失败了',error)
        // })
        const result = await reqLogin(username,password)//{status:0,data:user} {status:1,msg:提示信息}
        if(!result.status){//登录成功
          message.success('登录成功')
          //保存user
          console.log(result.data)//用户信息
          const user = result.data
          memoryUtil.user = user;//存在内存中
          storageUtil.saveUser(user)//保存到local中
          //跳转到管理界面——不需要再回退到登录页面，所以用replace，如果需要回来用push
          this.props.history.replace('/admin')
        }else{//登录失败
          message.error(result.msg)
        }
      }else{
        //校验失败
        console.log('校验失败')
      }
    });
    // //得到form对象
    // const form = this.props.form;
    // //获取表单项输入的数据
    // const values = form.getFieldsValue()
    // console.log('handleSubmit()',values)
  }
  // 对密码进行验证
  validatePwd=(rule,value,callback)=>{
    console.log('validatePwd()',rule,value);
    if(!value){
      callback('密码不能为空')
    }else if(value.length<4 || value.length>12){
      callback('密码长度不能小于4位大于12位')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback("密码必须是英文、数字、字母、下划线开头")
    }else{
      callback()//验证通过
    }
  }
   render (){
    const user = memoryUtil.user
    // 如果用户已经登录，自动跳转到登录页面
    if(user && user._id){
      // 自动跳转到登录页面——在render()中
      return <Redirect to='/' />
    }
     //得到具有强大功能的form对象——form
     const form = this.props.form 
     const { getFieldDecorator } = form;

     return (
       <div className="login">
         <header className="login-header">
           <img src={logo} alt=""/>
           <h1>React项目：后台管理系统</h1>
         </header>
         <section className="login-content">
           <h2>用户登录</h2>
           <Form onSubmit={this.handleSubmit} className="login-form">
              <Item>
                {
                  getFieldDecorator('username',{//配置对象：属性名是特定的一些名称
                  //声明式验证：直接使用别人定义好的验证规则进行验证
                    rules: [
                      { required: true,whitespace:true, message: '用户名必须输入' },
                      { min: 4, message: '用户名至少是4位' },
                      { max: 12, message: '用户名最多是12位' },
                      { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须以数字、字母、下划线开头' }
                    ],
                    initialValue:'admin',//指定初始值
                    validateTrigger: 'onBlur',
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="用户名"
                      disabled={true}
                    />
                  )
                }
              </Item>
              <Form.Item>
                {
                  getFieldDecorator('password',{
                    rules:[
                      {validator:this.validatePwd}
                    ],
                    validateTrigger: 'onBlur',
                  })(
                    <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                    />
                  )
                }
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
                </Button>
              </Form.Item>
            </Form>
         </section>
       </div>
     )
   }
 }

/* 
1、高阶函数
  1）一类特别的函数：
      a.接收函数类型的参数
      b.返回值是函数
  2）常见的：
      a.定时器——setTimeout()、setInterval()
      b.Promise：Promise(()=>{}) then(value=>{},reason=>{})
      c.数组变量相关的方法：forEach()、filter()、map()、reduce()、find()、findindex()
      d.函数对象的bind()
  3）高阶函数更新动态，更加就有扩展性
    
2、高阶组件
  1）本质就是一个函数
  2）接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
  3）作用：扩展组件的功能
  4）高阶组件也是高阶函数：接收一个组件函数，返回一个新的组件函数
*/
// 包装Form组件生成一个新的组件Form(login)——新组件会向Form组件传递一个强大的对象属性：from
 const WrapLogin = Form.create()(Login)
 export default WrapLogin;
/* 
  1、前台表单验证
  2、收集表单输入数据
*/

/* 
  async 和 await
  1、作用？
     简化promise对象的使用：不用再使用.then()来指定成功或者失败的函数
     以同步编码方式实现异步流程
  2、哪里写async？
     await所在函数（最近的）定义的左侧
  3、哪里写await？
     在返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功的value数据
*/
