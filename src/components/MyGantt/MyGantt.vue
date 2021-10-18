<template>
  <div id="gantt-wrap">
    <TaskTable
      class="task-table"
      :columns="columns"
      ref="aa"
      :taskList="taskList"
    />
    <div class="resize-handler"></div>
    <GanttTable :taskList="taskList" class="gantt-table" />
  </div>
</template>

<script>
import TaskTable from "./components/TaskTable";
import GanttTable from "./components/GanttTable";

export default {
  name: "MyGantt",
  props: {},
  data() {
    return {
      columns: [
        {
          text: "第一列",
          key: "one",
          render: (h) => {
            return h("span", "aabb");
          },
        },
        {
          text: "第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列",
          key: "two",
        },
        {
          text: "第三列",
          key: "three",
        },
      ],
      taskList: [
        {
          one: "任务1 - 列1",
          two: "任务1 - 列2",
          three: "任务1 - 列3",
        },
        {
          one: "任务2 - 列1",
          two: "任务2 - 列2",
          three: "任务2 - 列3",
        },
        {
          one: "任务3 - 列1",
          two: "任务3 - 列2",
          three: "任务3 - 列3",
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {
    TaskTable,
    GanttTable,
  },
};
</script>

<style scoped lang="less">
#gantt-wrap {
  display: flex;

  .task-table {
    background: orange;
    flex-shrink: 0;
    flex-basis: 300px;
    overflow: auto;
  }

  .resize-handler {
    width: 15px;
    flex-shrink: 0;
    background: rgb(107, 71, 62);
    cursor: pointer;
  }
  .gantt-table {
    flex-basis: auto;
    overflow: auto;
  }
}
</style>