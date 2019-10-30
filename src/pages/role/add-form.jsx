import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form,Input} from 'antd'

const Item = Form.Item;
// 添加分类的form组件
class AddForm extends Component {
  static propTypes = {
    setForm:PropTypes.func.isRequired,//传递form对象的函数
  }
  componentWillMount(){
      //准备将form对象通过setForm()方法传递给父组件
    this.props.setForm(this.props.form);
  }
  render() {
    //得到一个Form对象
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span:4},
      wrapperCol: {span:15}
    }
    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
        {
            getFieldDecorator('roleName',{
              initialValue:'',//指定默认值
              rules:[
                {required : true, message : '角色名称必须输入'}
              ]
            })(
              <Input placeholder="请输入角色名称"></Input>
            )
          }
        </Item>
        
      </Form>
    )
  }
}

export default Form.create()(AddForm)
