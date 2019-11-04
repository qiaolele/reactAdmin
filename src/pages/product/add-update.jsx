import React, { PureComponent } from 'react'
import {Card,Form,Input,Cascader,Upload,Icon,Button,message} from 'antd'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api/index'
import LinkButton from '../../components/link-button';
import PictureWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
const Item = Form.Item;
const {TextArea} = Input
// const options = [
//   {
//     value: 'zhejiang',
//     label: 'Zhejiang',
//     isLeaf: false,
//   },
//   {
//     value: 'jiangsu',
//     label: 'Jiangsu',
//     isLeaf: false,
//   },

//   {
//     value: '李四',
//     label: '李四',
//     isLeaf: true,
//   },
// ];
// product的添加、修改路由
class ProductAddUpdate extends PureComponent {
  state = {
    options:[],
  };

  constructor(props) {
    super(props)
    //创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  //自定义验证函数——校验价格
  validatePrice = (rule, value, callback) => {
    console.log(value, typeof value)
    if (value*1 > 0) {
      callback() // 验证通过
    } else {
      callback('价格必须大于0') // 验证没通过
    }
  }
  //提交的事件
  submit=()=>{
    //进行所有的表单验证——通过才发送请求
    this.props.form.validateFields(async (error,values)=>{
      if(!error){
        //取子组件上传图片的值
        values.imgs = this.pw.current.getImgs()
        //1、收集数据：——并封装成product对象
        const {name,desc,price,categoryIds,imgs} = values
        let pCategoryId,categoryId
        if(categoryIds.length ===1){
          pCategoryId = '0'
          categoryId = categoryIds[0]
        }else{
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        //获取子组件富文本编辑器的内容
        const detail = this.editor.current.getDetail()
        const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}
        //如果是更新，需要添加_id
        if(this.isUpdate){
          product._id = this.product._id
        }
        console.log(values,detail);
        //2、调用接口请求函数——去添加/更新
        const result = await reqAddOrUpdateProduct(product)
        //3、根据结果提示
        if(result.status===0){
            message.success(`${this.isUpdate ? '更新' :'添加'}商品成功！`)
            this.props.history.goBack();
        }else{
          message.error(`${this.isUpdate ? '更新' :'添加'}商品失败！`)
        }
      }else{
        message.error(error)
      }
    })
  }
  // 获取一级、二级分类列表并显示
  //async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
  getCategorys = async (parentId)=>{
    const result = await reqCategorys(parentId) //status:0 ,data:[]
    if(result.status===0){
      const categorys = result.data;
      if(parentId==='0'){//如果是一级分类列表
        this.initOptions(categorys);
      }else{//二级分类列表
        return categorys//返回一个二级列表==>async函数返回的promise就会成功且value为categorys
      }
    }
  }
  //更新options数组
  initOptions = async (categorys)=>{
    //根据categorys生成options数组
    const options = categorys.map(c=>({
        value:c._id,
        label:c.name,
        key:c._id,
        isLeaf:false,//不是叶子
    }))
    //如果是一个二级分类商品的更新——需要将二级商品的products渲染出来
    const {isUpdate,product} = this;
    const {pCategoryId,categoryId} = product;
    if(isUpdate && pCategoryId!=='0'){//说明是一个二级分类商品
        //获取对应的二级分类列表
        const subCategorys = await this.getCategorys(pCategoryId)
        //生成二级下拉列表options
        const childOptions = subCategorys.map(c=>({
            value:c._id,
            label:c.name,
            key:c._id,
            isLeaf:true
        }))
        //找到当前商品对应的一级目标options对象
        const targetOption = options.find(option => option.value === pCategoryId)
        //关联到一级对应的options上去
        targetOption.children = childOptions
    }
     //更新options状态
    this.setState({options})//这里的options是新创建的options所以会更新
  }
  //用于加载下一级列表的回调函数,
  loadData = async selectedOptions => {
    //得到选择的option选项
    const targetOption = selectedOptions[0];
    //显示loading效果
    targetOption.loading = true;
    //根据选中的分类，请求获取下一级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false;
    if(subCategorys && subCategorys.length>0){//当前选中的有二级分类
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c=>({
        value:c._id,
        label:c.name,
        key:c._id,
        isLeaf:true
      }))
      //关联到当前options上
      targetOption.children = childOptions
    }else{//当前选中的分类没有二级分类
      targetOption.isLeaf = true;//是叶子
    }
    // 更新options
    this.setState({
      options:[...this.state.options]
    })
  };
  componentDidMount(){
    this.getCategorys('0')
  }
  componentWillMount(){
    //取出携带的数据—
    const product = this.props.location.state//如果是添加，product没值，如果是修改，product有值
    this.isUpdate = !!product//两个!!强制转换boolean值，保存是否是修改标识
    this.product = product || {};//保存商品，如果没有保存的是空对象，避免报错
  }
  render() {
    const {isUpdate,product} = this;
    const {pCategoryId,categoryId,imgs,detail} = product;
    //用来接收级联分类id的数组
    const categoryIds = []
    if(isUpdate){
      //商品是一级分类产品
      if(pCategoryId==='0'){
        categoryIds.push(categoryId)
      }else{
        //商品是二级分类产品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: {span:2},// 指定label的宽度
      wrapperCol: {span:8},// 指定右侧包裹的宽度
    }
    const title = (
      <span>
        <LinkButton onClick={()=> this.props.history.goBack()}>
            <Icon type="arrow-left" style={{fontSize:18}}></Icon>
        </LinkButton>
        <span> {isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    const {getFieldDecorator} = this.props.form;
    return (
      <Card title={title}>
          <Form {...formItemLayout}>
              <Item label="商品名称" >
                  {
                    getFieldDecorator('name',{
                        initialValue:product.name,
                        rules:[
                          {required:true,message:'商品名称不能为空'}
                        ]
                    })(<Input placeholder="请输入商品名称"></Input>)
                  }
              </Item>
              <Item label="商品描述" >
                  {
                    getFieldDecorator('desc',{
                      initialValue:product.desc,
                      rules:[
                        {required:true,message:'商品描述不能为空'}
                      ]
                    })(<TextArea placeholder="请输入商品描述" autoSize={{minRows:2,maxRows:6}}></TextArea>)
                  }
                  
              </Item>
              <Item label="商品价格" >
                  {
                    getFieldDecorator('price',{
                      initialValue:product.price,
                      rules:[
                        {required:true,message:'商品价格不能为空'},
                        {validator:this.validatePrice}
                      ]
                    })(<Input type="number" placeholder="请输入商品价格" addonAfter="元"></Input>)
                  }
              </Item>
              <Item label="商品分类" >
                  {
                    getFieldDecorator('categoryIds',{
                      initialValue:categoryIds,
                      rules:[
                        {required:true,message:'商品分类不能为空'},
                      ]
                    })(
                      <Cascader
                        options={this.state.options}//指定需要显示的列表数据——数组
                        loadData={this.loadData}//指定当选择某个列表项，加载下一级列表的回调函数
                      />
                    )
                  }
              </Item>
              <Item label="商品图片" >
                <PictureWall ref={this.pw} imgs={imgs}></PictureWall>
              </Item>
              <Item label="商品详情" wrapperCol={{span:20}}>
                  <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
              </Item>
              <Item >
                  <Button type="primary" onClick={this.submit}>提交</Button>
              </Item>
          </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)

/*
  1、子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
  2、父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象(也就是组件对象)，调用其方法
*/
