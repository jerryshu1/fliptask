<template>
  <div>
    <div id="printContent">
      <table border="1" align="center" cellpadding="10" cellspacing="0" width="800px">
        <caption>
          <h2 style="font-size: 24px;">倒闸操作作业风险预控措施卡</h2>
        </caption>
        <tbody align="center" class="test">
        <th style="width: 130px;">操作任务</th>
        <td width="130px" colspan="1" rowspan="1">
          {{ printdata.task_name }}
        </td>
        <th style="width: 130px;">执行人员</th>
        <td width="130px" colspan="1" rowspan="1"></td>
        <th style="width: 130px;">执行时间</th>
        <td width="130px" colspan="1" rowspan="1"></td>
        </tbody>
      </table>
      <table border="1" align="center" cellpadding="10" cellspacing="0" width="800px">
        <tbody align="center" style="height: 60px;">
        <th style="width: 40px;">序号</th>
        <th style="width: 160px;">危险点分析</th>
        <th style="width: 160px;">预控措施</th>
        <th style="width: 40px;">打勾</th>
        </tbody>
        <tbody align="center" style="height: 60px;" v-for="(data,index) in riskandmeasures.risks" :key="index">
        <td width="40px" colspan="1" rowspan="1">
          {{index + 1}}
        </td>
        <td width="130px" colspan="1" rowspan="1">
          {{ data.split(".")[1] }}
        </td>
        <td width="130px" colspan="1" rowspan="1">
          {{ riskandmeasures.measures[index].split(".")[1] }}
        </td>
        <td width="40px" colspan="1" rowspan="1"></td>
        </tbody>
      </table>
    </div>
    <div class="btngroup">
      <button class="hobutton1" @click="handleExportExcel">导出excel文件</button>
      <button class="hobutton1" @click="printWindow">打印</button>
      <button class="hobutton1" @click="goPublished">返回</button>
    </div>
   
  </div>
</template>

<script>
import {mapState} from "vuex";
import store from "../store";
import { newpostupdatetoassign } from "../api/getComponents";

export default {
  name: "Print",
  data() {
    return {
      tHeader : ['危险点分析','预控措施'],
      outputdata:[],
      form: {
        fileType: 'xlsx'
      }
    }
  },
  computed: {
    ...mapState({
      printdata: (state) => {
        return store.state.printData;
      },
      riskandmeasures: (state) => {
        return store.state.riskandmeasure;
      },
      token: (state) => {
        return store.state.jwtToken;
      },
      usermessage: (state) => {
        return store.state.user
      },
      company: (state) => {
        return store.state.company
      },
      station: (state) => {
        return store.state.station
      }
    })
  },
  methods: {
    handleExportExcel() {
      for (var i in this.riskandmeasures.risks){
        this.outputdata.push([this.riskandmeasures.risks[i],this.riskandmeasures.measures[i]])
      }
      if (this.printdata._id === ''){
        let params = store.state.newtaskid;
        if (this.printdata.status === '已发布') {
          updateuserStatus(this.usermessage.company_id, params, this.token);
        }
      } else {
        let params = this.printdata._id;
        if (this.printdata.status === '已发布') {
          updateuserStatus(this.usermessage.company_id, params, this.token);
        }
      }
      import('./useExportExcel').then((excel) => {
        excel.exportJsonToExcel({
          multiHeader: [],
          merges: [],
          header: this.tHeader,
          data: this.outputdata,
          filename: this.printdata.task_name,
          autoWidth: true,
          bookType: this.form.fileType
        })
      })
    },
    printWindow() {
      let newstr = document.getElementById("printContent").innerHTML;
      document.body.innerHTML = newstr;
      window.print();
      if (this.printdata._id === ''){
        let params = store.state.newtaskid;
        if (this.printdata.status === '已发布') {
          newpostupdatetoassign(this.company, this.station, params).then((res) => {
            setTimeout("window.location.replace('published')",500)
          })
        } else {
          setTimeout("window.location.replace('published')",500)
        }
      } else {
        let params = this.printdata._id;
        if (this.printdata.status === '已发布') {
          newpostupdatetoassign(this.company, this.station, params).then((res) => {
            setTimeout("window.location.replace('published')",500)
          })
        } else {
          setTimeout("window.location.replace('published')",500)
        }
      }
    },
    goPublished() {
      let location = {
        name: "published"
      };
      this.$router.push(location);
    },
  }
}
</script>

<style scoped>
.outputbutton {
  width: 180px;
  height: 60px;
  margin-left: 250px;
  margin-top: 50px;
  background-color: #0000FF;
  color: #FFFFFF;
  font-size: 24px;
}
.printbutton {
  width: 180px;
  height: 60px;
  margin-left: 250px;
  margin-top: 50px;
  background-color: #0000FF;
  color: #FFFFFF;
  font-size: 24px;
}
.backbutton{
  width: 180px;
  height: 60px;
  margin-left: 250px;
  margin-top: 50px;
  background-color: #0000FF;
  color: #FFFFFF;
  font-size: 24px;
}

.test {
  height: 60px;
}

.btngroup{
  width: 800px;
  margin: 0 auto;
}

.hobutton1 {
  width: 150px;
  height: 40px;
  font-size: calc(100vw * 16 / 1920);
  color: #ffffff;
  margin-left: 10%;
  margin-top: 3%;
  background-image: linear-gradient(100deg, rgb(10, 38, 69), rgb(55, 81, 186));
}
</style>