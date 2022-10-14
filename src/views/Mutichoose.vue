<template>
  <div class="column">
    <div style="width: 66%; border-style: solid; border-color: #0000FF; margin-left: 17%;margin-top: 40px">
      <div v-for="(data, index) in muti_componentsDatas" :key="index">
        <div style="font-size: 24px">{{ muti_taskName[index] }}</div>
        <div v-for="(taskdata, index1) in data" :key="index1">
          <div style="margin-top: 5px; margin-left: 20px;">
            <div class="q-pa-md">
              <q-table
                  :rows=[muti_selectedTasks[index][index1]]
                  :columns="columns"
                  :hide-pagination="hidePagination"
              />
            </div>
          </div>
          <div style="height: 20px; font-size: 18px;margin-left: 20px;">
            存在的主要风险
          </div>
          <div class="q-pa-md">
            <div class="q-gutter-sm" v-for="(riskprevention,index) in taskdata.risks" :key="index">
              <el-checkbox size="medium" v-model="check[index][index1].checkrisks" :label=riskprevention
                           :val="riskprevention"
                           checked="true"/>
            </div>
          </div>
          <div style="height: 20px; font-size: 18px;margin-left: 20px; margin-top: 10px;">
            预控措施
          </div>
          <div class="q-pa-md">
            <div class="q-gutter-sm" v-for="(processcontrol,index) in taskdata.measures" :key="index">
              <el-checkbox size="medium" v-model="check[index][index1].checkprocess" :label=processcontrol
                           :val="processcontrol"
                           checked="true"/>
            </div>
          </div>
        </div>
        <div style="height: 20px; font-size: 18px;margin-left: 20px; margin-top: 10px;">
          备注
        </div>
        <div class="q-pa-md">
          <div>{{ muti_additionData[index] }}</div>
        </div>
      </div>
    </div>
    <div>
      <button class="homebutton" @click="goLast">上一步</button>
      <button class="homebutton1" @click="goPublished">确认发布</button>
      <el-dialog title="请选择任务派遣人" v-model="dialogVisible" width="30%">
        <el-form ref="form" :model="form" label-width="140px" :rules="rules1">
          <el-input v-model="input1" placeholder="请输入工单任务名称" />
          <el-form-item label="任务委派人" prop="password">
            <el-select v-model="assigner" placeholder="请选择任务委派人">
              <el-option
                  v-for="(names, index) in this.allusers"
                  :label=names.name
                  :value=names.name
                  :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="adminupdate">确 定</el-button>
            </span>
      </el-dialog>
      <button class="homebutton1" @click="reload">取消</button>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import store from '../store';
import {
  mapState
} from 'vuex';
import SearchBar from "../components/search/SearchBar.vue";
import SearchList from "../components/search/SearchList.vue";

export default {
  name: "Mutichoose",
  components: {
    SearchBar,
    SearchList,
  },
  created() {
    for (var j in store.state.muti_componentsData) {
      if (store.state.muti_componentsDatas[store.state.muti_componentsData[j].index][0] === '') {
        store.state.muti_componentsDatas[store.state.muti_componentsData[j].index][0] = store.state.muti_componentsData[j];
      } else {
        store.state.muti_componentsDatas[store.state.muti_componentsData[j].index].push(store.state.muti_componentsData[j]);
      }
    }
  },
  computed: {
    ...mapState({
      muti_componentsDatas: (state) => {
        return store.state.muti_componentsDatas;
      },
      muti_selectedTasks: (state) => {
        return store.state.muti_selectedTasks;
      },
      muti_taskName: (state) => {
        return store.state.muti_taskName;
      },
      muti_additionData: (state) => {
        return store.state.muti_additionData;
      },
      allusers: (satae) => {
        return store.state.allUsers;
      }
    })
  },
  beforeCreate() {
    store.dispatch('getallusersMessage');
  },
  data() {
    return {
      assigner: '',
      dialogVisible: false,
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
      hidePagination: true,
      check: [
        [{
          'checkrisks': [],
          'checkprocess': [],
        },
          {
            'checkrisks': [],
            'checkprocess': [],
          },
          {
            'checkrisks': [],
            'checkprocess': [],
          },
          {
            'checkrisks': [],
            'checkprocess': [],
          },
          {
            'checkrisks': [],
            'checkprocess': [],
          }],
        [{
          'checkrisks': [],
          'checkprocess': [],
        },
          {
            'checkrisks': [],
            'checkprocess': [],
          },
          {
            'checkrisks': [],
            'checkprocess': [],
          },
          {
            'checkrisks': [],
            'checkprocess': [],
          },
          {
            'checkrisks': [],
            'checkprocess': [],
          }],
        [{
          'checkrisks': [],
          'checkprocess': [],
        },
          {
            'checkrisks': [],
            'checkprocess': [],
          },
          {
            'checkrisks': [],
            'checkprocess': [],
          },
          {
            'checkrisks': [],
            'checkprocess': [],
          },
          {
            'checkrisks': [],
            'checkprocess': [],
          }]
      ],
      updataList: ref({}),
      input1: '',
    }
  },
  methods: {
    adminupdate() {
      // TODO: change the following to make compatible with multi-step operations
      let postdata = [];
      for (var i in store.state.muti_taskName) {
        var task_detail = {
          task_name: store.state.muti_taskName[i],
          additional: store.state.muti_additionData[i],
        };
        var test = [];
        for (var j in store.state.muti_componentsDatas[i]) {
          var detail = {
            device: store.state.muti_componentsDatas[i][j].device,
            operation: store.state.muti_componentsDatas[i][j].operation,
            // TODO: device_types => device_type
            device_type: store.state.muti_componentsDatas[i][j].device_type,
            risks: this.check[i][j].checkrisks,
            measures: this.check[i][j].checkprocess,
            measure_type: store.state.muti_componentsDatas[i][j].measure_type
          };
          test.push(detail);
        }
        task_detail.details = test;
        postdata.push(task_detail);
      }
      this.updataList.value = {
        task_name: this.input1,
        task_details: postdata,
        assigner: this.assigner,
        reviewer: store.state.user.name
      };
      store.dispatch('postData', this.updataList.value);
      let location = {
        name: "published",
      };
      this.$router.push(location);
      this.dialogVisible = false;
    },
    goPublished() {
      this.dialogVisible = true;
    },
    goLast() {
      store.commit('MUTIDELETE');
      let location = {
        name: "mutisearch",
      };
      this.$router.push(location);
    },
    reload() {
      window.location.reload();
    }
  },
}


</script>

<style scoped>
.homebutton {
  width: 80px;
  height: 60px;
  font-size: 20px;
  margin-top: 20px;
  color: #FFFFFF;
  margin-left: 500px;
  background-color: #0000ff;
  float: left;
}

.homebutton1 {
  width: 80px;
  height: 60px;
  font-size: 20px;
  margin-top: 20px;
  color: #FFFFFF;
  margin-left: 250px;
  background-color: #0000ff;
  float: left;
}

/deep/ .el-checkbox__label {
  display: inline-grid;
  white-space: pre-line;
  word-wrap: break-word;
  overflow: hidden;
  line-height: 20px;
}
</style>