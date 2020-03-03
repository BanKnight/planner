<template>
  <el-container class="full" direction="vertical">
    <el-form
      size="small"
      label-position="left"
      :model="form"
      label-width="5em"
      :rules="rules"
      ref="add_form"
    >
      <el-form-item label="标题：" prop="title">
        <el-input placeholder="标题" class="full-width" v-model="form.title" />
      </el-form-item>

      <el-form-item v-if="mode != 'workflow' " label="状态：">
        <el-select v-model="form.stats" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="指派：">
        <member-select v-model="form.assignee" class="full-width" size="mini" :planner="planner"></member-select>
      </el-form-item>

      <el-form-item label="结束:">
        <el-date-picker
          type="date"
          size="mini"
          placeholder="结束时间"
          v-model="form.stop"
          class="full-width"
          value-format="timestamp"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="标签:">
        <el-tag
          v-for="tag in form.tags"
          :key="tag"
          closable
          size="small"
          effect="plain"
          type="danger"
          @close="del_tag(tag)"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="input_visible"
          v-model="input_value"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="add_tag"
          @blur="cancle_add_tag"
        ></el-input>
        <el-button v-else icon="el-icon-plus" size="mini" @click="show_input"></el-button>
      </el-form-item>

      <el-form-item label="内容：">
        <el-row type="flex" justify="space-between" align="middle">
          <el-radio-group v-model="editing">
            <el-radio-button :label="true">编辑</el-radio-button>
            <el-radio-button :label="false">预览</el-radio-button>
          </el-radio-group>
        </el-row>
        <el-input
          v-if="editing"
          type="textarea"
          class="full-width"
          :rows="2"
          autosize
          placeholder="内容"
          v-model="form.content"
        />
        <div v-else style="border:1px solid #dcdfe6">
          <md-editor :value="form.content" :editable="false" size="mini" />
        </div>
      </el-form-item>

      <el-divider />

      <el-form-item label="里程碑：">
        <milestone-select
          v-model="form.milestone"
          class="full-width"
          size="mini"
          :planner="planner"
        />
      </el-form-item>

      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <el-form-item label="需求：">
            <el-row class="full-width">
              <backlog-select v-model="form.backlog" size="mini" :planner="planner"></backlog-select>
              <el-link :disabled="!form.backlog" @click="read_backlog = true">
                <i class="el-icon-view el-icon--right"></i>
              </el-link>
            </el-row>

            <el-checkbox :disabled="!form.backlog" v-model="form.close_backlog">关联完成</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题：" label-width="4em">
            <el-row class="full-width">
              <issue-select v-model="form.issue" size="mini" :planner="planner"></issue-select>
              <el-link :disabled="!form.issue" @click="read_issue = true">
                <i class="el-icon-view el-icon--right"></i>
              </el-link>
            </el-row>
            <el-checkbox :disabled="!form.issue" v-model="form.close_issue">关联完成</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-row type="flex" justify="space-between">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-upload"
            class="full-width"
            @click="save"
          >保存</el-button>
        </el-row>
      </el-form-item>
    </el-form>

    <el-dialog
      v-if="backlog"
      :title="backlog.title"
      :visible.sync="read_backlog"
      :fullscreen="true"
      append-to-body
    >
      <member-preview size="mini" :planner="planner" v-model="backlog.assignee" />

      <md-editor :value="backlog.content" :editable="false" size="mini" />
    </el-dialog>

    <el-dialog
      v-if="issue"
      :title="issue.title"
      :visible.sync="read_issue"
      :fullscreen="true"
      append-to-body
    >
      <member-preview size="mini" :planner="planner" v-model="issue.assignee" />

      <md-editor :value="issue.content" :editable="false" size="mini" />
    </el-dialog>
  </el-container>
</template>

<script>

import MemberSelect from "./MemberSelect";
import MemberPreview from "./MemberPreview";

import MilestoneSelect from "./MilestoneSelect";
import BacklogSelect from "./BacklogSelect";
import IssueSelect from "./IssueSelect";
import MdEditor from "./MdEditor";

import { STATS_OPTIONS } from "@/define"

export default {
  components: {
    MemberSelect,
    MemberPreview,
    MilestoneSelect,
    BacklogSelect,
    IssueSelect,
    MdEditor
  },
  props: {
    planner: String,
    col: String,
    mode: String,
  },
  data()  {
    return {
      editing: true,
      read_backlog: false,
      read_issue: false,
      form: {
        backlog: null,
        issue: null,
        stats: null,
        tags: [],
      },
      backlog: null,
      issue: null,
      input_visible: false,
      input_value: ''
    };
  },
  computed: {
    options()    {
      return STATS_OPTIONS
    },
    rules()    {
      return {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 3, message: "长度过短", trigger: "blur" }
        ],
      };
    }
  },
  watch: {
    "form.backlog": function(new_val)    {
      this.fetch_backlog(new_val);
    },
    "form.issue": function(new_val)    {
      this.fetch_issue(new_val);
    }
  },
  mounted()  {
    if (this.mode != "workflow")
    {
      this.form.stats = "default"
    }
  },
  methods: {
    save()    {

      this.$refs.add_form.validate(async valid =>      {
        if (!valid)        {
          return false;
        }

        this.form.content = this.form.content || ""

        this.$emit("save", this.form);
      });

    },
    async fetch_backlog()    {
      if (!this.form.backlog)      {
        this.backlog = null;
        return;
      }

      this.backlog = await this.$store.dispatch("backlogs_detail", {
        planner: this.planner,
        backlog: this.form.backlog
      });
    },
    async fetch_issue()    {
      if (!this.form.issue)      {
        this.issue = null;
        return;
      }

      this.issue = await this.$store.dispatch("issues_detail", {
        planner: this.planner,
        issue: this.form.issue
      });
    },

    add_tag()
    {
      let input_value = this.input_value;
      if (input_value)      {
        this.form.tags.push(this.input_value)
      }
      this.input_visible = false;
      this.input_value = '';
    },
    del_tag(tag)    {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },
    cancle_add_tag()
    {
      this.input_visible = false;
      this.input_value = '';
    },
    show_input()    {
      this.input_visible = true;
      this.$nextTick(() =>      {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  }
};
</script>
