import React, { PureComponent } from 'react'
import {Form,Input,Select} from 'antd'
import {PropTypes} from 'prop-types'
const Item = Form.Item;
const Option = Select.Option;
// 添加、修改用户的form组件
class UserForm extends PureComponent {
  static propTypes ={
    setForm:PropTypes.func.isRequired,  //4、用来接收父组件传递过来的form对象的函数
    roles:PropTypes.array.isRequired,  //用来接收父组件传递过来的角色数组
    user:PropTypes.object
  }

  componentWillMount(){
    this.props.setForm(this.props.form) //5、将form对象输入的内容传给父组件
  }
  
  render() {
    const {roles} = this.props
    const user = this.props.user
    const {getFieldDecorator} = this.props.form //2、将getFieldDecorator 解构出来，用于和表单进行双向绑定
    const formItemLayout = {
      labelCol: {span:4},
      wrapperCol: {span:15}
    }
    return (
      <Form {...formItemLayout}>
        <Item label="用户名">
          {
            getFieldDecorator('username',{      //3、getFieldDecorator 的使用方法，这种写法真的很蛋疼
              initialValue:user.username,
              rules:[
                {required: true, message: '姓名必须输入'}
              ]
            })(
              <Input placeholder="请输入用户名"></Input>
            )
          }
        </Item>
        {
          user._id ? null : (
            <Item label="密码">
            {
              getFieldDecorator('password',{
                initialValue:user.password,
                rules:[
                  {required:true,message:'密码不能为空'}
                ]
              })(
                <Input type="password" placeholder="请输入密码"></Input>
              )
            }
          </Item>
          )
        }
        <Item label="手机号">
          {
            getFieldDecorator('phone',{
              initialValue:user.phone,
              rules:[
                {required:true,message:'手机号不能为空'}
              ]
            })(
              <Input placeholder="请输入手机号"></Input>
            )
          }
        </Item>
        <Item label="邮箱">
          {
            getFieldDecorator('email',{
              initialValue:user.email,
              rules:[
                {required:true,message:'请输入邮箱'}
              ]
            })(
              <Input placeholder="请输入邮箱"></Input>
            )
          }
        </Item>
        <Item label="角色">
          {
            getFieldDecorator('role_id',{
              initialValue:user.role_id,
              rules:[
                {required:true,message:'请选择角色'}
              ]
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UserForm)  //1、创建form实例
