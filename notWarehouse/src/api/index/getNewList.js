import request from '@/plugin/axios'

export function  getNewList(data) {
  return request({
    url:"/DashBoard/DashBoardTrendMap",
    method: 'post',
    data
  })
}