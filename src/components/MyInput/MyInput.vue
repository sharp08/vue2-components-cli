<template>
  <input :class="['my-input']" type="text" value="123" />
</template>

<script>
export default {
  name: "MyInput",
};
</script>

<style lang="less">
.my-input {
  height: 34px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 0 10px;
}
</style>