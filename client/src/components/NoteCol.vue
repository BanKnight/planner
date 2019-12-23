<template>
  <el-container class="note-col">
    <el-header
      :class="{'note-col-head':true,'moveable':!editing}"
      height="24px"
      style="cursor:move;min-width:250px"
      @dblclick.native="edit_name"
    >
      <template v-if="!editing">
        <i class="el-icon-mobile">{{title}}</i>

        <span>
          <i class="el-icon-more" style="cursor:pointer"></i>
          <i class="el-icon-refresh" style="cursor:pointer" @click="refresh"></i>

          <i class="el-icon-plus" @click="adding = !adding" style="cursor:pointer"></i>
        </span>
      </template>
      <template v-else>
        <el-input
          ref="editing_name"
          autofocus
          v-model="editing_form.title"
          class="no-border-input"
          @blur="editing=false"
        ></el-input>
      </template>
    </el-header>

    <el-container class="scroll-if-need full" v-loading="loading">
      <draggable :list="curr" group="note" handle=".note-card-head" ghostClass="ghost">
        <note-card v-for="(note) in curr" :key="note.id" :value="note"></note-card>
      </draggable>

      <el-main v-if="adding" style="padding:10px 0;width:fit-content">
        <note :planner="planner" :col="col" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import draggable from "vuedraggable";
import NoteCard from "./NoteCard";
import Note from "@/components/Note";

export default {
  components: { Note, NoteCard, draggable },
  props: {
    planner: String,
    col: String
  },
  data() {
    return {
      title: "",
      curr: [],
      adding: false,
      loading: false,
      editing: false,
      editing_form: {
        title: ""
      }
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    refresh() {
      this.adding = false;
      this.editing = false;
      this.fetch();
    },
    async fetch() {
      this.loading = true;
      this.curr = [];

      let col = await this.$store.dispatch("boards_col_detail", {
        planner: this.planner,
        col: this.col
      });

      this.title = col.title;

      for (let one of col.curr) {
        this.curr.push(one);
      }
      this.loading = false;
    },
    edit_name() {
      this.editing = true;
      this.editing_form.title = this.title;
      this.$nextTick(() => {
        this.$refs.editing_name.focus();
      });
    }
  }
};
</script>

<style>
.note-col {
  -webkit-transition: 0.3s;
  transition: 0.3s;
  min-width: 250px;
  width: auto;
  height: 100%;
  margin-right: 10px;
}

.note-col-head {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #75b367;
  background-image: linear-gradient(to right, #75b367, #bfdcb9);

  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: white;
}
.note-col-head i {
  margin-right: 5px;
}

.note-col-head i:last-child {
  margin-right: 0;
}

.note-col-body {
  padding: 0;
}

.note-col:last-child {
  margin-right: 0;
}
</style>