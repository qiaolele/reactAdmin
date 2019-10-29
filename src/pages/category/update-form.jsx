import React, { Component } from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item;
const Option = Select.Option;
// 更新分类的form组件
class UpdateForm extends Component {
  static propTypes = {
    categoryName:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  }
  componentWillMount(){
    //准备将form对象通过setForm()方法传递给父组件
    this.props.setForm(this.props.form);
  }
  render() {
    const {categoryName} = this.props;
    //得到一个Form对象
    const {getFieldDecorator} = this.props.form;
    return (
      <Form>
        <Item>
        {
            getFieldDecorator('categoryName',{
              initialValue:categoryName,//指定默认值
              rules:[
                {required : true, message : '分类名称必须输入'}
              ]
            })(
              <Input placeholder="请输入分类名称"></Input>
            )
          }
        </Item>
        
      </Form>
    )
  }
}

export default Form.create()(UpdateForm)
