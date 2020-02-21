<template>
  <el-container class="scroll-if-need">
    <draggable
      :list="cols"
      handle=".note-col-head.moveable"
      draggable=".note-col"
      ghostClass="ghost"
      class="col-layout el-row el-row--flex"
      @end="on_drag_end"
    >
      <note-col
        v-for="col in cols"
        :key="col._id"
        :planner="planner_id"
        :group="group_id"
        :col="col._id"
        :mode="mode"
        @destroy="destroy(col)"
      />
    </draggable>

    <el-button
      style="width:250px;background-color:transparent;color:#8ea29e;font-size:2em;border:2px dashed #8ea29e"
      plain
      icon="el-icon-plus"
      @click="add_col"
    >添加</el-button>
  </el-container>
</template>

<script>
import NoteCol from "@/components/NoteCol";
import draggable from "vuedraggable";

export default {
  path: "detail/:group",
  weight: 8,
  meta: {
    require_logined: true
  },
  components: { NoteCol, draggable },
  data()  {
    return {
      mode: null,
      cols: [],

    };
  },
  computed: {
    planner_id()    {
      return this.$route.params.planner;
    },
    group_id()    {
      return this.$route.params.group;
    },
    rules()    {
      return {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
        ]
      };
    }
  },
  watch: {
    group_id()
    {
      this.refresh()
    }
  },
  mounted()  {
    this.refresh();
  },
  methods: {
    async refresh()    {
      let data = await this.$store.dispatch("boards_group_detail", {
        planner: this.planner_id,
        group: this.group_id
      });

      this.cols = data.cols
      this.mode = data.mode
    },
    async add_col()    {
      let title;
      try      {
        title = await this.$prompt("输入标题", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        });
      } catch (e)      {
        return;
      }

      let resp = await this.$store.dispatch("boards_create_col", {
        planner: this.planner_id,
        group: this.group_id,
        data: {
          title: title.value
        }
      });

      this.cols.push(resp);

      this.$message({
        type: "success",
        message: "创建成功" + resp._id
      });
    },
    async destroy(col)    {
      await this.$store.dispatch("boards_destroy_col", {
        planner: this.planner_id,
        group: this.group_id,
        col: col
      });

      this.cols.splice(this.cols.indexOf(col), 1);
    },

    /**
     * 参考：https://github.com/SortableJS/Sortable#options
     */
    async on_drag_end(evt)    {
      if (evt.oldIndex == evt.newIndex)      {
        return;
      }

      try      {
        this.cols = await this.$store.dispatch("boards_move_col", {
          planner: this.planner_id,
          group: this.group_id,
          data: {
            from: evt.oldIndex,
            to: evt.newIndex
          }
        });
      } catch (e)      {
        this.refresh();
      }

    }
  }
};
</script>

<style scoped>
.col-layout {
  height: 100%;
  flex-shrink: 0;
}
</style>
