<template>
    <div class="maincontain">
        <div class="title">
            <i class="el-icon-s-order"></i>
            <h3>任务派发</h3>
        </div>
        <el-steps direction="vertical" :active="active">
            <el-step title="步骤 1">
                <template v-slot:description>
                    <el-select v-model="current_company" class="m-2" placeholder="请选择公司" size="mini"
                        @change="getstationList">
                        <el-option v-for="item in companylist" :key="item" :label="item" :value="item" />
                    </el-select>

                    <!-- <el-select v-model="current_station" class="m-2" placeholder="请选择公司" size="large" @change="getstationList">
                        <el-option v-for="item in stationlist" :key="item" :label="item" :value="item" />
                    </el-select> -->
                    <el-autocomplete v-model="current_station" :fetch-suggestions="querySearch" clearable
                        placeholder="请选择站点" @select="handleSelect" v-if="current_company !== ''"/>
                </template>
            </el-step>
            <el-step title="步骤 2">
                <template v-slot:description>

                </template>
            </el-step>
            <el-step title="步骤 3">
                <template v-slot:description>

                </template>
            </el-step>
            <el-step title="步骤 4">
                <template v-slot:description>

                </template>
            </el-step>
            <el-step title="步骤 5">
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
        const current_station = ref('')
        const active = ref(0)

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
                    for (var i in res.station){
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
        // const getstationList = () => {
        //     getstationlist(current_company).then((res) => {
        //         console.log(res)
        //     })
        // }
        getcompanyList()


        return {
            companylist,
            current_company,
            current_station,
            active,
            stationlist,

            getcompanyList,
            getstationList,
            querySearch,
            handleSelect,
            createFilter
        }
    }
})
</script>

<style>
.el-steps .el-step {
    flex-basis: auto !important;
}
</style>