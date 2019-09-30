import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function GetMenu () {
  var Authorization ="Bearer "+util.cookies.get("token")
  return request({
    url: '/menu/list',
    headers: {Authorization},
    method: 'post'
  })
}

