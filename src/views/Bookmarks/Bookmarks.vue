<template>
	<div class="">
		<v-header />
		<template v-if="bookmarkLoading">
			<page-load :showAside="false" />
		</template>
		<main v-else class="main container container--lg">
			<!-- contact search -->
			<div class="contact searched__wrapper">
				<div class="searched__wrapper-header">
					<h3 class="title" v-if="screenType === 'large'">Contact Research</h3>
					<toggle-dropdown v-else>
						<template #dropdown-wrapper>
							<h3 class="title">
								Contact Research
								<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
							</h3>
						</template>
						<template #dropdown-items>
							<li class="dropdown__item" @click="searchType = 'company_research'">Company Research</li>
							<li class="dropdown__item" @click="searchType = 'contact_research'">Contact Research</li>
						</template>
					</toggle-dropdown>
				</div>
				<div>
					<template v-if="getSearchedResult.contact_insights">
						<div v-for="(article, j) in contact_insights_categories" :key="j">
							<div v-if="article.is_bookmarked">
								<InsightCard
									@openModal="
										toggleModalClass(
											'dislikeModal',
											{ type: 'contact_insights', index: j, section: 'news', ...article },
											$event
										)
									"
									@createEmailIntro="generateIntroEmail('contact_insights', article)"
									@removeDislike="
										toggleDislike({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)
									"
									:published="article.meta.published"
									:article="article"
									@bookmark="
										btnUpdateBookMarks({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)
									"
									@displayInsight="displaySearchItem('contact_insights', article)"
								/>
							</div>
						</div>
					</template>
					<template v-if="getSearchedResult.contact_insights && getSearchedResult.contact_insights.other_insights">
						<div v-for="(article, j) in contact_other_insights" :key="`${article.url}`">
							<div v-if="article.is_bookmarked">
								<InsightCard
									@openModal="
										toggleModalClass(
											'dislikeModal',
											{ type: 'contact_insights', index: j, section: 'news', ...article },
											$event
										)
									"
									@createEmailIntro="generateIntroEmail('contact_insights', article)"
									@removeDislike="
										toggleDislike({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)
									"
									:published="article.meta.published"
									:article="article"
									@bookmark="
										btnUpdateBookMarks({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)
									"
									@displayInsight="displaySearchItem('contact_insights', article)"
								/>
							</div>
						</div>
					</template>
				</div>
			</div>

			<!-- company search -->
			<div class="contact searched__wrapper">
				<div class="searched__wrapper-header">
					<h3 class="title" v-if="screenType === 'large'">Company Research</h3>
					<toggle-dropdown v-else>
						<template #dropdown-wrapper>
							<h3 class="title">
								Company Research
								<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
							</h3>
						</template>
						<template #dropdown-items>
							<li class="dropdown__item" @click="searchType = 'company_research'">Company Research</li>
							<li class="dropdown__item" @click="searchType = 'contact_research'">Contact Research</li>
						</template>
					</toggle-dropdown>
					<div class="filter-sort">
						<toggle-dropdown>
							<template #dropdown-wrapper> </template>
							<template #dropdown-items>
								<li class="dropdown__item" @click="sortByRecent('company_research')">Recent</li>
								<li class="dropdown__item" @click="sortByRelevance('company_research')">Relevance</li>
							</template>
						</toggle-dropdown>
						<dropdown-checkbox>
							<template #dropdown-wrapper>
								<span class="filter"><img src="@/assets/icons/filter.svg" alt="filter icon" svg-inline/></span>
							</template>
							<template #dropdown-items>
								<span v-for="(data, i) in getSearchedResult.company_research" :key="i">
									<li class="dropdown__item" v-if="getSearchedResult.company_research[i].length !== 0">
										<d-checkbox v-model="companyFilter" inputType="checkbox" :truthValue="i" :name="i">
											{{ i }}
										</d-checkbox>
									</li>
								</span>
							</template>
						</dropdown-checkbox>
					</div>
				</div>
				<template v-if="getSearchedResult.company_insights">
					<div v-for="(article, j) in company_insights_categories" :key="j">
						<div v-if="article.is_bookmarked">
							<InsightCard
								@openModal="
									toggleModalClass(
										'dislikeModal',
										{ type: 'contact_insights', index: j, section: 'news', ...article },
										$event
									)
								"
								@createEmailIntro="generateIntroEmail('contact_insights', article)"
								@removeDislike="toggleDislike({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)"
								:published="article.meta.published"
								:article="article"
								@bookmark="btnUpdateBookMarks({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)"
								@displayInsight="displaySearchItem('contact_insights', article)"
							/>
						</div>
					</div>
				</template>
			</div>
		</main>
	</div>
</template>

<script src="./bookmarks.js"></script>
<style lang="scss" scoped src="./bookmarks.scss"></style>
