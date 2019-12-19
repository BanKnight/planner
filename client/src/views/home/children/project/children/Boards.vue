<template>
  <layout>
    <el-container class="scroll-if-need full">
      <draggable
        style="width:fit-content;min-height:100%;"
        :list="cols"
        handle=".note-col-head .el-icon-rank"
        ghostClass="ghost"
      >
        <transition-group tag="div" class="el-row el-row--flex full">
          <note-col class="full-height" v-for="col in cols" :key="col.id" :value="col" />
        </transition-group>
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