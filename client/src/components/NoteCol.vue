<template>
  <el-container class="note-col full-height">
    <el-header
      :class="{
        'note-col-head': true,
        moveable: !editing && !adding && !editing_note
      }"
      height="40px"
      style="cursor:move;min-width:250px;"
    >
      <template v-if="!editing">
        <h4 @dblclick="edit_name">
          {{ title }}
          <el-tag type="success" size="small" effect="dark">{{ notes.length }}</el-tag>
        </h4>

        <el-dropdown @command="do_command">
          <span>
            <i class="el-icon-more" style="cursor:pointer"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="refresh">
              <i class="el-icon-refresh">刷新</i>
            </el-dropdown-item>
            <el-dropdown-item command="destroy">
              <i class="el-icon-delete">删除</i>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-else>
        <el-input
          ref="editing_name"
          autofocus
          v-model="editing_form.title"
          class="no-border"
          @keydown.enter.native="change_name"
          @blur="editing = false"
        ></el-input>
      </template>
    </el-header>

    <el-main v-loading="loading" style="padding:0">
      <el-container class="full">
        <el-aside class="scroll-if-need" width="250px">
          <el-button
            size="mini"
            icon="el-icon-plus"
            class="add-note-button"
            @click="(adding = !adding), (editing_note = null)"
          />

          <draggable
            :id="col"
            :list="notes"
            group="note"
            class="list-group"
            ghostClass="ghost"
            draggable=".note-card"
            @end="on_end"
          >
            <note-card
              v-for="note in notes"
              :key="note._id"
              :value="note"
              @edit="start_edit(note)"
              @remove="remove_note"
            ></note-card>
          </draggable>
        </el-aside>

        <el-dialog title="工单新增" :visible.sync="adding" width="600px" :close-on-click-modal="false">
          <new-note v-if="adding" :planner="planner" :col="col" :mode="mode" @save="add_note" />
        </el-dialog>

        <el-dialog
          title="工单编辑"
          :visible.sync="editing_note_dialog"
          width="600px"
          :close-on-click-modal="false"
        >
          <note-detail
            v-if="editing_note_dialog"
            :mode="mode"
            :value="editing_note"
            @save="save_note"
          />
        </el-dialog>
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
    group: String,
    col: String,
    mode: String
  },
  data()  {
    return {
      title: "",
      notes: [],
      adding: false,
      loading: false,
      editing: false,
      editing_note_dialog: false,
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

      Object.defineProperty(this.notes, "col", {
        value: this.col,
        enumerable: false
      });

      let col = await this.$store.dispatch("boards_col_detail", {
        planner: this.planner,
        group: this.group,
        col: this.col
      });

      this.title = col.title;
      this.notes = col.notes;

      this.loading = false;
    },

    async do_command(command)    {
      switch (command)
      {
        case "refresh": this.refresh();
          break
        case "destroy":
          try
          {
            await this.$confirm("删除后不可恢复", "是否确认删除", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            });

            this.destroy()
          }
          catch (e) { break }
          break

      }

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

      await this.$store.dispatch("boards_update_col", {
        planner: this.planner,
        group: this.group,
        col: this.col,
        data: this.editing_form
      });

      this.title = this.editing_form.title;
    },
    start_edit(note)    {
      this.adding = false;
      this.editing_note = note;
      this.editing_note_dialog = true
    },
    async add_note(form)    {
      await this.$store.dispatch("note_create", {
        planner: this.planner,
        group: this.group,
        col: this.col,
        data: form
      });

      this.refresh();
    },
    async save_note(form)    {
      await this.$store.dispatch("note_update", {
        planner: this.planner,
        group: this.group,
        col: this.col,
        note: this.editing_note._id,
        data: form
      });

      this.refresh();

      this.editing_note_dialog = false
      this.editing_note = null;

    },
    async remove_note(note)    {
      await this.$store.dispatch("note_destroy", {
        planner: this.planner,
        group: this.group,
        col: this.col,
        note: note._id
      });

      this.refresh();
    },

    async on_end(evt)    {
      try      {
        await this.$store.dispatch("note_move", {
          planner: this.planner,
          group: this.group,
          data: {
            from: evt.from.id,      //from col id
            to: evt.to.id,          //to col id
            target: evt.item.id,    //note id
            old: evt.oldDraggableIndex,   //old index
            new: evt.newDraggableIndex    //new index
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
  margin-right: 20px;
}

header.note-col-head {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
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

.add-note-button {
  width: 100%;
  margin-top: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
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
