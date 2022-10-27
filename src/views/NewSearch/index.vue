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
            <el-step title="请输入线路名称以及选择间隔单元">
                <template v-slot:description>
                    <div class="xianlu">
                        <el-autocomplete v-model="current_category" :fetch-suggestions="querySearch" clearable
                            placeholder="请选择站点" @select="changexianlu" v-if="station !== ''" />
                    </div>
                    <div>
                        <el-radio-group v-model="looptype" @change="changelooptype" v-if="station !== ''">
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
            <el-step title="请选择调度令" class="xuanzegroup">
                <template v-slot:description>
                    <div v-if="searchtype === 0">
                        <el-select v-model="start_status"  placeholder="请选择开始状态"
                            @change="changestartstatus" v-if="this.looptype !== ''">
                            <el-option v-for="(item, index) in statuslist" :key="index" :label="item" :value="item" />
                        </el-select>
                        <el-select v-model="end_status" class="ends m-2" placeholder="请选择结束状态"
                            @change="getcommonlist">
                            <el-option v-for="(item, index) in statuslist" :key="index" :label="item" :value="item" />
                        </el-select>

                        <el-select v-model="current_tasks" class="m-2" placeholder="请选择任务" v-if="paths"
                            @change="gettask">
                            <el-option v-for="(item, index) in pathlist" :key="index" :label="item" :value="item" />
                        </el-select>
                    </div>
                    <div v-if="searchtype === 1">
                        <el-select v-model="current_task" class="m-2" placeholder="请选择任务"
                            @change="getcurrentothertask">
                            <el-option v-for="(item, index) in othertasklist" :key="index" :label="item.task_name"
                                :value="index" />
                        </el-select>
                    </div>
                </template>
            </el-step>
            <el-step title="请选择操作对象">
                <template v-slot:description>
                    <span class="littletitle">{{current_task_use[current_step]}}</span>
                    <div
                        v-if="this.current_tasks.length !== 0 || this.current_task !== null || this.end_status !== '' || this.showtabledata.length !== 0">
                        <el-table ref="multipleTableRef" :data="showtabledata[0]" :border="parentBorder"
                            style="width: 100%" @select="handleSelectionChange" :row-key="getRowKeys">
                            <el-table-column type="selection" :reserve-selection="true" />
                            <el-table-column label="操作设备" prop="device" />
                            <el-table-column label="设备类型" prop="device_type" />
                            <el-table-column label="操作方式" prop="operation" />
                        </el-table>
                        <el-button class="hobutton2" @click="prestep">上一步</el-button>
                        <el-button class="hobutton2" @click="nextstep">下一步</el-button>
                    </div>

                </template>
            </el-step>
        </el-steps>
    </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { List } from "@element-plus/icons";
import { useRouter } from 'vue-router'
import { useStore, mapState } from "vuex";
import { ElMessage } from "element-plus";
import {
    newgetotherstask,
    newgetcommontask,
    newgetrisks,
} from "../../api/getComponents";

