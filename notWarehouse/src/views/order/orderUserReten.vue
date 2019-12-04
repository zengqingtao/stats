<template>
  <d2-container>
    <template slot="header">下单用户留存</template>
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
          <el-button class="search-reset-btn" type="success" @click="formData">搜索</el-button>
          <el-button class="search-reset-btn" type="danger" @click="reset">重置</el-button>
          <el-button class="search-reset-btn" type="primary" @click="exportData">导出数据</el-button>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div>
      <d2-crud
        :columns="crudColumns"
        :data="crudList"
        :loading="loading"
        :rowHandle="rowHandle"
        :pagination="pagination"
        @custom-emit-1="handleCustomEvent"
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
  </d2-container>
</template>

<script>
import { getAllFactory } from "@/api/factory/getAllFactory";
import { getOrderUserReten } from "@/api/stats/getOrderUserReten";
import setColWidth from "../mixins/setColwidth"
export default {
  name: "platformReport",
  mixins:[setColWidth],
  data: function() {
    // 因为列和行是对应的,所以这样才能设置指标的别名
    return {
      options: [],
      factory: "全部提货点",
      factorys: [], //保存所有的提货点
      fid: 0, //保存当前提货点的id
      start_time: "",
      end_time: "",
      // crud初始数据
      crudColumns: [
        { title: "日期", key: "log_date" },
        { title: "前7天有过1天下单的用户今天打开比率", key: "c1" },
        { title: "前7天有过2天下单的用户今天打开比率", key: "c2" },
        { title: "前7天有过3天下单的用户今天打开比率", key: "c3" },
        { title: "前7天有过4天下单的用户今天打开比率", key: "c4" },
        { title: "前7天有过5天下单的用户今天打开比率", key: "c5" },
        { title: "前7天有过6天下单的用户今天打开比率", key: "c6" },
        { title: "前7天有过7天下单的用户今天打开比率", key: "c7" }
      ],
      crudList: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 12,
        total: 0
      },
      // 自定义
      rowHandle: {
        custom: [
          {
            text: "详细信息",
            type: "success",
            size: "small",
            emit: "custom-emit-1"
          }
        ]
      },
      // 导出数据的列
      exportColumns: [
        { label: "日期", prop: "log_date" },
        { label: "前7天有过1天下单的用户今天打开比率", prop: "c1" },
        { label: "前7天有过2天下单的用户今天打开比率", prop: "c2" },
        { label: "前7天有过3天下单的用户今天打开比率", prop: "c3" },
        { label: "前7天有过4天下单的用户今天打开比率", prop: "c4" },
        { label: "前7天有过5天下单的用户今天打开比率", prop: "c5" },
        { label: "前7天有过6天下单的用户今天打开比率", prop: "c6" },
        { label: "前7天有过7天下单的用户今天打开比率", prop: "c7" }
      ]
    };
  },
  created() {
    this.setDefaultTime();
    this.allfactory();
    this.orderUserReten();
    this.setColWidth(100)
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
      this.orderUserReten();
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
      getAllFactory()
        .then(res => {
          this.options = ["全部提货点"];
          this.factorys = res.list;
          for (var i = 0; i < res.list.length; i++) {
            this.options.push(res.list[i].pickup_name);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 请求统计数据
    orderUserReten() {
      getOrderUserReten({
        page: this.pagination.currentPage, //当前页码
        size: this.pagination.pageSize, //当前页码数据最大条数
        start_time: this.transformTime(this.start_time),
        end_time: this.transformTime(this.end_time),
        pickup_id: this.fid //当前提货点id
      })
        .then(res => {
          this.crudList = this.transformCrudData(res.list);
          this.pagination.total = res.total; //修改d2-crud表的总条数
        })
        .catch(err => {
          console.log(err);
        });
    },
    //d2-crud表的自定义点击事件
    handleCustomEvent({ index, row }) {
      this.$router.push({
        name: "orderUserRetenStatInfo",
        query: {
          //如果是单纯传参，此处使用params,如果是查询字符串格式，此处使用query
          date: row.log_date,
          pickup_name: this.factory,
          pickup_id: this.fid
        }
      });
    },
    // 选择页码触发该方法
    paginationCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage; //修改页码
      this.orderUserReten();
    },
    // 设置默认时间
    setDefaultTime() {
      const start_date = new Date();
      const end_date = new Date();
      start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 15); //设置时间为昨天的前十五天
      end_date.setTime(end_date.getTime() - 3600 * 1000 * 24); //设置时间为昨天
      this.start_time = start_date;
      this.end_time = end_date;
    },
    // 点击搜索
    formData() {
      this.pagination.currentPage = 1;
      this.orderUserReten();
    },
    // 点击重置触发的方法
    reset() {
      this.setDefaultTime();
      this.formData();
      this.pagination.currentPage = 1;
      // console.log(this.pagination.currentPage);
      this.orderUserReten();
    },
    //表格显示数据处理
    transformCrudData(res) {
      for (let i = 0; i < res.length; i++) {
        res[i].c1 =
          res[i].c1.total == 0
            ? "0.00%"
            : (((res[i].c1.open_num * 10) / res[i].c1.total) * 10).toFixed(2) +
              "%";
        res[i].c2 =
          res[i].c2.total == 0
            ? "0.00%"
            : (((res[i].c2.open_num * 10) / res[i].c2.total) * 10).toFixed(2) +
              "%";
        res[i].c3 =
          res[i].c3.total == 0
            ? "0.00%"
            : (((res[i].c3.open_num * 10) / res[i].c3.total) * 10).toFixed(2) +
              "%";
        res[i].c4 =
          res[i].c4.total == 0
            ? "0.00%"
            : (((res[i].c4.open_num * 10) / res[i].c4.total) * 10).toFixed(2) +
              "%";
        res[i].c5 =
          res[i].c5.total == 0
            ? "0.00%"
            : (((res[i].c5.open_num * 10) / res[i].c5.total) * 10).toFixed(2) +
              "%";
        res[i].c6 =
          res[i].c6.total == 0
            ? "0.00%"
            : (((res[i].c6.open_num * 10) / res[i].c6.total) * 10).toFixed(2) +
              "%";
        res[i].c7 =
          res[i].c7.total == 0
            ? "0.00%"
            : (((res[i].c7.open_num * 10) / res[i].c7.total) * 10).toFixed(2) +
              "%";
      }
      return res;
    },
    exportData() {
      getOrderUserReten({
        page: 1, //当前页码
        size: this.pagination.total, //当前页码数据最大条数
        start_time: this.transformTime(this.start_time),
        end_time: this.transformTime(this.end_time),
        pickup_id: this.fid //当前提货点id
      }).then(res => {
        this.$export
          .excel({
            columns: this.exportColumns,
            data: this.transformCrudData(res.list),
            title: `${this.factory}下单用户留存详情表`
          })
          .then(() => {
            this.$message("导出成功");
          });
      });
    }
  }
};
</script>
<style lang="scss">
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
/* 统计折线图 */
.statisticalChart {
  margin-top: 20px;
}
.statisticalChart-img-box {
  display: flex;
  justify-content: center;
}
</style>