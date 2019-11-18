<template>
  <d2-container>
    <template slot="header">管理员管理</template>
    <el-button class="addbtn" type="primary" @click="addUser">新增管理员</el-button>
    <div>
      <!-- 添加用户 -->
      <div>
        <el-dialog :title="title" center :visible.sync="centerDialogVisible" width="60%">
          <el-form ref="addUser_form" :model="addUser_form">
            <el-form-item v-if="!clickaddbtn" label="当前用户为">{{ this.userName}}</el-form-item>
            <el-form-item label="角色">
              <el-select v-model="addUser_form.rolename" @change="selectGet" placeholder="请选择角色">
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.remark"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-if="clickaddbtn">
              <el-form-item label="用户名">
                <el-input v-model="addUser_form.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="addUser_form.pwd" type="password" placeholder="请输入密码" clearable></el-input>
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input
                  @keyup.enter.native="confirmbtn_addUser"
                  v-model="addUser_form.confirmPwd"
                  type="password"
                  placeholder="请输入确认密码"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item v-if="!clickaddbtn" label="状态">
              <el-radio-group v-model="addUser_form.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button v-if="clickaddbtn" type="primary" @click="confirmbtn_addUser">确 定</el-button>
            <el-button v-if="!clickaddbtn" type="primary" @click="confirmbtn_editUser">编 辑</el-button>
          </div>
        </el-dialog>
      </div>
      <el-dialog :title="dialogtitle" center :visible.sync="dialogVisible2">
        <el-form ref="form" :model="form">
          <el-form-item label="新密码">
            <el-input v-model="form.newPwd" type="password" placeholder="请输入新密码" clearable></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input
              @keyup.enter.native="confirmbtn"
              v-model="form.confirmPwd"
              type="password"
              placeholder="请输入确认密码"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="confirmbtnpasw">确 定</el-button>
        </div>
      </el-dialog>
      <d2-crud
        ref="d2Crud"
        :options="crudOptions"
        :columns="columns"
        :data="membersdata"
        :rowHandle="rowHandle"
        @custom-edit="edit"
        @custom-change-password="changePassword"
        @custom-change-status="changeStatus"
        @custom-delect="delect"
      ></d2-crud>
    </div>
  </d2-container>
