<template>
  <q-page class="q-pa-md">
    <div class="column">
      <mutisearchbar
          :data="queryData"
          @updated="queryUpdated"
          @refresh="searchData"
      />
      <div class="row">
        <muti-list ref="searchList" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

import SearchBar from "../components/search/SearchBar.vue";
import MutiList from "../components/search/MutiList.vue";
import Mutisearchbar from "../components/search/Mutisearchbar.vue";
export default defineComponent({
  name: "mutisearch",
  components: {
    SearchBar,
    MutiList,
    Mutisearchbar,
  },
  setup() {
    const indexData = ref({
      name: "tasks",
      // columns: ["operation_object_type_and_behavior", "operation_task", "remarks", "risk_content_description"],
    });
    const queryData = ref({
      query: "",
      // time: {
      //   tab: "relative",
      //   startDate: "",
      //   startTime: "",
      //   endDate: "",
      //   endTime: "",
      //   selectedRelativePeriod: "Minutes",
      //   selectedRelativeValue: 30,
      //   selectedFullTime: false,
      // },
    });

    const searchList = ref(null);
    const searchData = () => {
      searchList.value.searchData(indexData.value, queryData.value);
    };
    const resetColumns = () => {
      searchList.value.resetColumns(indexData.value);
    };

    const indexUpdated = ({ name, columns }) => {
      if (indexData.value.name != name) {
        indexData.value.name = name;
        indexData.value.columns = columns;
        queryData.value.query = "";
        searchData();
      } else {
        indexData.value.columns = columns;
        resetColumns();
      }
    };
    const queryUpdated = ({ query, time }) => {
      queryData.value.query = query;
      queryData.value.time = time;
      searchData();
    };

    return {
      indexData,
      queryData,
      searchList,
      searchData,
      indexUpdated,
      queryUpdated,
    };
  },
});
</script>
