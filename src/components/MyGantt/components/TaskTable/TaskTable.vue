<template>
  <div id="task-table">
    <!-- 表头 -->
    <div class="th" ref="th">
      <div class="tr">
        <div class="td" v-for="(item, index) in columns" :key="index">
          {{ item.text }}
        </div>
      </div>
    </div>
    <!-- 表体 -->
    <div class="tb">
      <div
        class="tr"
        v-for="(taskItem, taskIndex) in taskList"
        :key="taskIndex"
      >
        <div
          class="td"
          v-for="(columnItem, columnsIndex) in columns"
          :key="columnsIndex"
        >
          <template v-if="columnItem.render">
            <TableCell
              :row="taskItem"
              :rowIndex="taskIndex"
              :render="columnItem.render"
            />
          </template>
          <template v-else>
            {{ taskItem[columnItem.key] }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableCell from "../TableCell";

export default {
  name: "TaskTable",
  props: {
    columns: {
      type: Array,
    },
    taskList: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  components: {
    TableCell,
  },
};
</script>

<style scoped lang="less">
@import url(./TaskTable.less);
</style>