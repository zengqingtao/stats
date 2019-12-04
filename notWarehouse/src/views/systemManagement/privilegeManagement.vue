<template>
  <d2-container>
    <template slot="header">权限管理</template>
    <div>
      <div class="header">
        <el-button class="add-btn" type="primary" @click="addPrivilege">新增权限</el-button>
        <div class="search-box">
          <span class="text">搜索条件</span>
          <el-select v-model="searchcriteria" placeholder="请选择" @change="searchChange">
            <el-option
              v-for="(item,index) in option"
              :key="index"
              :label="`${item.title}`"
              :value="`${item.id}`"
            ></el-option>
          </el-select>
        </div>
      </div>
      <!-- 添加权限弹框 -->
      <el-dialog :title="dialogTitle" :visible.sync="centerDialogVisible" width="60%" center>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="选择菜单">
            <el-select
              v-model="form.region"
              :placeholder="placeholder1"
              @change="currStationChange"
            >
              <el-option v-for="(item,i) in options" :key="i" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="hideSeconmenu" label="一级菜单">
            <el-select v-model="form.region1" placeholder="请选择">
              <el-option
                v-for="item in parentNodeList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="类别">
            <el-input v-model="form.clazz"></el-input>
          </el-form-item>
          <el-form-item label="URL地址">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="图标样式">
            <el-input v-model="form.style"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="显示">
            <el-radio-group v-model="form.show">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button v-if="clickadd" type="primary" @click="determine">确 定</el-button>
          <el-button v-if="!clickadd" type="primary" @click="determineedit">修 改</el-button>
        </span>
      </el-dialog>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :options="crudOptions"
        :data="data"
        :rowHandle="rowHandle"
        @custom-edit="handelEdit"
        @custom-delete="handelDelete"
      ></d2-crud>
    </div>
  </d2-container>
