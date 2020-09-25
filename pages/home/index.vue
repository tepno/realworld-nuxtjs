<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">tepno</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed',
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                    },
                  }"
                  exact
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed',
                  }"
                  :to="{
                    name: 'home',
                  }"
                  exact
                  >Global Feed</nuxt-link
                >
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'tag',
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag,
                    },
                  }"
                  exact
                  ># {{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            v-for="article in articles"
            :key="article.slug"
            class="article-preview"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                @click="onFavorite(article)"
                :class="{
                  active: article.favorited,
                }"
                :disabled="article.favoritedDisabled"
              >
                <i class="ion-heart"></i>
                {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                v-for="item in totalPage"
                :key="item"
                :class="{
                  active: item === page,
                }"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag,
                      tab,
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="item in tags"
                :key="item"
                class="tag-pill tag-default"
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: item,
                  },
                }"
                >{{ item }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getYourFeedArticle,
  deleteFavorite,
  addFavorite,
} from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";
export default {
  name: "homeIndex",
  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1);
    const tag = query.tag;
    const tab = query.tab || "global_feed";
    const limit = 20;
    const loadArticles =
      tab === "global_feed" ? getArticles : getYourFeedArticle;
    const [articleData, tagsData] = await Promise.all([
      loadArticles({
        limit: limit,
        offset: (page - 1) * limit,
        tag,
      }),
      getTags(),
    ]);
    const { articles, articlesCount } = articleData.data;
    const { tags } = tagsData.data;

    articles.forEach((article) => (article.favoritedDisabled = false));

    return {
      articles, // 文章列表
      articlesCount, // 文章总数
      page, // 页码
      limit, // 每页大小
      tags, // 标签列表
      tag, // 数据标签
      tab, // 选项卡
    };
  },
  watchQuery: ["page", "tag", "tab"],
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async onFavorite(article) {
      console.log(article);
      article.favoritedDisabled = true;
      if (article.favorited) {
        await deleteFavorite(article.slug);
        article.favoritesCount += -1;
      } else {
        await addFavorite(article.slug);
        article.favoritesCount += 1;
      }
      article.favorited = !article.favorited;
      article.favoritedDisabled = false;
    },
  },
};
</script>

<style>
</style>