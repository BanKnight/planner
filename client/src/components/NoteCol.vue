<template>
  <el-container class="note-col">
    <el-header class="note-col-head" height="22px">
      <h4 class="el-icon-mobile" style="cursor:pointer">{{value.title}}</h4>
    </el-header>
    <el-button icon="el-icon-plus" style="margin: 10px 0"></el-button>

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
  margin-right: 10px;
}

.note-col-head {
  overflow: hidden;
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: #75b367;
  background-image: linear-gradient(to right, #75b367, #bfdcb9);

  border: 1px solid #ebeef5;
  border-radius: 4px;
  color: white;
}

.note-col-body {
  padding: 0;
}

.note-col:last-child {
  margin-right: 0;
}
</style>