<template>
  <div class="column">
    <div style="width: 66%; border-style: solid; border-color: #0000FF; margin-left: 17%;margin-top: 40px">
      <div v-for="(data, index) in componentData">
        <div style="margin-top: 20px; margin-left: 20px;">
          <div class="q-pa-md">
            <q-table
                :rows=[deviceData[index]]
                :columns="columns"
                :hide-pagination="hidePagination"
            />
          </div>
        </div>
        <div style="height: 20px; font-size: 18px;margin-left: 20px;">
          存在的主要风险
        </div>
        <div class="q-pa-md">
          <div class="q-gutter-sm" v-for="riskprevention in data.measures">
            <el-checkbox size="medium" v-model="check[index].checkrisks" :label=riskprevention :val="riskprevention" checked="true"/>
          </div>
        </div>
        <div style="height: 20px; font-size: 18px;margin-left: 20px; margin-top: 20px;">
          预控措施
        </div>
        <div class="q-pa-md">
          <div class="q-gutter-sm" v-for="processcontrol in data.risks">
            <el-checkbox size="medium" v-model="check[index].checkprocess" :label=processcontrol :val="processcontrol" checked="true"/>
          </div>
        </div>
      </div>
      <div style="height: 20px; font-size: 18px;margin-left: 20px; margin-top: 20px;">
        备注
      </div>
      <div class="q-pa-md">
        <div>{{ this.additionData }}</div>
      </div>
    </div>
    <div>
      <button class="homebutton" @click="laststep">上一步</button>
      <button class="homebutton2" @click="addnewtask">继续添加</button>
      <button class="homebutton1" @click="goPublished">确认发布</button>
      <el-dialog title="请选择任务派遣人" v-model="dialogVisible" width="30%">
        <el-form ref="form" :model="form" label-width="140px" :rules="rules1">
          <el-form-item label="请输入工单任务名" prop="id">
            <el-input v-model="input1"></el-input>
          </el-form-item>
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
  name: "choose",
  components: {
    SearchBar,
    SearchList,
  },
  mounted() {
    if (store.state.taskName === ''){
      let location = {
        name: 'search',
      };
      this.$router.push(location);
    }
  },
  computed: {
    ...mapState({
      componentData: (state) => {
        return store.state.componentsData;
      },
      deviceData: (state) => {
        return store.state.devicesData;
      },
      additionData: (state) => {
        return store.state.additionData;
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
      input1: '',
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
        }
      ],
      updataList: ref({})
    }
  },
  methods: {
    addnewtask() {
      var task_detail = {
        task_name: store.state.taskName,
        details: []
      };
      for (var i in this.componentData){
        var detail = {
          device: this.componentData[i].device,
          operation: this.componentData[i].operation,
          // TODO:device_types => device_type
          device_type: this.componentData[i].device_type,
          risks: this.check[i].checkrisks,
          measures: this.check[i].checkprocess,
          measure_type: this.componentData[i].measure_type
        };
        task_detail.details.push(detail);
      }
      store.state.addnewtasks.push(task_detail)
      let location = {
        name: "search",
      };
      this.$router.push(location);
    },
    adminupdate() {
      var task_detail = {
        task_name: store.state.taskName,
        details: []
      };
      for (var i in this.componentData){
        var detail = {
          device: this.componentData[i].device,
          operation: this.componentData[i].operation,
          // TODO:device_types => device_type
          device_type: this.componentData[i].device_type,
          risks: this.check[i].checkrisks,
          measures: this.check[i].checkprocess,
          measure_type: this.componentData[i].measure_type
        };
        task_detail.details.push(detail);
      }
      store.state.addnewtasks.push(task_detail);
      this.updataList.value = {
        task_name: this.input1,
        task_details: store.state.addnewtasks,
        assigner: this.assigner,
        reviewer: store.state.user.name
      };
      store.dispatch('postData',this.updataList.value);
      let location = {
        name: "published",
      };
      this.$router.push(location);
      this.dialogVisible = false;
    },
    goPublished() {
      // TODO: change the following to make compatible with multi-step operations
      this.dialogVisible = true;
    },
    laststep() {
      let location = {
        name: "search",
      };
      this.$router.push(location);
    },
    reload() {
      store.commit("clearnewadddata");
      let location = {
        name: "search",
      };
      this.$router.push(location);
    }
  },
  setup() {
    for (var i in store.state.selectedTasks.details) {
      store.dispatch("getComponents", store.state.selectedTasks.details[i]);
    }
    store.commit("DELETE");
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
  margin-left: 15%;
  background-color: #0000ff;
  float: left;
}

.homebutton2 {
  width: 80px;
  height: 60px;
  font-size: 20px;
  margin-top: 20px;
  color: #FFFFFF;
  margin-left: 15%;
  background-color: #0000ff;
  float: left;
}

.homebutton1 {
  width: 80px;
  height: 60px;
  font-size: 20px;
  margin-top: 20px;
  color: #FFFFFF;
  margin-left: 15%;
  background-color: #0000ff;
  float: left;
}
</style>