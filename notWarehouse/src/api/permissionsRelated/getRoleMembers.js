// 获取所有用户
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function getRoleMembers(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/auth/roleMembers',
        headers: { Authorization },
        method: 'post',
        data
    })
}
