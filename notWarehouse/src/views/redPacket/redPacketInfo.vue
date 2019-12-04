<template>
  <d2-container>
    <template slot="header">
      <div class="headerNav">
        <div @click="jump">&lt;</div>
        <div>
          {{searchTime}}
          <span class="pickup-points">全部提货点</span>详细信息
        </div>
        <el-button class="exportdetails" type="primary" @click="exportData">导出数据</el-button>
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
import { redPacketReportInfo } from "@/api/redEnvelopes/redPacketReportInfo";
export default {
  name: "redPacketInfo",
  data: function() {
    return {
      searchTime: "", //保存传递过来需要搜索的时间
      crudColumns: [
        { title: "提货点", key: "pickup_name" },
        { title: "下单领红包的人数", key: "pay_num" },
        { title: "有多少人进行过邀请（发送邀请链接）", key: "share_num" },
        { title: "有多少人点击了邀请链接", key: "invite_num" },
        { title: "关系链建立了多少(锁定的)", key: "lock_num" },
        { title: "邀请来并且下单的人数", key: "invite_pay_num" },
        { title: "红包点击提现多少个", key: "click_red_num" },
        { title: "红包提现多少笔", key: "withdraw_num" },
        { title: "累计费用(元)", key: "money_num" },
        { title: "第一次打开小程序(新用户)", key: "new_user_num" },
        { title: "受邀请进来购物的去重人数(新用户)", key: "order_only_num" },
        { title: "购物次数(新用户)", key: "new_user_order_num" },
        { title: "购物总金额(新用户)(元)", key: "new_user_order_money" },
        { title: "购物次数", key: "order_num" },
        { title: "购物总金额(元)", key: "order_money" }
      ],
      crudData: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      // 导出数据的列
      exportColumns: [
        {
          label: "提货点",
          prop: "pickup_name"
        },
        {
          label: "下单领红包的人数",
          prop: "pay_num"
        },
        {
          label: "有多少人进行过邀请（发送邀请链接）",
          prop: "share_num"
        },
        {
          label: "有多少人点击了邀请链接",
          prop: "invite_num"
        },
        {
          label: "关系链建立了多少(锁定的)",
          prop: "lock_num"
        },
        {
          label: "邀请来并且下单的人数",
          prop: "invite_pay_num"
        },
        {
          label: "红包点击提现多少个",
          prop: "click_red_num"
        },
        {
          label: "红包提现多少笔",
          prop: "withdraw_num"
        },
        {
          label: "累计费用(元)",
          prop: "money_num"
        },
        {
          label: "第一次打开小程序(新用户)",
          prop: "new_user_num"
        },
        {
          label: "受邀请进来购物的去重人数(新用户)",
          prop: "order_only_num"
        },
        {
          label: "购物次数(新用户)",
          prop: "new_user_order_num"
        },
        {
          label: "购物总金额(新用户)(元)",
          prop: "new_user_order_money"
        },
        {
          label: "购物次数",
          prop: "order_num"
        },
        {
          label: "购物总金额(元)",
          prop: "order_money"
        }
      ]
    };
  },
  mounted() {
    this.searchTime = this.$route.query.date;
    console.log("searchTime:", this.searchTime);
    this.detailInfo();
  },
  methods: {
    // 转换时间格式
    transformTime(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m > 0 && m <= 9) {
        m = "0" + m;
      }
      if (d > 0 && d <= 9) {
        d = "0" + d;
      }
      var newDate = y + "-" + m + "-" + d;
      return newDate;
    },
    // 返回上一页
    jump() {
      this.$router.push({
        name: "redPacket"
      });
    },
    // 请求数据
    detailInfo() {
      redPacketReportInfo({
        page: this.pagination.currentPage, //当前页码
        limit: this.pagination.pageSize, //当前页码数据最大条数
        date: this.searchTime
        // pickup_id:this.pickup_id
      }).then(res => {
        console.log("res000", res);
        this.crudData = res.list; //把数据赋值给d2-crud的crudData
        this.pagination.total = res.total;
      });
    },
    // 点击页码触发的事件
    paginationCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.detailInfo(); //页码变动，重新请求对应页码的数据
    },
    //导出数据
    exportData() {
      redPacketReportInfo({
        page:1, //当前页码
        limit: this.pagination.total, //当前页码数据最大条数
        date: this.searchTime
        // pickup_id:this.pickup_id
      }).then(res => {
        this.$export
          .excel({
            columns: this.exportColumns,
            data: res.list,
            title: "红包详情"
          })
          .then(() => {
            this.$message("导出成功");
          });
      });
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
.exportdetails{
  margin-left:10px;
}
/* 提货点 */
.pickup-points {
  font-weight: bold;
  margin-right: 5px;
}
</style>