import request from '@/plugin/axios'
// 新增分析
export function  getNewAnalysis(data) {
  return request({
    url: '/UsersReport/getNewAddUserList',
    method: 'post',
    data
  })
}
