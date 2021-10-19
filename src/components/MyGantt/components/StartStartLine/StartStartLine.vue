<template>
  <div class="connect-line">
    <!-- 把后续的内容都放到第一段之下，这样只要控制第一段的位置即可，每一段线的具体长度单独配置 -->
    <div class="line1" :style="{ width: formatLength[0] + 'px' }">
      <div class="line2" :style="{ height: formatLength[1] + 'px' }">
        <div class="line3" :style="{ width: formatLength[2] + 'px' }">
          <div class="triangle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StartStartLine",
  props: {
    // 表示每段的长度
    // start-start end-end 为三段
    // start-end end-start 为五段
    length: {
      type: Array,
      default: () => [20, 100, 100],
    },
  },
  data() {
    return {};
  },
  computed: {
    formatLength() {
      let r = [30, 30, 30];
      for (let i = 0; i <= 2; i++) {
        if (this.length[i] >= 0) {
          r[i] = this.length[i];
        }
      }
      return r;
    },
  },
};
</script>

<style scoped lang="less">
@import url(./StartStartLine.less);
</style>