import React, { Component } from 'react'
import {PropTypes} from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
  //接收父组件传过来的参数
  static propTypes = {
    detail:PropTypes.string
  }
  state = {
    editorState: EditorState.createEmpty(),//创建一个空的编辑对象
  }
  constructor(props) {
    super(props);
    const html = this.props.detail;
    if(html){//如果有内容，就根据html格式字符串创建一个对应的编辑内容对象
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
      }
    }else{
      this.state = {
        editorState: EditorState.createEmpty(),//创建一个空的编辑对象
      }
    }
  }

  // 当编辑对象内容发生改变时——输入过程中——传入最新的内容
  onEditorStateChange = (editorState) => {
    console.log(editorState)
    this.setState({
      editorState,
    });
  };
  getDetail = ()=>{
    //返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  uploadImageCallBack = (file)=>{
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          const url = response.data.url//得到图片地址
          resolve({data: {link: url}})
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{border:'1px solid #000',minHeight:200,padding:'0 20px'}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}
