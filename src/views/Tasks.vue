<template>
  <div>
    <div class="title">
      <el-icon>
        <List />
      </el-icon>
      <p>风险库</p>
    </div>

    <div>
      <el-table :data="this.tableData" style="width: 90%">
        <el-table-column prop="device" label="设备名称" align='center' width='180'/>
        <el-table-column prop="device_type" label="设备类型" align='center' width='180' />
        <el-table-column prop="operation" label="操作名称" align='center' width='180' />
        <el-table-column prop="risks" label="风险" align='center' />
        <el-table-column prop="measures" label="预控措施" align='center' />
      </el-table>
      <!-- <q-table style="
          height: 500px;
          width: 85%;
          margin-left: 7%;
          margin-top: 1%;
          padding: 2%;
          padding-top:2%
        " :rows="this.supertasklist" :columns="columns" row-key="index" virtual-scroll selection="multiple"
        v-model:selected="selected" v-model:pagination="pagination" :rows-per-page-options="[0]"
        v-if="this.usermessage.role === 'superadmin'" />

      <q-table style="
          height: 500px;
          width: 85%;
          margin-left: 7%;
          margin-top: 1%;
          padding-top: 2%;
          padding: 2%;
        " :rows="this.admintasklist" :columns="columns" row-key="index" virtual-scroll selection="multiple"
        v-model:selected="selected" v-model:pagination="pagination" :rows-per-page-options="[0]" v-else /> -->
    </div>

    <!--  <el-button v-if="this.usermessage.role === 'superadmin'" @click="addsignaltask" style="margin-left: 350px">新增单步任务</el-button>-->
    <!--  <el-button v-if="this.usermessage.role === 'superadmin'" @click="addmutitask" style="margin-left: 350px">新增复合型任务</el-button>-->
    <!--  <el-button v-else-if="this.usermessage.role === 'admin'" @click="adminadd" style="margin-left: 350px">新增任务表任务</el-button>-->
    <!--  <el-button v-if="this.usermessage.role === 'superadmin'" @click="superadmindeletetask" style="margin-left: 350px">删除任务</el-button>-->
    <el-button class="homtbutton" v-if="this.usermessage.role === 'admin'" @click="admindeletetask">删除任务
    </el-button>
    <el-dialog v-model="dialogTableVisible" title="新增单步任务" center>
      <div>
        <el-input v-model="task_name" placeholder="新增任务名称" style="width: 200px" />
        <div>
          <i @click="getAdd">增加</i>
          <div v-for="(val, index) in addCalculation" :key="index" style="margin-top: 10px">
            <el-input v-model="val.name" placeholder="器件名称"></el-input>
            <el-input v-model="val.type" placeholder="器件类别"></el-input>
            <el-input v-model="val.operation" placeholder="器件操作"></el-input>
            <i @click="getRemove(index)" v-if="index > 0">减少</i>
          </div>
        </div>
        <div style="margin-top: 10px">
          <el-input v-model="additional" placeholder="备注" style="width: 200px" />
        </div>
        <el-button @click="superadminaddtask" style="margin-left: 48%">发布</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogTableVisible1" title="新增复合型任务" center>
      <div>
        <el-input v-model="task_name" placeholder="新增复合型任务名称" style="width: 200px" />
        <div>
          <i @click="getAdd1">增加</i>
          <div v-for="(val, index) in addCalculation1" :key="index" style="margin-top: 10px">
            <el-input v-model="val.name" placeholder="单步任务名称" style="width: 150px"></el-input>
            <i @click="getRemove1(index)" v-if="index > 0">减少</i>
          </div>
        </div>
        <el-button @click="superadminaddtask" style="margin-left: 48%">发布</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogTableVisible2" title="新增任务表任务" center>
      <q-table style="height: 400px" title="未获取任务列表" :rows="rows" :columns="columns" row-key="index" virtual-scroll
        selection="multiple" v-model:selected="selected1" v-model:pagination="pagination"
        :rows-per-page-options="[0]" />
      <el-button @click="adminaddtask" style="margin-left: 48%; margin-top: 10px">加入任务库</el-button>
    </el-dialog>

  </div>

</template>

