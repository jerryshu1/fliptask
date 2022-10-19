<template>
  <div>
    <div class="title">
      <el-icon>
        <List />
      </el-icon>
      <p>已发布任务列表</p>
    </div>
    <div class="mt-4" style="width:85%; margin-left: 7%;margin-top: 1%">
      <el-input v-model="input" placeholder="请输入搜索内容" class="input-with-select" @change="enter">
        <template #prepend>
          <el-select v-model="select1" placeholder="Select">
            <el-option label="任务名称" value="任务名称" />
            <el-option label="任务状态" value="任务状态" />
          </el-select>
        </template>
      </el-input>
    </div>

    <el-table border :data="this.publishedData" style="width:85%; margin-left: 7%;margin-top: 2%" @select='select'>
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
          <el-button type="text" @click="gofinish(scope.row)" v-if="this.usermessage.role === 'admin'">确认完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <div class="btngroup">
        <button class="homebutton" @click="goDelete" v-if="this.usermessage.role === 'admin'">删除</button>
        <button class="homebutton" @click="dialogTableVisible2=true"
          v-if="this.usermessage.role === 'admin'">复合打印</button>
      </div>
      
      <el-dialog v-model="dialogTableVisible2" title="通用措施风险预控选择" width="95%" center>
        <div v-for="(data, index) in names" :key="index">
          <div style="height: 30px; font-size: 20px; color: #7cb342">{{ data }}</div>
          <div style="height: 20px; font-size: 16px;">存在的主要风险</div>
          <div v-for="(riskprevention,index) in this.generalmeasures.risks[index]" :key="index">
            <el-checkbox size="small" v-model="generaldata.risks" :label=riskprevention :val="riskprevention" checked
              border />
          </div>
          <div style="height: 20px; font-size: 16px;">预控措施</div>
          <div v-for="(measureprevention,index) in this.generalmeasures.measures[index]" :key="index">
            <el-checkbox size="small" v-model="generaldata.measures" :label=measureprevention :val="measureprevention"
              checked border />
          </div>
        </div>
        <el-input v-model="input2" placeholder="请输入工单任务名称" />
        <el-select v-model="assigner1" placeholder="请选择任务委派人">
          <el-option v-for="(names, index) in this.allusers" :label=names.name :value=names.name :key="index">
          </el-option>
        </el-select>
        <el-button @click="compositeprint" style="margin-top: 10px;margin-left: 50%">打印</el-button>
      </el-dialog>
      <el-dialog v-model="dialogTableVisible" title="详细信息">
        <div v-for="(data,index) in testdata" :key="index">
          <div style="font-size: 24px">{{ data.task_name }}</div>
          <div style="height: 20px; font-size: 10px;margin-left: 20px; margin-top: 5px;">
            备注:{{ data.additional }}
          </div>
          <div v-for="(taskdata,index) in data.details" :key="index">
            <div style="margin-top: 5px; margin-left: 20px;">
              <div class="q-pa-md">
                <q-table :rows=[taskdata] :columns="columns" :hide-pagination="hidePagination" />
              </div>
            </div>
            <div style="height: 20px; font-size: 18px;margin-left: 20px;">
              存在的主要风险
            </div>
            <div class="q-pa-md">
              <div class="q-gutter-sm" v-for="(riskprevention,index) in taskdata.risks" :key="index">
                <div>{{ riskprevention }}</div>
              </div>
            </div>
            <div style="height: 20px; font-size: 18px;margin-left: 20px; margin-top: 10px;">
              预控措施
            </div>
            <div class="q-pa-md">
              <div class="q-gutter-sm" v-for="(processcontrol,index) in taskdata.measures" :key="index">
                <div>{{ processcontrol }}</div>
              </div>
            </div>
          </div>
        </div>
        <el-input v-model="input1" placeholder="请输入工单任务名称" v-if="this.usermessage.role === 'admin'" />
        <el-select v-model="assigner" placeholder="请选择任务委派人" v-if="this.usermessage.role === 'admin'">
          <el-option v-for="(names, index) in this.allusers" :label=names.name :value=names.name :key="index">
          </el-option>
        </el-select>
        <el-button @click="republished(testdata)" v-if="this.usermessage.role === 'admin'">重新发布</el-button>
      </el-dialog>
      <el-dialog v-model="dialogTableVisible1" title="通用措施风险预控选择" width="95%" center>
        <div v-for="(data, index) in names" :key="index">
          <div style="height: 30px; font-size: 20px; color: #7cb342">{{ data }}</div>
          <div style="height: 20px; font-size: 16px;">存在的主要风险</div>
          <div v-for="(riskprevention,index) in this.generalmeasures.risks[index]" :key="index">
            <el-checkbox size="small" v-model="generaldata.risks" :label=riskprevention :val="riskprevention" checked
              border />
          </div>
          <div style="height: 20px; font-size: 16px;">预控措施</div>
          <div v-for="(measureprevention,index) in this.generalmeasures.measures[index]" :key="index">
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
import store from '../store';
import { deleteData, gettableData, postRiskData, updateStatus } from "../api/getComponents";
import {
  mapState
} from 'vuex';
import { List } from "@element-plus/icons";


