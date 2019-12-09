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
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="100%"
      size="small"
      :stripe="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="标题" width="120">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
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
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      multipleSelection: []
    };
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