<template>
  <el-container class="full">
    <el-aside width="180px" style="margin-right:10px">
      <articles ref="articles" :planner="planner_id" />
    </el-aside>

    <el-container style="padding:0" class="full" direction="vertical">
      <el-row type="flex" justify="space-between" align="middle">
        <template v-if="editing">
          <el-button-group>
            <el-button size="mini" icon="el-icon-close" @click="editing=false">取消</el-button>
            <el-button size="mini" type="primary" icon="el-icon-upload" @click="summit">保存</el-button>
          </el-button-group>
        </template>

        <template v-else>
          <el-button-group>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="destroy">删除</el-button>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editing = !editing">编辑</el-button>
          </el-button-group>
        </template>
      </el-row>
      <el-container class="el-card" direction="vertical">
        <div v-if="!editing" class style="text-align:center;">
          <h1>
            {{article.title}}
            <member-preview size="mini" :planner="planner_id" v-model="article.author" />
          </h1>
        </div>
        <el-input v-else placeholder="请输入标题" v-model="article.title" clearable></el-input>

        <el-header
          style="background-color:#f0f9eb;"
          class="scroll-if-need el-card"
          height="40px"
          v-if="article.attachments && article.attachments.length > 0 || editing"
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
                <h2>{{one.name}}</h2>
                <el-button type="success" @click="copy_link(one)">复制链接</el-button>
              </el-row>

              <el-image v-if="is_img(one)" :src="cal_link(one)"></el-image>
              <div v-else>不支持预览</div>

              <el-tag
                :class="is_img(one)?'el-icon-picture':'el-icon-document'"
                :closable="editing"
                type="success"
                size="mini"
                :effect="is_img(one)?'dark':'plain'"
                slot="reference"
                @close="close_file(one)"
              >{{one.name}}</el-tag>
            </el-popover>
          </el-row>
        </el-header>

        <md-editor
          v-model="article.content"
          theme="small"
          :editable="editing"
          :planner="planner_id"
        />
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

import copy from 'clipboard-copy'
import { is_img } from "@/utils"

import MemberPreview from "@/components/MemberPreview";
import Articles from "@/components/Articles";
import MdEditor from "@/components/MdEditor";

export default {
  path: "detail/:article",
  weight: 10,
  meta: { require_logined: true },
  components: { Articles, MemberPreview, MdEditor },
  data()  {
    return {
      article: {
        title: "",
        content: ""
      },
      editing: false,
      folding: true,
      deleting: [],
      adding: [],
    };
  },
  computed: {

    root()    {
      return `/planner/${this.planner_id}/wiki`;
    },
    planner_id()    {
      return this.$route.params.planner;
    },
    id()    {
      return this.$route.params.article;
    },
    upload_url()    {
      return `${this.$http.defaults.baseURL}/api/planner/${this.planner_id}/pan?path=/.private`;
    },
  },
  mounted()  {
    this.fetch();
  },
  watch: {
    id()    {
      this.fetch();
    }
  },
  beforeDestroy()  {
    for (let file of this.adding)
    {
      this.$store.dispatch("pan_destroy_priavte", {
        planner: this.planner_id,
        name: file.name,
      })
    }
    this.adding = []
  },
  methods: {
    async fetch()    {
      let article = await this.$store.dispatch("wiki_detail", {
        planner: this.planner_id,
        article: this.id
      });

      this.article = article;
    },
    async summit()    {
      let title = this.article.title.trim();

      if (title.length == 0)      {
        this.$message.error("请输入完整的标题后再提交");

        return;
      }

      for (let file of this.deleting)
      {
        this.$store.dispatch("pan_destroy_priavte", {
          planner: this.planner_id,
          name: file.name,
        })
      }

      this.deleting = []

      await this.$store.dispatch("wiki_update", {
        planner: this.planner_id,
        article: this.id,
        data: this.article
      });

      this.$message.success("修改成功");

      this.$refs.articles.refresh();

      this.editing = false;
      this.adding = []
    },
    async destroy()    {
      await this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });

      await this.$store.dispatch("wiki_destroy", {
        planner: this.planner_id,
        article: this.id
      });

      this.$message({
        type: "success",
        message: "删除成功!"
      });

      this.$router.push(this.root);
    },
    goback()    {
      if (this.from)      {
        this.$router.push(this.from);
      } else      {
        this.$router.push(this.root);
      }
    },
    on_upload_ok(response)    {
      this.article.attachments = this.article.attachments || []

      this.article.attachments.push(response)

      this.adding.push(response)

      console.log("upload ok", response)
    },
    preview_file(file)
    {
      console.log("preview file", file.name)
    },
    close_file(file)
    {
      console.log("close_file", file)
      console.log(this.article.attachments)

      let index = this.article.attachments.indexOf(file)
      if (index < 0)
      {
        console.log("no such file", file)
        return
      }

      this.article.attachments.splice(index, 1)

      this.deleting.push(file)
    },
    is_img(file)
    {
      return is_img(file.ext)
    },
    cal_link(one)
    {
      return `${this.$http.defaults.baseURL}/public/upload/${this.planner_id}/${one.res}`
    },
    copy_link(one)
    {
      let url = this.cal_link(one)

      copy(url)

      this.$message.success("复制成功")
    }
  }
};
</script>