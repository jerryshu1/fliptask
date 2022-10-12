<template>
  <div class="row justify-between">
    <div class="col row justify-between">
      <div class="col">
        <q-input
          v-model="searchQuery"
          placeholder="例如：运行改为热备用"
          dense
          filled
          type="search"
          class="search-field"
          @change="searchData"
          @keycode.enter="searchData"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, watch, ref } from "vue";


export default defineComponent({
  name: "ComponentSearchSearchBar",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["updated", "refresh"],
  setup(props, { emit }) {
    const searching = ref(false);
    const refreshIcon = ref("refresh");

    const searchQuery = ref(props.data.query);

    const searchData = () => {
      if (searching.value) {
        return;
      }
      refreshIcon.value = "refresh";
      searching.value = true;
      emit("updated", {
        query: searchQuery.value,
      });
      nextTick(() => {
        searching.value = false;
      });
    };

    return {
      searching,
      searchQuery,
      refreshIcon,
      searchData,
    };
  },
});
</script>

<style lang="scss">
.search-field .q-field__control {
  border-radius: 4px 0 0 0;
}
.search-time {
  width: 120px;
}
.search-dropdown {
  width: 60px !important;
}
</style>
