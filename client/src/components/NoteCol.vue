<template>
  <el-container class="note-col full-height">
    <el-header
      :class="{'note-col-head':true,'moveable':!editing && !adding && !editing_note}"
      height="24px"
      style="cursor:move;min-width:250px;"
    >
      <template v-if="!editing">
        <el-popconfirm title="是否确定删除" @onConfirm="destroy">
          <i class="el-icon-delete" slot="reference" style="cursor:pointer"></i>
        </el-popconfirm>

        <span @dblclick="edit_name">
          {{title}}
          <el-tag type="success" size="mini">{{curr.length}}</el-tag>
        </span>

        <span>
          <i class="el-icon-refresh" style="cursor:pointer" @click="refresh"></i>
        </span>
      </template>
      <template v-else>
        <el-input
          ref="editing_name"
          autofocus
          v-model="editing_form.title"
          class="no-border-input"
          @keydown.enter.native="change_name"
          @blur="editing = false;"
        ></el-input>
      </template>
    </el-header>

    <el-main v-loading="loading" style="padding:0">
      <el-container class="full">
        <el-aside class="scroll-if-need" width="250px">
          <el-button
            size="mini"
            icon="el-icon-plus"
            style="width:100%;margin-top:10px; border: 1px dashed #75b367;"
            @click="adding = !adding,editing_note = null"
          />

          <draggable
            :id="col"
            :list="curr"
            group="note"
            class="list-group"
            ghostClass="ghost"
            draggable=".note-card"
            @end="on_end"
          >
            <note-card
              v-for="note in curr"
              :class="{editing:note == editing_note}"
              :key="note._id"
              :value="note"
              @edit="start_edit"
              @remove="remove_note"
            ></note-card>
          </draggable>
        </el-aside>

        <el-main v-if="adding" style="margin-left:10px;padding:10px 0;width:fit-content">
          <new-note :planner="planner" :col="col" @save="add_note" @cancel="adding = false" />
        </el-main>

        <el-main v-if="editing_note" style="margin-left:10px;padding:10px 0;width:fit-content">
          <note-detail :value="editing_note" @save="save_note" @cancel="editing_note = null" />
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
  data()  {
    return {
      title: "",
      curr: [],
      adding: false,
      loading: false,
      editing: false,
      editing_note: null,
      editing_form: {
        title: null
      }
    };
  },
  mounted()  {
    this.fetch();
  },
  methods: {
    refresh()    {
      this.adding = false;
      this.editing = false;
      this.editing_note = null;
      this.fetch();
    },

    async fetch()    {
      this.loading = true;

      Object.defineProperty(this.curr, "col", {
        value: this.col,
        enumerable: false
      });

      let col = await this.$store.dispatch("boards_col_detail", {
        planner: this.planner,
        col: this.col
      });

      this.title = col.title;
      this.curr = [];

      for (let one of col.curr)      {
        this.curr.push(one);
      }

      this.loading = false;
    },
    async destroy()    {
      this.$emit("destroy");
    },
    edit_name()    {
      if (this.editing)      {
        return;
      }
      this.editing = true;
      this.editing_form.title = this.title;
      this.$nextTick(() =>      {
        this.$refs.editing_name.focus();
      });
    },
    async change_name()    {
      this.editing = false;
      if (this.editing_form.title.length == 0)      {
        return;
      }

      await this.$store.dispatch("boards_update", {
        planner: this.planner,
        col: this.col,
        data: this.editing_form
      });

      this.title = this.editing_form.title;
    },
    start_edit(note)    {
      this.adding = false;

      this.editing_note = note;
    },
    async add_note(form)    {
      await this.$store.dispatch("note_create", {
        planner: this.planner,
        col: this.col,
        data: form
      });

      this.refresh();
    },
    async save_note(form)    {
      await this.$store.dispatch("note_update", {
        planner: this.planner,
        col: this.col,
        note: this.editing_note._id,
        data: form
      });

      this.refresh();

      this.editing_note = null;
    },
    async remove_note(note)    {
      await this.$store.dispatch("note_destroy", {
        planner: this.planner,
        col: this.col,
        note: note._id
      });

      this.refresh();
    },

    async on_end(evt)    {
      try      {
        await this.$store.dispatch("note_move", {
          planner: this.planner,
          data: {
            from: evt.from.id,
            to: evt.to.id,
            target: evt.item.id,
            old: evt.oldDraggableIndex,
            new: evt.newDraggableIndex
          }
        });
      } finally      {
        this.refresh();
      }
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
  border: 2px solid #75b367;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.list-group {
  width: 100%;
  min-height: 80px;
  padding: 0 0 40px 0;
}
</style>