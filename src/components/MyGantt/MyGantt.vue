<template>
  <div id="gantt-wrap">
    <TaskTable
      class="task-table"
      :columns="columns"
      ref="task-table"
      :taskList="taskList"
    />
    <div
      class="resize-handler"
      ref="resize-handler"
      @mousedown="resizeHandlerMouseDown"
    ></div>
    <GanttTable
      @contentEvent="contentEvent"
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
    },
    scales: {
      type: Array,
      required: true,
    },
    regions: {
      type: Array,
    },
    lines: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  mounted() {
    this.$refs["resize-handler"].style.left =
      this.$refs["task-table"].$el.offsetWidth + "px";
    // 监听 columns，用于动态设置甘特图表头高度
    const taskTh = this.$refs["task-table"].$refs["th"];
    const ganttTh = this.$refs["gantt-table"].$refs["th"];
    this.unwatch = this.$watch(
      "columns",
      () => {
        // 需要动态保证左右两侧高度一致
        ganttTh.style.height = `${taskTh.offsetHeight}px`;
      },
      { immediate: true }
    );

    // 监听 taskTh 高度，同步 ganttTh 高度
    this.observer = new ResizeObserver(() => {
      ganttTh.style.height = `${taskTh.offsetHeight}px`;
    });
    this.observer.observe(taskTh);
  },
  beforeDestroy() {
    this.observer.observe(taskTh);
    this.observer = null;
    this.unwatch();
    this.unwatch = null;
  },
  methods: {
    // 拖拽逻辑
    resizeHandlerMouseDown(e) {
      const self = this.$refs["resize-handler"];
      const originOffsetLeft = self.offsetLeft;
      const x = e.clientX;

      document.onmousemove = (e) => {
        let dis = e.clientX - x;
        // 右移
        if (dis > 0) {
          self.style.left = originOffsetLeft + dis + "px";
        }
        // 左移
        else {
          self.style.left = originOffsetLeft + dis + "px";
        }
      };

      document.onmouseup = (e) => {
        this.$refs["task-table"].$el.style.width = self.offsetLeft + "px";
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    //  甘特图 - 滑块事件
    contentEvent(e, info) {
      this.$emit("contentEvent", e, info);
    },
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