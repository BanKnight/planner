<template>
  <el-container class="full el-card full" direction="vertical" style="padding:10px">
    <el-button-group>
      <el-button size="mini" icon="el-icon-upload">保存</el-button>
    </el-button-group>

    <el-form label-position="right" label-width="auto">
      <el-form-item label="标题:">
        <el-input placeholder="标题" size="mini" v-model="form.title" />
      </el-form-item>
      <el-form-item label="指派给:">
        <member-select style="border:none" size="mini" v-model="form.assignee" :planner="planner" />
      </el-form-item>
      <el-form-item label="时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.start" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col :span="2"></el-col>

        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="form.stop" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="内 容:">
        <el-input
          type="textarea"
          style="background-color:transparent"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="form.content"
        ></el-input>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script>
import MemberSelect from "./MemberSelect";

export default {
  components: { MemberSelect },
  props: {
    planner: String,
    col: String
  },
  data() {
    return {
      editable: false,
      form: {
        title: "",
        assignee: "",
        content: ""
      }
    };
  },
  computed: {
    options() {
      return {
        imagelink: true, // 图片链接
        fullscreen: true, // 全屏编辑
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        table: true, // 表格

        save: true, // 保存（触发events中的save事件）,
        subfield: true, // 单双栏模式
        preview: true // 预览
      };
    }
  },
  methods: {
    summit() {}
  }
};
</script>

