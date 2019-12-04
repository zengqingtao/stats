<template>
  <d2-container>
    <template slot="header">分工厂红包汇总</template>
    <!-- 顶部 -->
    <div class="header">
      <div class="pickup-points-box">
        <div class="pickup-points">提货点</div>
        <el-select class="pickup-points-option" v-model="factory" placeholder="请选择">
          <el-option v-for="(item,i) in options" :key="i" :value="item"></el-option>
        </el-select>
      </div>
      <div class="statisticsTime">
        <div class="time-title">统计时间</div>
        <div class="block">
          <el-date-picker v-model="start_time" type="date" placeholder="选择日期"></el-date-picker>
          <span>~</span>
          <el-date-picker v-model="end_time" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <div class="search-reset">
          <el-button class="search-reset-btn" type="success" @click="search">搜索</el-button>
          <el-button class="search-reset-btn" type="danger" @click="reset">重置</el-button>
          <el-button class="search-reset-btn" type="primary" @click="exportData">导出数据</el-button>
        </div>
      </div>
    </div>
    <!-- 表格部分 -->
    <div>
      <d2-crud
        :columns="crudColumns"
        :data="crudList"
        :loading="loading"
        :pagination="pagination"
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
  </d2-container>
</template>

<script>
import { getAllFactory } from "@/api/factory/getAllFactory";
import { factoryRedPacket } from "@/api/redEnvelopes/factoryRedPacket";
export default {
  name: "factoryRedPacket",
  data: function() {
    return {
      options: [],
      factory: "全部提货点",
      factorys: [], //保存所有的提货点
      fid: 0, //保存当前提货点的id
      start_time: "",
      end_time: "",
      // crud初始数据
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
      crudList: [],
      loading: true,
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
  created() {
    this.setDefaultTime();
    this.allfactory();
    this.factoryRedPacket();
  },
  watch: {
    /* 监听当前提货点的值，如果当前提货点的值发生变化，
    就遍历保存提货点的数组options，找到对应提货点的下标，赋值给fid*/
    factory() {
      for (var i = 0; i < this.options.length; i++) {
        if (this.factory == this.options[i]) {
          if (i == 0) {
            this.fid = 0;
          } else {
            this.fid = this.factorys[i - 1].pickup_id;
          }
        }
      }
      this.factoryRedPacket();
    }
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
    // 请求所有提货点
    allfactory() {
      getAllFactory().then(res => {
        this.options = ["全部提货点"];
        this.factorys = res.list;
        for (var i = 0; i < res.list.length; i++) {
          this.options.push(res.list[i].pickup_name);
        }
      });
    },
    // 请求统计数据
    factoryRedPacket() {
      this.loading = true;
      factoryRedPacket({
        page:this.pagination.currentPage,
        limit:this.pagination.pageSize,
        start_date: this.transformTime(this.start_time),
        end_date: this.transformTime(this.end_time),
        pickup_id: this.fid,
      }).then(res => {
        this.crudList = res.list;
        this.pagination.total = res.total;
        this.loading = false
      });
    },
    // 选择页码触发该方法
    paginationCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage; //修改页码
      this.factoryRedPacket();
    },
    // 设置默认时间
    setDefaultTime() {
      const start_date = new Date();
      const end_date = new Date();
      start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 7); //设置时间为昨天的前7天
      end_date.setTime(end_date.getTime() - 3600 * 1000 * 24); //设置时间为昨天
      this.start_time = start_date;
      this.end_time = end_date;
    },
    // 点击搜索
    search() {
      this.pagination.currentPage = 1;
      this.factoryRedPacket();
    },
    // 点击重置触发的方法
    reset() {
      this.pagination.currentPage = 1;
      this.setDefaultTime();
      this.search();
    },
    //点击导出数据
    exportData() {
      factoryRedPacket({
        page: 1, //当前页码
        limit: this.pagination.total, //当前页码数据最大条数
        start_date: this.transformTime(this.start_time),
        end_date: this.transformTime(this.end_time),
        pickup_id: this.fid //当前提货点id
      }).then(res => {
        // 保存数据给导出使用
        this.$export
          .excel({
            columns: this.exportColumns,
            data: res.list,
            title: "分工厂红包汇总"
          })
          .then(() => {
            this.$message("导出成功");
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 480px) {
  .header {
    padding-left: 10px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 135px !important;
  }
  .statisticsTime {
    flex-wrap: wrap;
    padding-top: 10px;
    width: 100%;
  }
  .time-title {
    font-size: 12px;
    padding-left: 3px;
  }
  .search-reset {
    padding-top: 10px;
    margin-left: 0 !important;
    width: 100%;
  }
  .search-reset-btn {
    width: 25%;
  }
}
.header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
/* 提货点大盒子 */
.pickup-points-box {
  display: flex;
  align-items: center;
}
/* 提货点 */
.pickup-points {
  min-width: 50px;
  margin-right: 10px;
}
/* 提货点的选项盒子 */
.pickup-points-option {
  min-width: 120px;
  margin-right: 20px;
}
.statisticsTime {
  display: flex;
  align-items: center;
}
.search-reset {
  margin-left: 10px;
}
</style>