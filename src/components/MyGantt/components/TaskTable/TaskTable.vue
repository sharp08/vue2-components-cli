<template>
  <div id="task-table">
    <!-- 这一层用于展示完整的、没有滚动条的图，切换 scales 时，应该重新设置这一层的宽度 -->
    <div class="default-no-fold">
      <!-- 表头 -->
      <div class="th" ref="th">
        <div class="tr">
          <div
            class="td"
            v-for="(item, index) in renderColumns"
            :key="index"
            :style="item.tdStyle"
          >
            <div class="content" :style="item.contentStyle">
              {{ item.text }}
            </div>
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
            v-for="(columnItem, columnsIndex) in renderColumns"
            :key="columnsIndex"
            :style="columnItem.tdStyle"
          >
            <div class="content" :style="columnItem.contentStyle">
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
  computed: {
    renderColumns() {
      let r = [];
      r = this.columns.map((item) => {
        let o = {
          text: item.text,
          key: item.key,
          render: item.render,
          tdStyle: {},
          contentStyle: {},
        };
        if (item.width) {
          o.tdStyle = {
            "flex-basis": item.width,
            "flex-grow": 0,
            "flex-shrink": 0,
            "box-sizing": "border-box",
          };
        }
        if (item.align) {
          o.contentStyle = { "text-align": item.align };
        }

        return o;
      });
      return r;
    },
  },
  components: {
    TableCell,
  },
};
</script>

<style scoped lang="less">
@import url(./TaskTable.less);
</style>