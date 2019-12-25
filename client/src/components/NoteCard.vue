<template>
  <el-container class="note-card">
    <el-header class="note-card-head" height="fit-content">
      <el-tag
        size="mini"
        v-if="value.stop"
        effect="dark"
        type="danger"
        class="el-icon-date"
      >{{ $format_md(value.stop) }}</el-tag>
      <el-tag size="mini" v-else effect="dark" type="danger" class="el-icon-date">无</el-tag>

      <el-button size="mini" type="text" icon="el-icon-more" @click="$emit('edit',value)" />
    </el-header>

    <i class="el-icon-document">{{value.title}}</i>

    <el-main
      v-if="value.content && value.content.length > 0"
      class="note-card-body markdown-body"
      v-html="$md(value.content)"
    ></el-main>

    <el-footer class="note-card-footer el-row el-row--flex" height="fit-content">
      <member-preview :value="value.assignee" size="mini" :planner="value.planner" />
      <milestone-preview :value="value.milestone" size="mini" :planner="value.planner" />
    </el-footer>
  </el-container>
</template>

<script>
import MemberPreview from "./MemberPreview";
import MilestonePreview from "./MilestonePreview";

export default {
  components: { MemberPreview, MilestonePreview },
  props: {
    value: Object
  }
};
</script>

<style>
.note-card {
  border-radius: 4px;
  border: 1px dashed #75b367;
  background-color: #ffffff;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  margin-top: 10px;
  width: 250px;
  padding: 5px;
}

header.note-card-head {
  cursor: move;

  display: flex;
  overflow: hidden;
  padding: 0;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

main.note-card-body {
  padding: 5px 0 5px 5px;
  font-size: 0.8em;
}

.note-card-footer {
  border-top: 1px solid #f5f6f8;
  justify-content: start;
  align-items: center;
}
</style>