import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function resetPassword (data) {
  var Authorization ="Bearer "+util.cookies.get("token")
  return request({
    url: '/auth/resetPassword',
    headers: {Authorization},
    method: 'post',
    data
  })
}