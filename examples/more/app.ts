import axios from "../../src";

// document.cookie = 'a=b'

// axios.get('/more/get').then(res => {
//   console.log(res);
// }).catch(e => {
//   console.log(e);
// })

// axios.post('http://127.0.0.1:8088/more/server2', {}, {
//   withCredentials: true
// }).then(res => {
//   console.log(res)
// }).catch(e => {
//   console.log(e);
// })


const instance = axios.create({
  xsrfCookieName: 'XSRF-TOKEN-D',
  xsrfHeaderName: 'X-XSRF-TOKEN-D'
})

instance.get('/more/get').then(res => {
  console.log(res);
}).catch(e => {
  console.log(e);
})
