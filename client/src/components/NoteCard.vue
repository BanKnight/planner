<template>
  <el-container class="note-card">
    <el-header class="note-card-head" height="fit-content">
      <span style="cursor:pointer">{{value.title}}</span>
    </el-header>

    <el-main class="note-card-body">
      <p>{{value.body}}</p>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    value: Object
  }
};
</script>

<style>
.note-card {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  margin-top: 10px;
  width: 250px;
}

header.note-card-head {
  overflow: hidden;
  padding: 0 10px;
  border-bottom: 1px solid #dcdfe6;
  background-color: #eff5ed;
  width: 100%;
}

.note-card-body {
  padding: 10px;
}
</style>