<template>
  <div>
    <div class="title">
      <el-icon>
        <List />
      </el-icon>
      <p>已发布任务列表</p>
    </div>

    <!-- <div class="search" style="width:85%; margin-left: 7%;margin-top: 1%">
      <el-select v-model="select1" placeholder="Select" class="selectpublish">
        <el-option label="任务名称" value="任务名称" />
        <el-option label="任务状态" value="任务状态" />
      </el-select>
    </div> -->


    <el-table border ref="multipleTableRef" :data="publishedData" style="width:85%; margin-left: 7%;margin-top: 2%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" align='center'>
      </el-table-column>
      <el-table-column type="index" label="序号" align='center'>
      </el-table-column>
      <el-table-column prop="task_name" label="操作任务" show-overflow-tooltip align='center'>
      </el-table-column>
      <el-table-column prop="assigner" label="编制人" align='center'>
      </el-table-column>
      <el-table-column prop="reviewer" label="审核人" align='center'>
      </el-table-column>
      <el-table-column prop="status" label="任务状态" align='center'>
      </el-table-column>
      <el-table-column prop="publish_date" label="发布时间" sortable align='center'>
      </el-table-column>
      <el-table-column prop="assign_date" label="任务派发时间" align='center'>
      </el-table-column>
      <el-table-column prop="finish_date" label="任务完成时间" align='center'>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="text" @click="signalprint(scope.row)">打印</el-button>
          <el-button type="text" @click="test(scope.row)">预览</el-button>
          <el-button type="text" @click="gofinish(scope.row)">确认完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <div class="btngroup">
        <button class="homebutton" @click="goDelete">删除</button>
        <button class="homebutton" @click="godoubleprint">复合打印</button>
      </div>

      <!-- 复合打印 -->
      <el-dialog v-model="dialogTableVisible2" title="通用措施风险预控选择" width="95%" center>
        <div v-for="(data, index) in commonnames" :key="index">
          <div style="height: 30px; font-size: 20px; color: #7cb342">{{ data }}</div>
          <div style="height: 20px; font-size: 16px;">存在的主要风险</div>
          <div v-for="(riskprevention, index1) in this.generalmeasures.risks[index]" :key="index1">
            <el-checkbox size="small" v-model="generaldata.risks" :label=riskprevention :val="riskprevention" checked
              border />
          </div>
          <div style="height: 20px; font-size: 16px;">预控措施</div>
          <div v-for="(measureprevention, index2) in this.generalmeasures.measures[index]" :key="index2">
            <el-checkbox size="small" v-model="generaldata.measures" :label=measureprevention :val="measureprevention"
              checked border />
          </div>
        </div>
        <el-input v-model="input2" placeholder="请输入工单任务名称" />
        <el-button @click="compositeprint" style="margin-top: 10px;margin-left: 50%">打印</el-button>
      </el-dialog>
      <!-- 预览 -->
      <el-dialog v-model="dialogTableVisible" title="详细信息">
        <div v-for="(data, index) in testdata" :key="index">
          <div style="font-size: 24px">{{ data.task_name }}</div>
          <div style="height: 20px; font-size: 10px;margin-left: 20px; margin-top: 5px;">
            备注:{{ data.additional }}
          </div>
          <div v-for="(taskdata, index) in data.details" :key="index">
            <div style="margin-top: 5px; margin-left: 20px;">
              <div class="q-pa-md">
                <q-table :rows=[taskdata] :columns="columns" :hide-pagination="hidePagination" />
              </div>
            </div>
            <div style="height: 20px; font-size: 18px;margin-left: 20px;">
              存在的主要风险
            </div>
            <div class="q-pa-md">
              <div class="q-gutter-sm" v-for="(riskprevention, index) in taskdata.risks" :key="index">
                <div>{{ riskprevention }}</div>
              </div>
            </div>
            <div style="height: 20px; font-size: 18px;margin-left: 20px; margin-top: 10px;">
              预控措施
            </div>
            <div class="q-pa-md">
              <div class="q-gutter-sm" v-for="(processcontrol, index) in taskdata.measures" :key="index">
                <div>{{ processcontrol }}</div>
              </div>
            </div>
          </div>
        </div>
        <el-input v-model="input1" placeholder="请输入工单任务名称" />
        <el-button @click="republished">重新发布</el-button>
      </el-dialog>
      <!-- 单步打印 -->
      <el-dialog v-model="dialogTableVisible1" title="通用措施风险预控选择" width="95%" center>
        <div v-for="(data, index) in commonnames" :key="index">
          <div style="height: 30px; font-size: 20px; color: #7cb342">{{ data }}</div>
          <div style="height: 20px; font-size: 16px;">存在的主要风险</div>
          <div v-for="(riskprevention, index1) in this.generalmeasures.risks[index]" :key="index1">
            <el-checkbox size="small" v-model="generaldata.risks" :label=riskprevention :val="riskprevention" checked
              border />
          </div>
          <div style="height: 20px; font-size: 16px;">预控措施</div>
          <div v-for="(measureprevention, index2) in this.generalmeasures.measures[index]" :key="index2">
            <el-checkbox size="small" v-model="generaldata.measures" :label=measureprevention :val="measureprevention"
              checked border />
          </div>
        </div>
        <el-button @click="goPrint" style="margin-top: 10px;margin-left: 50%">打印</el-button>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { newgettasklist, newdeletetask, newpostupdatetofinish, newposttask } from "../api/getComponents";
