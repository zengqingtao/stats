<template>
  <div
    class="d2-layout-header-aside-group"
    :style="styleLayoutMainGroup"
    :class="{grayMode: grayActive}"
  >
    <!-- 半透明遮罩 -->
    <div class="d2-layout-header-aside-mask"></div>
    <!-- 主体内容 -->
    <div class="d2-layout-header-aside-content" flex="dir:top">
      <!-- 顶栏 -->
      <div
        class="d2-theme-header"
        :style="{
          opacity: this.searchActive ? 0.5 : 1
        }"
        flex-box="0"
        flex
      >
        <div
          @click="toIndex"
          class="logo-group"
          :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}"
          flex-box="0"
        >
          <h3 class="company" v-if="!asideCollapse">好又省网络科技</h3>
          <h3 class="company" v-if="asideCollapse">好又省</h3>
        </div>
        <div class="toggle-aside-btn" @click="handleToggleAside" flex-box="0">
          <d2-icon name="bars" />
          <span class="company1">好又省</span>
        </div>
        <d2-menu-header flex-box="1" />
        <!-- 顶栏右侧 -->
        <div class="d2-header-right" flex-box="0">
          <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$env === 'development'" -->
          <!-- <d2-header-search @click="handleSearchClick"/> -->
          <!-- <d2-header-log /> -->
          <d2-header-fullscreen />
          <d2-header-theme />
          <d2-header-size />
          <d2-header-locales />
          <d2-header-user />
        </div>
      </div>
      <!-- 下面 主体 -->
      <div class="d2-theme-container" flex-box="1" flex>
        <!-- 主体 侧边栏 -->
        <div
          flex-box="0"
          ref="aside"
          class="d2-theme-container-aside"
          :style="{
            width: asideCollapse ? asideWidthCollapse : asideWidth,
            opacity: this.searchActive ? 0.5 : 1
          }"
        >
          <d2-menu-side />
        </div>
        <!-- 主体 -->
        <div class="d2-theme-container-main" flex-box="1" flex>
          <!-- 搜索 -->
          <transition name="fade-scale">
            <div v-if="searchActive" class="d2-theme-container-main-layer" flex>
              <d2-panel-search ref="panelSearch" @close="searchPanelClose" />
            </div>
          </transition>
          <!-- 内容 -->
          <transition name="fade-scale">
            <div v-if="!searchActive" class="d2-theme-container-main-layer" flex="dir:top">
              <!-- tab -->
              <div class="d2-theme-container-main-header" flex-box="0">
                <d2-tabs />
              </div>
              <!-- 页面 -->
              <div class="d2-theme-container-main-body" flex-box="1">
                <transition :name="transitionActive ? 'fade-transverse' : ''">
                  <keep-alive :include="keepAlive">
                    <router-view />
                  </keep-alive>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <!-- 修改密码 -->
      <div>
        <!-- <el-dialog center :visible.sync="dialogVisible1">
          <div class="d2crud">
            <d2-crud
              :columns="crudColumns"
              :data="crudData"
              :loading="loading"
              :rowHandle="rowHandle"
              @custom-emit-1="handleCustomEvent"
            />
          </div>
        </el-dialog>-->
        <el-dialog title="修改个人密码" center :visible.sync="dialogVisible1">
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
            <el-button type="primary" @click="confirmbtn">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 添加用户 -->
      <!-- <div>
        <el-dialog :title="changeofuser" center :visible.sync="dialogVisible_addUser">
          <el-form ref="addUser_form" :model="addUser_form">
            <el-form-item label="权限组">
              <el-select v-model="addUser_form.power" placeholder="请选择权限组">
                <el-option
                  v-for="(item,index) in rolesList"
                  :key="index"
                  :label="`${item.remark}`"
                  :value="`${item.id}`"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="addUser_form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="addUser_form.pwd" type="passwoord" placeholder="请输入密码" clearable></el-input>
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
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel_addUser">取 消</el-button>
            <el-button type="primary" @click="confirmbtn_addUser">确 定</el-button>
          </div>
        </el-dialog>
      </div>-->
      <!--  -->
    </div>
  </div>
</template>

