import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function getAddMember (data) {
  var Authorization ="Bearer "+util.cookies.get("token")
  return request({
    url: '/auth/addMember',
    headers: {Authorization},
    method: 'post',
    data
  })
}