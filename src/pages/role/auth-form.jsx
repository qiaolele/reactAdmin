import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form,Input,Tree} from 'antd'
import menuList from '../../config/menuConfig'
const { TreeNode } = Tree;
const Item = Form.Item;
// 添加分类的form组件
export default class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object
  }
  getTreeNodes = (menuList) =>{
    return menuList.reduce((pre,item)=>{
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    },[])
  }
  componentWillMount(){
    this.treeNodes = this.getTreeNodes(menuList)
  }
  render() {
    //得到一个Form对象
    const {role} = this.props;
    const formItemLayout = {
      labelCol: {span:4},
      wrapperCol: {span:15}
    }
    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
            <Input placeholder="请输入角色名称" value={role.name} disabled></Input>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
            {/* <TreeNode title="parent 1-0" key="0-0-0" >
              <TreeNode title="leaf" key="0-0-0-0"  />
              <TreeNode title="leaf" key="0-0-0-1" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title={<span>sss</span>} key="0-0-1-0" />
            </TreeNode> */}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}
