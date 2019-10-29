/*
能发布异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
优化1——统一处理请求异常
  在外层包一个自己创建的promise对象
  在请求出错时，不会reject(error)，而是显示错误提示
优化2：异步得到的不是response，而是response.data
  在请求成功resolve时：resolve(response.data)
*/
import axios from 'axios';
import {message} from 'antd'
export default function ajax(url,data={},type='GET'){
  return new Promise((resolve,reject)=>{
    let promise;
    //执行异步ajax请求
    if(type ==='GET'){//发送get请求
        promise = axios.get(url,{//配置对象
          params:data//指定请求参数——对象
        })
    }else{//发送post请求
        promise = axios.post(url,data)
    }
    promise.then(response=>{
      //成功了，调用resolve(value)
      resolve(response.data)
    }).catch(error=>{
      //失败了,调用reject(reason)，而是提示异常信息
      message.error('请求出错啦'+error.message)
    })
  })
  
}

//请求登录接口
axios('/login',{username:'Tom',password:'123456'},'POST').then()
//添加用户接口
axios('/manage/user/add',{username:'Tom',password:'123456',phone:'13263198358'},'POST').then()