<script>
import d2MenuSide from "./components/menu-side";
import d2MenuHeader from "./components/menu-header";
import d2Tabs from "./components/tabs";
import d2HeaderFullscreen from "./components/header-fullscreen";
import d2HeaderLocales from "./components/header-locales";
import d2HeaderSearch from "./components/header-search";
import d2HeaderSize from "./components/header-size";
import d2HeaderTheme from "./components/header-theme";
import d2HeaderUser from "./components/header-user";
import d2HeaderLog from "./components/header-log";
import { mapState, mapGetters, mapActions } from "vuex";
import mixinSearch from "./mixins/search";
import connector from "@/call/connector";
import { resetPassword } from "@api/changePassword/resetPassword";
import { getAddMember } from "@api/addUser/addMember";
export default {
  name: "d2-layout-header-aside",
  mixins: [mixinSearch],

  components: {
    d2MenuSide,
    d2MenuHeader,
    d2Tabs,
    d2HeaderFullscreen,
    d2HeaderLocales,
    d2HeaderSearch,
    d2HeaderSize,
    d2HeaderTheme,
    d2HeaderUser,
    d2HeaderLog
  },
  data() {
    return {
      // id: "",
      form: {
        newPwd: "",
        confirmPwd: ""
      },
      /*  addUser_form: {
        power: "",
        username: "",
        pwd: "",
        confirmPwd: ""
      }, */
      // rolesList: [],
      // dialogVisible1: false, //是否显示密码修改框
      dialogVisible1: false, //修改当个用户密码
      // dialogVisible_addUser: false,
      // crudData: [],
      loading: false,
      // 自定义
      /* rowHandle: {
        custom: [
          {
            text: "修改密码",
            type: "success",
            size: "small",
            emit: "custom-emit-1"
          }
        ]
      }, */
      // crudColumns: [{ title: "用户名", key: "username" }],
      // changeofuser: "",
      // [侧边栏宽度] 正常状态
      asideWidth: "200px",
      // [侧边栏宽度] 折叠状态
      asideWidthCollapse: "65px"
    };
  },
  created() {
    var clientWidth = document.body.clientWidth;
    if (clientWidth <= 480) {
      this.asideWidthCollapse = "0px";
    }
    //修改密码
    connector.$on("changePassword", data => {
      var list = data.list;
      this.crudData = [];
      for (var i = 0; i < list.length; i++) {
        var obj = {};
        obj.username = list[i].username;
        obj.id = list[i].id;
        // this.crudData.push(obj);
      }
      this.dialogVisible1 = data.msg;
      /*  if (this.crudData.length == 0) {
        this.dialogVisible1 = true;
        this.id = 0;
        this.changeofuser = "修改当前用户密码";
        this.dialogVisible1 = false;
      } */
    });
    // 添加用户
    /*  connector.$on("addUser", data => {
      this.dialogVisible_addUser = data.msg;
      this.rolesList = data.rolesList;
      console.log("this.rolesList:", this.rolesList);
    }); */
  },
  computed: {
    ...mapState("d2admin", {
      keepAlive: state => state.page.keepAlive,
      grayActive: state => state.gray.active,
      transitionActive: state => state.transition.active,
      asideCollapse: state => state.menu.asideCollapse
    }),
    ...mapState("d2admin/user", ["id"]),
    ...mapGetters("d2admin", {
      themeActiveSetting: "theme/activeSetting"
    }),
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup() {
      return {
        ...(this.themeActiveSetting.backgroundImage
          ? {
              backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
            }
          : {})
      };
    }
  },
  methods: {
    ...mapActions("d2admin/account", ["logout"]),
    // d2-crud的自定义点击事件
    /* handleCustomEvent({ index, row }) {
      this.form.newPwd = "";
      this.form.confirmPwd = "";
      this.dialogVisible2 = true;
      this.id = row.id;
      this.changeofuser = "修改用户为“" + row.username + "”的密码";
      console.log("row-----:", row);
    }, */
    // 修改密码确定按钮绑定的方法
    confirmbtn() {
      // console.log("触发修改密码");
      // console.log("当前用户id为:", this.id);
      if (this.form.newPwd.length < 3) {
        this.$message.error("新密码必须3位以上");
      } else if (this.form.newPwd != this.form.confirmPwd) {
        this.$message.error("两次输入密码不一致");
      } else {
        // console.log("触发修改密码")
        resetPassword({
          memberid: this.id,
          password: this.form.newPwd
        })
          .then(res => {
            if (JSON.stringify(res) == "{}") {
              this.$notify({
                title: "提示",
                message: "密码修改成功，请重新登录",
                type: "success"
              });
            }
            this.dialogVisible1 = false;
            this.logout();
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    cancel() {
      this.dialogVisible1 = false;
    },
    // 跳转到首页
    toIndex() {
      this.$router.push({
        name: "index"
      });
    },
    ...mapActions("d2admin/menu", ["asideCollapseToggle"]),
    /**
     * 接收点击切换侧边栏的按钮
     */
    handleToggleAside() {
      this.asideCollapseToggle();
    },
    // 添加用户
    confirmbtn_addUser() {
      if (!this.addUser_form.power) {
        this.$message.error("请选择权限组");
      } else if (this.addUser_form.username.length < 3) {
        this.$message.error("用户名必须3位以上");
      } else if (this.addUser_form.pwd.length < 3) {
        this.$message.error("密码必须3位以上");
      } else if (this.addUser_form.pwd != this.addUser_form.confirmPwd) {
        this.$message.error("两次输入密码不一致");
      } else {
        getAddMember({
          username: this.addUser_form.username,
          password: this.addUser_form.pwd,
          roleid: this.addUser_form.power
        })
          .then(res => {
            if (JSON.stringify(res) == "{}") {
              this.$notify({
                title: "提示",
                message: "成功添加用户",
                type: "success"
              });
              this.dialogVisible_addUser = false;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 取消用户
    cancel_addUser() {
      this.dialogVisible_addUser = false;
    }
  }
};
</script>

<style lang="scss">
// 注册主题
@import "~@/assets/style/theme/register.scss";
.company {
  color: #409eff;
}
.logo-group {
  @media screen and (max-width: 480px) {
    display: none;
  }
}
.logo-group:hover {
  cursor: pointer;
}
.toggle-aside-btn {
  @media screen and (max-width: 480px) {
    width: auto !important;
    padding: 0 10px;
  }
}
.company1 {
  display: none;
  @media screen and (max-width: 480px) {
    display: block;
    color: #409eff;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>
