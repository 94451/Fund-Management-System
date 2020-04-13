<template>
    <div class="fundList"
        <div class="fillContainer">
            <div >
                <el-form :inline="true" ref="add_data" :model="search_data">
                    <!-- 筛选 -->
                    <el-form-item label="按照时间筛选">
                        <el-date-picker
                            v-model="search_data.startTime"
                            type="datetime"
                            placeholder="选择开始时间"
                            default-time="12:00:00">
                        </el-date-picker>
                        至
                        <el-date-picker
                            v-model="search_data.endTime"
                            type="datetime"
                            placeholder="选择结束时间"
                            default-time="12:00:00">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" icon="search" @click="handleSearch()">
                            筛选
                        </el-button>
                    </el-form-item>
                    <el-form-item class="btnRight">
                        <el-button 
                            type="primary" 
                            size="small" 
                            icon="view" 
                            v-if="user.identity == 'manarger'"
                            @click="handleAdd()">
                            添加
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table_container">
                <el-table
                    v-if="tableData.length > 0"
                    :data="tableData"
                    max-height="450"
                    border
                    style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="70">
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="创建时间"
                        align="center"
                        width="260">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.date }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="收支类型"
                        align="center"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="describe"
                        align="center"
                        label="收支描述"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="carat"
                        align="center"
                        label="重量/吨"
                        width="150">
                        <template slot-scope="scope">
                            <span style="color: #4EC612">{{ scope.row.carat }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="Perton"
                        align="center"
                        label="单价/元"
                        width="150">
                        <template slot-scope="scope">
                            <span style="color: #E30505">{{ scope.row.Perton }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="intotal"
                        align="center"
                        label="合计/元"
                        width="150">
                        <template slot-scope="scope">
                            <span style="color: #409EFF">{{ scope.row.intotal }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="remak"
                        align="center"
                        label="备注"
                        width="220">
                        <template slot-scope="scope">
                            <span style="color: #E6A23C">{{ scope.row.remak }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        prop="operation"
                        align="center"
                        fixed="right"
                        width="160"
                        v-if="user.identity == 'manarger'"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="warning"
                                size="small"
                                icon="edit"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                                size="small"
                                type="danger"
                                icon="delete"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-row>
                    <el-col :span="24">
                        <div class="pagination">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="paginations.page_index"
                                :page-sizes="paginations.page_sizes"
                                :page-size="paginations.page_size"
                                :layout="paginations.layout" 
                                :total="paginations.total">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
                <div class="all-total">                    
                     资金总额：<span style="color:#409EFF">{{ allTotal }} </span>元                     
                </div>
                <div v-if="displayshow" class="filter-total">                
                    筛选的资金总额：<span style="color:#409EFF">{{ filterTotal }} </span>元                    
                </div>
            </div>
            <dialog-full :dialog="dialog" @showfilter="showfilter()" :formData="formData" @update="getProfile()"></dialog-full>
        </div>
    </div>
</template>

<script>
import DialogFull from '../components/DialogFull'

export default {
    name: 'fundList',
    components:{
        DialogFull
    },
    data(){
        return {
            
            search_data: {
                startTime: '',
                endTime: ''
            },
            filterTableData:[],
            paginations:{
                page_index: 1, // 当前位于那页
                total: 0, // 总数
                page_size: 5, // 一页显示多少条
                page_sizes:[5, 10, 15, 20], // 每页显示多少条
                layout:"total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            formData: {
                type:'',
                describe:'',
                carat:'',
                Perton:'',
                intotal:'',
                remak:'',
                id: ""
            },
            allTotal: 0,
            filterTotal: 0,
            tableData: [],
            allTableData: [],
            displayshow: false,
            dialog:{
                title:'',
                option:'edit',
                show: false
            }
        }
    },
    computed:{
        user() {
            return this.$store.getters.user
        }
    },
    created() {
        this.getProfile();
    },
    methods: {
        getProfile() {
            // 获取表格数据
            this.$axios.get('/api/profiles').then(res => {
                this.allTableData = res.data;
                this.allTotal = 0;

                for(let i = 0; i<this.allTableData.length; i++)
                   this.allTotal += parseFloat(this.allTableData[i].intotal);
                
                this.filterTableData = res.data;
                // 设置分页数据
                this.setPaginations();
            }).catch(err => {
                console.log(err);
            });
        },
        showfilter(val){
            this.displayshow = val;
        },
        setPaginations(){
            // 分页属性设置
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 5;

            // 设置默认的分页数据
            this.tableData = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        handleEdit(index, row){
            // console.log(row)
            // 编辑
            this.dialog = {
                show: true,
                option: 'edit',
                title: '修改资金信息'
            };
            // this.displayshow = false; 
            this.formData = {
                type: row.type,
                describe: row.describe,
                carat: row.carat,
                Perton: row.Perton,
                intotal: row.intotal,
                remak: row.remak,
                id: row._id
            }
        },
        handleDelete(index, row){
            this.$axios.delete(`api/profiles/delete/${row._id}`).then(res => {
                this.$message('删除成功！');
                // 刷新例表
                this.getProfile();
            });
            
        },
        handleAdd() {
            // 添加
            this.dialog = {
                title:'添加资金信息',
                option:'add',
                show: true 
            }
            // this.displayshow = false; 
            this.formData = {
                type:'',
                describe:'',
                carat:'',
                Perton:'',
                intotal:'',
                remak:'',
                id: ""
            }
        },
        handleSizeChange(page_size){
            // 切换Size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;

            // 设置默认的分页数据
            this.tableData = this.allTableData.filter((item, index) => {
                return index < page_size;
            });
        },
        handleCurrentChange(page){
            // 切换Size
            let index = this.paginations.page_size * (page -1);
            // 数据总数
            let sum = this.paginations.page_size * page;

            // 容器
            let tables = [];
            for(let i = index; i < sum; i++){
                if(this.allTableData[i]){
                    tables.push(this.allTableData[i]); 
                }
                this.tableData = tables;
            }
        },
        handleSearch(){
            // 筛选
            if(!this.search_data.startTime || !this.search_data.endTime){
                this.$message({
                    type:'warning ',
                    message:'请选择时间区间'
                });
                this.getProfile();
                return;
            }

            const sTime = this.search_data.startTime.getTime();
            const eTime = this.search_data.endTime.getTime();

            this.allTableData = this.filterTableData.filter(item => {
                let date = new Date(item.date);
                let time = date.getTime();
                return time >= sTime && time <= eTime;
            });
            this.displayshow = true;
            this.filterTotal = 0;
            for(let i = 0; i < this.allTableData.length; i++)
                this.filterTotal += parseFloat(this.allTableData[i].intotal);

            //分页数据
            this.setPaginations();
        }
    }
}
</script>

<style coped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
    float: right;
}
.pagination{
    text-align: right;
    margin-top:10px;
}
.all-total ,.filter-total{
    height: 30px;
    height: 30px;
}
</style>