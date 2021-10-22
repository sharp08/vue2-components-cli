<template>
  <div id="gantt-table">
    <!-- 这一层用于展示完整的、没有滚动条的图，切换 scales 时，应该重新设置这一层的宽度 -->
    <div class="default-no-fold" ref="no-fold">
      <!-- 表头 -->
      <div class="th" ref="th">
        <div
          class="tr"
          :style="{ height: `${100 / scales.length}%` }"
          v-for="[k, v] in renderHead"
          :key="k"
        >
          <span class="td" v-for="(sub, index) in v" :key="index">{{
            sub
          }}</span>
        </div>
      </div>
      <!-- 表体 -->
      <div class="tb">
        <div class="tr" v-for="(item, index) in taskList" :key="index">
          <div class="td"></div>
        </div>
        <!-- 暂时写死 4 = (行高30 - 拖拽区高22) / 2 -->
        <ResizableDiv
          v-for="item in renderRegions"
          :key="item.id"
          :ref="'resize_' + item.id"
          @event="(type) => handleResizableDivEvent(type, item.id)"
          :style="{
            top: `${item._lineIndex * 30 + 4}px`,
          }"
        />
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
  </div>
</template>

<script>
import ResizableDiv from "../ResizableDiv";
import StartStartLine from "../StartStartLine";
import EndEndLine from "../EndEndLine";
import StartEndLine from "../StartEndLine";
import EndStartLine from "../EndStartLine";
import { DATE_INTERVAL } from "@/js/utils";

