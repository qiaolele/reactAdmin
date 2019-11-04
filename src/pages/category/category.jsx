import React, { Component } from 'react'
import {Card,Button,Table,Icon, message,Modal} from 'antd';
import LinkButton from '../../components/link-button'
import {reqCategorys,reqUpdateCategory,reqAddCategory}  from '../../api/index'
import {PAGE_SIZE} from '../../utils/constant'
import AddForm from './add-form'
import UpdateForm from './update-form'
// 商品分类路由
import './category.less';
export default class Category extends Component {
  state = {
    categorys:[],//一级分类列表
    loading:false,//加载中——是否正在加载
    subCategorys:[],//二级分类列表
    parentId:'0',//当前需要显示的分类列表的parentId
    parentName:'',//当前需要显示的分类列表名称
    showStatus:0,//标识添加、更新的确认框是否展示;0:都不显示，1：显示添加，2：显示更新
  }
  //初始化Table所有列的数组
  initColumns = ()=>{
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',//指定显示数据对应的属性名
        key: 'name',
        // render: text => <a>{text}</a>,
      },
      {
        title: '操作',
        key: 'action',
        width:300,
        align:'center',
        render: (category) => (//指定返回需要显示的标签
          <span>
            <LinkButton onClick={()=>{this.showUpdate(category)}}>修改分类</LinkButton>  
            {/* 如何向事件回调函数传递参数：先定义一个匿名函数，再在函数调用处理的函数并传入数据 */}
            {this.state.parentId==='0'?<LinkButton onClick={()=>{this.showSubCategorys(category)}}>查看子分类</LinkButton>:null}
          </span>
        ),
      },
    ];
  }
  // 异步获取一级分类列表展示
  // parentId:如果没有指定根据状态中的parentId请求，如果指定了就根据指定的发送请求
  getCategorys =async (parentId)=>{
    //请求前显示loading
    this.setState({loading:true})
    parentId = parentId || this.state.parentId
    //发异步ajax请求，获取数据——去获取一级或二级分类列表
    const result = await reqCategorys(parentId)
    //请求完成后，隐藏loading
    this.setState({loading:false})
    if(result.status===0){//成功了
      //取出分类数组数据（可能是一级的也可能是二级的）
        const categorys = result.data
        if(parentId === '0'){
          //更新状态——一级分类状态
          this.setState({
            categorys,
          })
          console.log('-------',this.state.categorys.length)
        }else{
          //更新状态——二级分类状态
          this.setState({
            subCategorys:categorys,
          })
        }
    }else{
      //失败
      message.error("获取分类列表失败")
    }
  }
  //显示一级分类列表
  showCategorys =()=>{
    //更新为显示一级列表的状态
      this.setState({
        parentId:'0',
        parentName:'',
        subCategorys:[],
      })
  }
  //显示二级分类列表——接收对应的一级分类对象的二级分类列表
  showSubCategorys = (category)=>{
      // 更新状态
      this.setState({
        parentId:category._id,
        parentName:category.name
      },()=>{//在状态更新前重新render()后执行
        //获取二级分类列表
        this.getCategorys()
      })
      // setState()不能立即获取最新的状态，因为setState()是异步更新状态的
      // this.getCategorys(category.parentId)——如果放在这里执行parentId始终为0，因为是异步的
  }
  //显示添加分类确认框
  showAdd = ()=>{
      this.setState({
        showStatus:1
      })
  }
  //展示更新分类确认框
  showUpdate =(category)=>{
    //保存分类对象
    this.category = category;
    //更新状态
    this.setState({
      showStatus:2
    })
  }
  //添加分类确认框
  addCategory = ()=>{
    this.form.validateFields(async (err,values)=>{
      if(!err){
        this.setState({
          showStatus:0
        })
        //准备数据
        // const {categoryName,parentId} = this.form.getFieldsValue();
        const {parentId,categoryName} = values
        //重置所有的置入项——清楚数据
        this.form.resetFields()
        // 2、发请求更新；
        const result = await reqAddCategory(categoryName,parentId)
        if(result.status===0){//成功
          // 添加的分类就是当前分类列表下的分类
          if(parentId === this.state.parentId){
            //3重新获取当前分类列表显示
            this.getCategorys();
          }else if(parentId === '0'){//在二级分类列表下面添加一级分类项，此时回到一级列表没有及时更新——要重新获取一级分类列表，但不需要显示一级分类列表
            this.getCategorys('0');
          }
        }else{
          message.error(result.msg)
        }
      }
    })
  }
  //更新分类确认框
  updateCategory = ()=>{
    //先进行表单验证，只有通过了，才处理掉接口
    this.form.validateFields(async (err,values)=>{
        if(!err){
            //1、关闭弹窗；
            this.setState({
              showStatus:0
            })
            //准备数据
            const categoryId = this.category._id;
            // const categoryName = this.form.getFieldValue('categoryName')——同下面
            const {categoryName} = values;//解构
            //重置所有的置入项——清楚数据
            this.form.resetFields()
            // 2、发请求更新；
            const result = await reqUpdateCategory({categoryId,categoryName})
            if(result.status==0){//成功
              //3重新显示列表
              this.getCategorys();
            }
        }
    })
  }
  //隐藏添加、更贵确认框
  handleCancel=()=>{
    //重置所有的置入项——清楚数据
    this.form.resetFields()
    //隐藏确认框
    this.setState({
      showStatus:0
    })
  }
  // 为第一次render()准备数据
  componentWillMount(){
    this.initColumns();
  }
  //——发送请求ajax——执行一些异步任务
  componentDidMount(){
    //获取一级分类列表展示
    this.getCategorys();
  }
  render() {
    //读取状态数据
    const {categorys,loading,subCategorys,parentName,parentId,showStatus} = this.state;
    //读取指定的分类
    const category = this.category || {};//如果还没有指定一个空对象，否则会报错
    //定义card的左侧标题
    const title = parentId==='0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表 </LinkButton>
        <Icon type="arrow-right"></Icon> 
        <span> {parentName}</span>
      </span>
    )
    //定义card的右侧按钮
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type='plus' />
        添加
      </Button>
    )
    // const dataSource = [
    //   {
    //     __v: '1',
    //     name: '家用电器',
    //     parentId:'0',
    //     _id:'1',
    //   },
    //   {
    //     __v: '2',
    //     name: '玩具',
    //     parentId:'0',
    //     _id:'2',
    //   },
    // ];
    return (
      <div>
        <Card title={title} extra={extra}>
          <Table 
              columns={this.columns}
              dataSource={parentId==='0' ? categorys : subCategorys} 
              loading={loading}
              bordered 
              rowKey='_id'
              pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper:true}}
          ></Table>
          <Modal
            title="添加分类"
            visible={showStatus===1}
            onOk={this.addCategory}
            onCancel={this.handleCancel}
          >
          <AddForm
              categorys={categorys}
              parentId={parentId}
              setForm={(form)=>{this.form=form}}
          ></AddForm>
          </Modal>

          <Modal
            title="更新分类"
            visible={showStatus===2}
            onOk={this.updateCategory}
            onCancel={this.handleCancel}
          >
           <UpdateForm 
                categoryName={category.name} 
                setForm={(form)=>{this.form=form}}
            ></UpdateForm>
          </Modal>

        </Card>
      </div>
    )
  }
}
