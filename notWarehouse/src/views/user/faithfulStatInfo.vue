<template>
  <!-- 忠实用户留存详情页面 -->
  <d2-container>
    <template slot="header">
      <div class="headerNav">
        <div @click="jump">&lt;</div>
        <div>
          {{searchTime}}
          <span class="pickup-points">{{search_pickup_name}}</span>忠实用户留存详细信息
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
import { getFaithfulStatInfo } from "@/api/user/getFaithfulStatInfo";
export default {
  data() {
    return {
      search_pickup_name: "",
      searchTime: "", //保存传递过来需要搜索的时间
      pickup_id: 0, //提货点id
      loading: false,
      crudColumns: [
        { title: "日期", key: "date" },
        { title: "工厂", key: "pickup_name" },
        { title: "累积忠实用户", key: "total_user" },
        { title: "忠实用户访问人数", key: "visit_user" },
        { title: "忠实用户留存", key: "reten" }
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
    this.detailInfo();
  },
  methods: {
    jump() {
      this.$router.push({ name: "faithfulStat" });
    },
    // 请求数据
    detailInfo() {
      getFaithfulStatInfo({
        page: this.pagination.currentPage, //当前页码
        limit: this.pagination.pageSize, //当前页码数据最大条数
        date: this.searchTime,
        pickup_id: this.pickup_id
      })
        .then(res => {
          for (let i = 0; i < res.list.length; i++) {
            res.list[i]["reten"] =
              res.list[i].total_user == 0
                ? "0.00%"
                : (
                    ((res.list[i].visit_user * 10) / res.list[i].total_user) *
                    10
                  ).toFixed(2) + "%";
          }
          this.crudData = res.list; //把数据赋值给d2-crud的crudData
          this.pagination.total = res.total;
        })
        .catch(err => {});
    },
    // 点击页码触发的事件
    paginationCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.detailInfo(); //页码变动，重新请求对应页码的数据
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