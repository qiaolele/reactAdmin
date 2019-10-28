// 入口文件
import React from 'react';
import ReactDOM from 'react-dom';
import storageUtil from './utils/storageUtil';
import memoryUtil from './utils/memoryUtil'
import App from './App';
//读取local中保存的user信息，保存到内存中
const user = storageUtil.getUser();
memoryUtil.user = user;

//将APP组件标签渲染到index页面的div上
ReactDOM.render(<App />,document.getElementById('root'))
