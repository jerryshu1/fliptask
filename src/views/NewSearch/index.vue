<template>
    <div class="maincontain">
        <div class="title">
            <div style="font-size: 20px">
                <el-icon :size="26">
                    <component :is="List"></component>
                </el-icon>
            </div>
            <p>任务派发</p>
        </div>
        <el-steps style="width: 85%; margin-left: 7%; margin-top: 1%" direction="vertical" :active="active">
            <el-step title="请选择公司及站点">
                <template class="selectgroup" v-slot:description>
                    <el-select v-model="current_company" class="choosecomp m-2" placeholder="请选择公司" size="mini"
                        @change="getstationList">
                        <el-option v-for="item in companylist" :key="item" :label="item" :value="item" />
                    </el-select>

                    <el-autocomplete v-model="current_station" :fetch-suggestions="querySearch" clearable
                        placeholder="请选择站点" @select="handleSelect" />
                </template>
            </el-step>
            <el-step title="请输入线路名称以及选择间隔单元">
                <template v-slot:description>
                    <div>
                        <el-select v-model="current_category" class="m-2" placeholder="请选择线路" size="mini">
                            <el-option v-for="(item, index) in categorylist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div>
                        <el-radio-group v-model="looptype" @change="changelooptype">
                            <el-radio label="线路" size="large" border>线路</el-radio>
                            <el-radio label="变压器" size="large" border>变压器</el-radio>
                            <el-radio label="站用变" size="large" border>站用变</el-radio>
                            <el-radio label="电抗器" size="large" border>电抗器</el-radio>
                            <el-radio label="电容器" size="large" border>电容器</el-radio>
                            <el-radio label="母线" size="large" border>母线</el-radio>
                            <el-radio label="X母压变避雷器" size="large" border>X母压变避雷器</el-radio>
                            <el-radio label="线路导母线" size="large" border>线路导母线</el-radio>
                        </el-radio-group>
                    </div>
                </template>
            </el-step>
            <el-step title="请选择调度令">
                <template v-slot:description>
                    <div v-if="searchtype === 0">
                        <el-select v-model="start_status" class="m-2" placeholder="请选择开始状态" size="mini">
                            <el-option v-for="item in statuslist" :key="item" :label="item" :value="item" />
                        </el-select>
                        <el-select v-model="end_status" class="ends m-2" placeholder="请选择结束状态" size="mini"
                            @change="getcommonlist">
                            <el-option v-for="item in statuslist" :key="item" :label="item" :value="item" />
                        </el-select>
                        
                        <el-select v-model="current_task" class="ends m-2" placeholder="请选择任务" size="mini" v-if="paths">
                            <el-option v-for="item in pathlist" :key="item" :label="item"
                                :value="item" />
                        </el-select>
                    </div>
                    <div v-if="searchtype === 1">
                        <el-select v-model="current_task" class="m-2" placeholder="请选择任务" size="mini">
                            <el-option v-for="(item, index) in othertasklist" :key="item" :label="item.task_name"
                                :value="index" />
                        </el-select>
                    </div>
                </template>
            </el-step>
            <el-step title="请选择操作对象、存在的主要风险">
                <template v-slot:description>
                    <el-table ref="taskTableRef" :data="showtabledata[0]" :border="parentBorder" style="width: 100%"
                        @select="handleSelectionChange" :row-key="getRowKeys">
                        <el-table-column type="selection" :reserve-selection="true" />
                        <el-table-column label="Name" prop="name" />
                        <el-table-column label="State" prop="state" />
                        <el-table-column label="City" prop="city" />
                        <el-table-column label="Address" prop="address" />
                        <el-table-column label="Zip" prop="zip" />
                    </el-table>
                    <el-button @click="prestep">上一步</el-button>
                    <el-button @click="nextstep">下一步</el-button>
                </template>
            </el-step>
        </el-steps>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { List } from "@element-plus/icons";
import { ElMessage } from 'element-plus'
import { useStore } from "vuex";
import { getcompanylist, getstationlist, getcategorylist, getotherstasklist, getcomontasklist } from "../../api/getComponents";

