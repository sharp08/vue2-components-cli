<template>
  <div class="container">
    <div class="display">
      <div
        class="line"
        v-for="(item, index) in localRegions"
        :key="index"
        @click="handleSelect(item)"
        :class="{ selected: item.selected }"
      >
        <template v-for="(v, k) of item">
          <span class="label" :key="k + '_label'">{{ k }}: </span>
          <span class="value" :key="k + '_value'">{{ v }}</span>
        </template>
      </div>
    </div>
    <div>
      <button @click="handleCreate">创建连线</button>
      <select ref="select">
        <option :key="item" v-for="item in lineTypes" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateLines",
  props: {
    regions: {
      type: Array,
    },
  },
  data() {
    return {
      localRegions: [],
      selectedQueue: [],
      lineTypes: ["start-start", "start-end", "end-end", "end-start"],
    };
  },
  watch: {
    regions: {
      immediate: true,
      handler(newVal) {
        this.localRegions = newVal.map((item) => {
          return {
            ...item,
            selected: false,
          };
        });
      },
    },
  },
  methods: {
    handleSelect(region) {
      if (!region.selected) {
        region.selected = true;
        this.selectedQueue.push(region);
        if (this.selectedQueue.length > 2) {
          const del = this.selectedQueue.shift();
          del.selected = false;
        }
      } else {
        region.selected = false;
        const idx = this.selectedQueue.findIndex(
          (item) => item.id === region.id
        );
        this.selectedQueue.splice(idx, 1);
      }
    },
    handleCreate() {
      let ids = [];
      this.localRegions.forEach((item) => {
        if (item.selected) {
          ids.push(item.id);
        }
      });
      this.$emit("create", {
        ids,
        type: this.$refs["select"].value,
      });
    },
  },
};
</script>

<style scoped lang="less">
@import url(./CreateLines.less);
</style>