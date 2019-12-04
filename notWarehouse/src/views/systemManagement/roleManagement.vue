<template>
  <d2-container>
    <template slot="header">角色管理</template>
    <div>
      <el-button type="primary" @click="addRole">新增角色</el-button>
      <d2-crud
        ref="d2Crud"
        :options="crudOptions"
        :columns="columns"
        :data="roleListdata"
        :rowHandle="rowHandle"
        @role-deit="roleEdit"
        @role-delete="roleDelete"
      ></d2-crud>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="centerDialogVisible"
        width="60%"
        center
        :before-close="handleClose"
      >
        <el-form ref="editRole_form" :model="editRole_form">
          <el-form-item label="权限角色">
            <el-input v-model="editRole_form.name" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input v-model="editRole_form.remark" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="editRole_form.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div style="margin: 15px 0;">权限列表</div>
        <div class="role-item">
          <el-tree
            ref="tree"
            :data="roledata"
            show-checkbox
            accordion
            node-key="id"
            :props="defaultProps"
          ></el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button v-if="clickadd" type="primary" @click="determine">确 定</el-button>
          <el-button v-if="!clickadd" type="primary" @click="determineedit">修 改</el-button>
        </span>
      </el-dialog>
    </div>
  </d2-container>
</template>
<script>
import { getNodeList } from "@/api/permissionsRelated/getNodeList";
import { getRoleList } from "@api/permissionsRelated/getRoleList";
import { addRole } from "@api/permissionsRelated/addRole";
import { delRole } from "@api/permissionsRelated/delRole";
import { editRole } from "@api/permissionsRelated/editRole";
import setColWidth from "../mixins/setColwidth"
export default {
  mixins:[setColWidth],
  data() {
    return {
      isEdit: false,
      dialogTitle: "",
      centerDialogVisible: false,
      clickadd: true,
      crudOptions: { border: true },
      columns: [
        { title: "名称", key: "name", width: "150" },
        { title: "中文名称", key: "remark", width: "200" },
        { title: "状态", key: "status", width: "120" }
      ],
      roleListdata: [],
      rowHandle: {
        custom: [
          {
            text: "编辑",
            icon: "el-icon-edit",
            size: "small",
            type: "success",
            emit: "role-deit"
          },
          {
            text: "删除",
            icon: "el-icon-delete",
            size: "small",
            type: "danger",
            emit: "role-delete"
          }
        ]
      },
      editRole_form: {
        name: "",
        remark: "",
        status: 1
      },
      roledata: [],
      defaultProps: {
        children: "son",
        label: "title"
      }
    };
  },
  created() {
    this.allNodeList();
    this.RoleList();
    this.setColWidth(200)
  },
  methods: {
    /* 获取所有权限列表 */
    allNodeList() {
      getNodeList()
        .then(res => {
          this.roledata = res.list;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取角色列表
    RoleList() {
      getRoleList()
        .then(res => {
          for (var i = 0; i < res.list.length; i++) {
            if (res.list[i].status == 1) {
              res.list[i].status = "启用";
            } else {
              res.list[i].status = "禁止";
            }
          }
          this.roleListdata = res.list;
          // console.log("roleListdata", this.roleListdata);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击新增
    addRole() {
      this.clickadd = true;
      this.centerDialogVisible = true;
      this.dialogTitle = "新增角色";
      this.initfrom();
      this.isEdit = false;
    },
    //点击编辑
    roleEdit({ index, row }) {
      this.isEdit = true;
      this.clickadd = false;
      this.centerDialogVisible = true;
      this.dialogTitle = "编辑";
      this.editRole_form.name = row.name;
      this.editRole_form.remark = row.remark;
      this.editRole_form.status = row.status == "启用" ? 1 : 0;
      // this.editRole_form.status = row.status;
      // console.log("编辑角色");
      // 找到点击行的数据
      let echodata = this.roleListdata.find(v => v.name == row.name);
      let data1 = this.conversion(echodata.node).sort(function(a, b) {
        return a - b;
      });
      // console.log(data1);
      let keys = data1;
      this.$nextTick(function() {
        keys.forEach(v => {
          this.$refs.tree.setChecked(v, true, false);
        });
      });
    },
    roleDelete({ index, row }) {
      //删除角色
      var delRolename = row.name;
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRole({ name: delRolename })
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.RoleList();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //新增角色
    determine() {
      let name = this.editRole_form.name;
      let remark = this.editRole_form.remark;
      let status = this.editRole_form.status;
      let chackId = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
        .join();
      let addroleobj = {
        name: name,
        remark: remark,
        status: status,
        node_id: chackId
      };
      addRole(addroleobj)
        .then(res => {
          if (JSON.stringify(res) == "{}") {
            this.$notify({
              title: "提示",
              message: "添加成功",
              type: "success"
            });
            this.centerDialogVisible = false;
            this.RoleList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //编辑角色
    determineedit() {
      let name = this.editRole_form.name;
      let remark = this.editRole_form.remark;
      let status = this.editRole_form.status;
      let chackId = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
        .join();
      let editroleobj = {
        name: name,
        remark: remark,
        status: status,
        node_id: chackId
      };
      // console.log("编辑选中的权限ID", chackId);
      // console.log("编辑的状态", status);
      editRole(editroleobj)
        .then(res => {
          if (JSON.stringify(res) == "{}") {
            this.$notify({
              title: "提示",
              message: "修改成功",
              type: "success"
            });
            this.centerDialogVisible = false;
            this.RoleList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancel() {
      this.centerDialogVisible = false;
      let keys = [];
      this.$nextTick(function() {
        this.$refs.tree.setCheckedKeys(keys);
      });
    },
    //初始化
    initfrom() {
      this.editRole_form.name = "";
      this.editRole_form.remark = "";
      this.editRole_form.status = "";
      let keys = [];
      this.$nextTick(function() {
        this.$refs.tree.setCheckedKeys(keys);
      });
    },
    conversion(suorearr) {
      var scoreObject = suorearr;
      var arr = [];
      for (var i in scoreObject) {
        arr.push(scoreObject[i].id);
      }
      return arr;
    },
    handleClose(done) {
      let keys = [];
      this.$nextTick(function() {
        this.$refs.tree.setCheckedKeys(keys);
      });
      done();
      /* this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {}); */
    }
  }
};
</script>
<style lang="scss" scoped>
.role-item {
  border: #c0c4cc 1px solid;
  padding: 10px;
  border-radius: 5px;
}
.item {
  margin: 15px 0;
}
.el-checkbox-group {
  padding-left: 20px;
}
.el-button--primary {
  margin-left: 5px;
}
</style>