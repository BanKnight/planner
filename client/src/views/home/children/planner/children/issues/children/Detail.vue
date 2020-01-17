<template>
  <el-container class="full">
    <el-header height="auto" style="padding:0;margin-bottom:10px">
      <template v-if="editing">
        <el-button-group>
          <el-button size="mini" icon="el-icon-close" @click="editing = false">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-upload" @click="summit">保存</el-button>
        </el-button-group>
      </template>

      <template v-else>
        <el-button-group>
          <el-button size="mini" icon="el-icon-s-fold" @click="folding = !folding">选项</el-button>
          <el-button size="mini" icon="el-icon-edit" @click="editing = !editing">编辑</el-button>
        </el-button-group>
      </template>
    </el-header>

    <el-container class="full scroll-if-need">
      <el-aside
        width="180px"
        v-if="folding == false || editing == true"
        style="margin-right:10px;padding:10px"
        class="el-card"
      >
        <el-form :model="article">
          <el-form-item label="指派:">
            <member-select v-model="article.assignee" :planner="planner_id" :disabled="!editing" />
          </el-form-item>
          <el-form-item label="里程碑:">
            <milestone-select
              v-model="article.milestone"
              :planner="planner_id"
              :disabled="!editing"
            />
          </el-form-item>

          <!-- <el-form-item label="标签:">
            <el-select
              v-model="extra.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签"
            >
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>-->
        </el-form>
      </el-aside>

      <el-container class="el-card" direction="vertical">
        <div v-if="!editing" style="text-align:center;">
          <h2>{{ article.title }}</h2>
        </div>
        <el-input v-else placeholder="请输入标题" v-model="article.title" clearable></el-input>
        <el-header
          style="background-color:#f0f9eb;"
          class="scroll-if-need el-card"
          height="40px"
          v-if="article.attachments.length > 0 || editing"
        >
          <el-row type="flex" justify="start" align="middle" class="full-height">
            <el-upload
              v-if="editing"
              :show-file-list="false"
              :action="upload_url"
              multiple
              with-credentials
              :on-success="on_upload_ok"
            >
              <el-button size="mini" icon="el-icon-plus" style="margin-right:5px">上传附件</el-button>
            </el-upload>

            <el-popover
              placement="bottom-start"
              width="400"
              trigger="hover"
              v-for="one in article.attachments"
              :key="one._id"
            >
              <el-row type="flex" justify="space-between">
                <h2>{{ one.name }}</h2>
                <el-button type="success" @click="copy_link(one)">复制链接</el-button>
              </el-row>

              <el-image v-if="is_img(one)" :src="cal_link(one)"></el-image>
              <div v-else>不支持预览</div>

              <el-tag
                :class="is_img(one) ? 'el-icon-picture' : 'el-icon-document'"
                :closable="editing"
                type="success"
                size="mini"
                :effect="is_img(one) ? 'dark' : 'plain'"
                slot="reference"
                @close="close_file(one)"
              >{{ one.name }}</el-tag>
            </el-popover>
          </el-row>
        </el-header>
        <md-editor v-model="article.content" theme="small" :editable="editing" />
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import copy from "clipboard-copy";
import { is_img } from "@/utils";

import MemberSelect from "@/components/MemberSelect";
import MilestoneSelect from "@/components/MilestoneSelect";
import MdEditor from "@/components/MdEditor";

export default {
  path: "detail/:issue",
  weight: 10,
  meta: { require_logined: true },
  components: { MilestoneSelect, MemberSelect, MdEditor },

  data()  {
    return {
      article: {
        title: "",
        content: "",
        assignee: null,
        milestone: null,
        attachments: []
      },
      editing: false,
      deleting: [],
      adding: [],
      folding: true
    };
  },
  computed: {
    fold_icon()    {
      if (this.folding == false)      {
        return "el-icon-s-fold";
      }
      return "el-icon-s-unfold";
    },
    root()    {
      return `/planner/${this.planner_id}/issues`;
    },
    planner_id()    {
      return this.$route.params.planner;
    },
    id()    {
      return this.$route.params.issue;
    },
    upload_url()    {
      return `${this.$http.defaults.baseURL}/api/planner/${this.planner_id}/pan?path=/.private`;
    }
  },
  beforeRouteEnter(to, from, next)  {
    next(vm =>    {
      if (from.fullPath != "/")      {
        vm.from = from.fullPath;
      }
    });
  },
  mounted()  {
    this.fetch();
  },
  beforeDestroy()  {
    for (let file of this.adding)    {
      this.$store.dispatch("pan_destroy_priavte", {
        planner: this.planner_id,
        name: file.name
      });
    }
    this.adding = [];
  },
  methods: {
    async fetch()    {
      let article = await this.$store.dispatch("issues_detail", {
        planner: this.planner_id,
        issue: this.id
      });

      this.article = article;
    },
    async summit()    {
      let title = this.article.title.trim();

      if (title.length == 0)      {
        this.$message.error("请输入完整的标题后再提交");

        return;
      }

      for (let file of this.deleting)      {
        this.$store.dispatch("pan_destroy_priavte", {
          planner: this.planner_id,
          name: file.name
        });
      }

      this.deleting = [];

      await this.$store.dispatch("issues_update", {
        planner: this.planner_id,
        issue: this.id,
        data: this.article
      });

      this.$message.success("修改成功");

      this.editing = false;
      this.adding = [];
    },
    goback()    {
      if (this.from)      {
        this.$router.push(this.from);
      } else      {
        this.$router.push(this.root);
      }
    },
    on_upload_ok(response)    {
      this.article.attachments = this.article.attachments || [];

      this.article.attachments.push(response);

      this.adding.push(response);
    },
    close_file(file)    {
      let index = this.article.attachments.indexOf(file);
      if (index < 0)      {
        return;
      }

      this.article.attachments.splice(index, 1);

      this.deleting.push(file);
    },
    is_img(file)    {
      return is_img(file.ext);
    },
    cal_link(one)    {
      return `${window.location.origin}/public/upload/${this.planner_id}/${one.res}`;
    },
    copy_link(one)    {
      let url = this.cal_link(one);

      copy(url);

      this.$message.success("复制成功");
    }
  }
};
</script>
