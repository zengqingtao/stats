import request from '@/plugin/axios'
// 新增分析的详细信息
export function  getNewAnalysisInfo(data) {
    return request({
      url: '/UsersReport/getNewAddUserInfo',
      method: 'post',
      data
    })
  }