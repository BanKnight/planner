<template>
  <el-main class="full" style="padding:10px">
    <el-container class="full">
      <el-container class="scroll-if-need">
        <draggable
          :list="cols"
          handle=".note-col-head.moveable"
          ghostClass="ghost"
          class="col-layout el-row el-row--flex"
        >
          <note-col v-for="col in cols" :key="col" :planner="planner_id" :col="col" />
        </draggable>
      </el-container>

      <el-button
        style="height:50px;width:50px;color:white;background-color: #8ea29e;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"
        size="mini"
        icon="el-icon-plus"
        @click="add_col"
      ></el-button>
    </el-container>
  </el-main>
</template>

<script>
import NoteCol from "@/components/NoteCol";
import draggable from "vuedraggable";

export default {
  path: "boards",
  weight: 8,
  meta: { menu_title: "开发", require_logined: true },

  components: { NoteCol, draggable },
  data() {
    return {
      cols: [],
      drag: false
    };
  },
  computed: {
    planner_id() {
      return this.$route.params.planner;
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      let data = await this.$store.dispatch("boards_list", {
        planner: this.planner_id
      });

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