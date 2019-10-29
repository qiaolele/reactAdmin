import React, { Component } from 'react'
import {Card,Button,Icon,Table} from 'antd'
import { PAGE_SIZE } from '../../utils/constant'
// 角色管理路由
export default class Role extends Component {
  state = {
    roles:[
      {
        name:'发送到',
        create_time:'23535345',
        auth_time:'24424',
        auth_name:'乔乐乐'
      },
      {
        name:'发送到1',
        create_time:'235353451',
        auth_time:'244241',
        auth_name:'乔乐乐1'
      }
    ],
  }
  initColumn= () =>{
    this.columns = [
      {
        titile:'角色名称',
        dataIndex:'name',
      },
      {
        titile:'创建时间',
        dataIndex:'create_time',
      },
      {
        titile:'授权时间',
        dataIndex:'auth_time',
      },
      {
        titile:'授权人',
        dataIndex:'auth_name',
      }

    ]
  }
  componentWillMount =()=>{
    this.initColumn();
  }
  render() {
    const title = (
      <span>
        <Button type="primary">创建角色</Button>&nbsp;&nbsp;
        <Button type="primary" disabled>设置角色权限</Button>
      </span>
    )
    const {roles} = this.state;
    return (
      <Card title={title}>
          <Table
            bordered
            dataSource={roles}
            columns = {this.columns}
            pagination={{defaultPageSize:PAGE_SIZE}}
            rowSelection={{type:'radio'}}//单选按钮配置
          ></Table>
      </Card>
    )
  }
}
