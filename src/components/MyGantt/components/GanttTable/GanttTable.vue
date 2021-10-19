<template>
  <div id="gantt-table">
    <!-- 表头 -->
    <div class="th" ref="th">
      <div class="tr">图表区 - 表头</div>
    </div>
    <!-- 表体 -->
    <div class="tb">
      <div class="tr" v-for="(item, index) in taskList" :key="index">
        <div class="td"></div>
        <!-- 暂时写死 4 = (行高30 - 拖拽区高22) / 2 -->
        <ResizableDiv
          :ref="'resize_' + item.id"
          @event="(type) => handleResizableDivEvent(type, item.id)"
          :style="{
            top: `${index * 30 + 4}px`,
            left: `${(index + 1) * 50}px`,
          }"
        />
      </div>
      <!-- 连接线 -->
      <component
        :key="'line_' + index"
        v-for="(item, index) in renderLines"
        :is="lineComp(item)"
        :style="item.style"
        :length="item.length"
      />
    </div>
  </div>
</template>

<script>
import ResizableDiv from "../ResizableDiv";
import StartStartLine from "../StartStartLine";
import EndEndLine from "../EndEndLine";

// 针对 StartStartLine 的最终目标是，通过传入 lines 数组
// 内部对 lines 数据进行解析，生成
export default {
  name: "GanttTable",
  props: {
    taskList: {
      type: Array,
    },
    lines: {
      type: Array,
      default: () => [
        {
          from: "xxx",
          to: "xxx",
          type: "start-start",
        },
      ],
    },
  },
  data() {
    return {
      renderLines: [],
    };
  },
  computed: {},
  mounted() {
    // 需要动态保证左右两侧高度一致
    this.$refs[
      "th"
    ].style.height = `${this.$parent.$refs["aa"].$refs["th"].clientHeight}px`;

    this.renderLines = this.createRenderLines();
  },
  watch: {},
  methods: {
    createRenderLines() {
      let r = [];
      this.lines.forEach((item) => {
        const fromDom = this.$refs[`resize_${item.from}`][0].$el;
        const toDom = this.$refs[`resize_${item.to}`][0].$el;
        if (item.type === "start-start") {
          const o = this.createSSLine(
            fromDom,
            toDom,
            item.from,
            item.to,
            item.type
          );

          r.push(o);
        } else if (item.type === "end-end") {
          const o = this.createEELine(
            fromDom,
            toDom,
            item.from,
            item.to,
            item.type
          );

          r.push(o);
        }
      });

      return r;
    },
    // 创建 start-start 连接线
    createSSLine(fromDom, toDom, fromId, toId, type) {
      let line1, line2, line3, top, left;
      const defaultLen = 30; //  默认宽度
      const dis = 3; //  偏移量，让线与元素保持一点点距离
      // 如果起点元素在左边
      if (fromDom.offsetLeft <= toDom.offsetLeft) {
        line1 = defaultLen;
        line3 = defaultLen + toDom.offsetLeft - fromDom.offsetLeft;
      }
      // 如果终点元素在左边
      else {
        line1 = defaultLen + fromDom.offsetLeft - toDom.offsetLeft;
        line3 = defaultLen;
      }
      line2 = Math.abs(toDom.offsetTop - fromDom.offsetTop);
      top = fromDom.offsetTop + fromDom.clientHeight / 2;
      left = fromDom.offsetLeft - line1 - dis;

      let o = {
        style: {
          top: top + "px",
          left: left + "px",
        },
        length: [line1, line2, line3],
        from: fromId,
        to: toId,
        type,
      };
      return o;
    },
    // 创建 end-end 连接线
    createEELine(fromDom, toDom, fromId, toId, type) {
      let line1, line2, line3, top, left;
      const defaultLen = 30; //  默认宽度
      const dis = 3; //  偏移量，让线与元素保持一点点距离
      // 起点元素右边距
      const fromDomRightPos = fromDom.offsetLeft + fromDom.clientWidth;
      // 终点元素右边距
      const toDomRightPos = toDom.offsetLeft + toDom.clientWidth;
      // 如果终点元素在右边
      if (fromDomRightPos <= toDomRightPos) {
        line1 = defaultLen + toDomRightPos - fromDomRightPos;
        line3 = defaultLen;
      }
      // 如果起点元素在右边
      else {
        line1 = defaultLen;
        line3 = defaultLen + fromDomRightPos - toDomRightPos;
      }
      line2 = Math.abs(toDom.offsetTop - fromDom.offsetTop);
      top = fromDom.offsetTop + fromDom.clientHeight / 2;
      left = fromDomRightPos + dis;

      let o = {
        style: {
          top: top + "px",
          left: left + "px",
        },
        length: [line1, line2, line3],
        from: fromId,
        to: toId,
        type,
      };
      return o;
    },
    // 当 ResizableDiv 拖拽或者缩放时触发
    handleResizableDivEvent(type, taskId) {
      // 判断 renderLines 里面是否包含 taskId 无论 from 还是 to 属性
      // 如果包含，则证明已经存在这个线
      // 此时需要更新这条线（暂时使用替换）
      this.renderLines.forEach((item, index) => {
        // 已经存在了这条线
        if (item.from === taskId || item.to === taskId) {
          const fromDom = this.$refs[`resize_${item.from}`][0].$el;
          const toDom = this.$refs[`resize_${item.to}`][0].$el;
          // 类型一
          if (item.type === "start-start") {
            // 重新创建这条线
            const newLine = this.createSSLine(
              fromDom,
              toDom,
              item.from,
              item.to,
              item.type
            );
            // 删掉原来的线，用新的线替换
            this.renderLines.splice(index, 1, newLine);
          }
          // 类型二
          else if (item.type === "end-end") {
            // 重新创建这条线
            const newLine = this.createEELine(
              fromDom,
              toDom,
              item.from,
              item.to,
              item.type
            );
            // 删掉原来的线，用新的线替换
            this.renderLines.splice(index, 1, newLine);
          }
        }
      });
    },
    // 动态渲染 line
    lineComp(item) {
      let compName;
      switch (item.type) {
        case "start-start":
          compName = "StartStartLine";
          break;
        case "end-end":
          compName = "EndEndLine";
          break;
      }
      return compName;
    },
  },
  components: {
    ResizableDiv,
    StartStartLine,
    EndEndLine,
  },
};
</script>

<style scoped lang="less">
@import url(./GanttTable.less);
</style>