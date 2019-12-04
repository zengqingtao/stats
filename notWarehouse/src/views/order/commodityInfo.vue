<template>
    <d2-container>
        <template slot="header">
            <div class="headerNav">
                <div @click="jump">&lt;</div>
                <div><span class="pickup-points">{{ goods_name }}</span>的商品详情</div>
                <p class="site">厂区： {{site}}</p>
            </div>
        </template>

        <div>
            <d2-crud
                    :columns="crudColumns"
                    :data="crudList"
                    :loading="loading"
                    :pagination="pagination"
                    :rowHandle="rowHandle"
                    @custom-emit-1="handleCustomEvent"
                    @pagination-current-change="paginationCurrentChange"
            />
        </div>
        <!-- 对话框 -->
        <el-dialog
                :title="`${fname}`"
                :visible.sync="dialogVisible"
                width="80%"
                height="1000px"
        >
            <d2-crud
                    :columns="alert_crudColumns"
                    :data="alert_crudList"
                    :loading="alert_loading"
                    :pagination="alert_pagination"
                    @pagination-current-change="alert_paginationCurrentChange"
            />
        </el-dialog>
    </d2-container>
</template>

<script>
    import { getCommodityInfo } from "@/api/commodityList/commodityInfo";
    import imagetage from '@/views/order/detail_formImg'
    import { getalertformData } from "@/api/commodityList/alertformData"
    export default {
        name: "commodityInfo",
        data: function () {
            this.chartSettings = {
                labelMap: {
                    date: '日期',
                    commodityID: '商品ID',
                    commodityimg: '商品名称',
                    price: '单价',
                    odernum: '付款订单数',
                    reordernum: '未付款订单数'
                }
            }
            return{
                alertdate:'',
                // 对话框
                dialogVisible:false,//保存对话框的默认关闭状态
                alert_crudList:[],
                fname:'',
                site:'',
                fid:0,
                goods_id: 0,
                goods_name:'',
                chartData: {//columns必须与rows同语言
                    columns: ['date', 'goods_id', 'goods_name', 'shop_price', 'payment_order_num', 'non_payment_order_num','pickup_name'],
                    rows: []
                },
                // crud初始数据
                crudColumns: [
                    {title: '日期', key: 'date'},
                    {title: '商品ID', key: 'goods_id'},
                    {title: '商品名称', key: 'goods_name'},
                    {title: '商品图片',
                        key: 'goods_name',
                        component: {
                            name: imagetage,
                            props: {
                                myProps: ''
                            }
                        }
                    },
                    {title: '单价', key: 'shop_price'},
                    {title: '付款订单数', key: 'payment_order_num'},
                    {title: '未付款订单数', key: 'non_payment_order_num'}
                ],
                // 弹窗crud初始数据
                alert_crudColumns: [
                    {title: '付款订单数', key: 'payment_order_num'},
                    {title: '未付款订单数', key: 'non_payment_order_num'},
                    {title: '厂区名称', key: 'pickup_name'}
                ],
                crudList: [],
                loading: true,
                alert_loading: false,
                pagination: {
                    currentPage: 1,
                    pageSize: 15,
                    total: 0
                },
                alert_pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                // 自定义
                rowHandle: {
                    custom: [
                        {
                            text: '查看各厂区销售详情',
                            type: 'success',
                            size: 'small',
                            emit: 'custom-emit-1',
                            show: false,
                            disabled: function (index,row) {
                                if(row.payment_order_num == 0){
                                    return true
                                }
                            }
                        }
                    ]
                }
            }
        },
        methods:{
            // 请求弹窗数据
            alert_Infodata(){
                getalertformData({
                    'page': this.alert_pagination.currentPage,
                    'limit': 10,
                    'goods_id': this.goods_id,
                    'date': this.alertdate
                }).then(res => {
                    console.log(res)
                    this.alert_crudList = res.list;

                    this.alert_pagination.total = res.total;//修改d2-crud表的总条数
                    this.alert_loading = false;
                }).catch(err => {
                    console.log(err)
                })
            },

            Infodata(){
                getCommodityInfo({
                    'page': this.pagination.currentPage,
                    'limit': 15,
                    'goods_id': this.goods_id,
                    'pickup_id':this.fid
                }).then(res => {
                    console.log(res)
                    res.list.length==0?this.isNull=true:this.isNull=false;//没有数据显示图片
                    //把数据分别赋值给折线图的rows和d2-crud表的crudList
                    for(var i=res.list.length-1;i>=0;i--){
                        this.chartData.rows.push(res.list[i]);
                        // console.log(this.chartData.rows[i].list.goods_name)
                    }
                    var _this = this;
                    this.crudList = [];
                    setTimeout(function () {
                        _this.crudList = res.list;
                    })

                    this.pagination.total = res.total;//修改d2-crud表的总条数
                    this.goods_name = this.chartData.rows[0].goods_name
                    this.site = res.pickup_name
                    this.loading = false
                }).catch(err => {
                    console.log(err)
                })
            },
            // 选择页码触发该方法
            paginationCurrentChange(currentPage){
                this.pagination.currentPage = currentPage;//修改页码
                this.Infodata();
                console.log(currentPage)
                // this.currentPageChange();
            },
            // 弹窗选择页码触发该方法
            alert_paginationCurrentChange(currentPage){
                this.alert_pagination.currentPage = currentPage;//修改页码
                this.alert_Infodata();
                console.log(currentPage)
                // this.currentPageChange();
            },
            jump(){
                this.$router.push({
                    name:"commodity"
                });
            },
            // d2-crud的自定义点击事件
            handleCustomEvent ({index, row}) {
                this.alert_loading = true
                console.log(row)
                this.fname = row.goods_name+'  在各厂区销售详情';
                this.alertdate = row.date;
                this.goods_id = row.goods_id;
                this.alert_Infodata(); //请求数据
                this.dialogVisible = true; //打开该对话框

            }
            // //d2-crud表的自定义点击事件
            // handleCustomEvent ({index, row}) {
            //     this.$router.push({
            //         name:'commodityInfo',
            //         query:{ //如果是单纯传参，此处使用params,如果是查询字符串格式，此处使用query
            //             "date":row.date,
            //             "pickup_name":this.factory,
            //             "pickup_id":this.fid
            //         }
            //     })
            // }
        },
        created() {
            if(this.$route.query.pickup_id==0){
                this.rowHandle.custom[0].show = true;
            }
            this.goods_id = this.$route.query.goods_id;
            this.fid = this.$route.query.pickup_id;
            this.Infodata()

            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                this.crudColumns.splice(1, 3)
                this.rowHandle.custom[0].text = '查看'

            } else {

            }

        }

    }
</script>

<style >

    @media screen and  (max-width: 480px){
        .el-pagination__rightwrapper{
            float: none !important;
        }
        .el-pagination {
            white-space: inherit !important;
        }
        .el-pagination__jump{
            margin-left:0;
        }
    }
    .site{
        margin-left: 30px;
        color: #666;
    }
    .headerNav{
        width:100%;
        display:flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap:nowrap;
    }
    .headerNav>div:first-child{
        font-weight: 800;
        font-size:20px;
        color:#409eff;
        margin-right:20px
    }
    .headerNav>div:first-child:hover{
        cursor: pointer;
        /* font-size:22px; */
    }
</style>