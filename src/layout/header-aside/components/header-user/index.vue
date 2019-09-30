<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info ? `你好 ${info}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="changePassword">
        <i class="fa fa-thermometer-full" aria-hidden="true"></i>
        修改密码
      </el-dropdown-item>
      <el-dropdown-item @click.native="addUser">
        <i class="fa fa-user-circle" aria-hidden="true"></i>
        添加用户
      </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getRoleMembers } from '@/api/changePassword/roleMembers'
import { getRoles } from '@/api/addUser/roles'
import connector from '@/call/connector'
export default {
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    // 修改密码
    changePassword() {
      getRoleMembers().then(res=>{
        var list = res.list
        connector.$emit('changePassword',{msg:true,list:list})
      }).catch(err=>{
        console.log(err);
      })
    },
    // 添加用户
    addUser(){
      getRoles().then(res=>{
        console.log("roles-res:",res.roles);
        var rolesList = res.roles
        connector.$emit('addUser',{msg:true,rolesList})
      }).catch(err=>{
        console.log(err);
      })
    }
  }
}
</script>
