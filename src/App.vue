<template>
  <div class="wrap">
    <MyGantt />
  </div>
</template>

<script>
import MyGantt from "./components/MyGantt";

export default {
  name: "App",
  components: {
    MyGantt,
  },
  data() {
    return {};
  },
  watch: {},
  methods: {},
};
</script>

<style lang="less">
body {
  margin: 0;
}
.wrap {
}
</style>