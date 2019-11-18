<template>
    <d2-container>
        <template slot="header">分工厂累计下单情况</template>
        <!--时间、厂区选择组件-->
        <div class="header">
            <div class="pickup-points-box">
                <div class="pickup-points">提货点</div>
                <el-select class="pickup-points-option" v-model="factory" placeholder="请选择">
                    <el-option v-for="(item,i) in factOptions" :key="i" :value="item"></el-option>
                </el-select>
            </div>
            <div class="statisticsTime">
                <div class="time-title">统计时间</div>
                <div class="block">
                    <el-date-picker v-model="start_time" type="date" placeholder="选择日期" :disabled="true" ></el-date-picker>
                    <span>~</span>
                    <el-date-picker v-model="end_time" type="date" placeholder="选择日期" :disabled="true" ></el-date-picker>
                </div>
                <div class="search-reset">
<!--                    <el-button class="search-reset-btn" type="success" @click="formData">搜索</el-button>-->
<!--                    <el-button class="search-reset-btn" type="danger" @click="reset">重置</el-button>-->
                    <el-button class="search-reset-btn" type="primary" @click="exportExcel">导出数据</el-button>
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
    import { getOrderDetail } from "@/api/commodityList/getOrderDetail";

    export default {
        name: "factory_orderDetail",
        data: function() {
            return {
                crudColumns: [
                    { title: "日期", key: "date" },
                    { title: "星期", key: "week" },
                    { title: "当日1次下单人数", key: "today_one_buy_num" },
                    { title: "当日2次下单人数", key: "today_two_buy_num" },
                    { title: "当日3次下单人数", key: "today_three_buy_num" },
                    { title: "当日4次下单人数", key: "today_four_buy_num"},
                    { title: "当日5次下单人数", key: "today_five_buy_num" },
                    { title: "当日超过3次下单人数", key: "today_more_three_buy_num" },
                    { title: "累计1次下单人数", key: "count_one_buy_num" },
                    { title: "累计2次下单人数", key: "count_two_buy_num" },
                    { title: "累计3次下单人数", key: "count_three_buy_num" },
                    { title: "累计4次下单人数", key: "count_four_buy_num" },
                    { title: "累计5次下单人数", key: "count_five_buy_num" },
                    { title: "累计超过3次以上下单人数", key: "count_more_three_buy_mun" }
                ],
                // 导出表格
                excelColumns: [
                    { label: "日期", prop: "date" },
                    { label: "星期", prop: "week" },
                    { label: "当日1次下单人数", prop: "today_one_buy_num" },
                    { label: "当日2次下单人数", prop: "today_two_buy_num" },
                    { label: "当日3次下单人数", prop: "today_three_buy_num" },
                    { label: "当日4次下单人数", prop: "today_four_buy_num"},
                    { label: "当日5次下单人数", prop: "today_five_buy_num" },
                    { label: "当日超过3次下单人数", prop: "today_more_three_buy_num" },
                    { label: "累计1次下单人数", prop: "count_one_buy_num" },
                    { label: "累计2次下单人数", prop: "count_two_buy_num" },
                    { label: "累计3次下单人数", prop: "count_three_buy_num" },
                    { label: "累计4次下单人数", prop: "count_four_buy_num" },
                    { label: "累计5次下单人数", prop: "count_five_buy_num" },
                    { label: "累计超过3次以上下单人数", prop: "count_more_three_buy_mun" }
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
                    // layout: ' prev, pager, next, sizes, jumper, ->, total',

                }
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
                    getOrderDetail({
                        page: this.pagination.currentPage,
                        limit: 15,
                        pickup_id: this.fid,
                        // start_date: this.transformTime(this.start_time),
                        // end_date: this.transformTime(this.end_time)
                    })
                        .then(res => {
                            console.log("666:", res);
                            this.crudList = res.list;
                            this.pagination.total = res.total; //修改d2-crud表的总条数
                            this.loading = false;
                        })
                        .catch(error => {
                            console.log(error);
                        });
            },
            //导出表格事件
            exportExcel() {
                    getOrderDetail({
                        page: this.pagination.currentPage,
                        limit: 15,
                        pickup_id: this.fid,
                    })
                        .then(res => {
                            this.crudList = res.list;
                            var that = this
                            this.$export.excel({
                                columns:that.excelColumns,
                                data:that.crudList,
                                title: '分工厂累计下单情况表'
                            }).then(()=>{
                                this.$message('导出成功');
                            })
                        })
                        .catch(error => {
                            console.log(error);
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
                end_date.setTime(end_date.getTime() - 3600 * 1000 * 24); //设置时间为昨天
                this.start_time = start_date;
                this.end_time = end_date;
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
                this.pagination.currentPage = 1;
                // this.allKey=new Date().getTime()
                // console.log('更新',this.allKey)
                this.pagination.currentPage = 1;
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