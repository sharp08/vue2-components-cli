<template>
  <div class="simulation-pop">
    <div>
      <input type="date" v-model="popModel.startDate" />
      <input type="date" v-model="popModel.endDate" />
    </div>
    <div>
      <button @click="handleConfirm">确认</button>
      <button @click="handleCancel">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimulationPop",
  props: {
    model: {
      type: Object,
    },
  },
  data() {
    return {
      popModel: {
        taskId: null,
        startDate: null,
        endDate: null,
      },
    };
  },
  watch: {
    model: {
      handler(newVal) {
        this.popModel = {
          ...newVal,
        };
      },
    },
  },
  methods: {
    handleConfirm() {
      const o = {
        ...this.popModel,
        id: +new Date(),
      };
      this.$emit("confirm", o);
    },
    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped lang="less">
.simulation-pop {
  position: fixed;
  width: 400px;
  height: 400px;
  background: red;
  top: 0;
  left: 0;
  button {
    padding: 10px;
    font-size: 40px;
    cursor: pointer;
    margin-right: 10px;
  }
}
</style>