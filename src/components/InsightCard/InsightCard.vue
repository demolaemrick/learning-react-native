<template>
	<div class="card">
		<div class="card-wrapper">
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
						<img class="mr-1 icon" v-if="!bookmarked" @click="bookmark" src="../../assets/icons/bookman-icon.svg" alt="" />
						<img class="mr-1 icon" v-else @click="bookmark" src="../../assets/icons/bookman-icon-dark.svg" alt="" />
					</template>
					<template>
						<img class="icon" v-if="!disliked" @click="$emit('openModal')" src="../../assets/icons/dislike-icon.svg" alt="" />
						<img class="icon" v-else @click="$emit('openModal')" src="../../assets/icons/disliked-icon.svg" alt="" />
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script src="./insightCard.js"></script>
<style lang="scss" scoped>
@import './insightCard.scss';
</style>
