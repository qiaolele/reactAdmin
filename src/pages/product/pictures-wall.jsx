import React, { Component } from 'react'
import {Upload,Icon,Modal, message} from 'antd'
import {reqDeleteImg} from '../../api/index'
import {PropTypes} from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constant'
// 用于图片上传的组件
export default class PicturesWall extends Component {
  //接收父组件传来的值
  static propTypes = {
    imgs:PropTypes.array
  }
  constructor (props) {
    super(props)
    
    let fileList = [];
    //如果传入了imgs属性，根据imgs生成一个数组
    const {imgs} = this.props;
    if(imgs && imgs.length>0){
      fileList = imgs.map((img,index) =>({
        uid:-index,
        name:img,
        status:'done',
        url:BASE_IMG_URL + img
      }))
    }

    this.state = {
      previewVisible: false,//标识是否显示大图预览Modal
      previewImage: '',//Modal里面大图的url地址
      fileList//所有已上传图片的数组
    }
  }

  // state = {
  //   previewVisible: false,//标识是否显示大图预览Modal
  //   previewImage: '',//Modal里面大图的url地址
  //   fileList: [
  //     // {
  //     //   uid: '-1',//文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
  //     //   name: 'image.png',//图片文件名
  //     //   status: 'done',//图片的状态 uploading(正在上传中) done(已上传) error removed(已删除)
  //     //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//图片地址
  //     // },
  //   ],
  // };
  //让Modal隐藏
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    console.log(`handlePreview()`,file)
    // 显示指定file对应的大图
    this.setState({
      previewImage: file.url || file.thumbUrl,//thumbUrl：是没有上传成功时候自动生成的一个字段，显示图片地址
      previewVisible: true,
    });
  };
  //fileList:所有已上传图片的数组
  handleChange = async ({ file,fileList }) => {
    console.log(`handleChange()`,file.status,fileList.length,file===fileList[fileList.length-1])
    //一旦上传成功，将当前上传的file的信息及时的修正：name值不对，url没有
    if(file.status === 'done'){
      const result = file.response;
      if(result.status===0){
        message.success('上传图片成功！')
        const {name,url} = result.data;
        file = fileList[fileList.length-1];
        file.name = name;
        file.url = url;
      }else{
        message.error('上传图片失败！')
      }
    }else if(file.status==='removed'){//删除图片
      const result = await reqDeleteImg(file.name)
      if(result.status === 0){
        message.success('删除图片成功！')
      }else{
        message.error('删除图片失败！')
      }
    }
    // 在操作（上传/删除）过程中及时更新fileList状态
    this.setState({ fileList })

  };
  // 用来获取所有已经上传图片文件名的数组
  getImgs = ()=>{
    return this.state.fileList.map(file => file.name)
  }
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"//接口上传图片的（接口）地址
          accept='image/*'//指定接收的类型（图片格式）
          name="image"//请求参数名——必须指定，否则发送不到后台
          listType="picture-card"//支持的三种基本样式
          fileList={fileList}//所有已上传文件的列表
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