export default defineComponent({
    setup() {
        const current_company_id = ref('')
        const companylist = ref([]);
        const stationlist = ref([]);
        const categorylist = ref([])
        const othertasklist = ref([])
        const current_company = ref("");
        const current_category = ref("");
        const current_station = ref("");
        const current_task = ref(null)
        const looptype = ref("");
        const active = ref(0);
        const searchtype = ref(null);
        const paths = ref(false)
        const pathlist = ref ([])
        const start_status = ref("");
        const end_status = ref("");
        // 底下单选的value
        const showtabledata = ref([])
        const Length = ref(0)
        const statuslist = ref([
            "运行",
            "热备用",
            "冷备用",
            "检修",
            "开关检修"
        ]);
        const lastcheck = ref([])
        const tableData = [
            {
                date: '运行改为热备用',
                family: [
                    {
                        name: 'hjx1',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    },
                    {
                        name: 'hjx2',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    },
                    {
                        name: 'hjx3',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    },
                ],
            },
            {
                date: '运行改为冷备用',
                family: [
                    {
                        name: 'xjw1',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    },
                    {
                        name: 'xjw2',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    },
                    {
                        name: 'xjw3',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    }
                ],
            },
        ]
        const neededdata = ref({})
        const current_step = ref(0)
        const multipleSelection = ref([])
        const taskTableRef = ref()

        const store = useStore();

        const getcompanyList = () => {
            getcompanylist().then((res) => {
                if (res) {
                    companylist.value = res.company;
                }
            });
        };

        const getstationList = (value) => {
            stationlist.value = [];
            getstationlist(value).then((res) => {
                if (res) {
                    for (var i in res.station) {
                        stationlist.value.push({
                            value: res.station[i],
                            link: res.station[i],
                        });
                    }
                }
            });
        };

        const querySearch = (queryString, cb) => {
            const results = queryString
                ? stationlist.value.filter(createFilter(queryString))
                : stationlist.value;
            cb(results);
        };

        const createFilter = (queryString) => {
            return (restaurant) => {
                return (
                    restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
                );
            };
        };

        const handleSelect = (item) => {
            current_station.value = item.value
            let params = {
                city: current_company.value,
                station: current_station.value
            }
            getcategorylist(params).then((res) => {
                if (res) {
                    categorylist.value = res.categories
                }
            })
        };

        const changelooptype = (val) => {
            if (val === "线路" || "变压器" || "站用变" || "电抗器" || "电容器") {
                end_status.value = ''
                start_status.value = ''
                paths.value=false
                searchtype.value = 0;
                statuslist.value[4] = '开关' + val + '检修'
            }
            if (val === "母线") {
                let params = {
                    subject: val
                }
                getotherstasklist(current_company_id.value, params).then((res) => {
                    if (res) {
                        othertasklist.value = res
                        current_task.value = null
                        searchtype.value = 1;
                    }
                })
            }
            if (val === "X母压变避雷器") {
                let params = {
                    subject: val
                }
                getotherstasklist(current_company_id.value, params).then((res) => {
                    if (res) {
                        othertasklist.value = res
                        current_task.value = null
                        searchtype.value = 1;
                    }
                })
            }
            if (val === "线路导母线") {
                searchtype.value = 2;
            }
        };

        const nextstep = () => {
            if (current_step.value + 1 < Length.value) {
                current_step.value += 1
                // checkdevice.value.push(value.value)
                showtabledata.value = [tableData[current_step.value].family]
            } else {
                // 跳转中间层
            }
        };
        const prestep = () => {
            if (current_step.value - 1 >= 0) {
                current_step.value -= 1
                showtabledata.value = [tableData[current_step.value].family]
            } else {
                ElMessage.info("已经是第一页！")
            }
        }
        const getcommonlist = () => {
            if (end_status.value === '') {
                ElMessage.error('结束状态未选择')
            } else if (start_status.value === '') {
                ElMessage.error('起始状态未选择')
            } else {
                let params = {
                    to: end_status.value,
                    from: start_status.value
                }
                getcomontasklist(current_company_id.value, params).then((res) => {
                    if (res) {
                        if (res.paths === null) {
                            paths.value=false
                            ElMessage.error('任务库无此类任务')
                        } else {
                            if (res.paths.length === 1) {
                                paths.value=false
                                neededdata.value = res
                            } else {
                                paths.value = true
                                pathlist.value = res.paths
                                neededdata.value = res
                            }
                        }
                    } else {
                        ElMessage.error('请求错误')
                    }
                })
            }
        }

        const handleSelectionChange = (selection) => {
            // if (selection.length > 1) {
            //     let del_row = selection.pop();
            //     console.log('0',del_row);
            //     ElMessage("最多只能选1");
            //     taskTableRef.value.toggleRowSelection(del_row, false)
            // } else {
            //     value.value = selection[0];
            // }
            console.log(selection)
        }
        const getRowKeys = (row) => {
            return row.name
        }
        onMounted(() => {
            getcompanyList()
            current_company_id.value = store.state.user.company_id
            Length.value = tableData.length
            showtabledata.value = [tableData[current_step.value].family]
        })

        return {
            current_company_id,
            companylist,
            categorylist,
            current_company,
            current_category,
            current_station,
            active,
            stationlist,
            looptype,
            searchtype,
            start_status,
            end_status,
            statuslist,
            tableData,
            multipleSelection,
            lastcheck,
            current_step,
            showtabledata,
            Length,
            taskTableRef,
            current_task,
            othertasklist,
            paths,
            neededdata,
            pathlist,

            getcompanyList,
            getstationList,
            querySearch,
            handleSelect,
            createFilter,
            changelooptype,
            nextstep,
            prestep,
            getRowKeys,
            getcommonlist,
            // selectClick,
            // selected,
            handleSelectionChange,
            List,
        };
    },
});
</script>

<style>
.el-steps .el-step {
    flex-basis: auto !important;
}

.el-select {
    margin-top: 1%;
    margin-bottom: 2%;
}

.el-autocomplete{
    margin-top: 1%;
    margin-bottom: 2%;
}

.selectgroup{
    display: flex;
}

.el-radio-group {
    margin-bottom: 1%;
}

.el-radio {
    margin-bottom: 1%;
}

.ends {
    margin-left: 2%;
}

.choosecomp {
    margin-right: 2%;
}

:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
    visibility: hidden;
}


</style>