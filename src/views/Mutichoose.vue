<template>
  <div class="title">
    <el-icon>
      <List />
    </el-icon>
    <p>已发布任务列表</p>
  </div>
  <div class="container" style="width: 85%; margin-left: 7%; margin-top: 1%">
    <div v-for="(data, index) in risk_and_measure" :key="index">
      <div style="font-size: 20px;
          font-weight: 800;
          margin-left: 40%;
          margin-top: 2%;
          margin-bottom: 2%;
        ">
        {{ index }}
      </div>
      <div v-for="(taskdata, index1) in data" :key="index1">
        <div style="margin-top: 5px; margin-left: 10%">
          <el-table :data="taskdata" border style="width: 90%">
            <el-table-column label="操作设备" prop="device" />
            <el-table-column label="设备类型" prop="device_type" />
            <el-table-column label="操作方式" prop="operation" />
          </el-table>
        </div>
        <div style="
            font-size: 16px;
            font-weight: 800;
            margin-left: 10%;
            margin-top: 10px;
          ">
          存在的主要风险
        </div>
        <div class="q-pa-md">
          <div class="q-gutter-sm" v-for="(riskprevention, index2) in taskdata[0].risks" :key="index2"
            style="margin-left: 10%">
            <el-checkbox size="medium" v-model="checked[index][index1].checkrisks" :label="riskprevention"
              :val="riskprevention" checked="true" />
          </div>
        </div>
        <div style="
            font-size: 16px;
            font-weight: 800;
            margin-left: 10%;
            margin-top: 10px;
          ">
          预控措施
        </div>
        <div class="q-pa-md">
          <div class="q-gutter-sm" v-for="(processcontrol, index3) in taskdata[0].measures" :key="index3"
            style="margin-left: 10%">
            <el-checkbox size="medium" v-model="checked[index][index1].checkprocess" :label="processcontrol"
              :val="processcontrol" checked="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="btngroup">
    <button class="hobutton1" @click="goLast">继续添加任务</button>
    <button class="hobutton1" @click="goPublished">确认发布</button>
    <button class="hobutton1" @click="reload">取消任务发布</button>
  </div>
  <el-dialog title="请选择任务派遣人" v-model="dialogVisible" width="30%">
    <el-form ref="form" :model="form" label-position="right" label-width="auto">
      <el-form-item label="请输入工单任务名" prop="id">
        <el-input v-model="input1" style="width: 65%;"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="hobutton1" @click="dialogVisible = false">取 消</el-button>
      <el-button class="hobutton1" @click="adminupdate">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import SearchBar from "../components/search/SearchBar.vue";
import SearchList from "../components/search/SearchList.vue";
import { List } from "@element-plus/icons";
import { newposttask } from '../api/getComponents'

export default defineComponent({
  name: "Mutichoose",

  setup() {
    //data
    const risk_and_measure = ref({})
    const sunxu = ref([])
    const checked = ref({})
    const lens = ref({})
    const dialogVisible = ref(false)
    const assigner = ref('')
    const reviewer = ref('')
    const hidePagination = ref(true)
    const updataList = ref({})
    const input1 = ref('')
    //others
    const store = useStore();
    const router = useRouter();
    //methods
    const goLast = () => {
      router.push({ path: '/newsearch' });
    }
    const goPublished = () => {
      dialogVisible.value = true;
    }
    const reload = () => {
      store.commit('deletetask')
      router.push({ path: '/newsearch' });
    }
    const adminupdate = () => {

      let keys = Object.keys(risk_and_measure.value)
      let task_detail = []
      for (var i in keys) {
        let opera = []
        for (var j in risk_and_measure.value[keys[i]]) {
          opera.push({
            device: risk_and_measure.value[keys[i]][j][0].device,
            device_type: risk_and_measure.value[keys[i]][j][0].device_type,
            operation: risk_and_measure.value[keys[i]][j][0].operation,
            risks: risk_and_measure.value[keys[i]][j][0].device.risks,
            measures: risk_and_measure.value[keys[i]][j][0].device.measures,
            measure_type: risk_and_measure.value[keys[i]][j][0].measure_type,
          })
        }
        let taskdetail = {
          task_name: keys[i],
          details: opera,
          additional: '',
          description: '',
        }
        task_detail.push(taskdetail)
      }
      let task = {
        task_name: input1.value,
        task_details: task_detail,
      }
      newposttask(store.state.company, store.state.station, task).then((res) => {
        router.push({ name: 'published' })
      })
    }
    onMounted(() => {
      risk_and_measure.value = store.state.risk_and_measure;
      lens.value = store.state.lens;
      sunxu.value = Object.keys(risk_and_measure.value);
      for (var i in sunxu.value) {
        checked.value[sunxu.value[i]] = [];
        for (let j = 0; j < lens.value[sunxu.value[i]]; j++) {
          checked.value[sunxu.value[i]].push({
            checkrisks: [],
            checkprocess: [],
          });
        }
      }
    });

    return {
      //data
      risk_and_measure,
      checked,
      lens,
      dialogVisible,
      assigner,
      hidePagination,
      updataList,
      input1,
      reviewer,
      //methods
      goLast,
      goPublished,
      reload,
      adminupdate,

      SearchBar,
      SearchList,
      List,
    };
  },
});
</script>

<style scoped>
.hobutton1 {
  width: 150px;
  height: 40px;
  font-size: calc(100vw * 16 / 1920);
  color: #ffffff;
  margin-left: 15%;
  margin-top: 2%;
  background-image: linear-gradient(100deg, rgb(10, 38, 69), rgb(55, 81, 186));
}

/deep/ .el-checkbox__label {
  display: inline-grid;
  white-space: pre-line;
  word-wrap: break-word;
  overflow: hidden;
  line-height: 20px;
}

.container {
  height: 600px;
  border: 1px solid rgb(214, 214, 214);
  overflow: auto;
}
</style>