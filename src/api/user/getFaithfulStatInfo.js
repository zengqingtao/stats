import request from '@/plugin/axios'
// 忠实用户留存详情
export function getFaithfulStatInfo(data) {
  return request({
    url: 'UsersReport/findFaithfulUserInfo',
    method: 'post',
    data
  })
}