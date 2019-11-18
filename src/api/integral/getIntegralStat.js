import request from '@/plugin/axios'
//获取积分数据
export function getIntegralStat (data) {
  return request({
    url: '/scorereport/list',
    method: 'post',
    data
  })
}