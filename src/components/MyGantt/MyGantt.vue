<template>
  <div id="gantt-wrap">
    <TaskTable
      class="task-table"
      :columns="columns"
      ref="task-table"
      :taskList="taskList"
    />
    <div class="resize-handler"></div>
    <GanttTable
      :startDate="startDate"
      :endDate="endDate"
      :scales="scales"
      :taskList="taskList"
      :regions="regions"
      ref="gantt-table"
      class="gantt-table"
      :lines="lines"
    />
  </div>
</template>

<script>
import TaskTable from "./components/TaskTable";
import GanttTable from "./components/GanttTable";

export default {
  name: "MyGantt",
  props: {
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    taskList: {
      type: Array,
      required: true,
    },
    scales: {
      type: Array,
      required: true,
    },
    regions: {
      type: Array,
      required: true,
    },
    lines: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  mounted() {
    // 监听 columns，用于动态设置甘特图表头高度
    this.unwatch = this.$watch(
      "columns",
      () => {
        // 需要动态保证左右两侧高度一致
        this.$refs["gantt-table"].$refs[
          "th"
        ].style.height = `${this.$refs["task-table"].$refs["th"].clientHeight}px`;
      },
      { immediate: true }
    );
  },
  beforeDestroy() {
    this.unwatch();
    this.unwatch = null;
  },
  components: {
    TaskTable,
    GanttTable,
  },
};
</script>

<style scoped lang="less">
@import url(./MyGantt.less);
</style>