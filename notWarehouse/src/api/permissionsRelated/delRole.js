//删除角色
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function delRole(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/role/delRole',
        headers: { Authorization },
        method: 'post',
        data
    })
}