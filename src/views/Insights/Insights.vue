<template>
	<div class="">
		<v-header />
		<template v-if="loading">
			<page-load />
		</template>
		<main v-else class="main container container--lg">
			<div v-if="!editNote" class="aside__left">
				<div class="section section__1">
					<h5 class="title">Contact Details</h5>
					<div class="contact__details">
						<div class="text__initials" v-if="contact_details.name">
							{{
								contact_details.name
									.match(/\b(\w)/g)
									.join('')
									.toUpperCase()
							}}
						</div>
						<div class="text__name__role">
							<div class="name">{{ contact_details.name }}</div>
							<div class="role">{{ contact_details.role }}</div>
						</div>
					</div>
				</div>
				<div class="section section__2">
					<div class="contact__address">
						<div class="title">Email Address</div>
						<div class="text">{{ contact_details.email }}</div>
					</div>
					<div class="contact__address">
						<div class="title">Company</div>
						<div class="text">{{ contact_details.company }}</div>
					</div>
					<div class="contact__icon__group">
						<span v-for="(social, i) in contact_details.socials" :key="i">
							<a v-if="social.twitter && Object.entries(social.twitter).length > 0" :href="social.twitter" target="_blank"
								><img src="@/assets/icons/twitter-icon.svg" svg-inline
							/></a>
							<a v-if="social.linkedin && Object.entries(social.linkedin).length > 0" :href="social.linkedin" target="_blank"
								><img src="@/assets/icons/linkedin-icon.svg" svg-inline
							/></a>
							<a
								v-if="social.website && Object.entries(social.website).length > 0"
								:href="validateURL(social.website)"
								target="_blank"
								><img src="@/assets/icons/world-icon.svg" svg-inline
							/></a>
							<a
								v-if="social.crunchbase && Object.entries(social.crunchbase).length > 0"
								:href="validateURL(social.crunchbase)"
								target="_blank"
								><img src="@/assets/icons/crunchbase.svg" svg-inline
							/></a>
						</span>
					</div>
				</div>
				<div class="section__3">
					<h5 class="last__refresh">Last refresh: {{ contact_details.last_refresh }}<span>June 6, 2021 | 09:45am</span></h5>
					<div class="input__group">
						<div class="icon refresh"><img src="@/assets/icons/refresh.svg" svg-inline alt="refresh" /></div>
						<div class="icon notification"><img src="@/assets/icons/notification.svg" svg-inline alt="notification" /></div>
						<input type="checkbox" :checked="searchedResult.status.statusCode === 'DONE'" @change="markResearch($event)" />
						<div class="input__label__text">Mark as done</div>
					</div>
				</div>
				<div class="section section__4">
					<h5 class="title">Contact Insight</h5>
					<div class="contact-tabs">
						<p
							v-for="(tab, index) in contactInsightsTab"
							:key="index"
							class="contact-tab"
							:class="{ active: tab.title === selectedInsightTab }"
							@click="scrollToSection(tab)"
						>
							{{ tab.title }}
						</p>
					</div>
				</div>
				<div class="section__5">
					<div class="text">Bookmarked {{ userBookmarksCount }}</div>
					<div v-if="userBookmarksCount !== 0" @click="$router.push({ name: 'Bookmarks', query: { rowId: rowId } })" class="link">
						See All
					</div>
				</div>
				<div class="section__6 bookmarks">
					<div
						class=""
						v-if="showFirstBookmark.contact_research !== ''"
						@click="displaySearchItem('contact_research', showFirstBookmark['contact_research'])"
					>
						<div class="title">Contact Research</div>
						<div class="content">
							{{ showFirstBookmark['contact_research'].description || '' }}
						</div>
					</div>
					<div class="" v-if="showFirstBookmark.company_research !== ''">
						<div class="title">Company Research</div>
						<div class="content">
							{{ showFirstBookmark['company_research'].description || '' }}
						</div>
					</div>
				</div>
				<div class="section__6" @click="editNote = !editNote">
					<div class="text">Notes</div>
					<div class="link"></div>
				</div>
				<template v-if="notepadTXT">
					<div class="section__7" @click="editNote = !editNote">
						<div class="title">{{ notepadTXT }}</div>
						<div class="content"></div>
					</div>
				</template>
			</div>
			<div v-else class="notepad">
				<span class="title-wrapper">
					<p class="notepad-title">Notepad</p>
					<img src="@/assets/icons/collapse.svg" svg-inline @click="editNote = false" />
				</span>
				<textarea
					class="notepad-input"
					rows="20"
					cols="50"
					name="text"
					id="textArea"
					v-model="notepadTXT"
					@blur="handleTextareaBlur"
					placeholder="Write down findings from research."
				>
				</textarea>
			</div>

			<!-- contact search -->
			<div class="contact searched__wrapper" v-if="searchType === 'contact_research' || screenType === 'large'">
				<div class="searched__wrapper-header">
					<h3 class="title" v-if="screenType === 'large'">Contact Insights</h3>
					<toggle-dropdown v-else>
						<template #dropdown-wrapper>
							<h3 class="title">
								Contact Insights
								<img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline />
							</h3>
						</template>
						<template #dropdown-items>
							<li class="dropdown__item" @click="searchType = 'company_research'">Company Research</li>
							<li class="dropdown__item" @click="searchType = 'contact_research'">Contact Research</li>
						</template>
					</toggle-dropdown>
				</div>
				<div class="snapshot-section" ref="snapshot">
					<h3 class="section-title">Snapshot</h3>
					<div class="snapshot-info">
						<div class="flex flex__item-center postion">
							<img src="@/assets/icons/work.svg" svg-inline />
							<p class="ml">
								{{ contact_details.name }} has worked at <span class="main-info">{{ contact_details.company }}</span> for
								{{ contact_insights.snapshot.current_employer.start | moment('from', 'now', true) }}
							</p>
						</div>
						<div class="flex flex__item-center postion">
							<img src="@/assets/icons/articles.svg" svg-inline />
							<p class="ml">
								Mentioned in <span class="main-info">{{ contact_insights.snapshot.mentions }} articles</span>
							</p>
						</div>
						<div class="flex flex__item-center postion">
							<img src="@/assets/icons/convo-bubble.svg" svg-inline />
							<p class="ml">
								Speaks most about
								<span class="main-info" v-for="(interest, i) in contact_insights.snapshot.interests" :key="i">
									{{ interest }}
									<template v-if="i !== contact_insights.snapshot.interests.length - 1">, </template>
								</span>
							</p>
						</div>
						<div class="flex flex__item-center postion">
							<img src="@/assets/icons/linkedin-icon2.svg" svg-inline />
							<p class="ml">
								Posted on <span class="main-info">LinkedIn</span> on
								{{ contact_insights.snapshot.last_linkedin_activity | moment('LL') }}
							</p>
						</div>
						<div class="flex flex__item-center postion">
							<img src="@/assets/icons/twitter-icon2.svg" svg-inline />
							<p class="ml">Most viral tweet was:</p>
						</div>
					</div>
				</div>
				<div class="news-section" ref="news-section">
					<div class="news">
						<h3 class="section-title">News & Articles</h3>
						<div class="filter-sort">
							<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem">
								<template #dropdown-wrapper>
									<p class="sort">Relevant <img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline /></p>
								</template>
								<template #dropdown-items>
									<li class="dropdown__item">Relevance</li>
								</template>
							</toggle-dropdown>
						</div>
					</div>
					<TextInput
						class="search-section mb-0"
						type="text"
						placeholder="Search"
						v-model="searchQuery"
						:icon="{ type: 'search' }"
						backgroundColor="#F5F5F5"
						border="#F5F5F5"
						width="448px"
						borderRadius="12px"
						searchIconColor="#3A434B"
					/>

					<div class="tab-group flex">
						<h5
							v-for="(tab, index) in tabs"
							:key="index"
							class="tab"
							:class="{ active: tab === selectedTab }"
							@click="selectedTab = tab"
						>
							{{ tab }}
						</h5>
					</div>
					<template v-for="categories in contact_insights_categories">
						<InsightCard
							v-for="article in categories"
							:key="categories[article]"
							@openModal="toggleModalClass('dislikeModal')"
							:title="article.title"
							:content="article.description"
						/>
					</template>

					<!-- <InsightCard
						@openModal="toggleModalClass('dislikeModal')"
						title="Kingsley Omin wins Gold at the Olympics!"
						content="Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quaerat, corporis. Distinctio voluptates tenetur molestias sunt libero?
            Voluptatem facilis optio qui natus velit explicabo. Quisquam fugit repudiandae iure atque eum minus!
            Quis et itaque nam"
					/> -->
				</div>
				<div class="quote-section" ref="quotes">
					<h3 class="section-title">Quotes</h3>
					<InsightCard
						v-for="(quote, index) in contact_insights.quotes"
						:key="index"
						:timestamp="quote.timestamp"
						:url="quote.url"
						content="We've seen rapid acceleration in the category and in our business this year, 
            and as we look to 2021 its clear that every consumer-facing business in the world is focused 
            on how to use data"
					/>
				</div>
				<div class="otherInsight-section" ref="others">
					<h3 class="section-title">Other Insights</h3>
					<InsightCard
						@openModal="toggleModalClass('dislikeModal')"
						content="Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quaerat, corporis. Distinctio voluptates tenetur molestias sunt libero?
            Voluptatem facilis optio qui natus velit explicabo. Quisquam fugit repudiandae iure atque eum minus!
            Quis et itaque nam"
					/>
				</div>
			</div>

			<!-- company search -->
			<div class="contact searched__wrapper" v-if="searchType === 'company_research' || screenType === 'large'">
				<div class="searched__wrapper-header">
					<h3 class="title" v-if="screenType === 'large'">Company Insights</h3>
					<toggle-dropdown v-else>
						<template #dropdown-wrapper>
							<h3 class="title">
								Company Research
								<img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline />
							</h3>
						</template>
						<template #dropdown-items>
							<li class="dropdown__item" @click="searchType = 'company_research'">Company Research</li>
							<li class="dropdown__item" @click="searchType = 'contact_research'">Contact Research</li>
						</template>
					</toggle-dropdown>
				</div>
				<div class="snapshot-section">
					<h3 class="section-title">Snapshot</h3>
					<div class="snapshot-info">
						<div class="flex flex__item-center postion">
							<img src="@/assets/icons/articles.svg" svg-inline />
							<p class="ml">
								Mentioned in <span class="main-info">{{ company_insights.snapshot.mentions }} news articles</span> in the
								past year
							</p>
						</div>
						<div class="flex flex__item-center postion">
							<img src="@/assets/icons/fund.svg" svg-inline />
							<p class="ml">
								Raised a round of <span class="main-info">funding</span> in
								{{ company_insights.snapshot.last_funding | moment('MMMM YYYY') }}
							</p>
						</div>
						<div class="flex flex__item-center postion">
							<img src="@/assets/icons/convo-bubble.svg" svg-inline />
							<p class="ml">
								Speaks most about
								<span class="main-info" v-for="(interest, i) in company_insights.snapshot.interests" :key="i">
									{{ interest }}
									<template v-if="i !== contact_insights.snapshot.interests.length - 1">, </template>
								</span>
							</p>
						</div>
						<div class="flex flex__item-center postion">
							<img src="@/assets/icons/jobs.svg" svg-inline />
							<p class="ml">Have {{ company_insights.snapshot.jobs }} <span class="main-info">open jobs</span></p>
						</div>
					</div>
				</div>
				<div class="news-section">
					<div class="news">
						<h3 class="section-title">News</h3>
						<div class="filter-sort">
							<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem">
								<template #dropdown-wrapper>
									<p class="sort">Relevant <img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline /></p>
								</template>
								<template #dropdown-items>
									<li class="dropdown__item">Relevance</li>
								</template>
							</toggle-dropdown>
						</div>
					</div>
					<TextInput
						class="search-section mb-0"
						type="text"
						placeholder="Search"
						v-model="searchQuery"
						:icon="{ type: 'search' }"
						backgroundColor="#F5F5F5"
						border="#F5F5F5"
						width="448px"
						borderRadius="12px"
						searchIconColor="#3A434B"
					/>

					<div class="tab-group flex">
						<h5
							v-for="(tab, index) in companyTabs"
							:key="index"
							class="tab"
							:class="{ active: tab === companyTab }"
							@click="companyTab = tab"
						>
							{{ tab }}
						</h5>
					</div>
					<template v-for="categories in company_insights_categories">
						<InsightCard
							v-for="article in categories"
							:key="categories[article]"
							@openModal="toggleModalClass('dislikeModal')"
							:title="article.title"
							:content="article.description"
						/>
					</template>
				</div>
				<div class="jobs-section">
					<div class="jobs-header flex flex__space-center">
						<h3 class="section-title">News</h3>
						<div class="open-roles">
							<p class="roles-number">{{ company_insights.jobs.length }} Open roles</p>
						</div>
					</div>
					<div class="job flex flex__space-center" v-for="(job, i) in company_insights.jobs" :key="i">
						<h4 class="title">{{ job.role }}</h4>
						<div>
							<p class="location">{{ job.location }}</p>
							<p class="type">{{ job.employment_type }}</p>
						</div>
					</div>
				</div>
			</div>
		</main>
		<!-- Dislike Modal -->
		<modal
			position="center"
			v-if="dislikeModal"
			:active="true"
			:toggleClass="toggleClass"
			@close="toggleModalClass('dislikeModal')"
			maxWidth="400px"
		>
			<template #title>
				<h4 class="modal__header-title">Why did you dislike the search result?</h4>
			</template>
			<template #info>
				<h5>We will like to get your feedback to help us improve our services</h5>
			</template>
			<template #body>
				<div class="modal__content">
					<p class="modal__content-text">
						<RadioBtn
							style="display: block"
							margin=""
							id="statusType"
							:options="dislikeOptions"
							name="status"
							v-model="statusOption"
						/>
					</p>
					<div class="modal__content-btn">
						<v-button class="config__btn" buttonType="warning" size="modal">
							<template v-if="!loading">Submit</template>
							<Loader v-else />
						</v-button>
					</div>
				</div>
			</template>
		</modal>
	</div>
</template>

<script src="./insights.js"></script>
<style lang="scss" scoped src="./insights.scss"></style>
