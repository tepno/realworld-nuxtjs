/**
 * 基于 axios 封装的模块
 */

import axios from 'axios'

const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 响应拦截器

export default request