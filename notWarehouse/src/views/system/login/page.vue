<template>
  <div class="page-login" v-if="!isHide">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div class="page-login--layer page-login--layer-time" flex="main:center cross:center">{{time}}</div>
    <div class="page-login--layer">
      <div class="page-login--content" flex="dir:top main:justify cross:stretch box:justify">
        <div class="page-login--content-header">
          <p class="page-login--content-header-motto">时间是一切财富中最宝贵的财富</p>
        </div>
        <div class="page-login--form-box">
          <!-- form -->
          <div class="page-login--form">
            <el-card shadow="never">
              <div class="page-login--form-title">登录到好又省</div>
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="账号密码登录" name="accountPassword">
                  <i slot="prepend" class="fa fa-user-circle-o"></i>
                  <el-form
                    ref="loginForm"
                    label-position="top"
                    :rules="rules"
                    :model="formLogin"
                    size="default"
                  >
                    <el-form-item prop="username">
                      <el-input type="text" v-model="formLogin.username" placeholder="用户名">
                        <i slot="prepend" class="fa fa-user-circle-o"></i>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                      <!-- @keyup.enter.native="submit"按回车键就触发登录方法 -->
                      <el-input
                        @keyup.enter.native="submit"
                        type="password"
                        v-model="formLogin.password"
                        placeholder="密码"
                      >
                        <i slot="prepend" class="fa fa-keyboard-o"></i>
                      </el-input>
                    </el-form-item>
                    <el-button size="default" @click="submit" type="primary" class="button-login">登录</el-button>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="钉钉扫码登录" name="scanCodelogin">
                  <!-- <div v-if="showcode" id="login_container"></div> -->
                  <div id="login_container"></div>
                  <!-- <div class="dingLogin">
                    <i slot="prepend" class="fa fa-user-circle-o"></i>
                    <el-form
                      ref="dingLoginForm"
                      label-position="top"
                      :rules="rules"
                      :model="dingLoginForm"
                      size="default"
                    >
                      <el-form-item prop="username">
                        <el-input type="text" v-model="dingLoginForm.username" placeholder="用户名">
                          <i slot="prepend" class="fa fa-user-circle-o"></i>
                        </el-input>
                      </el-form-item>
                      <el-form-item prop="password">
                        <el-input
                          @keyup.enter.native="dingsubmit"
                          type="password"
                          v-model="dingLoginForm.password"
                          placeholder="密码"
                        >
                          <i slot="prepend" class="fa fa-keyboard-o"></i>
                        </el-input>
                      </el-form-item>
                      <el-button
                        size="default"
                        @click="dingsubmit"
                        type="primary"
                        class="button-login"
                      >登录</el-button>
                    </el-form>
                  </div>-->
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { mapActions } from "vuex";
import { checkIsLogined } from "@/api/sys.login";

