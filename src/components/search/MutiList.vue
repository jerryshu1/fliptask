<template>
  <div class="col column q-my-md q-ml-md">
    <div class="test-list">
      <q-table
          :rows="searchResult"
          :columns="resultColumns"
          row-key="name"
          title="搜索结果"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width/>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                  size="sm"
                  color="accent"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td colspan="100%">
              <div class="text-left">
                {{ props.row.name }}
              </div>
            </q-td>
          </q-tr>
          <q-tr
              :props="props"
              v-show="props.expand"
              v-for="child in props.row.children"
              :key="child.task_name"
          >
            <q-td/>
            <q-td width='30'>
              <q-checkbox
                  v-model="shape"
                  :val="child"
                  @click="checktask(child)"
              />
            </q-td>
            <q-td key="task_name" :props="props">
              {{ child.task_name }}
            </q-td>
            <q-td key="details" :props="props">
              {{ child.details }}
            </q-td>
            <q-td key="additional" :props="props">
              {{ child.additional }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div>
      <button style="width: 100px;height: 60px;background-color:white;margin-top: 20px;float: left;margin-left: 500px"
              @click="goNext" v-show="datashow">
        下一步
      </button>
      <button style="width: 100px;height: 60px;background-color:white;margin-top: 20px;float: left;margin-left: 500px"
              @click="reload" v-show="datashow">
        取消
      </button>
    </div>
  </div>
</template>

<script>
import {defineComponent, nextTick, ref} from "vue";
import {date} from "quasar";
import store from "../../store";

import searchService from "../../services/search";
import {firstsearch, getsearchtasklist, searchtype} from "../../api/getComponents";

export default defineComponent({
  name: "mutiList",
  data() {
    return {
      shape: ref([]),
      nextData: [],
      nextName: [],
      nextAdditional: [],
      datashow: false,
    }
  },
  methods: {
    checktask(data) {
      for (var i in this.shape) {
        if (this.shape[i].task_name === data.task_name && this.shape[i].detail_raw !== data.detail_raw) {
          this.shape.splice(this.shape.indexOf(this.shape[i]), 1);
        }
      }
      if (i === String(this.data_lens - 1)) {
        this.datashow = true;
      } else {
        this.datashow = false;
      }
    },
    goNext() {
      for (var i in this.shape) {
        for (var j in this.shape) {
          if (this.shape[j].index == i) {
            this.nextData.push(this.shape[j].detail_raw);
            this.nextName.push(this.shape[j].task_name);
            this.nextAdditional.push(this.shape[j].additional);
          }
        }
      }

      // var len = this.nextData.length
      // for (i=0; i < len - 1; i++){
      //   for (var k in this.nextData[i]){
      //     for (var l in this.nextData[i+1]){
      //       if (this.nextData[i][k].device === this.nextData[i+1][l].device && this.nextData[i][k].device_type === this.nextData[i+1][l].device_type && this.nextData[i][k].operation === this.nextData[i+1][l].operation){
      //         this.nextData[i][k].twice = true;
      //         this.nextData[i+1][l].twice = true;
      //       }
      //     }
      //   }
      // }
      store.state.muti_selectedTasks = this.nextData;
      store.state.muti_taskName = this.nextName;
      store.state.muti_additionData = this.nextAdditional;
      store.state.muti_taskNames = this.searchName;
      for (var i in store.state.muti_taskName) {
        store.state.muti_componentsDatas.push(['']);
      }
      for (var i in store.state.muti_selectedTasks) {
        for (var j in store.state.muti_selectedTasks[i]) {
          console.log(store.state.muti_selectedTasks[i][j])
          store.dispatch("getmutiComponents", store.state.muti_selectedTasks[i][j]);
        }
      }
      setTimeout(this.gomutichoose, 600);
    },
    gomutichoose() {
      let location = {
        name: "mutichoose"
      }
      this.$router.push(location);
      this.shape = ref([]);
      this.nextData = [];
      this.nextName = [];
      this.nextAdditional = [];
      this.datashow = false;
    },
    reload() {
      window.location.reload();
      let location = {
        name: "mutichoose"
      }
      this.$router.push(location);
    }
  },
  watch: {
    searchName() {
      this.shape = ref([]);
      this.nextData = [];
      this.nextName = [];
      this.nextAdditional = [];
      this.datashow = false;
    }
  },
  setup() {
    // Accessing nested JavaScript objects and arrays by string path
    // https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
    Object.byString = function (o, s) {
      if (s == undefined) {
        return "";
      }
      s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
      s = s.replace(/^\./, ""); // strip a leading dot
      var a = s.split(".");
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (typeof o == "object" && k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    };

    const defaultColumns = () => {
      return [
        {
          name: "name",
          field: "name",
          label: "任务名称",
          align: "left",
          sortable: true,
        },
        {
          name: "task_name",
          field: "task_name",
          label: "操作任务",
          align: "left",
          sortable: true,
        },
        {
          name: "details",
          field: "details",
          label: "操作设备",
          align: "left",
          sortable: true,
        },
        {
          name: "additional",
          field: "additional",
          label: "备注",
          align: "left",
          sortable: true,
        },
      ];
    };

    const searchTable = ref(null);
    const searchResult = ref([]);
    const resultCount = ref("");
    const data_lens = ref(0);
    const searchName = ref("");
    const resultTotal = ref(0);
    const resultColumns = defaultColumns();
    // get the normalized date and time from the dateVal object
    const getDateConsumableDateTime = function (dateVal) {
      if (dateVal.tab == "relative") {
        var period = "";
        var periodValue = 0;

        // quasar does not support arithmetic on weeks. convert to days.
        if (dateVal.selectedRelativePeriod.toLowerCase() == "weeks") {
          period = "days";
          periodValue = dateVal.selectedRelativeValue * 7;
        } else {
          period = dateVal.selectedRelativePeriod.toLowerCase();
          periodValue = dateVal.selectedRelativeValue;
        }
        var subtractObject = '{"' + period + '":' + periodValue + "}";

        var endTimeStamp = new Date();
        var startTimeStamp = date.subtractFromDate(
            endTimeStamp,
            JSON.parse(subtractObject)
        );

        return {
          start_time: startTimeStamp,
          end_time: endTimeStamp,
        };
      } else {
        var start, end;

        if (dateVal.startDate == "" && dateVal.startTime == "") {
          start = new Date();
        } else {
          start = new Date(dateVal.startDate + " " + dateVal.startTime);
        }

        if (dateVal.endDate == "" && dateVal.endTime == "") {
          end = new Date();
        } else {
          end = new Date(dateVal.endDate + " " + dateVal.endTime);
        }

        var rVal = {
          start_time: start,
          end_time: end,
        };
        return rVal;
      }
    };

    // whether enable histogram or not
    const chartKeyFormat = ref("HH:mm:ss");
    const chartHistogram = ref(null);
    const chartOptions = {
      chart: {
        id: "search-summary",
        toolbar: {
          show: true,
        },
      },
      grid: {
        borderColor: "#eee",
        strokeDashArray: 5,
      },
      colors: ["#26A69A", "#9C27B0"],
      series: [],
      xaxis: {
        type: "numeric",
        labels: {
          show: false,
          rotateAlways: false,
          rotate: 0,
          hideOverlappingLabels: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          columnWidth: "90%",
        },
      },
      title: {
        text: "",
      },
      noData: {
        text: "Loading...",
      },
    };

    const buildSearch = (queryData) => {
      var req = {
        query: {
          match_phrase: {
            task_name: {
              query: {}
            },
          },
        },
        sort: ["-_score"],
        form: 0,
        size: parseInt(maxRecordToReturn.value, 10),
      };

      if (queryData.query == "") {
        req.query = ref({
          bool: {
            must: {
              match_all: {}
            }
          }
        }).value;
        return req;
      }

      // req.query.bool.must.push({
      //   query_string: {
      //     query: queryData.query,
      //   },
      // });

      req.query.match_phrase.task_name.query = queryData.query;

      return req;
    };

    const maxRecordToReturn = ref(100);
    const selectedPerPage = ref("10");
    const perPageOptions = [
      {label: "5", value: 5},
      {label: "10", value: 10},
      {label: "20", value: 20},
      {label: "50", value: 50},
      {label: "100", value: 100},
      {label: "All", value: 0},
    ];
    const pagination = ref({
      rowsPerPage: 10,
    });
    const changePagination = (val) => {
      selectedPerPage.value = val.label;
      pagination.value.rowsPerPage = val.value;
      searchTable.value.setPagination(pagination.value);
    };

    let lastIndexName = "";
    const searchLoading = ref(false);
    const searchData = (indexData, queryData) => {
      if (searchLoading.value) {
        return false;
      }
      searchLoading.value = true;
      searchName.value = queryData.query;

      // let a = queryData.query.split('运行')[0]
      // let b = queryData.query.split('运行')[1]
      // console.log(a)
      // console.log(b)
      const a = ref('')
      const b = ref('')
      if (queryData.query.indexOf('运行') !== -1){
        a.value = queryData.query.split('运行')[0]
        b.value = '运行' + queryData.query.split('运行')[1]
      }
      else if (queryData.query.indexOf('热备用') !== -1){
        a.value = queryData.query.split('热备用')[0]
        b.value = '热备用' + queryData.query.split('热备用')[1]
      }
      else if (queryData.query.indexOf('开关检修') !== -1){
        a.value = queryData.query.split('开关检修')[0]
        b.value = '开关检修' + queryData.query.split('开关检修')[1]
      }
      else if (queryData.query.indexOf('线路检修') !== -1){
        a.value = queryData.query.split('线路检修')[0]
        b.value = '线路检修' + queryData.query.split('线路检修')[1]
      }
      else if (queryData.query.indexOf('冷备用') !== -1){
        a.value = queryData.query.split('冷备用')[0]
        b.value = '冷备用' + queryData.query.split('冷备用')[1]
      }
      else if(queryData.query.indexOf('开关线路') !== -1){
        a.value = queryData.query.split('开关线路')[0]
        b.value = '开关线路' + queryData.query.split('开关线路')[1]
      }
      else if(queryData.query.indexOf('开关站用变') !== -1){
        a.value = queryData.query.split('开关站用变')[0]
        b.value = '开关站用变' + queryData.query.split('开关站用变')[1]
      }
      else if(queryData.query.indexOf('开关电容器') !== -1){
        a.value = queryData.query.split('开关电容器')[0]
        b.value = '开关电容器' + queryData.query.split('开关电容器')[1]
      }
      else if(queryData.query.indexOf('开关变压器') !== -1){
        a.value = queryData.query.split('开关变压器')[0]
        b.value = '开关变压器' + queryData.query.split('开关变压器')[1]
      }
      let senddata = {
        station: '新泽',
        device: '220千伏副二母'
      }
      console.log(senddata);
      searchtype(senddata, store.state.jwtToken).then((res1) => {
        if (res1 === ''){
          let params = {
            q: '出线' + '-' + b.value
          }
          getsearchtasklist(store.state.user.company_id, store.state.jwtToken, params)
              .then((res) => {
                if (res === null) {
                  searchResult.value = [];
                  // results.forEach(result => searchResult.value.push(result._source));

                  resultTotal.value = 0;
                  searchLoading.value = false;
                }
                else if(res.length === 0){
                  searchResult.value = [];
                  // results.forEach(result => searchResult.value.push(result._source));

                  resultTotal.value = 0;
                  searchLoading.value = false;
                }
                else if (res[0].combinations) {
                  var combinations = res[0].combinations;
                  data_lens.value = combinations.length
                  var finalresults = [];
                  for (var i in res[0].combinations) {
                    finalresults.push('');
                    let test = {
                      q: res[0].combinations[i],
                    }
                    getsearchtasklist(store.state.user.company_id, store.state.jwtToken, test)
                        .then((res) => {
                          if (lastIndexName != "" && lastIndexName != indexData.name) {
                            resetColumns(indexData);
                          }
                          lastIndexName = indexData.name;
                          var results = [];
                          results = res;
                          const diplayresults = [];
                          let index1 = 0;
                          for (var s in combinations) {
                            if (combinations[s].indexOf(results[0].task_name) !== -1) {
                              index1 = Number(s);
                            }
                          }
                          for (var k in results) {
                            var obj = {
                              index: index1,
                              detail_raw: results[k].details,
                              additional: results[k].additional,
                              task_name: results[k].task_name,
                              order_number: results[k].order_number,
                              details: results[k].details.reduce((acc, detail) => {
                                if (detail.device_type !== '--') {
                                  acc += detail.device_type;
                                }
                                acc += detail.device + ": " + detail.operation + "; ";
                                return acc
                              }, '')
                            };
                            diplayresults.push(obj);
                          }
                          var data = {
                            name: test.q,
                            children: diplayresults
                          };
                          finalresults[index1] = data;
                          nextTick(setTimeout(() => {
                            searchResult.value = finalresults;
                            // results.forEach(result => searchResult.value.push(result._source));
                            resultTotal.value = results.length;
                            searchLoading.value = false;
                          }, 200));
                        })
                  }
                }
                else {
                  nextTick(() => {
                    searchResult.value = [];
                    // results.forEach(result => searchResult.value.push(result._source));

                    resultTotal.value = 0;
                    searchLoading.value = false;
                  });
                }
              })
        }
        else {
          searchResult.value = [];
          // results.forEach(result => searchResult.value.push(result._source));

          resultTotal.value = 0;
          searchLoading.value = false;
        }
      })
    }

    const resetColumns = (indexData) => {
      resultColumns.value = defaultColumns();
      if (indexData.columns.length == 0) {
        return;
      }
      // remove _source column
      resultColumns.value.splice(0);
      // add all the selected fields one by one
      for (let i = 0; i < indexData.columns.length; i++) {
        var newCol = {
          name: indexData.columns[i],
          label: indexData.columns[i],
          field: (row) => Object.byString(row._source, indexData.columns[i]),
          align: "left",
          sortable: true,
        };
        resultColumns.value.push(newCol);
      }
    };

    return {
      searchData,
      resetColumns,
      data_lens,
      searchName,
      resultColumns,
      searchResult,
      resultTotal,
      searchLoading,
      selectedPerPage,
      maxRecordToReturn,
      perPageOptions,

      changePagination,
      chartHistogram,
      chartOptions,
    };
  },
});
</script>

<style lang="scss">
.max-result {
  width: 170px;
}

.search-list {
  width: 100%;

  .chart {
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .q-table__top {
    padding: 5px 0 0 0;
  }

  .q-table thead tr,
  .q-table tbody td {
    height: 38px;
    padding: 6px 12px;
  }

  .q-table__bottom {
    width: 100%;
  }

  .q-table__bottom {
    min-height: 40px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .q-td {
    word-wrap: break-word;
    word-break: break-all;

    .expanded {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}

.q-table__title{
  padding: 10px;
}
</style>