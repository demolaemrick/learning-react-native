<template>
	<div class="card mb-2">
		<h4 v-if="title" class="title">{{ title }}</h4>
		<div>
			<q class="quote" v-if="!title">{{ content }}</q>
			<p v-else class="content">{{ content }}</p>
		</div>

		<div class="details flex flex__item-center flex-spaced">
			<div class="article-details flex flex__item-center">
				<img class="gap" src="../../assets/icons/calendar.svg" alt="" />
				<p>{{timestamp | moment('LL')}} | {{url}}</p>
			</div>

			<div class="flex flex__item-center">
				<div>
					<img class="mr-1 icon" src="../../assets/icons/bookman-icon.svg" alt="" />
				</div>
				<!-- <img class="mr-1 icon" src="../../assets/icons/bookmark.svg" alt="" /> -->
				<div class="icon" @click="$emit('openModal')">
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
