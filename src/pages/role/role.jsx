import React, { Component } from 'react'
import {Card,Button,Modal,Table, message} from 'antd'
import { PAGE_SIZE } from '../../utils/constant'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api/index'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'
import {formateDate} from '../../utils/dateUtils'
// 角色管理路由
export default class Role extends Component {
  state = {
    roles:[],//所有角色的列表
    role:{},//选中的role
    isShowAdd:false,//是否显示添加弹窗
    isShowAuth:false,//是否显示设置权限弹窗
  }
  constructor(props){
    super(props)
    this.auth = React.createRef();
  }
  initColumn= () =>{
    this.columns = [
      {
        title:'角色名称',
        dataIndex:'name',
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        render:(create_time) => formateDate(create_time)
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        render:formateDate
      },
      {
        title:'授权人',
        dataIndex:'auth_name',
      }

    ]
  }
  //获取角色列表
  getRoles= async ()=>{
    const result = await reqRoles()
    if(result.status ===0){
      const roles = result.data;
      this.setState({
        roles
      })
    }else{
      message.success("获取列表失败")
    }
  }
  onRow =(role)=>{
    return {
      onClick: event => {
        this.setState({
          role
        })
      }, // 点击行
      onDoubleClick: event => {},
      onContextMenu: event => {},
      onMouseEnter: event => {}, // 鼠标移入行
      onMouseLeave: event => {},
    };
  }
  //添加角色
  addRole= async ()=>{
    //先进行表单验证，只有通过了，才处理掉接口
      this.form.validateFields(async (err,values)=>{
        if(!err){
            const {roleName} = values;//解构
            //重置所有的置入项——清楚数据
            this.form.resetFields()
            // 1、发请求更新；
            const result = await reqAddRole(roleName)
            if(result.status===0){//成功
              message.success('添加角色成功')
              //2、关闭弹窗；
              this.setState({isShowAdd:false})
              //新产生的角色
              const role = result.data;
              //更新roles状态——基于原本的状态数据更新——使用函数的方式来更新
              this.setState(state=> ({
                roles: [...state.roles,role]
              }))
              //对象的更新方式适合——更新的数据和之前的没有关系
              // this.setState({})
              // //3重新显示列表
              // this.getRoles();
            }else{
              message.success('添加角色失败')
            }
        }
    })
  }
  //更新角色
  updateRole = async ()=>{
    const role = this.state.role;
    //得到最新的menus
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_time = Date.now();
    role.auth_name = memoryUtil.user.username;
    //请求接口更新数据
    const result = await reqUpdateRole(role);
    if(result.status === 0){
      //2、关闭弹窗；
      this.setState({isShowAuth:false})
      //如果当前更新的是自己角色的权限，强制退出到登录页面
      if(role._id === memoryUtil.user.role_id){
        memoryUtil.user = {}
        storageUtil.removeUser()
        this.props.history.replace('/login');
        message.success('当前用户角色权限已修改，请重新登录')
      }else{
        message.success('设置角色权限成功')
        //获取角色列表
        this.getRoles();
      }
    }else{
      message.error('设置角色权限失败')
    }
  }
  handleCancel=()=>{
    this.setState({
      isShowAdd:false,
      isShowAuth:false
    })
  }
  componentWillMount =()=>{
    this.initColumn();
  }
  componentDidMount=()=>{
    this.getRoles();
  }
  render() {
    const {roles,role,isShowAdd,isShowAuth} = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={()=> this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
        <Button type="primary" onClick={()=> this.setState({isShowAuth: true})} disabled={!role._id}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
          <Table
            bordered
            dataSource={roles}
            columns = {this.columns}
            rowKey='_id'
            pagination={{defaultPageSize:PAGE_SIZE}}
            rowSelection={{
              type:'radio',
              selectedRowKeys:[role._id],
              onSelect: (role) => { // 选择某个radio时回调
                this.setState({
                  role
                })
              }
            }}//单选按钮配置
            onRow ={this.onRow}
          ></Table>
          <Modal
            title="添加角色"
            visible={isShowAdd}
            onOk={this.addRole}
            onCancel={this.handleCancel}
          >
          <AddForm
              setForm={(form)=>{this.form=form}}
          ></AddForm>
          </Modal>
          <Modal
            title="设置角色权限"
            visible={isShowAuth}
            onOk={this.updateRole}
            onCancel={this.handleCancel}
          >
          <AuthForm role={role} ref={this.auth}></AuthForm>
          </Modal>
      </Card>
    )
  }
}
