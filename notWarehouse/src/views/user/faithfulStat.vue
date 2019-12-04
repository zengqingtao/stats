<template>
  <!-- 忠实用户留存页面 -->
  <d2-container>
    <template slot="header">忠实用户留存</template>
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
        @goDetail="goFaithfulStatInfo"
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
  </d2-container>
</template>

<script>
import { getAllFactory } from "@/api/factory/getAllFactory";
import { getFaithfulStat } from "@/api/user/getFaithfulStat";
import setColWidth from "../mixins/setColwidth";
export default {
  mixins:[setColWidth],
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
        { title: "日期", key: "date" },
        { title: "累积忠实用户", key: "total_user" },
        { title: "忠实用户访问人数", key: "visit_user" },
        { title: "忠实用户留存", key: "reten" }
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
            emit: "goDetail"
          }
        ]
      },
      // 导出数据的列
      exportColumns: [
        { label: "日期", prop: "date" },
        { label: "累积忠实用户", prop: "total_user" },
        { label: "忠实用户访问人数", prop: "visit_user" },
        { label: "忠诚用户存留", prop: "reten" }
      ]
    };
  },
  created() {
    this.setDefaultTime();
    this.allfactory();
    this.getfaithfulStatData();
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
      this.getfaithfulStatData();
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
    getfaithfulStatData() {
      // console.log("调用接口");
      getFaithfulStat({
        page: this.pagination.currentPage, //当前页码
        limit: this.pagination.pageSize, //当前页码数据最大条数
        start_date: this.transformTime(this.start_time),
        end_date: this.transformTime(this.end_time),
        pickup_id: this.fid
      })
        .then(res => {
          this.crudList = this.transformData(res.list);
          this.pagination.total = res.total; //修改d2-crud表的总条数
        })
        .catch(err => {
          console.log(err);
        });
    },
    //d2-crud表的自定义点击事件
    goFaithfulStatInfo({ index, row }) {
      this.$router.push({
        name: "faithfulStatInfo",
        query: {
          //如果是单纯传参，此处使用params,如果是查询字符串格式，此处使用query
          date: row.date,
          pickup_name: this.factory,
          pickup_id: this.fid
        }
      });
    },
    // 选择页码触发该方法
    paginationCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage; //修改页码
      this.getfaithfulStatData();
    },
    // 设置默认时间
    setDefaultTime() {
      // const start_date = new Date("2019-10-04");
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
      this.getfaithfulStatData();
    },
    // 点击重置触发的方法
    reset() {
      this.setDefaultTime();
      this.formData();
      this.pagination.currentPage = 1;
      this.getfaithfulStatData();
    },
    //计算用户留存率
    transformData(datas) {
      for (let i = 0; i < datas.length; i++) {
        datas[i]["reten"] =
          datas[i].total_user == 0
            ? "0.00%"
            : (((datas[i].visit_user * 10) / datas[i].total_user) * 10).toFixed(
                2
              ) + "%";
      }
      return datas;
    },
    exportData() {
      // console.log("导出数据")
      getFaithfulStat({
        page: 1, //当前页码
        limit: this.pagination.total, //当前页码数据最大条数
        start_date: this.transformTime(this.start_time),
        end_date: this.transformTime(this.end_time),
        pickup_id: this.fid //当前提货点id
      }).then(res => {
        this.$export
          .excel({
            columns: this.exportColumns,
            data: this.transformData(res.list),
            title: `${this.factory}忠诚用户留存详情表`
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