export default {
  name: "GanttTable",
  props: {
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    scales: {
      type: Array,
    },
    taskList: {
      type: Array,
    },
    regions: {
      type: Array,
    },
    lines: {
      type: Array,
    },
  },
  data() {
    return {
      renderLines: [], // 用于渲染连接线
      renderTaskList: [],
    };
  },
  computed: {
    // 用于渲染头部
    renderHead() {
      // 这里期望 r 是一个有序对象，因此使用 Map
      let r = new Map();
      let years = [];
      let months = [];
      let days = [];

      const dateTree = DATE_INTERVAL(
        +new Date(this.startDate),
        +new Date(this.endDate)
      );
      // 无论 scales 传入什么值，r 都是完整的结构
      for (let [y, v1] of Object.entries(dateTree)) {
        years.push(y);
        for (let [m, v2] of Object.entries(v1)) {
          months.push(m);
          for (let [d, v3] of Object.entries(v2)) {
            days.push(d);
          }
        }
      }

      // scales 决定 renderHead 包含哪些值
      this.scales.forEach((item) => {
        if (item.unit === "year") {
          r.set(item.unit, years);
        } else if (item.unit === "month") {
          r.set(item.unit, months);
        } else if (item.unit === "day") {
          r.set(item.unit, days);
        }
      });

      return r;
    },
    //  用于渲染 region
    renderRegions() {
      let r = this.regions.map((region) => {
        const findIndex = this.taskList.findIndex(
          (task) => task.id === region.taskId
        );
        return {
          ...region,
          /**
           * 因为 region 是相对于 tb 而不是相对于行定位，因此要获取到
           * 当前 region 位于第几行才能摆正 region 的位置
           */
          _lineIndex: findIndex,
        };
      });
      return r;
    },
  },
  mounted() {
    // scales 发生变化 => 重新渲染 regions 和 lines
    // regions 发生变化 => 重新渲染 regions 和 lines
    // taskList 发生变化 => 重新渲染 regions 和 lines
    // lines 发生变化 => 重新渲染 lines

    this.unwatch = this.$watch(
      () => {
        return {
          scales: this.scales,
          renderRegions: this.renderRegions,
          taskList: this.taskList,
          lines: this.lines,
        };
      },
      () => {
        this.renderRegionsFn();
        this.renderLines = this.renderLinesFn();
      },
      { immediate: true }
    );
  },
  beforeDestroy() {
    this.unwatch();
    this.unwatch = null;
  },
  methods: {
    // 根据数据渲染 region
    renderRegionsFn() {
      // 注意这里需要加上一天的时间戳才是完整的时间戳长度
      const completeStamp =
        new Date(this.endDate).getTime() -
        new Date(this.startDate).getTime() +
        86400000;

      this.renderRegions.forEach((region) => {
        const startDiffStamp =
          new Date(region.startDate).getTime() -
          new Date(this.startDate).getTime();
        const regionDuration =
          new Date(region.endDate).getTime() -
          new Date(region.startDate).getTime();

        const w =
          this.$refs["no-fold"].clientWidth * (regionDuration / completeStamp);
        const l =
          this.$refs["no-fold"].clientWidth * (startDiffStamp / completeStamp);
        this.$refs["resize_" + region.id][0].$el.style.left = l + "px";
        this.$refs["resize_" + region.id][0].$el.style.width = w + "px";
      });
    },
    // 渲染连接线
    renderLinesFn() {
      let r = [];
      this.lines.forEach((item) => {
        const fromRef = this.$refs[`resize_${item.from}`];
        const toRef = this.$refs[`resize_${item.to}`];
        if (fromRef && toRef) {
          const fromDom = fromRef[0].$el;
          const toDom = toRef[0].$el;
          // 做个映射，减少重复代码
          const map = {
            "start-start": "createSSLine",
            "end-end": "createEELine",
            "start-end": "createSELine",
            "end-start": "createESLine",
          };
          const o = this[map[item.type]](
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
    // 创建 start-end 连接线
    createSELine(fromDom, toDom, fromId, toId, type) {
      let line1, line2, line3, line4, line5, top, left;
      const defaultLen = 30; //  默认宽度
      const dis = 3; //  偏移量，让线与元素保持一点点距离
      // 起点元素左边距
      const fromDomLeftPos = fromDom.offsetLeft;
      // 终点元素右边距
      const toDomRightPos = toDom.offsetLeft + toDom.clientWidth;

      // 场景一
      if (fromDomLeftPos - toDomRightPos >= defaultLen * 2) {
        line1 = defaultLen;
        line2 = toDom.offsetTop - fromDom.offsetTop - defaultLen / 2;
        line3 = 2; //  这里是线宽
        line4 = defaultLen / 2;
        line5 = fromDomLeftPos - toDomRightPos - defaultLen - 4; //  4 是调试出来的，换成 dis 箭头会有偏移
      }
      // 场景二
      else if (fromDomLeftPos - toDomRightPos < defaultLen * 2) {
        line1 = defaultLen;
        line2 = toDom.offsetTop - fromDom.offsetTop - defaultLen / 2;
        line3 = Math.abs(
          toDomRightPos + defaultLen - (fromDomLeftPos - defaultLen) + dis * 2
        );
        line4 = defaultLen / 2;
        line5 = defaultLen;
      }
      top = fromDom.offsetTop + fromDom.clientHeight / 2;
      left = fromDomLeftPos - defaultLen - dis;

      let o = {
        style: {
          top: top + "px",
          left: left + "px",
        },
        length: [line1, line2, line3, line4, line5],
        from: fromId,
        to: toId,
        type,
      };
      return o;
    },
    // 创建 end-start 连接线
    createESLine(fromDom, toDom, fromId, toId, type) {
      let line1, line2, line3, line4, line5, top, left;
      const defaultLen = 30; //  默认宽度
      const dis = 3; //  偏移量，让线与元素保持一点点距离
      // 起点元素右端到容器左侧距离
      const fromDomRightPos = fromDom.offsetLeft + fromDom.clientWidth;
      // 终点元素左端到容器左侧距离
      const toDomLeftPos = toDom.offsetLeft;

      // 场景一
      if (toDomLeftPos - fromDomRightPos >= defaultLen * 2) {
        line1 = defaultLen;
        line2 = toDom.offsetTop - fromDom.offsetTop - defaultLen / 2;
        line3 = 2; //  这里是线宽
        line4 = defaultLen / 2;
        line5 = toDomLeftPos - fromDomRightPos - defaultLen - dis; //  4 是调试出来的，换成 dis 箭头会有偏移
      }
      // 场景二
      else if (toDomLeftPos - fromDomRightPos < defaultLen * 2) {
        line1 = defaultLen;
        line2 = toDom.offsetTop - fromDom.offsetTop - defaultLen / 2;
        line3 = (defaultLen + dis) * 2 - (toDomLeftPos - fromDomRightPos);
        line4 = defaultLen / 2;
        line5 = defaultLen;
      }
      top = fromDom.offsetTop + fromDom.clientHeight / 2;
      left = fromDomRightPos + dis;

      let o = {
        style: {
          top: top + "px",
          left: left + "px",
        },
        length: [line1, line2, line3, line4, line5],
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
          // 类型三
          else if (item.type === "start-end") {
            // 重新创建这条线
            const newLine = this.createSELine(
              fromDom,
              toDom,
              item.from,
              item.to,
              item.type
            );
            // 删掉原来的线，用新的线替换
            this.renderLines.splice(index, 1, newLine);
          }
          // 类型四
          else if (item.type === "end-start") {
            // 重新创建这条线
            const newLine = this.createESLine(
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
    // 动态渲染 line 组件
    lineComp(item) {
      let compName;
      switch (item.type) {
        case "start-start":
          compName = "StartStartLine";
          break;
        case "end-end":
          compName = "EndEndLine";
          break;
        case "start-end":
          compName = "StartEndLine";
          break;
        case "end-start":
          compName = "EndStartLine";
          break;
      }
      return compName;
    },
  },
  components: {
    ResizableDiv,
    StartStartLine,
    EndEndLine,
    StartEndLine,
    EndStartLine,
  },
};
</script>

<style scoped lang="less">
@import url(./GanttTable.less);
</style>