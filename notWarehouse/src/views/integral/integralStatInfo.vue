<template>
  <!-- 积分统计详情页面 -->
  <d2-container>
    <template slot="header">
      <div class="headerNav">
        <div @click="jump">&lt;</div>
        <div>
          {{ searchTime }}
          <span class="pickup-points">{{ search_pickup_name }}</span>
          积分统计详情
        </div>
      </div>
    </template>
    <!-- d2-crud表 -->
    <div class="d2crud">
      <d2-crud
        :columns="crudColumns"
        :data="crudData"
        :loading="loading"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
  </d2-container>
</template>
<script>
import { getIntegralStatInfo } from "@/api/integral/getIntegralStatInfo";
export default {
  data() {
    return {
      search_pickup_name: "",
      searchTime: "", //保存传递过来需要搜索的时间
      pickup_id: 0, //提货点id
      loading: true,
      crudColumns: [
        { title: "日期", key: "date" },
        { title: "签到领积分用户数", key: "sign_user_num" },
        { title: "成功下单领积分用户数", key: "order_user_num" },
        { title: "分享任意商品领积分用户数", key: "share_user_num" },
        { title: "帮好友砍价领积分用户数", key: "help_user_num" },
        { title: "提货点", key: "pickup_name" }
      ],
      crudData: [],
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      }
    };
  },
  mounted() {
    this.searchTime = this.$route.query.date;
    this.search_pickup_name = this.$route.query.pickup_name;
    this.pickup_id = this.$route.query.pickup_id;
    this.integralDetails();
  },
  methods: {
    jump() {
      this.$router.push({ name: "integralStat" });
    },
    // 请求数据
    integralDetails() {
      getIntegralStatInfo({
        page: this.pagination.currentPage, //当前页码
        limit: this.pagination.pageSize, //当前页码数据最大条数
        date: this.searchTime,
        pickup_id: this.pickup_id
      })
        .then(res => {
        //   console.log(`积分详情：${res}`);
          this.crudData = res.list; //把数据赋值给d2-crud的crudData
          this.pagination.total = res.total;
          this.loading = false;
        })
        .catch(err => {});
    },
    // 点击页码触发的事件
    paginationCurrentChange(currentPage) {
      this.loading = true;
      this.pagination.currentPage = currentPage;
      this.integralDetails(); //页码变动，重新请求对应页码的数据
    }
  }
};
</script>
<style scoped>
.headerNav {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
}
.headerNav > div:first-child {
  font-weight: 800;
  font-size: 20px;
  color: #409eff;
  margin-right: 20px;
}
.headerNav > div:first-child:hover {
  cursor: pointer;
  /* font-size:22px; */
}
/* 提货点 */
.pickup-points {
  font-weight: bold;
  margin-right: 5px;
}
</style>
