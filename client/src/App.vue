<template>
  <el-container id="app" class="full">
    <router-view />
  </el-container>
</template>

<style >
@import "~github-markdown-css";
@import "~nprogress/nprogress.css";

body,
html {
  width: 100%;
  height: 100%;

  font-family: sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;

  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
  background-color: #f4f5f5;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 0;
}

p {
  margin-top: 0;
  margin-bottom: 10px;
}

.full {
  width: 100%;
  height: 100%;
}

.full-width {
  width: 100%;
}

.full-height {
  height: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 8px;
}

.el-scrollbar .el-scrollbar__wrap {
  overflow-x: auto;
  overflow-y: auto;
}

.el-scrollbar__view {
  height: 100%;
}
.el-tree {
  height: 100%;
  background-color: transparent;
  overflow-y: auto;
  overflow-x: auto;
}
.el-tree > .el-tree-node {
  width: 100%;
  display: inline-block;
}

.el-card__header,
.el-card__body {
  padding: 10px;
}

.sidebar {
  background-color: #334444;
  color: white;
}

.not-too-long {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: #c7c9cc;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

.scroll-if-need {
  overflow-y: auto;
  overflow-x: auto;
}

.ghost {
  opacity: 0.8;
  background: #c8ebfb;
}

.el-tag {
  margin-right: 10px;
}
</style>
