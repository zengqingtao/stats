import request from '@/plugin/axios'
//获取积分统计详情数据
export function getIntegralStatInfo (data) {
  return request({
    url: '/scorereport/DetailList',
    method: 'post',
    data
  })
}