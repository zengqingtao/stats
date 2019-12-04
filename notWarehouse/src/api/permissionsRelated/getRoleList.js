//获取角色列表
import request from '@/plugin/axios'
import util from '@/libs/util.js'

export function getRoleList(data) {
    var Authorization = "Bearer " + util.cookies.get("token")
    return request({
        url: '/role/getRoleList',
        headers: { Authorization },
        method: 'post',
        data
    })
}