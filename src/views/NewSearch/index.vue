<template>
    <div class="maincontain">
        <div class="title">
            <i class="el-icon-s-order"></i>
            <h3>任务派发</h3>
        </div>
        <el-steps direction="vertical" :active="active">
            <el-step title="请选择公司及站点">
                <template v-slot:description>
                    <el-select v-model="current_company" class="m-2" placeholder="请选择公司" size="mini"
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
                        <el-select v-model="end_status" class="m-2" placeholder="请选择结束状态" size="mini"
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

                </template>
            </el-step>
        </el-steps>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { getcompanylist, getstationlist } from "../../api/getComponents"


export default defineComponent({

    setup() {
        const companylist = ref([])
        const stationlist = ref([])
        const current_company = ref('')
        const current_company1 = ref('')
        const current_station = ref('')
        const looptype = ref('')
        const active = ref(0)
        const searchtype = ref(1)
        const start_status = ref('')
        const end_status = ref('')
        const statuslist = ref(
            ['运行','热备用','冷备用','开关检修','线路检修','开关线路检修','变压器检修','开关变压器检修','开关站用变检修','电容器检修检修','电抗器检修检修']
        )

        const getcompanyList = () => {
            getcompanylist().then((res) => {
                if (res) {
                    companylist.value = res.company
                }
            })
        }

        const getstationList = (value) => {
            stationlist.value = []
            getstationlist(value).then((res) => {
                if (res) {
                    for (var i in res.station) {
                        stationlist.value.push({
                            value: res.station[i],
                            link: res.station[i]
                        })
                    }
                }
            })
        }

        const querySearch = (queryString, cb) => {
            const results = queryString
                ? stationlist.value.filter(createFilter(queryString))
                : stationlist.value
            // call callback function to return suggestions
            cb(results)
        }

        const createFilter = (queryString) => {
            return (restaurant) => {
                return (
                    restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
                )
            }
        }

        const handleSelect = (item) => {
            console.log(item)
        }

        const changelooptype = (val) => {
            if (val === '1' || '2' || '3' || '4' || '5'){
                searchtype.value = 0
            }
            if (val === '6'){
                searchtype.value = 1
            }
            if (val === '7'){
                searchtype.value = 1
            }
            if (val === '8'){
                searchtype.value = 2
            }
        }

        getcompanyList()


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

            getcompanyList,
            getstationList,
            querySearch,
            handleSelect,
            createFilter,
            changelooptype,
        }
    }
})
</script>

<style>
.el-steps .el-step {
    flex-basis: auto !important;
}
</style>