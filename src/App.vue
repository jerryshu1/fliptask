<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted() {
    window.addEventListener('beforeunload', this.saveState);
    // getcompanylist()
  },
  created() {
    if (sessionStorage.length !== 0) {
      this.$store.commit('reloads', JSON.parse(sessionStorage.state));
    }
  },
  methods: {
    saveState() {
      sessionStorage.setItem('state', JSON.stringify(this.$store.state));
    }
  }
};
</script>
