<template>
	<div class="card" @click="$emit('displayInsight')">
		<div class="card-wrapper">
			<h4 v-if="article.title" class="title">
				{{ article.title }}
			</h4>

			<p class="content" v-if="article.meta && article.meta.html" v-html="article.meta.html.snippet"></p>
			<div @click.stop="" class="details flex flex__item-center flex-spaced">
				<div class="article-details flex flex__item-center">
					<img class="gap" src="../../assets/icons/calendar.svg" alt="" />
					<a class="article-link" :href="article.url || article.article_url" target="_blank" rel="noopener noreferrer">
						<p>
							<template v-if="published">{{ published | moment('LL') }} |</template> {{ cleanUrl }}
						</p>
					</a>
				</div>

				<div class="flex flex__item-center">
					<template>
						<button
							class="mr-1 icon"
							@click="$emit('createEmailIntro')"
							content="<div>Generate<br/>email hook</div>"
							v-tippy="{ placement: 'right', delay: [50, 0], arrow: true, allowHTML: true }"
						>
							<img class="icon" src="../../assets/icons/edit.svg" svg-inline alt="tooltip icon" />
						</button>
					</template>
				
				</div>
			</div>
		</div>
	</div>
</template>

<script src="./emailHookCard.js"></script>
<style lang="scss" scoped>
@import './emailHookCard.scss';
</style>
