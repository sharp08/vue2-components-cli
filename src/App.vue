<template>
  <div class="wrap">
    <MyRich />
    <!-- <hr />
    <MyButton type="danger" />
    <hr />
    <MyInput /> -->
  </div>
</template>

<script>
import MyRich from "./components/MyRich";
export default {
  name: "App",
  components: {
    MyRich,
  },
  data() {
    return {};
  },
  watch: {},
  methods: {},
};
</script>

<style lang="less">
.wrap {
}
</style>