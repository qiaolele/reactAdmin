import React, { Component } from 'react'
import {Card,Table,Button,message,Modal} from 'antd'
import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import UserForm from './user-form'
import { PAGE_SIZE } from '../../utils/constant'
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api/index'

// 用户管理路由
export default class User extends Component {
  state = {
    users:[],//所有的用户列表
    roles:[],//所有角色列表
    isShow:false,//是否展示添加、修改用户弹窗
  }
  handleCancel=()=>{
    this.form.resetFields();//重置form对象
    this.setState({isShow:false})
  }
  initColumns = ()=>{
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render:(create_time) => formateDate(create_time)
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user)=>(
          <span>
            <LinkButton onClick={()=> this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={()=> this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ];
  }
  //根据role的数组生成包含所有角色名的对象（属性名用角色id值）
  initRoleNames=(roles) => {
    const roleNames = roles.reduce((pre,role)=>{
      pre[role._id] = role.name
      return pre
    },{})
    //保存起来
    this.roleNames = roleNames;
  }
  //获取用户列表数据
  getUsers= async()=>{
    const result = await reqUsers()
    if(result.status===0){
      const {users,roles} = result.data;
      this.initRoleNames(roles);
      this.setState({
        users,
        roles,
        isShow:false
      })
    }else{
      message.error('获取用户列表失败')
    }
  }
  //添加、修改用户发送请求
  addOrUpdateUser=async()=>{
    //收集输入数据
    // const user = this.form.getFieldsValue()//获取表单输入的信息——同values
    this.form.validateFields( async(err,values)=>{//7、获取表单输入的信息，进行校验
      console.log(values)
      if(!err){
        this.form.resetFields();
        const user = values;
        //如果是更新——需要给user指定_id属性
        if(this.user){
          user._id = this.user._id
        }
         //提交添加的请求
        const result = await reqAddOrUpdateUser(user)
        if(result.status===0){
          message.success(`${this.user?'修改':'添加'}用户成功!`)
          this.setState({isShow:false})
          //更新列表显示
          this.getUsers();
        }else{
          message.error(`${this.user?'修改':'添加'}用户失败!`)
        }
      }
    })
  }
  //显示添加弹窗
  showAdd=()=>{
    this.user = null;
    this.setState({
      isShow: true
    })
  }
  //展示修改弹窗——并传入user
  showUpdate=(user)=>{
    this.user = user //保存user——标识是否进行修改
    this.setState({
      isShow:true
    })
  }
  //删除指定用户
  deleteUser= (user)=>{
    Modal.confirm({
      title:`确认删除${user.username}吗?`,
      onOk: async()=>{
        const result = await reqDeleteUser(user._id)
        if(result.status===0){
          message.success("删除用户成功!")
          this.getUsers();
        }else{
          message.error("删除用户失败!")
        }
      }
    })
  }
  componentWillMount(){
    this.initColumns();
  }
  //获取用户列表
  componentDidMount = ()=>{
    this.getUsers();
  }
  render() {
    const {isShow,users,roles} = this.state;
    const user = this.user || {}
    const title= (
      <Button type="primary" onClick={this.showAdd}>创建用户</Button>
    )
    return (
      <Card title={title}>
          <Table
            rowKey="_id"
            dataSource={users}
            columns={this.columns}
            bordered={true}
            pagination={{defaultPageSize:PAGE_SIZE}}
          >
          </Table>
          <Modal
            title={user._id ? '修改用户' : '添加用户'}
            visible={isShow}
            onOk={this.addOrUpdateUser}
            onCancel={this.handleCancel}
          >
            <UserForm setForm={form => this.form=form} roles={roles} user={user}></UserForm>
            {/* 6、使用setForm 拿到子组件传递过来的ref（官方写法） */}
          </Modal>

      </Card>
    )
  }
}
