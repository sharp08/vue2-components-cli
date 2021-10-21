<template>
  <div id="gantt-wrap">
    <TaskTable
      class="task-table"
      :columns="columns"
      ref="aa"
      :taskList="taskList"
    />
    <div class="resize-handler"></div>
    <GanttTable
      :startDate="startDate"
      :endDate="endDate"
      :scales="scales"
      :taskList="taskList"
      :regions="regions"
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
  props: {},
  data() {
    return {
      startDate: "2021-06-21",
      endDate: "2021-06-30",
      // 左侧任务列
      columns: [
        {
          text: "第一列",
          key: "one",
          render: (h) => {
            return h("span", "测试render");
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
      // 维度
      scales: [
        {
          unit: "year",
        },
        {
          unit: "month",
        },
        {
          unit: "day",
        },
      ],
      // 任务列表
      taskList: [
        {
          id: "1",
          one: "任务1 - 列1",
          two: "任务1 - 列2",
          three: "任务1 - 列3",
        },
        {
          id: "2",
          one: "任务2 - 列1",
          two: "任务2 - 列2",
          three: "任务2 - 列3",
        },
        {
          id: "3",
          one: "任务3 - 列1",
          two: "任务3 - 列2",
          three: "任务3 - 列3",
        },
        {
          id: "4",
          one: "任务4 - 列1",
          two: "任务4 - 列2",
          three: "任务4 - 列3",
        },
      ],
      // 甘特图时间段
      regions: [
        {
          id: "a",
          taskId: "1",
          startDate: "2021-06-22",
          endDate: "2021-06-23",
        },
        {
          id: "b",
          taskId: "2",
          startDate: "2021-06-24",
          endDate: "2021-06-26",
        },
        {
          id: "d",
          taskId: "4",
          startDate: "2021-06-27",
          endDate: "2021-06-28",
        },
      ],
      // 连接线
      lines: [
        // {
        //   from: "a",
        //   to: "d",
        //   type: "start-start",
        // },
        // {
        //   from: "a",
        //   to: "d",
        //   type: "end-end",
        // },
        {
          from: "b",
          to: "d",
          type: "start-end",
        },
        // {
        //   from: "b",
        //   to: "d",
        //   type: "end-start",
        // },
      ],
    };
  },
  components: {
    TaskTable,
    GanttTable,
  },
};
</script>

<style scoped lang="less">
#gantt-wrap {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;

  .task-table {
    background: orange;
    flex-shrink: 0;
    overflow: auto;
    width: 300px;
  }

  .resize-handler {
    width: 15px;
    flex-shrink: 0;
    background: rgb(107, 71, 62);
    cursor: w-resize;
  }
  .gantt-table {
    overflow: auto;
    flex: 1;
  }
}
</style>