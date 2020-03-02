<template>
  <el-container :class="class_name" :id="value._id" @click.native="$emit('edit')">
    <el-header class="note-card-head" height="fit-content">
      <span style="margin-bottom:5px;">
        <i class="el-icon-document" style="margin-right:5px;"></i>
        {{ value.title }}
      </span>

      <member-preview :value="value.assignee" size="mini" :planner="value.planner" />
    </el-header>

    <el-footer
      class="note-card-footer el-row el-row--flex"
      height="fit-content"
      style="flex-wrap: wrap;"
    >
      <milestone-preview :value="value.milestone" size="mini" :planner="value.planner" />
      <date-preview :value="value.stop" />
    </el-footer>
  </el-container>
</template>

<script>
import MemberPreview from "./MemberPreview";
import MilestonePreview from "./MilestonePreview";
import DatePreview from "./DatePreview";

export default {
  components: { MemberPreview, MilestonePreview, DatePreview },
  props: {
    value: Object
  },
  computed: {
    diff()    {
      if (this.value.stop == null)      {
        return Infinity;
      }

      const first = this.$dayjs(this.value.stop).endOf("day");
      const second = this.$dayjs().endOf("day");

      return first.diff(second, "day");
    },
    day_option()    {
      if (this.diff <= 0)      {
        return {
          type: "info",
          effect: "dark"
        };
      }

      if (this.diff < 2)      {
        return {
          type: "",
          effect: "dark"
        };
      }

      return {
        type: "success",
        effect: "plain"
      };
    },
    class_name()    {
      return {
        "note-card": true,
        "doing": this.value.stats == "doing",
        "done": this.value.stats == "done"
      }
    }
  },
  methods: {
    on_command(cmd)    {
      switch (cmd)      {
        case "delete":
          this.do_delete();
          break;
      }
    },
    ask_delete()    {

      this.$confirm("准备删除了, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() =>        {
          this.$emit("remove", this.value);
        })
        .catch(() => { });
    }
  }
};
</script>

<style>
.note-card {
  overflow: hidden;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  margin-top: 10px;
  width: 250px;
  padding: 5px;
  cursor: move;
  cursor: -webkit-grabbing;

  background-color: #fff;
  border-radius: 4px;
  border: 1px dashed #75b367;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

.note-card.doing {
  border: 1px solid #75b367;
}

.note-card.done {
  text-decoration: line-through;
  color: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
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
  padding: 0;
  border-top: 1px solid #f5f6f8;
  justify-content: start;
  align-items: center;
}
</style>