import { List } from "@element-plus/icons";
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { useStore, mapState } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";


export default defineComponent({
  name: "Published",
  data() {
    return {
      selected: [],
      select1: '任务名称',
      input: '',
      hidePagination: true,
      task_name: '',
      assigner: '',
      assigner1: '',
      columns: [
        {
          name: 'device',
          align: 'left',
          field: 'device',
          label: '操作对象'
        },
        {
          name: 'device_type',
          align: 'left',
          field: 'device_type',
          label: '设备类型'
        },
        {
          name: 'operation',
          align: 'left',
          field: 'operation',
          label: '操作行为'
        }
      ],
      ids: [],
      statuss: [],
    }
  },
  setup() {
    const publishedData = ref([])
    const multipleSelection = ref([])
    const signaldata = ref({})
    const input1 =ref('')
    const input2 = ref('')
    const task_name = ref('')
    const testdata = ref([]) //预览数据
    const dialogTableVisible1 = ref(false) //单步
    const dialogTableVisible2 = ref(false) //复合
    const dialogTableVisible = ref(false) //预览
    const commonnames = ref(['操作指令发布', '接收操作指令', '拟写、审核操作票', '人员安排', '安全工器具准备', '风险预控', '执行倒闸操作'])
    const generalmeasures = ref({
      risks: {
        0: ['1.发布操作指令过迟，导致现场拟票时间紧张，增加操作票编审批不到位风险。'],
        1: ['1.调度指令及操作目的未与现场设备状态实际核对，导致和调度指令核对不正确。'],
        2: ['1.拟写及审核操作票不正确，导致操作票错误。'],
        3: ['1.安排的操作人员和监护人员精神状态不佳或人员技能不足。'],
        4: ['1.安全工器具检查不到位，导致使用不合格的安全工器具。'],
        5: ['1.危险点分析及预控措施落实不到位或没有针对性，导致操作及监护人员对风险掌握不到位。'],
        6: ['1.操作过程中临时发生影响倒闸操作的异常时，处置不当，引起误操作。',
          '2.倒闸操作前及倒闸操作过程中未认真核对监控后台信号，造成误操作。',
          '3.操作对象错误，造成误操作。',
          '4.操作过程中发生触电、电缆沟坠落、爬梯坠落等人身伤害。'
        ]
      },
      measures: {
        0: ['1.原则上计划性倒闸操作，Ⅰ级、Ⅱ级风险倒闸操作，相应调度应提前48小时将相关操作任务发布至相关班组，Ⅲ级、Ⅳ级、Ⅴ级风险倒闸操作，应提前24小时将相关操作任务发布至相关班组。'],
        1: ['1.接收调度指令后，应与现场设备运行方式核对正确后，再与调度核对正确。'],
        2: ['1.严格落实操作票拟票、审票要求，副值、正值、值长逐级审票正确。'],
        3: ['1.合理安排操作人员，不安排当天精神状态不佳、身体有恙的值班员参与操作。复杂的操作由经验丰富值班员担任操作人，值班负责人担任监护人。'],
        4: ['1.根据操作任务，认真准备所用的安全帽、绝缘手套、绝缘靴、验电笔、接地线、绝缘操作杆等安全工器具，认真检查，确保使用的安全工器具正确、合格。'],
        5: ['1.认真开展危险点分析与预控措施讨论，危险点分析预控时，参与操作的人员均需参加，并确保人人掌握自己的任务、危险点及预控措施。'],
        6: ['1.操作过程中，出现操作异常时应立即停止操作，禁止跳项操作，认真进行核对检查，确认自身操作行为无误后，应及时汇报相关调度及管理人员，必要时联系检修人员到场处理。待异常消除后，再继续操作。',
          '2.倒闸操作前，监护人和操作人应对监控系统进行全面信号核对，确认设备状态与操作要求相符，进行操作的间隔及相关公用设备内无异常信号；倒闸操作全过程，应安排专人做好监控后台光字信号、遥信遥测的核对和确认工作，发现后台光字及简报窗口有异常信号或出现多余信号',
          '3.认真履行操作监护制和唱票复诵制，操作前严格执行三核对，认真检查操作设备的名称、编号及位置，防止走错间隔。。',
          '4.操作过程中应注意保持与低压设备之间的距离，注意防止电缆沟坠落、上爬梯时检查爬梯稳固并注意人身安全。'
        ]
      }
    })
    const generaldata = ref({
      risks: [],
      measures: []
    })
    const printdata = ref({
      risks: [],
      measures: []
    })

    const router = useRouter()
    const store = useStore()
    const storeStateFns = mapState(["company", "station", "current_userinfo"])
    const storeState = {};
    Object.keys(storeStateFns).forEach((fnKey) => {
      const fn = storeStateFns[fnKey].bind({ $store: store });
      storeState[fnKey] = computed(fn);
    })

    const gettasklist = () => {
      newgettasklist(store.state.company, store.state.station).then((res) => {
        if (res) {
          publishedData.value = res
          for (var i in publishedData.value) {
            if (publishedData.value[i].status === 'published') {
              publishedData.value[i].status = '已发布';
            } else if (publishedData.value[i].status === 'assigned') {
              publishedData.value[i].status = '已派发';
            } else if (publishedData.value[i].status === 'finished') {
              publishedData.value[i].status = '已完成';
            }

            var d = new Date(publishedData.value[i].publish_date);
            publishedData.value[i].publish_date = d.toLocaleString();
            if (publishedData.value[i].publish_date.split(' ')[0].split('/')[2].length === 1) {
              publishedData.value[i].publish_date = publishedData.value[i].publish_date.split('/')[0] + '/' + publishedData.value[i].publish_date.split('/')[1] +
                '/0' + publishedData.value[i].publish_date.split('/')[2]
            }
            if (publishedData.value[i].assign_date) {
              var d1 = new Date(publishedData.value[i].assign_date);
              publishedData.value[i].assign_date = d1.toLocaleString();
              if (publishedData.value[i].assign_date.split(' ')[0].split('/')[2].length === 1) {
                publishedData.value[i].assign_date = publishedData.value[i].assign_date.split('/')[0] + '/' + publishedData.value[i].assign_date.split('/')[1] +
                  '/0' + publishedData.value[i].assign_date.split('/')[2]
              }
            }
            if (publishedData.value[i].finish_date) {
              var d2 = new Date(publishedData.value[i].finish_date);
              publishedData.value[i].finish_date = d2.toLocaleString();
              if (publishedData.value[i].finish_date.split(' ')[0].split('/')[2].length === 1) {
                publishedData.value[i].finish_date = publishedData.value[i].finish_date.split('/')[0] + '/' + publishedData.value[i].finish_date.split('/')[1] +
                  '/0' + publishedData.value[i].finish_date.split('/')[2]
              }
            }

            for (var i in publishedData.value) {
              var devices = '';
              var devices_type = '';
              var operations = '';
              var measures = '';
              for (var j in publishedData.value[i].task_details[0].details) {
                devices += publishedData.value[i].task_details[0].details[j].device + ' ';
                operations += publishedData.value[i].task_details[0].details[j].operation + ' ';
                measures += publishedData.value[i].task_details[0].details[j].measure_type + ' ';
                devices_type += publishedData.value[i].task_details[0].details[j].device_type + ' ';
              }
              publishedData.value[i].devices = devices;
              publishedData.value[i].operations = operations;
              publishedData.value[i].measures_type = measures;
              publishedData.value[i].device_types = devices_type;
            }
          }
          publishedData.value = publishedData.value.reverse();
        }
      })
    }
    const gofinish = (prop) => {
      if (prop.status === '已发布') {
        ElMessage.warning('该任务还未派发')
      } else if (prop.status === '已派发') {
        ElMessageBox.confirm('该任务是否已完成', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          newpostupdatetofinish(store.state.company, store.state.station, prop._id).then(() => {
            ElMessage.success('任务完成')
            gettasklist()
          })
        }).catch(() => {
          ElMessage.info('取消')
        });
      } else {
        ElMessage.warning('该任务已完成')
      }
    }
    const handleSelectionChange = (val) => {
      multipleSelection.value = val
    }
    const signalprint = (prop) => {
      signaldata.value = prop;
      dialogTableVisible1.value = true
    }
    const goDelete = () => {
      for (var i in multipleSelection.value) {
        newdeletetask(store.state.company, store.state.station, multipleSelection.value[i]._id).then((res) => {
          gettasklist()
        })
      }
    }
    const goPrint = () => {
      for (var m in generaldata.value.risks) {
        printdata.value.risks.push(generaldata.value.risks[m])
      }
      for (var n in generaldata.value.measures) {
        printdata.value.measures.push(generaldata.value.measures[n])
      }
      for (var i in signaldata.value.task_details) {
        for (var j in signaldata.value.task_details[i].details) {
          for (var k in signaldata.value.task_details[i].details[j].risks) {
            printdata.value.risks.push(signaldata.value.task_details[i].details[j].risks[k])
          }
          for (var l in signaldata.value.task_details[i].details[j].risks) {
            printdata.value.measures.push(signaldata.value.task_details[i].details[j].measures[l])
          }
        }
      }
      var finaldata = {
        risks: [],
        measures: []
      }
      for (var r in printdata.value.risks) {
        if (finaldata.risks.indexOf(printdata.value.risks[r]) === -1) {
          finaldata.risks.push(printdata.value.risks[r])
          finaldata.measures.push(printdata.value.measures[r])
        }
      }
      let datas = {
        'task_name': signaldata.value.task_name,
        '_id': signaldata.value._id,
        'status': signaldata.value.status
      }
      store.commit('saveriskandmeasure', finaldata)
      store.commit('saveprintdata', datas)

      let location = {
        name: "print"
      };
      router.push(location);
    }
    const godoubleprint = () => {
      dialogTableVisible2.value = true
    }
    const compositeprint = () => {
      var task_detail = {
        task_name: input2.value,
        task_details: []
      }
      for (var t in multipleSelection.value) {
        for (var s in multipleSelection.value[t].task_details) {
          task_detail.task_details.push(multipleSelection.value[t].task_details[s])
        }
      }
      newposttask(store.state.company, store.state.station, task_detail).then((res) => {
        if (res) {
          store.commit('savenewtaskid', res.id)
        }
      })

      for (var m in generaldata.value.risks) {
        printdata.value.risks.push(generaldata.value.risks[m])
      }
      for (var n in generaldata.value.measures) {
        printdata.value.measures.push(generaldata.value.measures[n])
      }
      for (var o in multipleSelection.value) {
        for (var i in multipleSelection.value[o].task_details) {
          for (var j in multipleSelection.value[o].task_details[i].details) {
            for (var k in multipleSelection.value[o].task_details[i].details[j].risks) {
              printdata.value.risks.push(multipleSelection.value[o].task_details[i].details[j].risks[k])
            }
            for (var l in multipleSelection.value[o].task_details[i].details[j].risks) {
              printdata.value.measures.push(multipleSelection.value[o].task_details[i].details[j].measures[l])
            }
          }
        }
      }
      var finaldata = {
        risks: [],
        measures: []
      }
      for (var r in printdata.value.risks) {
        if (finaldata.risks.indexOf(printdata.value.risks[r]) === -1) {
          finaldata.risks.push(printdata.value.risks[r])
        }
        if (finaldata.measures.indexOf(printdata.value.measures[r]) === -1) {
          finaldata.measures.push(printdata.value.measures[r])
        }
      }
      let data = {
        'task_name': input2.value,
        '_id': store.state.newtaskid,
        'status': '已发布'
      }
      store.commit('saveriskandmeasure', finaldata)
      store.commit('saveprintdata', data)
      let location = {
        name: "print"
      };
      router.push(location);
    }
    const test = (prop) => {
      task_name.value = prop.task_name;
      testdata.value = prop.task_details;
      dialogTableVisible.value = true;
    }
    const republished = () => {
      var republishdata = {
        task_name: input1.value,
        task_details: testdata.value,
      }
      newposttask(store.state.company, store.state.station, republishdata).then((res) => {
        if (res) {
          gettasklist()
          dialogTableVisible.value = false
        }
      })
    }
    onMounted(() => {
      if (store.state.company === '' || store.state.station === ''){
        ElMessage.info('请先选择需要查看的分公司以及站点')
        window.history.go(-1)
      }
      gettasklist()

    })

    return {
      publishedData,
      multipleSelection,
      dialogTableVisible,
      dialogTableVisible1,
      dialogTableVisible2,
      signaldata,
      commonnames,
      generalmeasures,
      generaldata,
      printdata,
      input2,
      input1,
      testdata,

      gettasklist,
      gofinish,
      handleSelectionChange,
      goDelete,
      signalprint,
      goPrint,
      godoubleprint,
      compositeprint,
      test,
      republished,

      List,
    }
  },
})


</script>

<style scoped>
.title {
  display: flex;
  margin-top: 3%;
  margin-left: 7%;
}

.title .el-icon {
  font-size: calc(100vw * 26 / 1920);
  margin-right: 20px;
}

.title p {
  color: black;
  font-size: calc(100vw * 20 / 1920);
  font-weight: 800;
}

.homebutton {
  width: 150px;
  height: 40px;
  font-size: calc(100vw * 16 / 1920);
  margin-top: 5%;
  color: #FFFFFF;
  margin-left: 25%;
  background-image: linear-gradient(100deg, rgb(10, 38, 69), rgb(55, 81, 186));
}

.search .el-input {

  width: 70%
}

.search .el-select {
  width: 20%;
  margin-right: 10px;
}

.search {
  display: flex;
  align-items: center;
}
</style>