<template>
  <el-container class="note-card" :id="value._id">
    <el-header class="note-card-head" height="fit-content">
      <i
        class="el-icon-document"
        style="margin-bottom:5px;cursor:pointer"
        @click="$emit('edit',value)"
      >{{value.title}}</i>

      <el-dropdown trigger="click" size="small" @command="on_command">
        <el-button size="mini" type="text" icon="el-icon-more" />

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-delete" command="delete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-main
      v-if="value.content && value.content.length > 0"
      class="note-card-body markdown-body"
      v-html="$md(value.content)"
    ></el-main>

    <el-footer class="note-card-footer el-row el-row--flex" height="fit-content">
      <member-preview :value="value.assignee" size="mini" :planner="value.planner" />
      <milestone-preview :value="value.milestone" size="mini" :planner="value.planner" />
      <el-tag
        size="mini"
        v-if="value.stop"
        effect="dark"
        type="danger"
        class="el-icon-date"
      >{{ $format_md(value.stop) }}</el-tag>
      <el-tag size="mini" v-else effect="plain" type="danger" class="el-icon-date"></el-tag>
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
  },
  methods: {
    on_command(cmd) {
      console.log("click on card menu", cmd);

      switch (cmd) {
        case "delete":
          this.do_delete();
          break;
      }
    },
    do_delete() {
      this.$confirm("准备删除了, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("remove", this.value);
        })
        .catch(() => {});
    }
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
  cursor: move;
  cursor: -webkit-grabbing;
}

header.note-card-head {
  display: flex;
  overflow: hidden;
  padding: 0;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

main.note-card-body {
  padding: 0 0 0.8em 1em;
  font-size: 0.8em;
}

footer.note-card-footer {
  padding-left: 0.5em;
  border-top: 1px solid #f5f6f8;
  justify-content: start;
  align-items: center;
}
</style>