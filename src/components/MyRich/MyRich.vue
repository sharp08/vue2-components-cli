<template>
  <div class="wrap">
    <button @click="temp">test</button>
    <div class="bar">
      <select @change="handleSelectChange">
        <option value="p">Paragraph</option>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="h3">H3</option>
        <option value="h3">H3</option>
      </select>
      <input type="color" name="" id="" @change="handleChangeColor" />
      <button class="btn" @click="handleExec('bold')">加粗</button>
      <button class="btn" @click="handleExec('italic')">倾斜</button>
      <button class="btn" @click="handleExec('justifyLeft')">左对齐</button>
      <button class="btn" @click="handleExec('justifyCenter')">居中</button>
      <button class="btn" @click="handleExec('justifyRight')">右对齐</button>
      <button class="btn" @click="handleExec('insertOrderedList')">
        有序列表
      </button>
      <button class="btn" @click="handleExec('insertUnorderedList')">
        无序列表
      </button>
      <button class="btn" @click="handleExec('insertHTML')">insertHTML</button>
    </div>
    <div
      id="edit"
      ref="edit"
      class="container edit"
      contenteditable="true"
      @input="handleEditableChange"
      @keyup="handkeKeyup"
    ></div>
    <hr />
    <div>展示区</div>
    <div id="display" class="container display"></div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      localAbc: {},
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.selObj = window.getSelection();
    this.syncInnerHTML();
  },
  watch: {},
  methods: {
    temp() {
      // console.log(this.selObj.toString());
      // console.log(this.selObj);
      // console.log(this.selObj.getRangeAt(0));
      console.log(this.selObj.cloneContents());
    },
    handkeKeyup(e) {},
    handleExec(cmd, tag) {
      if (cmd === "bold") {
        document.execCommand("bold");
      } else if (cmd === "italic") {
        document.execCommand("italic");
      } else if (cmd === "justifyLeft") {
        document.execCommand("justifyLeft");
      } else if (cmd === "justifyCenter") {
        document.execCommand("justifyCenter");
      } else if (cmd === "justifyRight") {
        document.execCommand("justifyRight");
      } else if (cmd === "insertOrderedList") {
        document.execCommand("insertOrderedList");
      } else if (cmd === "insertUnorderedList") {
        document.execCommand("insertUnorderedList");
      } else if (cmd === "insertHTML") {
        document.execCommand("insertHTML", false, "<p><span>oooeee</span></p>");
      }
    },
    handleEditableChange(e) {
      if (this.throttleTimer) return;
      this.throttleTimer = setTimeout(() => {
        this.syncInnerHTML();
        this.throttleTimer = null;
      }, 1000);
    },
    syncInnerHTML() {
      document.querySelector("#display").innerHTML =
        document.querySelector("#edit").innerHTML;
    },
    handleSelectChange(e) {
      document.execCommand("formatBlock", false, e.target.value);
    },
    handleChangeColor(e) {
      console.log(e);
      console.log(e.target.value);
      // document.execCommand("foreColor", false, e.target.value);
      document.execCommand("foreColor", false, "#e31c1c");
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.wrap {
  .bar {
    display: flex;
    margin-bottom: 4px;
    & > * {
      margin-right: 4px;
    }
    .btn {
      background: rgba(0, 140, 238, 1);
      border: none;
      color: #fff;
      border-radius: 2px;
      padding: 4px 8px;
      cursor: pointer;
      &:hover {
        background: rgba(0, 140, 238, 0.8);
      }
    }
  }
  .container {
    height: 200px;
    background: orange;
    padding: 10px;
  }
}
</style>