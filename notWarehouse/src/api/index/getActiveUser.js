import request from '@/plugin/axios'

export function  getActiveUser(data) {
  return request({
    url:"/DashBoard/activeUser",
    method: 'post',
    data
  })
}