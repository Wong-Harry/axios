import axios from "../../src";
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123
console.log(qs.stringify({
  a: 1
}))
axios({
  url: '/config/post',
  method: 'post',
  data: qs.stringify({
    a: 1
  }),
  headers: {
    test: 123
  }
}).then(res => { console.log(res) }).catch(e => { console.error(e) })
