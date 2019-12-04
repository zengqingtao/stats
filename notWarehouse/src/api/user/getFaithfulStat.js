import request from '@/plugin/axios'
// 忠实用户留存
export function getFaithfulStat(data) {
  return request({
    url: 'UsersReport/getFaithfulUserList',
    method: 'post',
    data
  })
}
