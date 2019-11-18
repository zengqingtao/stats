import request from '@/plugin/axios'
// 新增分析
export function  getUserReportList(data) {
  return request({
    url: '/UsersReport/getUserReportList',
    method: 'post',
    data
  })
}
