import axios, { Canceler } from "../../src";

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch(function (e) {
  if (axios.isCancel(e)) {
    console.log('Request Canceled', e.message);
  }
})

setTimeout(() => {
  source.cancel('Operation cancel by the user.')

  axios.post('/cancel/get', { a: 1 }, { cancelToken: source.token }).catch(function (e) {
    if (axios.isCancel(e)) {
      console.log(e.message);
    }
  })
}, 100);

let cancel: Canceler

axios.get('/cancel/get', {
  cancelToken: new CancelToken(e => {
    cancel = e
  })
}).catch(function (e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled');
  }
})

setTimeout(() => {
  cancel()
}, 200);
