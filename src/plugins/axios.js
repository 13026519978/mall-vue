import Vue from 'vue'
import axios from 'axios'
import { Loading, Message } from 'element-ui'

import router from '@/router.js'
let loading;

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
	//在发送请求之前做些什么
	// console.log(config);
	loading = Loading.service({ background: 'rgba(0,0,0,0.2)' })
	// 注册登录忽略token
	if (config.url == '/api/admin/login' || config.url == '/api/admin/register' || config.url == '/api/upload/common') {
		return config;
	}
	let token = sessionStorage.token;
	// console.log(token);
	if (!token) {
		Message.error({
			message: 'token失效，请重新登陆！',
			onClose: () => {
				router.replace('/login')
				loading.close();
			}
		})
	}
	config.headers.Authorization = `Bearer ${token}`;
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(({ status, data }) => {
	//在这里你可以判断后台返回数据携带的请求码
	// loading关闭
	loading.close();
	if (status === 200) {
		return data
	} else {
		// 非200请求抱错
		throw Error(data.msg || '服务异常')
	}
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});
