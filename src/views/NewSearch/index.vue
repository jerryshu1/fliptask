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
                <template v-slot:description>
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
                        <el-select v-model="current_company1" class="m-2" placeholder="请选择线路" size="mini"
                            @change="getstationList">
                            <el-option v-for="item in companylist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div>
                        <el-radio-group v-model="looptype" @change="changelooptype">
                            <el-radio label="1" size="large" border>线路</el-radio>
                            <el-radio label="2" size="large" border>变压器</el-radio>
                            <el-radio label="3" size="large" border>站用变</el-radio>
                            <el-radio label="4" size="large" border>电抗器</el-radio>
                            <el-radio label="5" size="large" border>电容器</el-radio>
                            <el-radio label="6" size="large" border>母线</el-radio>
                            <el-radio label="7" size="large" border>X母压变避雷器</el-radio>
                            <el-radio label="8" size="large" border>线路导母线</el-radio>
                        </el-radio-group>
                    </div>
                </template>
            </el-step>
            <el-step title="请选择调度令">
                <template v-slot:description>
                    <div v-if="searchtype === 0">
                        <el-select v-model="start_status" class="m-2" placeholder="请选择开始状态" size="mini"
                            @change="getstationList">
                            <el-option v-for="item in statuslist" :key="item" :label="item" :value="item" />
                        </el-select>
                        <el-select v-model="end_status" class="ends m-2" placeholder="请选择结束状态" size="mini"
                            @change="getstationList">
                            <el-option v-for="item in statuslist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div v-if="searchtype === 1">
                        <el-select v-model="current_company" class="m-2" placeholder="请选择任务" size="mini"
                            @change="getstationList">
                            <el-option v-for="item in companylist" :key="item" :label="item" :value="item" />
                        </el-select>
                    </div>
                </template>
            </el-step>
            <el-step title="请选择操作对象、存在的主要风险">
                <template v-slot:description>
                    <el-table ref="taskTableRef" :data="showtabledata[0]" :border="parentBorder" style="width: 100%" @select="handleSelectionChange" :row-key="getRowKeys">
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
import { getcompanylist, getstationlist } from "../../api/getComponents";

export default defineComponent({
    setup() {
        const companylist = ref([]);
        const stationlist = ref([]);
        const current_company = ref("");
        const current_company1 = ref("");
        const current_station = ref("");
        const looptype = ref("");
        const active = ref(0);
        const checked1 = ref([[false, false, false], [false, false, false]])
        const searchtype = ref(1);
        const start_status = ref("");
        const end_status = ref("");
        // 底下单选的value
        const value=ref([])
        const checkdevice = ref([])
        const showtabledata = ref([])
        const Length = ref(0)
        const statuslist = ref([
            "运行",
            "热备用",
            "冷备用",
            "开关检修",
            "线路检修",
            "开关线路检修",
            "变压器检修",
            "开关变压器检修",
            "开关站用变检修",
            "电容器检修检修",
            "电抗器检修检修",
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
                    },
                ],
            },
        ]
        const current_step = ref(0)
        const multipleSelection = ref([])
        const taskTableRef = ref()

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
                    restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
                    0
                );
            };
        };

        const handleSelect = (item) => {
            console.log(item);
        };

        const changelooptype = (val) => {
            if (val === "1" || "2" || "3" || "4" || "5") {
                searchtype.value = 0;
            }
            if (val === "6") {
                searchtype.value = 1;
            }
            if (val === "7") {
                searchtype.value = 1;
            }
            if (val === "8") {
                searchtype.value = 2;
            }
        };

        const nextstep = () => {
            if (current_step.value + 1 < Length.value) {
                current_step.value += 1
                checkdevice.value.push(value.value)
                showtabledata.value = [tableData[current_step.value].family]
            } else {
                // 跳转中间层
            }
        };
        const prestep = () =>{
            if(current_step.value - 1 >=0){
                current_step.value -= 1
                showtabledata.value = [tableData[current_step.value].family]
            }else{
                ElMessage.info("已经是第一页！")
            }
        }


        const handleSelectionChange = (selection) => {
            if (selection.length > 1) {
                let del_row = selection.pop();
                console.log('0',del_row);
                ElMessage("最多只能选1");
                taskTableRef.value.toggleRowSelection(del_row, false)
            } else {
                value.value = selection[0];
            }
        }
        const getRowKeys = (row) =>{
            return row
        }
        onMounted(() => {
            getcompanyList()
            Length.value = tableData.length
            showtabledata.value = [tableData[current_step.value].family]
        })

        return {
            companylist,
            current_company,
            current_company1,
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
            checked1,
            lastcheck,
            current_step,
            showtabledata,
            Length,
            taskTableRef,
            value,
            checkdevice,

            getcompanyList,
            getstationList,
            querySearch,
            handleSelect,
            createFilter,
            changelooptype,
            nextstep,
            prestep,
            getRowKeys,
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