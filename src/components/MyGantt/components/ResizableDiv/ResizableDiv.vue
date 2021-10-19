<template>
  <div class="resizable-div" ref="resizable-div">
    <div
      @mousedown="leftHandlerMouseDown"
      class="left-handler"
      ref="left-handler"
    ></div>
    <div @mousedown="contentMouseDown" class="content" ref="content"></div>
    <div
      @mousedown="rightHandlerMouseDown"
      class="right-handler"
      ref="right-handler"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ResizableDiv",
  props: {},
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    // 左侧把手逻辑
    leftHandlerMouseDown(e) {
      const targetElement = this.$refs["resizable-div"];
      const parentNode = targetElement.parentNode;
      const originWidth = targetElement.clientWidth; // 拖拽元素初始的宽度
      const originOffsetLeft = targetElement.offsetLeft; //  拖拽元素到父级初始左边距
      const x = e.clientX;

      document.onmousemove = (e) => {
        let dis = e.clientX - x;
        // 右移
        if (dis > 0) {
          if (dis > originWidth) dis = originWidth;
          targetElement.style.width = originWidth - dis + "px";
          targetElement.style.left = originOffsetLeft + dis + "px";
        }
        // 左移
        else {
          if (originOffsetLeft + dis < 0) dis = 0 - originOffsetLeft;
          targetElement.style.width = originWidth - dis + "px";
          targetElement.style.left = originOffsetLeft + dis + "px";
        }
      };

      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.$emit("event", "left");
      };
    },
    // 拖拽
    contentMouseDown(e) {
      const targetElement = this.$refs["resizable-div"]; //  拖拽运动的元素
      const parentNode = targetElement.parentNode; // 拖拽元素的父容器
      const maxOffsetLeft = parentNode.clientWidth - targetElement.clientWidth;

      const x = targetElement.offsetLeft - e.clientX;
      document.onmousemove = (e) => {
        // 限制拖拽范围
        let left = e.clientX + x;
        if (left > maxOffsetLeft) {
          left = maxOffsetLeft;
        } else if (left < 0) {
          left = 0;
        }
        targetElement.style.left = left + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.$emit("event", "move");
      };
    },
    // 右侧把手
    rightHandlerMouseDown(e) {
      const targetElement = this.$refs["resizable-div"];
      const parentNode = targetElement.parentNode;
      const originWidth = targetElement.clientWidth; // 拖拽元素初始的宽度
      const originOffsetLeft = targetElement.offsetLeft; //  拖拽元素到父级初始左边距
      const x = e.clientX;

      document.onmousemove = (e) => {
        let width = originWidth + e.clientX - x;
        if (width < 0) {
          width = 0;
        } else if (width + originOffsetLeft > parentNode.clientWidth) {
          width = parentNode.clientWidth - originOffsetLeft;
        }
        targetElement.style.width = width + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.$emit("event", "right");
      };
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
@import url(./ResizableDiv.less);
</style>