<script>
import { ref } from "vue";
import { mapState, useStore } from "vuex";
import { deletetask, newgetComponents, newget } from "../api/getComponents";
import store from "../store";
import { List } from "@element-plus/icons";

const columns = [
  {
    name: "index",
    label: "序号",
    field: "index",
  },
  {
    name: "task_name",
    required: true,
    label: "任务名称",
    align: "left",
    field: "task_name",
    // sortable: true
  },
  { name: "message", align: "center", label: "任务步骤", field: "message" },
  { name: "type", label: "任务类型", field: "type", sortable: true },
];
let id = 1000;
let id1 = 1000;
export default {
  name: "tasks",
  data() {
    return {
      dialogTableVisible: false,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      task_name: "",
      additional: "",
      //单步
      addCalculation: [{ id: 1, name: "", type: "", operation: "" }],
      //复合
      addCalculation1: [{ id: 1, name: "" }],
      selected1: [],
      tableData: []
    };
  },
  components: {
    List,
  },
  computed: {
    ...mapState({
      usermessage: (state) => {
        return state.user;
      },
      supertasklist: (state) => {
        return state.supertasklist;
      },
      admintasklist: (state) => {
        return state.admintasklist;
      },
      token: (state) => {
        return store.state.jwtToken;
      },
    }),
  },
  beforeCreate() {
    newget().then((res) => {
      console.log(res)
      this.tableData = res
    })
  },
  methods: {
    addsignaltask() {
      this.dialogTableVisible = true;
      console.log("超级管理员");
    },
    addmutitask() {
      this.dialogTableVisible1 = true;
      console.log("超级管理员");
    },
    adminadd() {
      this.dialogTableVisible2 = true;
      console.log("分公司管理员");
    },
    getAdd() {
      let obj = { id: id++, name: "", type: "", operation: "" };
      this.addCalculation.push(obj);
    },
    getRemove(index) {
      this.addCalculation.splice(index, 1);
    },
    getAdd1() {
      let obj = { id: id1++, name: "" };
      this.addCalculation1.push(obj);
    },
    getRemove1(index) {
      this.addCalculation1.splice(index, 1);
    },
    superadminaddtask() {
      console.log("新增成功");
      this.dialogTableVisible = false;
      this.dialogTableVisible1 = false;
    },
    adminaddtask() {
      console.log("新增成功");
      this.dialogTableVisible2 = false;
    },
    superadmindeletetask() {
      console.log("删除成功");
    },
    admindeletetask() {
      for (var i in this.selected) {
        deletetask(
          this.usermessage.company_id,
          this.selected[i].id,
          this.token
        );
      }
      setTimeout(() => {
        store.dispatch("getadminlist");
      }, 30 * this.selected.length);
      this.selected = ref([]);
    },
  },
  setup() {
    const selected = ref([]);
    return {
      columns,
      selected,

      pagination: ref({
        rowsPerPage: 0,
      }),
    };
  },
};
</script>
<style scoped>
.calculation {
  display: flex;
  /*border: 1px #f00 solid;*/
  margin-bottom: 10px;
}

/deep/ .el-input {
  width: 150px;
  height: 32px;
  margin-right: 10px;
}

.el-input__inner {
  height: 100%;
}

/deep/ .el-select {
  /*height: 40px;*/
  width: 150px;
  margin-right: 10px;
}

.el-input {
  height: 32px;
}

.el-input__inner {
  height: 100%;
  width: 40px;
}

.el-input__icon {
  line-height: 32px;
}

.el-icon-remove {
  line-height: 32px;
}

.condition2 {
  width: 100%;
  margin-bottom: 20px;
}

span {
  margin-right: 10px;
  font-size: 14px;
  color: #61646e;
}

/deep/ .el-input {
  width: 110px;
  height: 32px;
  margin-right: 10px;
}

.el-input-group__append {
  padding: 0;
  border-left: none;
  border-radius: 0;
  border-right: none;
  background: #fff;
  color: #61646e;
  font-size: 14px;
  padding-right: 10px;
}

.homtbutton {
  width: 120px;
  height: 40px;
  font-size: calc(100vw * 16 / 1920);
  margin-top: 3%;
  color: #FFFFFF;
  margin-left: 40%;
  background-image: linear-gradient(100deg, rgb(10, 38, 69), rgb(55, 81, 186));
}
</style>