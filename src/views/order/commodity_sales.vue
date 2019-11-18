<template>
  <d2-container>
    <template slot="header">商品销售</template>
    <div class="header">
      <div class="pickup-points-box">
        <div class="pickup-points">提货点</div>
        <el-select class="pickup-points-option" v-model="factory" placeholder="请选择">
          <el-option v-for="(item,i) in options" :key="i" :value="item"></el-option>
        </el-select>
      </div>
      <!-- <div class="statisticsTime" >
        <div class="time-title">活动时间</div>
        <div class="block">
          <el-date-picker v-model="start_time" type="date" placeholder="选择日期"></el-date-picker>
          <span>~</span>
          <el-date-picker v-model="end_time" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <div class="search-reset">
          <el-button class="search-reset-btn" type="success" @click="formData">搜索</el-button>
          <el-button class="search-reset-btn" type="danger" @click="reset">重置</el-button>
        </div>
      </div> -->
    </div>
    <div class="orderTotal">
      <p>
        今日订单数总计：
        <span>{{ paymentorder_num }}</span>
      </p>
      <p>
        今日未付款订单数总计：
        <span>{{ non_paymentorder_num }}</span>
      </p>
    </div>

    <div :key="allKey" class="d2crudbox">
      <d2-crud
        class="d2crud"
        :key="allKey"
        :columns="crudColumns"
        :data="crudList"
        :loading="loading"
        :pagination="pagination"
        :rowHandle="rowHandle"
        :options="d2option"
        @custom-emit-1="handleCustomEvent"
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
  </d2-container>
</template>

<script>
import { getAllFactory } from "@/api/factory/getAllFactory";
import { getCommodityList } from "@/api/commodityList/commodityList";
import imagetage from "@/views/order/formImage";

export default {
  name: "commodity_sales",
  component: {
    imagetage
  },
  data: function() {
    this.chartSettings = {
      labelMap: {
        commodityID: "商品ID",
        commodityimg: "商品名称",
        price: "单价"
      }
    };
    return {
      d2option: {
        rowClassName({ row, rowIndex }) {
          if (rowIndex % 2 == 0) {
            return "warning-row";
          }
          return "";
        }
      },
      tee: 0,
      paymentorder_num: "0", //已付款订单数总计
      non_paymentorder_num: "0", //未付款订单数总计
      allKey: "",
      isNull: false, //是否有数据的显示开关
      options: [],
      factory: "全部提货点",
      factorys: [], //保存所有的提货点
      id: 0, //保存当前商品id
      fid: 0, //提货点id
      start_time: "",
      end_time: "",
      chartData: {
        //columns必须与rows同语言
        columns: [
          "goods_id",
          "goods_name",
          "goods_pic",
          "activity_price",
          "bargain_status"
        ],
        rows: []
      },
      // crud初始数据
      crudColumns: [
        { title: "商品ID", key: "goods_id" },
        { title: "商品名称", key: "goods_name" },
        {
          title: "商品图片",
          key: "goods_pic",
          component: {
            name: imagetage,
            props: {
              myProps: this.allKey
            }
          }
        },
        { title: "单价", key: "activity_price" },
        { title: "砍价状态", key: "bargain_status" },
        { title: "实时付款订单数", key: "payment_order_num" },
        { title: "实时未付款订单数", key: "non_payment_order_num" }
      ],
      crudList: [],
      loading: true,
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      // 自定义
      rowHandle: {
        custom: [
          {
            text: "详情",
            type: "success",
            size: "small",
            emit: "custom-emit-1"
          }
        ]
      }
    };
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
            console.log("fid:" + this.fid);
          }
        }
      }
      this.formData();
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
    formData() {
      // 活动时间段选择的判断
      const thisdate = new Date();
      this.nowDate = thisdate.getTime();
      let judge1 = this.start_time - this.end_time > 0; //起点时间是否大于终点时间
      let judge2 = this.start_time - this.nowDate > 0; //起点时间是否大于当前时间
      let judge3 = this.end_time - this.nowDate > 0; //终点时间是否大于当前时间
      if (judge2 || judge1 || judge3) {
        this.$message({
          showClose: true,
          message: "请选择正确的时间段",
          type: "warning"
        });
        return false;
      }

      // 发送请求
      console.log(
        this.transformTime(this.start_time) +
          "~" +
          this.transformTime(this.end_time)
      );
      console.log(this.fid);
      getCommodityList({
        page: this.pagination.currentPage,
        limit: 15,
        pickup_id: this.fid,
        start_date: this.transformTime(this.start_time),
        end_date: this.transformTime(this.end_time)
      })
        .then(res => {
          this.paymentorder_num = res.all_payment;
          this.non_paymentorder_num = res.all_non_payment;
          res.list.length == 0 ? (this.isNull = true) : (this.isNull = false); //没有数据显示图片
          //把数据分别赋值给折线图的rows和d2-crud表的crudList
          for (var i = 0; i <= res.list.length - 1; i++) {
            this.chartData.rows.push(res.list[i]);
          }

          this.crudList = [];
          var _this = this;
          setTimeout(() => {
            _this.crudList = res.list;
          });

          this.loading = false;
          this.pagination.total = res.total; //修改d2-crud表的总条数
        })
        .catch(err => {
          console.log(err);
        });
    },
    //d2-crud表的自定义点击事件
    handleCustomEvent({ index, row }) {
      console.log(this.chartData.rows[index].goods_id);
      this.$router.push({
        name: "commodityInfo",
        query: {
          //如果是单纯传参，此处使用params,如果是查询字符串格式，此处使用query
          goods_id: row.goods_id,
          pickup_id: this.fid
        }
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
      const start_date = new Date();
      const end_date = new Date();
      start_date.setTime(start_date.getTime() - 3600 * 1000 * 24 * 7); //设置时间为昨天的前7天
      end_date.setTime(end_date.getTime()); //设置时间为昨天
      this.start_time = start_date;
      this.end_time = end_date;
    },
    // 点击重置触发的方法
    reset() {
      this.pagination.currentPage = 1;
      this.setDefaultTime();
      // this.formData();
    }
  },
  created() {
    this.setDefaultTime();
    this.formData();
    this.allfactory();

    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.crudColumns.splice(2, 1);
      this.crudColumns.splice(0, 1);
      this.crudColumns.splice(2, 1);
    } else {
    }
  }
};
</script>

<style scoped>
@media screen and (min-width: 480px) {
  .orderTotal {
    display: flex;
    justify-content: flex-start;
  }
}
@media screen and (max-width: 480px) {
  .orderTotal {
    padding-left: 10px;
  }
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
.d2crudbox {
  display: flex;
  width: 100%;
}
.d2crud {
  width: 100%;
}
.orderTotal p {
  font-size: 16px;
  margin-right: 30px;
}
.orderTotal p span {
  color: #eb4d54;
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