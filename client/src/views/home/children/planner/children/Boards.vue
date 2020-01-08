<template>
  <el-main class="full" style="padding:10px">
    <el-container class="full">
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
            :key="col"
            :planner="planner_id"
            :col="col"
            @destroy="destroy(col)"
            @drag-card="on_drag_card"
          />
        </draggable>

        <el-button
          style="width:250px;margin-left:10px;background-color:transparent;color:#8ea29e;font-size:2em;border:2px dashed #8ea29e"
          plain
          icon="el-icon-plus"
          @click="add_col"
          >添加</el-button
        >
      </el-container>
    </el-container>
  </el-main>
</template>

<script>
import NoteCol from "@/components/NoteCol";
import draggable from "vuedraggable";

export default {
  path: "boards",
  weight: 8,
  meta: {
    menu_title: "开发",
    menu_icon: "el-icon-s-cooperation",
    require_logined: true
  },

  components: { NoteCol, draggable },
  data() {
    return {
      cols: []
    };
  },
  computed: {
    planner_id() {
      return this.$route.params.planner;
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    async refresh() {
      let data = await this.$store.dispatch("boards_list", {
        planner: this.planner_id
      });

      this.cols = [];
      for (let one of data) {
        this.cols.push(one); //全部都是id
      }
    },
    async add_col() {
      let title;
      try {
        title = await this.$prompt("输入标题", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        });
      } catch (e) {
        return;
      }

      let resp = await this.$store.dispatch("boards_create", {
        planner: this.planner_id,
        data: {
          title: title.value
        }
      });

      this.cols.push(resp._id);

      this.$message({
        type: "success",
        message: "创建成功"
      });
    },
    async destroy(col) {
      await this.$store.dispatch("boards_destroy", {
        planner: this.planner_id,
        col: col
      });

      this.cols.splice(this.cols.indexOf(col), 1);
    },

    /**
     * 参考：https://github.com/SortableJS/Sortable#options
     */
    async on_drag_end(evt) {
      console.log("on_drag_end", evt.oldIndex, evt.newIndex);

      if (evt.oldIndex == evt.newIndex) {
        return;
      }

      try {
        this.cols = await this.$store.dispatch("boards_move", {
          planner: this.planner_id,
          data: {
            from: evt.oldIndex,
            to: evt.newIndex
          }
        });
      } catch (e) {
        this.refresh();
      }

      // var itemEl = evt.item;  // dragged HTMLElement
      // 		evt.to;    // target list
      // 		evt.from;  // previous list
      // 		evt.oldIndex;  // element's old index within old parent
      // 		evt.newIndex;  // element's new index within new parent
      // 		evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
      // 		evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
      // 		evt.clone // the clone element
      // 		evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
    },
    on_drag_card(evt) {
      console.log(
        "on_drag_card",
        evt.from._id,
        evt.to._id,
        evt.oldIndex,
        evt.newIndex
      );
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
