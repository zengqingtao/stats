//修改管理员信息
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function editMemberInfo(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/auth/editMemberInfo',
        headers: { Authorization },
        method: 'post',
        data
    })
}