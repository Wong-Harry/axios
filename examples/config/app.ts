import axios, { AxiosTransFormer } from "../../src";
import qs from 'qs'

axios.defaults.headers.common['test2'] = 312

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: qs.stringify({
//     a: 1
//   }),
//   headers: {
//     test: 123
//   }
// }).then(res => { console.log(res) }).catch(e => { console.error(e) })

axios({
  transformRequest: [(function (data) {
    return qs.stringify(data)
  }), ...(axios.defaults.transformRequest as AxiosTransFormer[])],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransFormer[]), function (data) {
    if (typeof data === 'object') {
      data.c = 2
    }
    return data
  }],
  url: '/config/post',
  method: 'post',
  data: {
    a: 2
  }
}).then((res) => {
  console.log(res.data)
}).catch(e => console.error(e))


const instance = axios.create({
  transformRequest: [(function (data) {
    return qs.stringify(data)
  }), ...(axios.defaults.transformRequest as AxiosTransFormer[])],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransFormer[]), function (data) {
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then((res) => {
  console.log(res.data)
}).catch(e => console.error(e))


axios({
  url: '/config/post',
  method: 'post',
  data: {
    a: 123123
  }
}).then((res) => {
  console.log(res.data)
}).catch(e => console.error(e))

