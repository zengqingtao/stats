<template>
  <d2-container>
    <template slot="header">
      <div class="headerNav">
        <div @click="jump">&lt;</div>
        <div>
          {{searchTime}}
          <span class="pickup-points">{{search_pickup_name}}</span>下单用户留存详细信息
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
        :rowHandle="rowHandle"
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
  </d2-container>
</template>

<script>
import { getOrderUserRetenInfo } from "@/api/stats/getOrderUserRetenInfo";
export default {
  data: function() {
    return {
      searchTime: "", //保存传递过来需要搜索的时间
      pickup_id: 0, //提货点id
      crudColumns: [
        { title: "日期", key: "log_date" },
        { title: "前7天有过1天下单的用户今天打开比率", key: "c1" },
        { title: "前7天有过2天下单的用户今天打开比率", key: "c2" },
        { title: "前7天有过3天下单的用户今天打开比率", key: "c3" },
        { title: "前7天有过4天下单的用户今天打开比率", key: "c4" },
        { title: "前7天有过5天下单的用户今天打开比率", key: "c5" },
        { title: "前7天有过6天下单的用户今天打开比率", key: "c6" },
        { title: "前7天有过7天下单的用户今天打开比率", key: "c7" },
        { title: "提货点", key: "pickup_name" }
      ],
      crudData: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 12,
        total: 0
      },
    };
  },
  mounted() {
    this.searchTime = this.$route.query.date;
    this.search_pickup_name = this.$route.query.pickup_name;
    this.pickup_id = this.$route.query.pickup_id;
    this.detailInfo();
  },
  methods: {
    // 返回上一页
    jump() {
      this.$router.push({
        name: "orderUserRetenStat"
      });
    },
    // 请求数据
    detailInfo() {
      getOrderUserRetenInfo({
        page: this.pagination.currentPage, //当前页码
        size: this.pagination.pageSize, //当前页码数据最大条数
        date: this.searchTime,
        pickup_id: this.pickup_id
      })
        .then(res => {
          this.crudData = this.transformCrudData(res.list); //把数据赋值给d2-crud的crudData
          this.pagination.total = res.total;
        })
        .catch(err => {});
    },
    // 点击页码触发的事件
    paginationCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.detailInfo(); //页码变动，重新请求对应页码的数据
    },
    transformCrudData(res){
      for (let i = 0; i < res.length; i++) {
        res[i].c1 = res[i].c1.total == 0 ? "0.00%": (((res[i].c1.open_num * 10) / res[i].c1.total) * 10).toFixed(2) + "%";
        res[i].c2 = res[i].c2.total == 0 ? "0.00%": (((res[i].c2.open_num * 10) / res[i].c2.total) * 10).toFixed(2) + "%";
        res[i].c3 = res[i].c3.total == 0 ? "0.00%": (((res[i].c3.open_num * 10) / res[i].c3.total) * 10).toFixed(2) + "%";
        res[i].c4 = res[i].c4.total == 0 ? "0.00%": (((res[i].c4.open_num * 10) / res[i].c4.total) * 10).toFixed(2) + "%";
        res[i].c5 = res[i].c5.total == 0 ? "0.00%": (((res[i].c5.open_num * 10) / res[i].c5.total) * 10).toFixed(2) + "%";
        res[i].c6 = res[i].c6.total == 0 ? "0.00%": (((res[i].c6.open_num * 10) / res[i].c6.total) * 10).toFixed(2) + "%";
        res[i].c7 = res[i].c7.total == 0 ? "0.00%": (((res[i].c7.open_num * 10) / res[i].c7.total) * 10).toFixed(2) + "%";
      }
      return res;
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