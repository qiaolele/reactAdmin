import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {Form,Input,Tree} from 'antd'
import menuList from '../../config/menuConfig'
const Item = Form.Item;
const { TreeNode } = Tree;
// 添加分类的form组件
export default class AuthForm extends PureComponent {
  static propTypes = {
    role: PropTypes.object,
  }
  constructor(props){
    super(props)
    //根据传入的角色生成勾选状态
    const {menus} = this.props.role;
    this.state ={
      checkedKeys: menus
    }
  }
  getTreeNodes = (menuList) =>{
    return menuList.map((item,index) =>{
        return (
          <TreeNode title={item.title} key={item.key}>  
            {item.children ? this.getTreeNodes(item.children) : null}
          </TreeNode>
        )
    })
    // return menuList.reduce((pre,item)=>{
    //   pre.push(
    //     <TreeNode title={item.title} key={item.key}>
    //       {item.children ? this.getTreeNodes(item.children) : null}
    //     </TreeNode>
    //   )
    //   return pre
    // },[])
  }
  //为父组件提交获取最新menus数据的方法
  getMenus= () =>  this.state.checkedKeys
  //选中某个节点时的回调
  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };
  componentWillMount(){
    this.treeNodes = this.getTreeNodes(menuList)
  }
  //根据新传入的role来更新checkedKeys状态
  // 当组件接收到新的属性时自动调用
  componentWillReceiveProps(nextProps){
    console.log('componentWillReceiveProps()',nextProps)
    const menus = nextProps.role.menus 
    this.setState({
      checkedKeys: menus
    })
  }
  render() {
    console.log('AuthForm render()')
    //得到一个Form对象
    const {role} = this.props;
    const {checkedKeys} = this.state;
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
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
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
