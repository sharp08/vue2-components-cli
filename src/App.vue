<template>
  <div class="wrap">
    <div class="gantt-demo-container">
      <MyGantt />
    </div>
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
  .gantt-demo-container {
    height: 500px;
    width: 700px;
    border: 5px solid red;
  }
}
</style>