<template>
  <d2-container>
    <template slot="header">未履约汇总</template>
    <!-- 顶部 -->
    <div class="header">
      <div class="pickup-points-box">
        <div class="pickup-points">提货点</div>
        <el-select class="pickup-points-option" v-model="factory" placeholder="请选择">
          <el-option v-for="(item,i) in options" :key="i" :value="item"></el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="exportData">导出数据</el-button>
    </div>
    <div class="orderTotal">
      <p>
        未履约订单总计：
        <span>{{total_order_num}}</span>
      </p>
      <p>
        未履约用户总计：
        <span>{{total_user_num}}</span>
      </p>
    </div>
    <!-- 表格部分 :rowHandle="rowHandle" -->
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
    <!-- 对话框 -->
    <el-dialog :title="`${fname}`" :visible.sync="dialogVisible" width="50%" height="1000px">
      <el-button type="primary" @click="dialogExportData">导出数据</el-button>
      <d2-crud
        :columns="dialogColumns"
        :data="dialogList"
        :loading="dialogLoading"
        :pagination="dialogPagination"
        @pagination-current-change="dialogPaginationCurrentChange"
      />
    </el-dialog>
  </d2-container>
</template>

<script>
import { getAllFactory } from "@/api/factory/getAllFactory";
import { getNotPerformance } from "@/api/performance/notPerformance";
import { getNotPerformanceInfo } from "@/api/performance/notPerformanceInfo";
export default {
  name: "notPerformance",
  data: function() {
    return {
      options: [],
      factory: "全部提货点",
      factorys: [], //保存所有的提货点
      fid: 0, //保存当前提货点的id
      // crud初始数据
      total_order_num: "0",
      total_user_num: "0",
      crudColumns: [
        { title: "提货点", key: "pickup_name" },
        { title: "单量", key: "order_num" },
        { title: "用户数", key: "user_num" }
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
          label: "单量",
          prop: "order_num"
        },
        {
          label: "用户数",
          prop: "user_num"
        }
      ],
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
      // 对话框的显示开关
      dialogVisible: false,
      dialogColumns: [
        { title: "商品", key: "goods_name" },
        { title: "数量", key: "total_num" }
      ],
      dialogList: [],
      dialogLoading: true,
      dialogPagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      fname: "", //当前行的提货点
      dialogPickup_id: 0, //当前行的提货点id
      // 导出数据的列
      dialogExportColumns: [
        {
          label: "商品",
          prop: "goods_name"
        },
        {
          label: "数量",
          prop: "total_num"
        }
      ]
    };
  },
  created() {
    this.allfactory();
    this.getNotPerformance();
    // 5分钟执行一遍
    setInterval(() => {
      this.getNotPerformance();
    }, 300000);
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
      this.pagination.currentPage = 1;
      this.getNotPerformance();
    }
  },
  methods: {
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
    getNotPerformance() {
      this.loading = true;
      getNotPerformance({
        page: this.pagination.currentPage,
        limit: this.pagination.pageSize,
        pickup_id: this.fid
      }).then(res => {
        console.log("res---", res);
        this.total_order_num = res.total_order_num;
        this.total_user_num = res.total_user_num;
        this.crudList = res.list;
        this.pagination.total = res.total;
        this.loading = false;
      });
    },
    // 选择页码触发该方法
    paginationCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage; //修改页码
      this.getNotPerformance();
    },
    //点击导出数据
    exportData() {
      getNotPerformance({
        page: 1, //当前页码
        limit: this.pagination.total, //当前页码数据最大条数
        pickup_id: this.fid //当前提货点id
      }).then(res => {
        // 保存数据给导出使用
        this.$export
          .excel({
            columns: this.exportColumns,
            data: res.list,
            title: "未履约汇总"
          })
          .then(() => {
            this.$message("导出成功");
          });
      });
    },
    // 请求未履约工厂的商品详细信息
    getNotPerformanceInfo() {
      this.dialogLoading = true;
      getNotPerformanceInfo({
        pickup_id: this.dialogPickup_id,
        page: this.dialogPagination.currentPage,
        limit: this.dialogPagination.pageSize
      }).then(res => {
        this.dialogList = res.list;
        this.dialogPagination.total = res.total;
        this.dialogLoading = false;
        console.log("infoRes:", res);
      });
    },
    //d2-crud表的自定义点击事件
    handleCustomEvent({ index, row }) {
      this.fname = row.pickup_name;
      this.dialogPickup_id = row.pickup_id;
      this.dialogVisible = true;
      this.dialogPagination.currentPage = 1;
      this.getNotPerformanceInfo();
    },
    // 选择页码触发该方法
    dialogPaginationCurrentChange(currentPage) {
      this.dialogPagination.currentPage = currentPage; //修改页码
      this.getNotPerformanceInfo();
    },
    // 导出数据
    dialogExportData() {
      getNotPerformanceInfo({
        page: 1, //当前页码
        limit: this.dialogPagination.total, //当前页码数据最大条数
        pickup_id: this.dialogPickup_id //当前提货点id
      }).then(res => {
        // 保存数据给导出使用
        this.$export
          .excel({
            columns: this.dialogExportColumns,
            data: res.list,
            title: this.fname
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
  .pickup-points-box {
    margin-bottom: 10px;
  }
  .orderTotal {
    display: flex;
    justify-content: flex-start;
    flex-direction: column
  }
  .orderTotal {
    padding-left: 10px;
  }
}
.orderTotal{
  display: flex;
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
</style>