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

            <el-step title="清输入线路名称以及选择间隔单元">
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
                    <el-table :data="tableData" :border="parentBorder" style="width: 100%">
                        <el-table-column type="expand">
                            <template #default="props">
                                <div m="4">
                                    <el-table :data="props.row.family" :border="childBorder">
                                        <el-table-column type="selection" />
                                        <el-table-column label="Name" prop="name" />
                                        <el-table-column label="State" prop="state" />
                                        <el-table-column label="City" prop="city" />
                                        <el-table-column label="Address" prop="address" />
                                        <el-table-column label="Zip" prop="zip" />
                                    </el-table>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="task_name" prop="date" />
                    </el-table>
                    <el-button @click="nextstep">下一步</el-button>
                </template>
            </el-step>
        </el-steps>
    </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { List } from "@element-plus/icons";

import { getcompanylist, getstationlist } from "../../api/getComponents";

export default defineComponent({
    setup() {
<<<<<<< Updated upstream
        const companylist = ref([]);
        const stationlist = ref([]);
        const current_company = ref("");
        const current_company1 = ref("");
        const current_station = ref("");
        const looptype = ref("");
        const active = ref(0);
        const checked1 = ref([[false, false, false],[false, false, false]])
        const searchtype = ref(1);
        const start_status = ref("");
        const end_status = ref("");
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
                        name: 'Jerry',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    },
                    {
                        name: 'Spike',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    },
                    {
                        name: 'Tyke',
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
                        name: 'Jerry',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    },
                    {
                        name: 'Spike',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    },
                    {
                        name: 'Tyke',
                        state: 'California',
                        city: 'San Francisco',
                        address: '3650 21st St, San Francisco',
                        zip: 'CA 94114',
                    },
                ],
            },
        ]
        const multipleSelection = ref([])
=======
        const companylist = ref([])
        const stationlist = ref([])
        const current_company = ref('')
        const current_company1 = ref('')
        const current_station = ref('')
        const looptype = ref('')
        const active = ref(0)
        const searchtype = ref(4)
        const start_status = ref('')
        const end_status = ref('')
        const statuslist = ref(
            ['运行','热备用','冷备用','开关检修','线路检修','开关线路检修','变压器检修','开关变压器检修','开关站用变检修','电容器检修检修','电抗器检修检修']
        )
>>>>>>> Stashed changes

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
            // call callback function to return suggestions
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
            if (current_step + 1 < length) {
                current_step += 1
                showtabledata = tableData[current_step]
            } else {

            }
        }

        const checkthis = (val, val2) => {
            console.log(val);
            console.log(val2);
            console.log(checked1.value);
            lastcheck.value = [val2.$index,val.$index]
            // multipleSelection.value = val
            // console.log(multipleSelection.value);
        }
        
        getcompanyList();

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

            getcompanyList,
            getstationList,
            querySearch,
            handleSelect,
            createFilter,
            changelooptype,
            checkthis,
            nextstep,
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
</style>