<template>
  <div class="wrap">
    <MyGanttDemo />
  </div>
</template>

<script>
import MyGanttDemo from "./components/MyGantt/Demo";

export default {
  name: "App",
  components: {
    MyGanttDemo,
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
</style>