</template>
<script>
import { getNodeList } from "@/api/permissionsRelated/getNodeList";
import { getParentNode } from "@/api/permissionsRelated/getParentNode";
import { addNode } from "@/api/permissionsRelated/addNode";
import { delNode } from "@/api/permissionsRelated/delNode";
import { editNode } from "@/api/permissionsRelated/editNode";
import setColWidth from "../mixins/setColwidth";
export default {
  mixins: [setColWidth],
  data() {
    return {
      searchcriteria: "一级菜单",
      option: [],
      editid: "",
      clickadd: true,
      dialogTitle: "",
      crudOptions: { border: true },
      parentNodeList: [], //一级菜单列表
      placeholder1: "请选择",
      options: ["一级菜单", "二级菜单"],
      hideSeconmenu: false,
      form: {
        title: "",
        clazz: "",
        url: "",
        style: "",
        sort: "",
        status: 1,
        show: 1,
        region: "一级菜单",
        region1: ""
      },
      centerDialogVisible: false,
      columns: [
        { title: "ID", key: "id", width: "80" },
        { title: "标题", key: "title", width: "150" },
        { title: "类别", key: "clazz", width: "150" },
        { title: "URL地址", key: "url", width: "150" },
        { title: "图标样式", key: "style", width: "150" },
        { title: "排序", key: "sort", width: "80" },
        { title: "父ID", key: "parent_id", width: "80" },
        { title: "状态", key: "status", width: "110" },
        { title: "显示", key: "show_status", width: "110" }
        /*  { title: "创建时间", key: "create_time", width: "100" },
        { title: "更新时间", key: "update_time", width: "100" } */
      ],
      data: [],
      data1: "", //未处理过的权限列表
      data2: "", //一级菜单数据
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
            text: "删除",
            icon: "el-icon-delete",
            size: "small",
            type: "danger",
            emit: "custom-delete"
          }
        ]
      },
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      }
    };
  },
  created() {
    this.allNodeList();
    this.parentNode();
    this.setColWidth(200);
  },

  methods: {
    /* 获取所有权限列表 */
    allNodeList() {
      getNodeList()
        .then(res => {
          this.data1 = res.list;
          // console.log(this.data1);
          // let rawData = res.list;
          // this.dataProcess(rawData);
          // console.log("原始数据", rawData);
        })
        .catch(err => {
          console.log(err);
        });
    },
    /* 获取一级菜单 */
    parentNode() {
      getParentNode()
        .then(res => {
          this.data2 = res.list;
          this.data = res.list;
          this.parentNodeList = res.list;
          this.option = [
            { id: 0, title: "一级菜单" },
            { id: 1, title: "全部" }
          ];
          for (var i = 0; i < res.list.length; i++) {
            this.option.push(res.list[i]);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //添加权限按钮
    addPrivilege() {
      this.clickadd = true;
      this.centerDialogVisible = true;
      this.dialogTitle = "添加权限";
      this.initfrom();
    },
    //确定添加权限
    determine() {
      // var time = this.getNowFormatDate();
      var show = "";
      var status = "";
      var parent_id = "";
      // console.log("显示", this.form.show);
      // console.log("状态", this.form.status);
      if (this.form.region1 == "") {
        parent_id = 0;
      } else {
        parent_id = this.form.region1;
      }
      var addObj = {
        parent_id: parent_id,
        title: this.form.title,
        clazz: this.form.clazz,
        url: this.form.url,
        style: this.form.style,
        sort: this.form.sort,
        status: this.form.status,
        show_status: this.form.show
        // create_time: time
      };
      /* 添加权限 */
      addNode(addObj)
        .then(res => {
          if (JSON.stringify(res) == "{}") {
            this.$notify({
              title: "提示",
              message: "添加成功",
              type: "success"
            });
            this.allNodeList();
            this.parentNode();
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.centerDialogVisible = false;
    },
    //显示二级菜单
    currStationChange(val) {
      if (val == "二级菜单") {
        this.hideSeconmenu = true;
        this.form.region = "";
        this.placeholder1 = "二级菜单";
      } else {
        this.form.region1 = "";
        this.hideSeconmenu = false;
      }
    },
    // 点击编辑按钮
    handelEdit({ index, row }) {
      this.clickadd = false;
      this.editid = row.id;
      this.centerDialogVisible = true;
      this.dialogTitle = "编辑";
      this.form.title = row.title;
      this.form.clazz = row.clazz;
      this.form.url = row.url;
      this.form.style = row.style;
      this.form.sort = row.sort;
      let status = row.status == "启用" ? 1 : 0;
      this.form.status = status;
      let show = row.show_status == "显示" ? 1 : 0;
      this.form.show = show;
      if (row.parent_id != 0) {
        this.hideSeconmenu = true;
        this.form.region = "";
        this.form.region1 = row.parent_id;
        // console.log("当前选中行的父ID", this.form.region1);
      } else {
        this.hideSeconmenu = false;
        this.form.region1 = "";
      }
    },
    determineedit() {
      //确定修改权限
      var parent_id = "";
      if (this.form.region1 == "") {
        parent_id = 0;
      } else {
        parent_id = this.form.region1;
      }
      var editObj = {
        id: this.editid,
        parent_id: parent_id,
        title: this.form.title,
        clazz: this.form.clazz,
        url: this.form.url,
        style: this.form.style,
        sort: this.form.sort,
        status: this.form.status,
        show_status: this.form.show
        // create_time: time
      };
      editNode(editObj)
        .then(res => {
          if (JSON.stringify(res) == "{}") {
            this.$notify({
              title: "提示",
              message: "修改成功",
              type: "success"
            });
            this.allNodeList();
            this.parentNode();
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.centerDialogVisible = false;
    },
    handelDelete({ index, row }) {
      //删除权限数据
      var delid = row.id;
      // console.log(delid);
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delNode({ id: delid })
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // console.log(res);
              this.allNodeList();
              this.parentNode();
            })
            .catch(err => {
              // console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    initfrom() {
      this.form.title = "";
      this.form.clazz = "";
      this.form.url = "";
      this.form.style = "";
      this.form.sort = "";
      this.form.region = "一级菜单";
      this.form.region1 = "";
      this.hideSeconmenu = false;
    },
    //权限数据处理
    dataProcess(dataobj) {
      var arr = dataobj;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].son) {
          arr = arr.slice(0, i + 1).concat(arr[i].son, arr.slice(i + 1));
          // delete arr[i].son;
        }
        if (arr[i].status == 1) {
          arr[i].status = "启用";
        }
        if (arr[i].status == 0) {
          arr[i].status = "禁用";
        }
        if (arr[i].show_status == 1) {
          arr[i].show_status = "显示";
        }
        if (arr[i].show_status == 0) {
          arr[i].show_status = "隐藏";
        }
      }
      // console.log("权限数据", arr);

      this.data = arr;
    },
    //条件查询
    searchChange(val) {
      var datas = this.data1;
      if (val == 1) {
        // console.log(datas);
        this.dataProcess(datas);
      } else if (val == 0) {
        this.data = this.data2;
      } else {
        let searchdata = datas.find(v => v.id == val);
        let selectdata = [];
        selectdata.push(searchdata);
        this.dataProcess(selectdata);
      }
    }
  }
};
</script>
<style scoped>
.add-btn {
  margin-right: 10px;
}
.text {
  margin-right: 5px;
}
</style>