</template>
<script>
import { getRoleMembers } from "@/api/permissionsRelated/getRoleMembers";
import { getRoles } from "@/api/addUser/roles";
import { getAddMember } from "@api/addUser/addMember";
import connector from "@/call/connector";
import { editMemberInfo } from "@/api/permissionsRelated/editMemberInfo";
import { resetPassword } from "@api/changePassword/resetPassword";
import setColWidth from "../mixins/setColwidth"
export default {
  mixins:[setColWidth],
  data() {
    return {
      userName: "",
      clickaddbtn: true,
      title: "",
      memberid: "",
      editrolename: "",
      rolesList: [],
      crudOptions: { border: true },
      centerDialogVisible: false,
      dialogVisible2: false,
      dialogtitle: "",
      repaswid: "",
      columns: [
        { title: "ID", key: "id", width: "100" },
        { title: "昵称", key: "nick", width: "150" },
        { title: "用户名", key: "username", width: "150" },
        { title: "角色名称", key: "role", width: "150" },
        { title: "状态", key: "status", width: "150" }
      ],
      membersdata: [],
      //密码form
      form: {
        newPwd: "",
        confirmPwd: ""
      },
      //添加用户form
      addUser_form: {
        nick: "",
        roleName: "",
        username: "",
        pwd: "",
        confirmPwd: "",
        status: 1,
        rolename: ""
      },
      rowHandle: {
        custom: [
          {
            text: "编辑",
            icon: "el-icon-edit",
            size: "small",
            type: "success",
            emit: "custom-edit"
          },
          {
            text: "更改状态",
            type: "warning",
            icon: "el-icon-edit",
            size: "small",
            emit: "custom-change-status"
          },
          {
            text: "修改密码",
            type: "info",
            icon: "el-icon-edit",
            size: "small",
            emit: "custom-change-password"
          }
          /*  {
            text: "删除",
            icon: "el-icon-delete",
            size: "small",
            type: "danger",
            emit: "custom-delete"
          } */
        ]
      }
    };
  },
  created() {
    this.allrolemembers();
    this.allRoles();
    this.setColWidth(340)
  },
  methods: {
    // 获取下拉框 label的值
    selectGet(vId) {
      //这个vId也是value值
      let obj = {};
      obj = this.rolesList.find(item => {
        return item.id == vId; //筛选出匹配数据
      });
      this.editrolename = obj.name;
    },
    //获取权限组
    allRoles() {
      getRoles()
        .then(res => {
          this.rolesList = res.roles;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 请求所有管理员
    allrolemembers() {
      getRoleMembers()
        .then(res => {
          for (var i = 0; i < res.list.length; i++) {
            if (res.list[i].status == 1) {
              res.list[i].status = "启用";
            } else {
              res.list[i].status = "禁止";
            }
          }
          this.membersdata = res.list;
        })
        .catch(err => {
          console.log(err);
        });
    },

    addUser() {
      this.clickaddbtn = true;
      this.centerDialogVisible = true;
      this.title = "添加管理员";
      this.initfrom();
    },
    // 添加用户
    confirmbtn_addUser() {
      if (!this.addUser_form.rolename) {
        this.$message.error('请选择权限组');
      } else if (this.addUser_form.username.length < 3) {
        this.$message.error('用户名必须3位以上');
      } else if (this.addUser_form.pwd.length < 3) {
        this.$message.error('密码必须3位以上');
      } else if (this.addUser_form.pwd != this.addUser_form.confirmPwd) {
        this.$message.error('两次输入密码不一致');
      } else {
        getAddMember({
          username: this.addUser_form.username,
          password: this.addUser_form.pwd,
          roleid: this.addUser_form.rolename
        })
          .then(res => {
            if (JSON.stringify(res) == "{}") {
              this.$notify({
                title: "提示",
                message: "添加成功",
                type: "success"
              });
              this.allrolemembers();
            }
            this.centerDialogVisible = false;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 编辑按钮
    edit({ index, row }) {
      this.addUser_form.rolename = ""
      let titlename = "";
      this.clickaddbtn = false;
      this.centerDialogVisible = true;
      if (row.role == "root") {
        titlename = "超级管理员";
      } else if (row.role == "admin") {
        titlename = "管理员";
      } else {
        titlename = "普通用户";
      }
      this.title = `当前角色为${titlename}`;
      // console.log("选中行数据", row);
      this.addUser_form.username = row.username;
      this.addUser_form.roleName = row.role;
      this.addUser_form.nick = row.nick;
      this.addUser_form.status = row.status == "启用" ? 1 : 0;
      this.memberid = row.id;
      this.userName = row.nick;
    },
    confirmbtn_editUser() {
      let edrole = "";
      if (this.editrolename == "") {
        edrole = this.addUser_form.roleName;
      } else {
        edrole = this.editrolename;
      }
      editMemberInfo({
        memberid: this.memberid,
        role: edrole,
        status: this.addUser_form.status
      })
        .then(res => {
          if (JSON.stringify(res) == "{}") {
            this.$notify({
              title: "提示",
              message: "成功修改管理员信息",
              type: "success"
            });
            this.allrolemembers();
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.centerDialogVisible = false;
    },
    // 修改密码
    changePassword({ index, row }) {
      this.dialogVisible2 = true;
      // console.log("id", row.id);
      this.repaswid = row.id;
      this.dialogtitle = `修改用户名为${row.username}的密码`;
    },
    // 修改密码确定按钮绑定的方法
    confirmbtnpasw() {
      if (this.form.newPwd.length < 3) {
        this.$message.error("新密码必须3位以上");
      } else if (this.form.newPwd != this.form.confirmPwd) {
        this.$message.error("两次输入密码不一致");
      } else {
        resetPassword({
          memberid: this.repaswid,
          password: this.form.newPwd
        })
          .then(res => {
            if (JSON.stringify(res) == "{}") {
              this.$notify({
                title: "提示",
                message: "修改成功",
                type: "success"
              });
              this.dialogVisible2 = false;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 修改状态
    changeStatus({ index, row }) {
      console.log("ststus", row.status);
      var status = row.status == "启用" ? 0 : 1;
      editMemberInfo({
        memberid: row.id,
        role: row.role,
        status: status
      })
        .then(res => {
          if (JSON.stringify(res) == "{}") {
            this.$notify({
              title: "提示",
              message: "成功修改状态",
              type: "success"
            });
            this.allrolemembers();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除
    delect({ index, row }) {},
    cancel() {
      this.centerDialogVisible = false;
    },
    //初始化
    initfrom() {
      this.addUser_form.username = ""
      this.addUser_form.rolename = ""
    }
  }
}
</script>
<style lang="scss" scoped>
.el-button--primary {
  margin-left: 5px;
}
</style>
