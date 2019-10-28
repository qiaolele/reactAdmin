import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form,Input,Select} from 'antd'

const Item = Form.Item;
const Option = Select.Option;
// 添加分类的form组件
class AddForm extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired,//一级分类列表
    parentId: PropTypes.string.isRequired, // 父分类的ID
    setForm:PropTypes.func.isRequired,//传递form对象的函数
  }
  componentWillMount(){
      //准备将form对象通过setForm()方法传递给父组件
    this.props.setForm(this.props.form);
  }
  render() {
    //得到一个Form对象
    const {getFieldDecorator} = this.props.form;
    const {categorys,parentId} = this.props;
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('parentId',{
              initialValue:parentId//知道默认值——动态选中匹配的分类
            })(
              <Select>
                <Option value='0'>一级分类</Option>
                {
                  categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item>
        {
            getFieldDecorator('categoryName',{
              initialValue:'',//知道默认值
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

export default Form.create()(AddForm)
