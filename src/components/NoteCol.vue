<template>
  <el-container class="note-col">
    <el-header class="note-col-head" height="42px">
      <el-row type="flex" justify="space-between" align="middle">
        <h3 class="el-icon-rank" style="cursor:pointer">{{value.title}}</h3>

        <el-button-group>
          <el-button size="mini" icon="el-icon-plus"></el-button>
          <el-button size="mini" icon="el-icon-more"></el-button>
        </el-button-group>
      </el-row>
    </el-header>

    <el-container direction="vertical" class="note-col-body scroll-if-need">
      <draggable :list="value.notes" group="note" handle=".note-card-head" ghostClass="ghost">
        <note-card v-for="(note) in value.notes" :key="note.id" :value="note"></note-card>
      </draggable>
    </el-container>
  </el-container>
</template>

<script>
import draggable from "vuedraggable";
import NoteCard from "./NoteCard";

export default {
  components: { NoteCard, draggable },
  props: {
    value: Object
  }
};
</script>

<style>
.note-col {
  width: 250px;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  margin-right: 20px;
}

.note-col-head {
  overflow: hidden;
  padding: 0px;
}

.note-col-body {
  padding: 0;
}

.note-col:last-child {
  margin-right: 0;
}
</style>