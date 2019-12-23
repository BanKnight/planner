<template>
  <layout>
    <el-container class="scroll-if-need full">
      <draggable
        :list="cols"
        handle=".note-col-head.moveable"
        ghostClass="ghost"
        class="col-layout el-row el-row--flex"
      >
        <note-col v-for="col in cols" :key="col.id" :value="col" />
        <el-button icon="el-icon-plus"></el-button>
      </draggable>
    </el-container>
  </layout>
</template>

<script>
import layout from "../layout";
import NoteCol from "@/components/NoteCol";
import draggable from "vuedraggable";

export default {
  path: "boards",
  weight: 8,
  meta: { menu_title: "开发", require_logined: true },

  components: { layout, NoteCol, draggable },
  data() {
    return {
      cols: [],
      drag: false
    };
  },
  mounted() {
    setTimeout(() => {
      for (let i = 1; i < 6; ++i) {
        let one = {
          id: i,
          title: `标题${i}`,
          notes: []
        };

        let notes_count = Math.floor(Math.random() * 10000) % 10;

        for (let j = 1; j < notes_count; ++j) {
          one.notes.push({
            id: `${i}:${j}`,
            title: `${i}:${j} title`,
            body: "note body"
          });
        }

        this.cols.push(one);
      }
    }, 300);
  }
};
</script>

<style scoped>
.col-layout {
  height: 100%;
  flex-shrink: 0;
}
</style>