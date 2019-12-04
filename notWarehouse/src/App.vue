<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import util from "@/libs/util";
export default {
  name: "app",
  watch: {
    "$i18n.locale": "i18nHandle"
  },
  created() {
    this.i18nHandle(this.$i18n.locale);
  },
  methods: {
    i18nHandle(val, oldVal) {
      util.cookies.set("lang", val);
      document.querySelector("html").setAttribute("lang", val);
    }
  }
};
</script>

<style lang="scss">
@import "~@/assets/style/public-class.scss";

@media screen and (max-width: 480px) {
  .d2-layout-header-aside-group
    .d2-layout-header-aside-content
    .d2-theme-container
    .d2-theme-container-main
    .d2-theme-container-main-layer {
    position: relative !important;
    width: 100%;
  }
  .d2-layout-header-aside-group
    .d2-layout-header-aside-content
    .d2-theme-container
    .d2-theme-container-main
    .d2-theme-container-main-body
    .container-component
    .d2-container-full {
    position: relative !important;
  }
  .d2-layout-header-aside-group
    .d2-layout-header-aside-content
    .d2-theme-container
    .d2-theme-container-main
    .d2-theme-container-main-body
    .container-component {
    overflow: auto !important;
  }
  .d2-layout-header-aside-group
    .d2-layout-header-aside-content
    .d2-theme-container
    .d2-theme-container-main
    .d2-theme-container-main-body
    .container-component,
  .d2-layout-header-aside-group
    .d2-layout-header-aside-content
    .d2-theme-container
    .d2-theme-container-aside
    .d2-layout-header-aside-menu-side,
  .d2-layout-header-aside-group .d2-layout-header-aside-content,
  .d2-layout-header-aside-group .d2-layout-header-aside-mask {
    position: relative !important;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
  .el-message-box,
  .el-dialog {
    width: 80% !important;
  }
  i.fa.fa-navicon {
    display: none !important;
  }
}
.el-form-item {
  margin-bottom: 5px !important;
}
</style>
