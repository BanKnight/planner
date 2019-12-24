<template>
  <el-container class="note-col full-height">
    <el-header
      :class="{'note-col-head':true,'moveable':!editing && !adding && !editing_note}"
      height="24px"
      style="cursor:move;min-width:250px"
      @dblclick.native="edit_name"
    >
      <template v-if="!editing">
        <i class="el-icon-mobile">{{title}}</i>

        <span>
          <i class="el-icon-more" style="cursor:pointer"></i>
          <i class="el-icon-refresh" style="cursor:pointer" @click="refresh"></i>

          <i
            class="el-icon-plus"
            @click="adding = !adding,editing_note = null"
            style="cursor:pointer"
          ></i>
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

    <el-main v-loading="loading" style="padding:0">
      <el-container class="full">
        <el-aside v-if="!adding" class="scroll-if-need" width="auto">
          <draggable :list="curr" group="note" handle=".note-card-head" ghostClass="ghost">
            <note-card
              v-for="note in curr"
              :class="{editing:note == editing_note}"
              :key="note.id"
              :value="note"
              @edit="start_edit"
            ></note-card>
          </draggable>
        </el-aside>

        <el-main v-else style="padding:10px 0;width:fit-content">
          <new-note :planner="planner" :col="col" @save="add_note" @cancel="adding = false" />
        </el-main>

        <el-main v-if="editing_note" style="margin-left:10px;padding:10px 0;width:fit-content">
          <note-detail :value="editing_note" @save="add_note" @cancel="editing_note = null" />
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import draggable from "vuedraggable";
import NoteCard from "./NoteCard";
import NewNote from "@/components/NewNote";
import NoteDetail from "@/components/NoteDetail";

export default {
  components: { NewNote, NoteCard, NoteDetail, draggable },
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
      editing_note: null,
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
      this.editing_note = null;
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

      console.log(this.curr);

      this.loading = false;
    },
    edit_name() {
      this.editing = true;
      this.editing_form.title = this.title;
      this.$nextTick(() => {
        this.$refs.editing_name.focus();
      });
    },
    start_edit(note) {
      this.adding = false;

      this.editing_note = note;
    },
    async add_note(form) {
      await this.$store.dispatch("note_create", {
        planner: this.planner,
        col: this.col,
        data: form
      });

      this.refresh();
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
  background-color: #8ea29e;

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

.editing {
  border: 1px solid#75b367;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>