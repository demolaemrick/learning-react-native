<template>
	<div class="card" @click="openArticle">
		<div class="card-wrapper">
			<h4 v-if="article.title" class="title">
				{{ article.title }}
			</h4>
			<q v-if="article.quote" class="quote"> {{ article.quote }}</q>
			<div v-if="article.speaker" class="quotee mb-1">
				<p>- {{ article.speaker }}</p>
			</div>

			<p class="content" v-if="article.meta && article.meta.html" v-html="article.meta.html.snippet"></p>
			<p v-else class="content">{{ article.description }}</p>
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
					<template v-if="!article.quote && showEmailIcon && loggedInUser.can_generate_email && !isFromAdmin">
						<button
							class="icon icon-margin"
							@click="$emit('createEmailIntro')"
							content="<div>Generate<br/>email hook</div>"
							v-tippy="{ placement: 'right', delay: [50, 0], arrow: true, allowHTML: true }"
						>
							<img v-if="article.has_mail" src="../../assets/icons/hook-added.svg" svg-inline alt="" />
							<img v-else class="icon" src="../../assets/icons/noHooks.svg" svg-inline alt="tooltip icon" />
						</button>
					</template>
					<template v-if="showBookmarkIcon && !isFromAdmin">
						<button class="icon icon-margin" @click="$emit('bookmark', !article.is_bookmarked ? 'add' : 'remove')">
							<svg
								width="20"
								height="20"
								:fill="!article.is_bookmarked ? 'none' : 'black'"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M5.088 4.353c0-.92.747-1.667 1.667-1.667h8.333c.92 0 1.667.746 1.667 1.667v13.333l-5.833-2.916-5.834 2.916V4.353z"
									stroke="#333758"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					</template>
					<template v-if="showDislikeIcon && !isFromAdmin">
						<button v-if="!article.is_disliked" class="icon mr-1" @click="$emit('openModal')">
							<img src="../../assets/icons/dislike-icon.svg" svg-inline alt="" />
						</button>
						<button v-else @click="$emit('removeDislike')">
							<img class="icon" src="../../assets/icons/disliked-icon.svg" svg-inline alt="" />
						</button>
					</template>
					<template v-if="isFromAdmin && !article.quote">
						<button
							:disabled="sendingImp"
							class="iconBtn ml-1"
							:content="`<div>${article.ranked_by_admin ? 'Derank Article' : 'Rank Article'}</div>`"
							v-tippy="{ placement: 'right', delay: [50, 0], arrow: true, allowHTML: true }"
							@click="toggleImportanceFunc()"
						>
							<img
								class="icon"
								:src="
									article.ranked_by_admin
										? require('../../assets/icons/thumbs-up-on.svg')
										: require('../../assets/icons/thumbs-up-off.svg')
								"
								svg-inline
								alt=""
							/>
							<div class="loaderContainer" v-if="sendingImp">
								<Loader color="#3B48F7" />
							</div>
						</button>
					</template>
					<template v-if="isFromAdmin && !article.quote">
						<button
							:disabled="sending"
							class="iconBtn ml-1"
							:content="`<div>${article.hidden ? 'Unhide Article' : 'Hide Article'}</div>`"
							v-tippy="{ placement: 'right', delay: [50, 0], arrow: true, allowHTML: true }"
							@click="toggleArticleFunc()"
						>
							<img
								class="icon"
								:src="
									article.hidden
										? require('../../assets/icons/close-eye.svg')
										: require('../../assets/icons/open-eye.svg')
								"
								svg-inline
								alt=""
							/>
							<div class="loaderContainer" v-if="sending">
								<Loader color="#3B48F7" />
							</div>
						</button>
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
