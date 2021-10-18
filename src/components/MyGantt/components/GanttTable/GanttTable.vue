<template>
  <div id="gantt-table">
    <!-- 表头 -->
    <div class="th" ref="th">
      <div class="tr">图表区 - 表头</div>
    </div>
    <!-- 表体 -->
    <div class="tb">
      <div class="tr" v-for="(item, index) in taskList" :key="index">
        <div class="td">
          asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfa
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GanttTable",
  props: {
    taskList: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {
    // 需要动态保证左右两侧高度一致
    this.$refs[
      "th"
    ].style.height = `${this.$parent.$refs["aa"].$refs["th"].clientHeight}px`;
  },
  watch: {},
  methods: {},
  components: {},
};
</script>

<style scoped lang="less">
@import url(./GanttTable.less);
</style>