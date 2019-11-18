<template :myProps="myProps" :key="abc">
  <div class="img_txt">
    <img :src="goods_img"  class="commodityImg" />
  </div>
</template>

<script>
export default {
  name: "formImage",
  props: {
    scope: {
      default: null
    },
    myProps: {}
  },
  data() {
    return {
      goods_img: "",
      goods_name: ""
    };
  },
  methods: {
    inits() {
      this.goods_img = this.scope.row.notice_share_img;
      this.goods_name = this.scope.row.goods_name;
    }
  },
  mounted() {
    this.inits();
  }
};
</script>

<style scoped>
.commodityImg {
  width: 100px;
}
.img_txt {
  width: 100px;
  text-align: center;
}

@media only screen and (max-width: 750px) {
  .commodityImg {
    width: 50px !important;
  }
  .img_txt {
    width: 50px !important;
    text-align: center;
  }
}
</style>