export default {
  name: "Published",
  data() {
    return {
      testdata: [],
      selected: [],
      printdata: {
        risks: [],
        measures: []
      },
      select1: '任务名称',
      input: '',
      input1: '',
      input2: '',
      dialogTableVisible: false,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
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
      names: ['操作指令发布', '接收操作指令', '拟写、审核操作票', '人员安排', '安全工器具准备', '风险预控', '执行倒闸操作'],
      generaldata: {
        risks: [],
        measures: []
      },
      generalmeasures: {
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
      },
      ids: [],
      statuss: [],
      signaldata: {},
    }
  },
  components: {
    List
  },
  mounted() {
    if (store.state.user.role === 'superadmin') {
      let location = {
        name: "user"
      };
      this.$router.push(location);

    } else {
      store.dispatch('getPublishData');
    }
  },
  computed: {
    ...mapState({
      publishedData: (state) => {
        return store.state.publishedData;
      },
      token: (state) => {
        return store.state.jwtToken;
      },
      usermessage: (state) => {
        return store.state.user
      },
      allusers: (satae) => {
        return store.state.allUsers;
      }
    })
  },
  methods: {
    signalprint(prop) {
      this.signaldata = prop;
      this.dialogTableVisible1 = true
    },
    republished(data) {
      var republishdata = {
        task_name: this.input1,
        task_details: data,
        reviewer: store.state.user.name,
        assigner: this.assigner
      };
      postRiskData(this.usermessage.company_id, republishdata, this.token).then((res) => {
        this.$store.commit('fuheprint', res);
        gettableData(this.usermessage.company_id, '', this.token).then((res1) => {
          this.$store.commit('PUBLISHDATA', res1);
          this.dialogTableVisible = false;
        })
      })
      // store.dispatch('postData', republishdata);
      // this.dialogTableVisible = false;
      // store.dispatch('getPublishData')
    },
    test(prop) {
      this.task_name = prop.task_name;
      this.testdata = prop.task_details;
      this.dialogTableVisible = true;
    },
    gofinish(prop) {
      if (prop.status === '已发布') {
        this.$message({
          message: '该任务还未派发',
          type: 'warning'
        })
      } else if (prop.status === '已派发') {
        this.$confirm('该任务是否已完成', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          updateStatus(this.usermessage.company_id, prop._id, this.token).then(() => {
            this.$message({
              type: 'success',
              message: '任务完成'
            });
            this.$store.dispatch('getPublishData');
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消'
          });
        });
      } else {
        this.$message({
          message: '该任务已完成',
          type: 'warning'
        })
      }
    },
    enter() {
      if (this.select1 === '任务名称') {
        if (this.input === '') {
          this.$store.dispatch('getPublishData');
        } else {
          let params = {
            task_name: this.input
          }
          this.$store.dispatch('getPublishData', params);
        }
      } else {
        if (this.input === '已发布') {
          let params = {
            status: 'published'
          }
          this.$store.dispatch('getPublishData', params);
        }
        if (this.input === '已派发') {
          let params = {
            status: 'assigned',
          }
          this.$store.dispatch('getPublishData', params);
        }
        if (this.input === '已完成') {
          let params = {
            status: 'finished',
          }
          this.$store.dispatch('getPublishData', params);
        }
        if (this.input === '') {
          this.$store.dispatch('getPublishData');
        }
      }
    },
    goDelete() {
      for (var i in this.selected) {
        deleteData(this.usermessage.company_id, this.selected[i]._id, this.token)
      }
      setTimeout(() => {
        store.dispatch('getPublishData');
      }, 30 * this.selected.length)
      this.selected = [];
    },
    goPublished() {
      let location = {
        name: "published"
      };
      this.$router.push(location);
    },
    goPrint() {
      for (var m in this.generaldata.risks) {
        this.printdata.risks.push(this.generaldata.risks[m])
      }
      for (var n in this.generaldata.measures) {
        this.printdata.measures.push(this.generaldata.measures[n])
      }
      for (var i in this.signaldata.task_details) {
        for (var j in this.signaldata.task_details[i].details) {
          for (var k in this.signaldata.task_details[i].details[j].risks) {
            this.printdata.risks.push(this.signaldata.task_details[i].details[j].risks[k])
          }
          for (var l in this.signaldata.task_details[i].details[j].risks) {
            this.printdata.measures.push(this.signaldata.task_details[i].details[j].measures[l])
          }
        }
      }
      var finaldata = {
        risks: [],
        measures: []
      }
      for (var r in this.printdata.risks) {
        if (finaldata.risks.indexOf(this.printdata.risks[r]) === -1) {
          finaldata.risks.push(this.printdata.risks[r])
        }
        if (finaldata.measures.indexOf(this.printdata.measures[r]) === -1) {
          finaldata.measures.push(this.printdata.measures[r])
        }
      }
      let datas = {
        'task_name': this.signaldata.task_name,
        '_id': this.signaldata._id,
        'status': this.signaldata.status
      }
      store.state.riskandmeasure = finaldata;
      store.state.printData = datas;

      let location = {
        name: "print"
      };
      this.$router.push(location);
    },
    select(selection, row) {
      if (this.selected.indexOf(row) === -1) {
        this.selected.push(row);
      } else {
        this.selected.splice(this.selected.indexOf(row), 1);
      }
    },
    compositeprint() {
      var task_detail = {
        task_name: this.input2,
        assigner: this.assigner1,
        reviewer: store.state.user.name,
        task_details: []
      };
      for (var t in this.selected) {
        for (var s in this.selected[t].task_details) {
          task_detail.task_details.push(this.selected[t].task_details[s])
        }
      }
      store.dispatch('postData', task_detail);

      for (var m in this.generaldata.risks) {
        this.printdata.risks.push(this.generaldata.risks[m])
      }
      for (var n in this.generaldata.measures) {
        this.printdata.measures.push(this.generaldata.measures[n])
      }
      for (var o in this.selected) {
        for (var i in this.selected[o].task_details) {
          for (var j in this.selected[o].task_details[i].details) {
            for (var k in this.selected[o].task_details[i].details[j].risks) {
              this.printdata.risks.push(this.selected[o].task_details[i].details[j].risks[k])
            }
            for (var l in this.selected[o].task_details[i].details[j].risks) {
              this.printdata.measures.push(this.selected[o].task_details[i].details[j].measures[l])
            }
          }
        }
      }
      var finaldata = {
        risks: [],
        measures: []
      }
      for (var r in this.printdata.risks) {
        if (finaldata.risks.indexOf(this.printdata.risks[r]) === -1) {
          finaldata.risks.push(this.printdata.risks[r])
        }
        if (finaldata.measures.indexOf(this.printdata.measures[r]) === -1) {
          finaldata.measures.push(this.printdata.measures[r])
        }
      }
      let data = {
        'task_name': this.input2,
        '_id': store.state.newtaskid,
        'status': '已发布'
      }
      store.state.riskandmeasure = finaldata;
      store.state.printData = data;
      let location = {
        name: "print"
      };
      this.$router.push(location);
    }
  },
  setup() {
    if (store.state.user.role === 'admin') {
      store.dispatch('getallusersMessage');
    }
  },
}


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
  width: 120px;
	height: 40px;
	font-size: calc(100vw * 16 / 1920);
	margin-top: 5%;
	color: #FFFFFF;
  margin-left: 100px;
	background-image: linear-gradient(100deg, rgb(10, 38, 69), rgb(55, 81, 186));
}

.btngroup{
  width:500px;
  margin: 0 auto;
}
</style>