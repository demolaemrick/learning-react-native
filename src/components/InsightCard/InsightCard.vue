<template>
  <div class="card">
    <h4 v-if="title" class="title">{{ title }}</h4>
    <div>
      <q class="quote" v-if="!title">{{ content }}</q>
      <p v-else class="content">{{ content }}</p>
    </div>
    <div class="details mb-2 flex flex__item-center flex-spaced">
      <div class="article-details flex flex__item-center">
        <img class="gap" src="../../assets/icons/calendar.svg" alt="" />
        <p>March 6, 2021   |   VB  Venturebeat.com</p>
      </div>
      <div class="flex flex__item-center">
        <div>
          <img class="mr-1" src="../../assets/icons/bookman-icon.svg" alt="" />
        </div>
        <img class="mr-1" src="../../assets/icons/bookmark.svg" alt="" />
        <div @click="$emit('openModal')">
          <img src="../../assets/icons/dislike-icon.svg" alt="" />  
        </div>
      </div>
    </div>
  </div>
  
  
</template>

<script src="./insightCard.js"></script>
<style lang="scss" scoped>
@import './insightCard.scss';
</style>