export default defineComponent({
    setup() {
        const othertasklist = ref([]);
        const current_category = ref("");
        const current_task = ref(null)
        const current_tasks = ref([])
        const current_task_use = ref([])
        const userchoose = ref([])
        const looptype = ref("");
        const active = ref(0);
        const searchtype = ref(null);
        const paths = ref(false)
        const pathlist = ref([])
        const start_status = ref("");
        const end_status = ref("");
        const showtabledata = ref([]);
        const Length = ref(0);
        const statuslist = ref(["运行", "热备用", "冷备用", "检修", "开关检修"]);
        const neededdata = ref({})
        const current_step = ref(0)
        const multipleSelection = ref([])
        const multipleTableRef = ref()
        const every1 = ref({
            task_name: '电压互感器',
            details: [{
                device: '电压互感器',
                device_type: '',
                operation: '停复役',
                task_name: '电压互感器'
            }]
        })
        const every2 = ref({
            task_name: '电流互感器',
            details: [{
                device: '电流互感器',
                device_type: '',
                operation: '停复役',
                task_name: '电流互感器'
            }]
        })
        const every3 = ref({
            task_name: '避雷器',
            details: [{
                device: '避雷器',
                device_type: '',
                operation: '复役',
                task_name: '避雷器'
            }]
        })
        const risk_and_measure = ref({})
        const task_num = ref({})

        const store = useStore();
        const router = useRouter()

        const storeStateFns = mapState(["categorylist", "company", "station"])
        const storeState = {};
        Object.keys(storeStateFns).forEach((fnKey) => {
            const fn = storeStateFns[fnKey].bind({ $store: store });
            storeState[fnKey] = computed(fn);
        })

        const querySearch = (queryString, cb) => {
            let searchlist = store.state.categorylist
            const results = queryString
                ? searchlist.filter(createFilter(queryString))
                : searchlist;
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

        const changestartstatus = () => {
            paths.value = false
        }
        const changexianlu = () => {
            active.value = 1
        }
        const changelooptype = (val) => {
            showtabledata.value = []
            active.value = 2

            if (val === "母线" || val === "X母压变避雷器") {
                let company = store.state.company
                let station = store.state.station
                let params = {
                    subject: val,
                };
                newgetotherstask(company, station, params).then((res) => {
                    if (res) {
                        for (var i in res) {
                            for (var j in res[i].details) {
                                res[i].details[j]['task_name'] = res[i]['task_name']
                            }
                        }
                        othertasklist.value = res;
                        current_task.value = null;
                        searchtype.value = 1;
                    }
                });
            }
            if (val === "线路" || "变压器" || "站用变" || "电抗器" || "电容器") {
                end_status.value = ''
                start_status.value = ''
                paths.value = false
                searchtype.value = 0;
                statuslist.value[4] = "开关" + val + "检修";
            }
            if (val === "线路导母线") {
                if (multipleTableRef.value) {
                    multipleTableRef.value.clearSelection()
                }
                searchtype.value = 2;
                current_step.value = 0
                current_task_use.value = []
                neededdata.value['paths'] = []
                neededdata.value['tasks'] = {}
                neededdata.value['paths'].push('线路倒母线')
                current_task_use.value.push('线路倒母线')
                current_task_use.value.push('电压互感器')
                current_task_use.value.push('电流互感器')
                current_task_use.value.push('避雷器')
                Length.value = current_task_use.value.length

                neededdata.value['tasks']['线路倒母线'] = {
                    task_name: '线路倒母线',
                    details: [{
                        device: '断路器',
                        device_type: 'AIS',
                        operation: '分合闸',
                        task_name: '线路倒母线',
                    }, {
                        device: '断路器',
                        device_type: 'GIS(HGIS)',
                        operation: '分合闸',
                        task_name: '线路倒母线',
                    }, {
                        device: '断路器',
                        device_type: '开关柜',
                        operation: '分合闸',
                        task_name: '线路倒母线',
                    }, {
                        device: '隔离开关',
                        device_type: 'AIS',
                        operation: '分闸',
                        task_name: '线路倒母线',
                    }, {
                        device: '隔离开关',
                        device_type: 'AIS',
                        operation: '合闸',
                        task_name: '线路倒母线',
                    }, {
                        device: '隔离开关',
                        device_type: 'GIS(HGIS)',
                        operation: '分闸',
                        task_name: '线路倒母线',
                    }, {
                        device: '隔离开关',
                        device_type: 'GIS(HGIS)',
                        operation: '合闸',
                        task_name: '线路倒母线',
                    }, {
                        device: '线路',
                        device_type: '双母线',
                        operation: '倒母操作',
                        task_name: '线路倒母线',
                    }, {
                        device: '保护压板',
                        device_type: '硬压板',
                        operation: '投退',
                        task_name: '线路倒母线',
                    }, {
                        device: '保护压板',
                        device_type: '软压板',
                        operation: '投退',
                        task_name: '线路倒母线',
                    },]
                }
                neededdata.value['tasks']['电压互感器'] = every1.value
                neededdata.value['tasks']['电流互感器'] = every2.value
                neededdata.value['tasks']['避雷器'] = every3.value

                showtabledata.value = [neededdata.value['tasks']['线路倒母线'].details]
            }

        };
        const gettask = (val) => {
            if (multipleTableRef.value) {
                multipleTableRef.value.clearSelection()
            }
            showtabledata.value = []
            current_step.value = 0
            current_task_use.value = val
            current_task_use.value.push('电压互感器')
            current_task_use.value.push('电流互感器')
            current_task_use.value.push('避雷器')
            Length.value = current_task_use.value.length

            showtabledata.value = [neededdata.value['tasks'][val[0]].details]
            active.value = 3
        }
        const nextstep = () => {
            if (current_step.value + 1 < Length.value) {
                current_step.value += 1
                let key = current_task_use.value[current_step.value]
                showtabledata.value = [neededdata.value['tasks'][key].details]
            } else {
                risk_and_measure.value = {}
                let keys = Object.keys(risk_and_measure.value)
                for (var i in userchoose.value) {
                    if (keys.indexOf(userchoose.value[i].task_name) === -1) {
                        let key = userchoose.value[i].task_name
                        task_num.value[key] = 1
                        risk_and_measure.value[key] = []
                        keys = Object.keys(risk_and_measure.value)
                    } else {
                        let len = userchoose.value[i].task_name
                        task_num.value[len] += 1
                    }
                }
                for (var j in userchoose.value) {
                    let key = userchoose.value[j]['task_name']
                    let params = {
                        device: userchoose.value[j].device,
                        device_type: userchoose.value[j].device_type,
                        operation: userchoose.value[j].operation
                    }
                    newgetrisks(params).then((res) => {
                        if (res) {
                            risk_and_measure.value[key].push(res)
                        }
                    })
                }
                store.commit('savenewriskandmeasure', risk_and_measure.value)
                store.commit('savelens', task_num.value)
                router.push({ name: 'mutichoose' })
            }
        };
        const prestep = () => {
            if (current_step.value - 1 >= 0) {
                current_step.value -= 1
                let key = current_task_use.value[current_step.value]
                showtabledata.value = [neededdata.value['tasks'][key].details]
            } else {
                ElMessage.info("已经是第一页！");
            }
        };
        const getcommonlist = () => {
            showtabledata.value = []
            current_task_use.value = []
            current_step.value = 0
            if (end_status.value === "") {
                ElMessage.error("结束状态未选择");
            } else if (start_status.value === "") {
                ElMessage.error("起始状态未选择");
            } else {
                let start = ''
                let end = ''
                if (start_status.value === statuslist.value[4]) {
                    start = '开关检修'
                } else {
                    start = start_status.value
                }
                if (end_status.value === statuslist.value[4]) {
                    end = '开关检修'
                } else {
                    end = end_status.value
                }
                let params = {
                    to: end,
                    from: start
                }
                let company = store.state.company
                let station = store.state.station
                newgetcommontask(company, station, params).then((res) => {
                    if (res) {
                        if (res.paths === null) {
                            paths.value = false
                            end_status.value = ''
                            ElMessage.error('任务库无此类任务')
                        } else {
                            if (res.paths.length === 1) {
                                for (var i in res.tasks) {
                                    for (var j in res.tasks[i].details) {
                                        res.tasks[i].details[j]['task_name'] = res.tasks[i]['task_name']
                                    }
                                }
                                paths.value = false
                                neededdata.value = res
                                current_task_use.value = neededdata.value['paths'][0]
                                current_task_use.value.push('电压互感器')
                                current_task_use.value.push('电流互感器')
                                current_task_use.value.push('避雷器')
                                neededdata.value['tasks']['电压互感器'] = every1.value
                                neededdata.value['tasks']['电流互感器'] = every2.value
                                neededdata.value['tasks']['避雷器'] = every3.value
                                Length.value = current_task_use.value.length
                                let key = neededdata.value['paths'][0][0]

                                showtabledata.value = [neededdata.value['tasks'][key].details]
                                active.value = 3
                            } else {
                                for (var i in res.tasks) {
                                    for (var j in res.tasks[i].details) {
                                        res.tasks[i].details[j]['task_name'] = res.tasks[i]['task_name']
                                    }
                                }
                                paths.value = true
                                pathlist.value = res.paths
                                neededdata.value = res
                                neededdata.value['tasks']['电压互感器'] = every1.value
                                neededdata.value['tasks']['电流互感器'] = every2.value
                                neededdata.value['tasks']['避雷器'] = every3.value

                            }
                        }
                    } else {
                        ElMessage.error("请求错误");
                    }

                });
            }
        };
        const handleSelectionChange = (selection) => {
            userchoose.value = selection
        }
        const getRowKeys = (row) => {
            return row.device + row.device_type + row.operation + row.task_name
        }
        const getcurrentothertask = (val) => {
            if (multipleTableRef.value) {
                multipleTableRef.value.clearSelection()
            }
            current_step.value = 0
            let key = othertasklist.value[val]

            neededdata.value['paths'] = []
            neededdata.value['tasks'] = {}
            neededdata.value['paths'].push(key.task_name)
            current_task_use.value = neededdata.value['paths']
            current_task_use.value.push('电压互感器')
            current_task_use.value.push('电流互感器')
            current_task_use.value.push('避雷器')
            Length.value = current_task_use.value.length

            neededdata.value['tasks'][key.task_name] = key
            neededdata.value['tasks']['电压互感器'] = every1.value
            neededdata.value['tasks']['电流互感器'] = every2.value
            neededdata.value['tasks']['避雷器'] = every3.value

            showtabledata.value = [neededdata.value['tasks'][key.task_name].details]
            active.value = 3

        }

        return {
            active,
            looptype,
            searchtype,
            start_status,
            end_status,
            statuslist,
            multipleSelection,
            current_step,
            showtabledata,
            Length,
            multipleTableRef,
            current_task,
            current_tasks,
            current_task_use,
            current_category,
            othertasklist,
            paths,
            neededdata,
            pathlist,
            every1,
            every2,
            every3,
            userchoose,
            risk_and_measure,
            task_num,

            querySearch,
            createFilter,
            changelooptype,
            nextstep,
            prestep,
            getRowKeys,
            getcommonlist,
            changestartstatus,
            changexianlu,
            gettask,
            getcurrentothertask,
            handleSelectionChange,
            List,
            ...storeState,
        };
    },
});
</script>

<style lang="less">
.el-steps .el-step {
    flex-basis: auto !important;
}

.el-select {
    margin-top: 1%;
    margin-bottom: 2%;
}

.xuanzegroup{
    .el-input__inner{
        width: 120px;
    }
}


.el-autocomplete {
    margin-top: 1%;
    margin-bottom: 2%;
}

.xianlu{
    .el-input{
        width: 200px;
    }
}

.selectgroup {
    display: flex;
    align-items: center;
}

.el-radio-group {
    margin-bottom: 1%;
}

.el-radio {
    margin-bottom: 1%;
}

.ends {
    width: 190px;
    margin-left: 2%;
}

.choosecomp {
    margin-right: 2%;
}

:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
    visibility: hidden;
}


.hobutton2 {
    width: 120px;
    height: 40px;
    font-size: calc(100vw * 16 / 1920);
    color: #ffffff;
    margin-left: 25%;
    margin-top: 2%;
    background-image: linear-gradient(100deg, rgb(10, 38, 69), rgb(55, 81, 186));
}

.littletitle{
    margin-left: 35%;
    font-size: calc(100vw * 16 / 1920);
    font-weight: 800;
    color: black;
}

</style>