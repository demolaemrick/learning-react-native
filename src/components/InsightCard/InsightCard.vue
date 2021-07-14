<template>
	<div class="card">
		<h4 class="title">{{ title }}</h4>

		<q v-if="quote" class="quote">{{ quote }}</q>

		<p class="content">{{ content }}</p>
		<div class="details flex flex__item-center flex-spaced">
			<div class="article-details flex flex__item-center">
				<img class="gap" src="../../assets/icons/calendar.svg" alt="" />
				<p>March 6, 2021 | VB Venturebeat.com</p>
			</div>

			<div class="flex flex__item-center">
				<template>
					<img class="mr-1 icon" src="../../assets/icons/bookman-icon.svg" alt="" />
				</template>
				<!-- <img class="mr-1 icon" src="../../assets/icons/bookmark.svg" alt="" /> -->
				<template>
					<img class="icon" v-if="!disliked"  @click="$emit('openModal')" src="../../assets/icons/dislike-icon.svg" alt="" />
					<img class="icon" v-else  @click="$emit('openModal')" src="../../assets/icons/disliked-icon.svg" alt="" />
				</template>
			</div>

		</div>
	</div>
</template>

<script src="./insightCard.js"></script>
<style lang="scss" scoped>
@import './insightCard.scss';
</style>
