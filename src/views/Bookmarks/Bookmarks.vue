<template>
	<div class="">
		<v-header />
		<template v-if="loading || bookmarkLoading">
			<page-load :showAside="false" />
		</template>
		<main v-else class="main container container--lg">
			<!-- contact search -->
			<div class="contact searched__wrapper">
				<div class="searched__wrapper-header">
					<h3 class="title" v-if="screenType === 'large'">Contact Insight</h3>
				</div>
				<div>
					<template v-if="bookmarkValue === 'contactBookmarks' && getSearchedResult.contact_insights">
						<div v-for="(article, j) in contact_insights_categories" :key="j">
							<div v-if="article.is_bookmarked">
								<InsightCard
									:published="article.meta.published || article.content.date || article.meta.timestamp"
									:article="article"
									:showEmailIcon="false"
									:showDislikeIcon="false"
									@bookmark="
										btnUpdateBookMarks({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)
									"
									@displayInsight="displaySearchItem('contact_insights', article)"
								/>
							</div>
						</div>
					</template>

					<template
						v-if="
							bookmarkValue === 'contactBookmarks' &&
								getSearchedResult.contact_insights &&
								getSearchedResult.contact_insights.other_insights
						"
					>
						<div v-for="(article, j) in contact_other_insights" :key="`${article.url}`">
							<div v-if="article.is_bookmarked">
								<InsightCard
									:published="article.meta.published || article.content.date || article.meta.timestamp"
									:article="article"
									:showEmailIcon="false"
									:showDislikeIcon="false"
									@bookmark="
										btnUpdateBookMarks({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)
									"
									@displayInsight="displaySearchItem('contact_insights', article)"
								/>
							</div>
						</div>
					</template>

					<!-- all contact bookmarks -->
					<template v-if="bookmarkValue === 'allBookmarks' && userBookmarks.contact_research.length">
						<div v-for="(article, j) in userBookmarks.contact_research" :key="j">
							<InsightCard
								:published="article.meta.published || article.content.date || article.meta.timestamp"
								:article="article"
								:showEmailIcon="false"
								:showDislikeIcon="false"
								@bookmark="btnUpdateBookMarks({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)"
								@displayInsight="displaySearchItem('contact_insights', article)"
							/>
						</div>
					</template>
					<template v-else>
						<div class="emptyState">
							<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
							<p class="emptyState-text">No content found!</p>
						</div>
					</template>
				</div>
			</div>

			<!-- company search -->
			<div class="contact searched__wrapper">
				<div class="searched__wrapper-header">
					<h3 class="title" v-if="screenType === 'large'">Company Insight</h3>
				</div>
				<template v-if="bookmarkValue === 'contactBookmarks' && getSearchedResult.company_insights">
					<div v-for="(article, j) in company_insights_categories" :key="j">
						<div v-if="article.is_bookmarked">
							<InsightCard
								:published="article.meta.published || article.content.date || article.meta.timestamp"
								:article="article"
								:showEmailIcon="false"
								:showDislikeIcon="false"
								@bookmark="btnUpdateBookMarks({ type: 'company_insights', index: j, section: 'news', ...article }, $event)"
								@displayInsight="displaySearchItem('company_insights', article)"
							/>
						</div>
					</div>
				</template>

				<!-- all company bookmarks -->
				<template v-if="bookmarkValue === 'allBookmarks' && userBookmarks.company_research.length">
					<div v-for="(article, j) in userBookmarks.company_research" :key="j">
						<InsightCard
							:published="article.meta.published || article.content.date || article.meta.timestamp"
							:article="article"
							:showEmailIcon="false"
							:showDislikeIcon="false"
							@bookmark="btnUpdateBookMarks({ type: 'company_insights', index: j, section: 'news', ...article }, $event)"
							@displayInsight="displaySearchItem('company_insights', article)"
						/>
					</div>
				</template>
				<template v-else>
					<div class="emptyState">
						<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
						<p class="emptyState-text">No content found!</p>
					</div>
				</template>
			</div>
		</main>
	</div>
</template>

<script src="./bookmarks.js"></script>
<style lang="scss" scoped src="./bookmarks.scss"></style>
