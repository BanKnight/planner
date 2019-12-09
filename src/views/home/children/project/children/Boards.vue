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
  title: "看板",
  path: "",
  weight: 9,
  components: { layout, NoteCol, draggable },
  data() {
    return {
      cols: [],
      drag: false
    };
  },
  mounted() {
    setTimeout(() => {
      for (let i = 1; i < 20; ++i) {
        let one = {
          id: i,
          title: `标题${i}`,
          notes: []
        };

        for (let j = 1; j < 30; ++j) {
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