export default {
  data() {
    return {
      showcode: false,
      isHide: false,
      token: "",
      errcode: "",
      activeName: "scanCodelogin",
      timeInterval: null,
      time: dayjs().format("HH:mm:ss"),
      // 快速选择用户
      users: [
        {
          name: "Admin",
          username: "admin",
          password: "admin"
        },
        {
          name: "Editor",
          username: "editor",
          password: "editor"
        },
        {
          name: "User1",
          username: "user1",
          password: "user1"
        }
      ],
      // 表单
      formLogin: {
        username: "",
        password: ""
      },
      dingLoginForm: {
        username: "",
        password: ""
      },
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    //钉钉回调重定向页面携带的参数
    this.token = this.$route.query.token;
    this.errcode = this.$route.query.errcode;
  },
  mounted() {
    // var clientWidth = document.body.clientWidth;
    this.timeInterval = setInterval(() => {
      this.refreshTime();
    }, 1000);
    /* if (clientWidth > 480) {
      this.showcode = true;
    } */
    this.codeLogin();
    this.dingDingLogin();
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  methods: {
    ...mapActions("d2admin/account", ["login", "dingdinglogin"]),
    ...mapActions("d2admin/page", ["closeAll"]),
    refreshTime() {
      this.time = dayjs().format("HH:mm:ss");
    },
    handleClick(tab, event) {
      let myclick = tab.index;
      if (myclick == 0) {
        this.codeLogin();
      }
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit() {
      this.closeAll();
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 检查是否已经有在登录
          // checkIsLogined(this.formLogin).then((response)=> {
          //   console.log("response:",response);
          //   if (response.code != 1) {
          //     Message.error(response.msg)
          //   } else {
          //     if (response.isLogined == 1) {
          //       this.$confirm('当前用户已经被其他人登录，确定把对方踢下线并登录？（如果不是你本人操作，请注意账号安全）', {
          //         confirmButtonText: '确定',
          //         cancelButtonText: '取消',
          //         type: 'warning'
          //       }).then(() => {
          //         // 登录
          //         // 注意 这里的演示没有传验证码
          //         // 具体需要传递的数据请自行修改代码
          //          this.login(Object.assign({vm: this}, this.formLogin))
          //       })
          //     } else {
          //       // 登录
          //       // 注意 这里的演示没有传验证码
          //       // 具体需要传递的数据请自行修改代码
          //       this.login(Object.assign({vm: this}, this.formLogin))
          //     }
          //   }
          // })
          this.login(Object.assign({ vm: this }, this.formLogin));
        } else {
          // 登录表单校验失败
          // this.$message.error('表单校验失败，请检查')
        }
      });
    },
    //钉钉扫码
    codeLogin() {
      // var appid = "dingoag5rctau1si1qgphx"
      // var appid = "dingoaa48v7d61u3ee3h1t"
      var appid = process.env.VUE_APP_DINGDINGAPPID;
      var baseurl = process.env.VUE_APP_API;
      var url = encodeURIComponent(baseurl + "/dingding/dingDingLogin");
      var obj = DDLogin({
        id: "login_container", //这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
        goto: encodeURIComponent(
          "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" +
            appid +
            "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" +
            url
        ), //请参考注释里的方式
        style: "border:none;background-color:#FFFFFF;",
        width: "238",
        height: "300"
      });
      var handleMessage = function(event) {
        var origin = event.origin;
        console.log("origin", event.origin);
        if (origin == "https://login.dingtalk.com") {
          //判断是否来自ddLogin扫码事件。
          var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
          var url1 =
            "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=" +
            appid +
            "&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=" +
            url +
            "&loginTmpCode=" +
            loginTmpCode;
          window.location.href = url1;
          // console.log("loginTmpCode", loginTmpCode);
        }
      };
      if (typeof window.addEventListener != "undefined") {
        window.addEventListener("message", handleMessage, false);
      } else if (typeof window.attachEvent != "undefined") {
        window.attachEvent("onmessage", handleMessage);
      }
    },

    /* dingsubmit() {
      console.log("钉钉登录");
      // https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=APPID&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=REDIRECT_URI
    }, */
    //钉钉登录
    dingDingLogin() {
      if (this.errcode == 0) {
        this.$message.error("无法登录，您不是内部用户");
      }
      if (this.token !== undefined) {
        this.dingdinglogin(Object.assign({ vm: this }, { token: this.token }));
        this.isHide = true;
      }
    }
  }
};
</script>

<style lang="scss">
// .el-tabs__nav {
//   margin-left: 15px;
// }
.el-tabs__nav-wrap::after {
  background-color: white;
}
#login_container {
  margin-top: -30px;
}
.page-login {
  @extend %unable-select;
  $backgroundColor: #f0f2f5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
    }
  }
  // 登录表单
  .page-login--form {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -140px;
    margin-top: -150px;
    width: 280px;
    // 卡片
    .el-card {
      margin-bottom: 15px;
    }
    // 登录按钮
    .button-login {
      width: 100%;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // 登录标题“登录到好又省”
  .page-login--form-title {
    color: #409eff;
    text-align: center;
    padding-bottom: 10px;
    font-weight: bold;
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #fff;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100% {
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
