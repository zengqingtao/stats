<template>
  <d2-container>
    <template slot="header">钉钉用户管理</template>
    <div>
      <div>
        <el-dialog :title="title" center :visible.sync="centerDialogVisible" width="60%">
          <el-form ref="ding_form" :model="ding_form">
            <el-form-item label="角色">
              <el-select v-model="ding_form.rolename" @change="selectGet" placeholder="请选择角色">
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.remark"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirmbtn">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <d2-crud
        ref="d2Crud"
        :options="crudOptions"
        :columns="columns"
        :data="dingusers"
        :rowHandle="rowHandle"
        @custom-edit="edit"
        @custom-delect="delect"
      ></d2-crud>
    </div>
  </d2-container>
</template>
<script>
import { getDingDingUser } from "@/api/dingTalk/getDingDingUser";
import { getRoles } from "@/api/addUser/roles";
import { addDingDingUser } from "@/api/dingTalk/addDingDingUser";
export default {
  data() {
    return {
      title: "",
      editrolename: "", //需要修改的用户的rolename
      rolesList: [],
      crudOptions: { border: true },
      centerDialogVisible: false,
      columns: [
        { title: "unionid", key: "unionid", width: "250" },
        { title: "userid", key: "userid", width: "250" },
        { title: "用户名", key: "name", width: "150" }
      ],
      dingusers: [],
      ding_form: {
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
          }
          /* {
            text: "删除",
            icon: "el-icon-delete",
            size: "small",
            type: "danger",
            emit: "custom-delete"
          } */
        ]
      },
      unionid: "",
      nick: ""
    };
  },
  created() {
    this.allDingDingUser();
    this.allRoles();
  },
  methods: {
    // 获取下拉框 label的值
    selectGet(vId) {
      let obj = {};
      obj = this.rolesList.find(item => {
        return item.id == vId; //筛选出匹配数据
      });
      // console.log(obj.name);
      this.editrolename = obj.name;
    },
    //获取权限组
    allRoles() {
      getRoles()
        .then(res => {
          // console.log("roles-res:", res.roles);
          this.rolesList = res.roles;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 请求所有钉钉用户
    allDingDingUser() {
      getDingDingUser()
        .then(res => {
          this.dingusers = res.list;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 编辑按钮
    edit({ index, row }) {
      this.centerDialogVisible = true;
      this.title = `钉钉用户${row.name}`;
      this.unionid = row.unionid;
      this.ding_form.rolename = row.role;
      this.nick = row.name;
    },
    confirmbtn() {
      /* console.log("role id", this.unionid);
      console.log("nick", this.nick); */
      let edrole = "";
      if (this.editrolename == "") {
        edrole = this.ding_form.rolename;
      } else {
        edrole = this.editrolename;
      }
      this.centerDialogVisible = false;
      // console.log(edrole)
      addDingDingUser({
        unionid: this.unionid,
        nick: this.nick,
        role: edrole
      })
        .then(res => {
          if (JSON.stringify(res) == "{}") {
            this.$notify({
              title: "提示",
              message: "成功编辑钉钉用户",
              type: "success"
            });
            // this.allDingDingUser();
            this.centerDialogVisible = false;
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
    }
  }
};
</script>
<style scoped>
.d2-crud {
  /* width: 1400px; */
}
</style>