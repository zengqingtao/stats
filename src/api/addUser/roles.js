import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function getRoles (data) {
  var Authorization ="Bearer "+util.cookies.get("token")
  return request({
    url: '/auth/roles',
    headers: {Authorization},
    method: 'post',
    data
  })
}