<template>
  <el-container direction="vertical" class="full">
    <el-row type="flex" justify="space-between" align="middle" style="margin-bottom:10px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-right:20px"
        @click="$router.push(`${root}/new`)"
      ></el-button>

      <el-input
        class="search"
        placeholder="输入搜索关键字"
        v-model="keyword"
        clearable
        prefix-icon="el-icon-search"
        @clear="on_clear"
        @keydown.enter.native.stop="on_search"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-row>

    <el-table
      ref="data"
      :data="data"
      style="width: 100%"
      height="100%"
      size="small"
      :stripe="true"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>

      <el-table-column label="标签">
        <template slot-scope="scope">
          <span>
            <el-tag v-for="tag in scope.row.tags" :key="tag" type="danger" size="small">{{tag}}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="指派给" prop="assignee" width="120"></el-table-column>

      <el-table-column label="里程碑" width="120">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.milestone ||"无" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="right" fixed="right">
        <el-button-group>
          <el-button size="mini" icon="el-icon-edit" type="primary"></el-button>
          <el-button size="mini" icon="el-icon-check" type="success"></el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger"></el-button>
        </el-button-group>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
export default {
  path: "",
  weight: 8,
  meta: { require_logined: true },
  data() {
    return {
      keyword: "",
      data: [],
      multipleSelection: []
    };
  },
  mounted() {
    for (let i = 1; i < 100; ++i) {
      let one = {
        _id: i,
        title: `this is title ${i}`,
        milesone: "milestone[${i}]",
        tags: ["标签1", "标签2", "标签3"],
        assignee: "张三",
        created: Date.now()
      };

      this.data.push(one);
    }
  },
  computed: {
    root() {
      return `/project/${this.$route.params.id}/backlogs`;
    }
  },
  methods: {
    on_clear() {},
    on_search() {},
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>