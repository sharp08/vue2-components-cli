<template>
  <div class="gantt-demo-container">
    <div class="tool-bar">
      <!-- <button @click="load">加载后台数据</button> -->
      <button @click="loadColumns">加载 列</button>
      <button @click="loadDate">加载 时间范围</button>
      <button @click="loadScales">加载 时间维度</button>
      <button @click="loadTasks">加载 任务</button>
      <button @click="changeScales('year')" :style="styles('year')">年</button>
      <button @click="changeScales('month')" :style="styles('month')">
        月
      </button>
      <button @click="changeScales('day')" :style="styles('day')">日</button>
      <button @click="loadRegions">加载 计划</button>
      <button @click="loadLines">加载 连接线</button>
      <button @click="clearLines">清除所有的 连接线</button>
      <!-- <button @click="addLines">新增lines</button> -->
    </div>
    <div class="display-container">
      <MyGantt
        @contentEvent="contentEvent"
        :startDate="startDate"
        :endDate="endDate"
        :scales="scales"
        :taskList="taskList"
        :lines="lines"
        :columns="columns"
        :regions="regions"
      />
    </div>
    <!-- 展示当前存在哪些 regions ，用于创建连接线 -->
    <CreateLines :regions="regions" @create="handleCreateLine" />
    <!-- 模拟弹窗 -->
    <SimulationPop
      v-show="popSwitch"
      :model="popModel"
      @confirm="handlePopConfirm"
      @cancel="popSwitch = false"
    />
  </div>
</template>

<script>
import MyGantt from "../index";
import CreateLines from "./components/CreateLines";
import SimulationPop from "./components/SimulationPop";

export default {
  name: "GanttDemo",
  data() {
    return {
      popSwitch: false,
      popModel: {},

      startDate: "",
      endDate: "",
      // 左侧任务列
      columns: [],
      // 维度
      scales: [],
      // 任务列表
      taskList: [],
      // 甘特图时间段
      regions: [],
      // 连接线
      lines: [],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    load() {
      this.loadColumns();
      this.loadDate();
      this.loadScales();
      this.loadTasks();
      this.loadRegions();
      this.loadLines();
    },
    loadColumns() {
      this.columns = [
        {
          text: "第一列",
          key: "one",
          align: "right",
          width: "50%",
        },
        {
          text: "第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列第二列",
          key: "two",
        },
        {
          text: "第三列",
          key: "three",
          render: (h, params) => {
            return [
              h(
                "button",
                {
                  on: {
                    click: () => {
                      this.popModel = {
                        taskId: params.row.id,
                        startDate: null,
                        endDate: null,
                      };

                      this.popSwitch = true;
                    },
                  },
                },
                "新增"
              ),
            ];
          },
        },
      ];
    },
    loadDate() {
      this.startDate = "2021-10-01";
      this.endDate = "2021-11-02";
    },
    loadScales() {
      this.scales = [
        {
          unit: "year",
        },
        {
          unit: "month",
        },
        {
          unit: "day",
        },
      ];
    },
    loadTasks() {
      this.taskList = [
        {
          id: "1",
          one: "任务1 - 列1",
          two: "任务1 - 列2",
          three: "任务1 - 列3",
        },
        {
          id: "2",
          one: "任务2 - 列1",
          two: "任务2 - 列2任务2 - 列2任务2 - 列2任务2 - 列2",
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
      ];
    },
    loadRegions() {
      this.regions = [
        {
          id: "a",
          taskId: "1",
          startDate: "2021-10-02",
          endDate: "2021-10-03",
          class: "green", // 默认支持 blue green，也可以自定义，建议只改 background-color 和 border-color
          text: "ab",
        },
        {
          id: "b",
          taskId: "2",
          startDate: "2021-10-04",
          endDate: "2021-10-06",
          text: "长文本长文本长文本长文本",
        },
        {
          id: "d",
          taskId: "4",
          startDate: "2021-10-07",
          endDate: "2021-10-08",
        },
      ];
    },
    loadLines() {
      this.lines = [
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
      ];
    },
    clearLines() {
      this.lines = [];
    },
    changeScales(unit) {
      let temp = [...this.scales];
      const idx = temp.findIndex((item) => item.unit === unit);
      if (idx >= 0) {
        temp.splice(idx, 1);
      } else {
        temp.push({ unit });
      }
      let r = [];
      ["year", "month", "day"].forEach((str) => {
        const o = temp.find((item) => item.unit === str);
        if (o) {
          r.push(o);
        }
      });
      this.scales = [...r];
    },
    // 动态样式
    styles(unit) {
      const o = this.scales.find((item) => item.unit === unit);
      if (o) {
        return {
          color: "red",
          fontWeight: "bold",
        };
      }
    },
    handlePopConfirm(params) {
      this.regions.push(params);
      this.popSwitch = false;
    },
    handleCreateLine({ ids, type }) {
      if (ids.length === 2) {
        this.lines.push({
          from: ids[0],
          to: ids[1],
          type,
        });
      } else {
        console.warn("请选择两条需要连接的数据");
      }
    },
    // 滑块上触发的事件，目前支持 mouseenter mouseleave click，通过 e.type 判断事件类型
    contentEvent(e, info) {
      console.log(e, info);
    },
  },
  components: {
    MyGantt,
    SimulationPop,
    CreateLines,
  },
};
</script>

<style scoped lang="less">
.gantt-demo-container {
  .tool-bar {
    padding: 4px;
    button {
      margin-right: 4px;
    }
  }
  .display-container {
    height: 400px;
    width: 700px;
    margin-left: 30px;
    margin-bottom: 10px;
  }
}
</style>
<style lang="less">
.abc {
  background: red;
}
</style>