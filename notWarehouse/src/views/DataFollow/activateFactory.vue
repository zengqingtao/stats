<template>
  <d2-container>
    <template slot="header">老厂重新激活分厂</template>
    <!--时间、厂区选择组件-->
    <div class="header">
      <div class="pickup-points-box">
        <div class="pickup-points">提货点</div>
        <el-select class="pickup-points-option" v-model="factory" placeholder="请选择">
          <el-option v-for="(item,i) in factOptions" :key="i" :value="item"></el-option>
        </el-select>
      </div>
      <div class="statisticsTime">
        <div class="time-title">活动时间</div>
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
    <!--表格-->
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
import { getDataFollow } from "@/api/DataFollow/getDataFollow";

export default {
  name: "activateFactory",
  data: function() {
    return {
      crudColumns: [
        { title: "工人人数", key: "pickup_user" },
        { title: "领纸人数", key: "draw_user" },
        { title: "领纸覆盖", key: "get_cover" },
        { title: "领纸订单数", key: "get_order_num" },
        { title: "领纸累计下单用户", key: "all_order_num" },
        {
          title: "下单用户",
          children: [
            { title: "领纸下单人数", key: "get_order_user" },
            {
              title: "领纸占比（领纸下单人数/领纸人数）",
              key: "get_proportion"
            },
            {
              title: "领纸累计占比（领纸下单人数/累计领纸人数）",
              key: "get_system_proportion"
            }
          ]
        },
        { title: "订单数（不限领纸）", key: "order_num" },
        { title: "累计下单用户（不限领纸）", key: "all_user_num" },
        { title: "下单用户（不限领纸）", key: "user_num" },
        { title: "累计占比（下单用户/累计下单用户）", key: "all_proportion" },
        { title: "日期", key: "date" },
        { title: "星期", key: "week" }
      ],
      start_time: "",
      end_time: "",
      factory: "",
      fid: 0,
      factorys: [], //保存所有的提货点
      factOptions: [], //保存所有的提货点
      crudList: [],
      loading: true,
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      // 导出数据
      // 导出数据的列
      exportColumns: [
        {
          label: "工人人数",
          prop: "pickup_user"
        },
        {
          label: "领纸人数",
          prop: "draw_user"
        },
        {
          label: "领纸覆盖",
          prop: "get_cover"
        },
        {
          label: "领纸订单数",
          prop: "get_order_num"
        },
        {
          label: "领纸累计下单用户",
          prop: "all_order_num"
        },
        {
          label: "领纸下单人数",
          prop: "get_order_user"
        },
        {
          label: "领纸占比（领纸下单人数/领纸人数）",
          prop: "get_proportion"
        },
        {
          label: "领纸累计占比（领纸下单人数/累计领纸人数）",
          prop: "get_system_proportion"
        },
        {
          label: "订单数（不限领纸）",
          prop: "order_num"
        },
        {
          label: "累计下单用户（不限领纸）",
          prop: "all_user_num"
        },
        {
          label: "下单用户（不限领纸）",
          prop: "user_num"
        },
        {
          label: "累计占比（下单用户/累计下单用户）",
          prop: "all_proportion"
        },
        {
          label: "日期",
          prop: "date"
        },
        {
          label: "星期",
          prop: "week"
        }
      ]
    };
  },

  methods: {
    // 请求所有提货点
    allfactory() {
      getAllFactory()
        .then(res => {
          console.log(res);
          this.factorys = res.list;
          for (var i = 0; i < res.list.length; i++) {
            this.factOptions.push(res.list[i].pickup_name);
          }
          this.factory = this.factorys[0].pickup_name;
          this.fid = this.factorys[0].pickup_id;
          this.formData();
          console.log(this.fid);
        })
        .catch(err => {
          console.log(err);
        });
    },
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
    formData() {
      this.loading = true,
      this.pagination.currentPage = 1;
        getDataFollow({
          page: this.pagination.currentPage,
          limit: 15,
          pickup_id: this.fid,
          start_date: this.transformTime(this.start_time),
          end_date: this.transformTime(this.end_time)
        }).then(res => {
          console.log("666:", res);
          this.crudList = res.list;
          this.pagination.total = res.total; //修改d2-crud表的总条数
          this.loading = false;
        });
    },
    // 选择页码触发该方法
    paginationCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage; //修改页码
      this.formData();

      // this.currentPageChange();
    },
    // 设置默认时间
    setDefaultTime() {
      const start_date = new Date("2019-10-14");
      const end_date = new Date();
      // start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 7); //设置时间为昨天的前7天
      start_date.setTime(start_date.getTime()); //设置固定2019-10-14为默认开始时间
      end_date.setTime(end_date.getTime()); //设置时间为昨天
      this.start_time = start_date;
      this.end_time = end_date;
    },
    // 点击重置触发的方法
    reset() {
      this.pagination.currentPage = 1;
      this.setDefaultTime();
      this.formData();
    },
    // 导出数据
    exportData() {
      getDataFollow({
        page: 1,
        limit: this.pagination.total,
        pickup_id: this.fid,
        start_date: this.transformTime(this.start_time),
        end_date: this.transformTime(this.end_time)
      }).then(res => {
        this.$export
          .excel({
            columns: this.exportColumns,
            data: res.list,
            title: "老厂重新激活分厂"
          })
          .then(() => {
            this.$message("导出成功");
          });
      });
    }
  },
  watch: {
    /* 监听当前提货点的值，如果当前提货点的值发生变化，
            就遍历保存提货点的数组options，找到对应提货点的下标，赋值给fid*/
    factory() {
      console.log("this.factOptions", this.factOptions);
      console.log("this.factorys", this.factorys);
      for (var i = 0; i < this.factOptions.length; i++) {
        if (this.factory == this.factOptions[i]) {
          this.fid = this.factorys[i].pickup_id;
        }
      }
      // this.allKey=new Date().getTime()
      // console.log('更新',this.allKey)
      this.formData();
    }
  },
  created() {
    this.setDefaultTime();
    this.allfactory();
  }
};
</script>

<style scoped>
@media screen and (max-width: 1050px) {
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
    width: 30%;
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