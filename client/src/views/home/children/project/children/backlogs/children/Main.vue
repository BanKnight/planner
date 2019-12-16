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
      <el-table-column label="标题">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="里程碑" width="120">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.milestone ||"无" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="right">
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
        created: Date.now(),
        title: `this is title ${i}`,
        milesone: "milestone[${i}]"
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