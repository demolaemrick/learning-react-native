<template>
	<div class="">
		<v-header />
		<template v-if="loading">
			<page-load />
		</template>
		<main v-else class="main container container--lg">
			<div v-if="!editNote" class="aside__left">
				<div class="section section__1">
					<div class="title">
						<div class="text">Contact Details</div>
					</div>
					<div class="contact__details">
						<div class="text__initials" v-if="searchedResult.full_name">
							{{
								searchedResult.full_name
									.match(/\b(\w)/g)
									.join('')
									.toUpperCase()
							}}
						</div>
						<div class="text__name__role">
							<div class="name">{{ searchedResult.full_name }}</div>
							<div class="role">{{ searchedResult.role }}</div>
						</div>
					</div>
				</div>
				<div class="section section__2">
					<div class="contact__address">
						<div class="title">Email Address</div>
						<div class="text">{{ searchedResult.email }}</div>
					</div>
					<div class="contact__address">
						<div class="title">Company</div>
						<div class="text">{{ searchedResult.company }}</div>
					</div>
					<div class="contact__icon__group">
						<span v-for="(social, i) in socials" :key="i">
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
					<div class="title__text">Research Status</div>
					<div class="input__group">
						<input type="checkbox" :checked="searchedResult.status.statusCode === 'DONE'" @change="markResearch($event)" />
						<div class="input__label__text">Completed</div>
					</div>
				</div>
				<div class="section__4">
					<div class="text">Bookmarked {{ userBookmarksCount }}</div>
					<div v-if="userBookmarksCount !== 0" @click="$router.push({ name: 'Bookmarks', query: { rowId: rowId } })" class="link">
						See All
					</div>
				</div>
				<div class="section__5 bookmarks">
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
				<div class="section-wrapper">
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
					<div class="snapshot-section">
						<h3 class="section-title">Snapshot</h3>
						<div class="snapshot-info">
							<div class="flex flex__item-center postion">
								<img src="@/assets/icons/work.svg" svg-inline />
								<p class="ml">Kingsley has worked at <span class="main-info">Enyata</span> for 1 year</p>
							</div>
							<div class="flex flex__item-center postion">
								<img src="@/assets/icons/articles.svg" svg-inline />
								<p class="ml">Speaks most about <span class="main-info">19 articles</span></p>
							</div>
							<div class="flex flex__item-center postion">
								<img src="@/assets/icons/convo-bubble.svg" svg-inline />
								<p class="ml">Mentioned in <span class="main-info">data</span> and <span class="main-info">data</span></p>
							</div>
							<div class="flex flex__item-center postion">
								<img src="@/assets/icons/linkedin-icon2.svg" svg-inline />
								<p class="ml">Posted on <span class="main-info">LinkedIn</span></p>
							</div>
							<div class="flex flex__item-center postion">
								<img src="@/assets/icons/twitter-icon2.svg" svg-inline />
								<p class="ml">Most viral tweet was:</p>
							</div>
						</div>
					</div>
					<Tweet v-if="tweetId" :id="tweetId" error-message="This tweet could not be loaded" error-message-class="tweet--error">
						<div class="spinner">
							<LoadIcon />
						</div>
					</Tweet>
				</div>

				<div class="news-section">
					<div class="section-wrapper">
						<div class="news">
							<h3 class="section-title">News & Articles</h3>
							<div class="filter-sort">
								<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem">
									<template #dropdown-wrapper>
										<p class="sort">Relevant <img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline /></p>
									</template>
									<template #dropdown-items>
										<li class="dropdown__item">Recent</li>
										<li class="dropdown__item">Relevant</li>
									</template>
								</toggle-dropdown>
							</div>
						</div>
						<TextInput
							class="search-section mb-0"
							type="text"
							placeholder="Search"
							name="contactSearch"
							v-model="contactSearchQuery"
							:icon="{ type: 'search' }"
							backgroundColor="#F5F5F5"
							border="#F5F5F5"
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
					</div>

					<InsightCard
						:disliked="disliked"
						@openModal="toggleModalClass('dislikeModal')"
						title="Journey to the Center of the Earth"
						content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, corporis. 
              Distinctio voluptates tenetur molestias sunt libero? Voluptatem facilis optio qui natus velit explicabo. 
              Quisquam fugit repudiandae iure atque eum minus!
              Quis et itaque nam"
					/>
					<InsightCard
						:disliked="disliked"
						@openModal="toggleModalClass('dislikeModal')"
						title="Kingsley Omin wins Gold at the Olympics!"
						content="Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quaerat, corporis. Distinctio voluptates tenetur molestias sunt libero?
              Voluptatem facilis optio qui natus velit explicabo. Quisquam fugit repudiandae iure atque eum minus!
              Quis et itaque nam"
					/>
				</div>
				<div class="quote-section">
					<div class="section-wrapper">
						<h3 class="section-title">Quotes</h3>
					</div>
					<InsightCard
						:disliked="disliked"
						@openModal="toggleModalClass('dislikeModal')"
						quote="We've seen rapid acceleration in the category and in our business this year, 
              and as we look to 2021 its clear that every consumer-facing business in the world is focused 
              on how to use data"
					/>
				</div>
				<div class="topics-section">
					<div class="section-wrapper">
						<h3 class="section-title">Topics</h3>
					</div>
					<PieChart class="topics-chart" :chartData="chartData" :labels="mainTopics" />
				</div>
				<div class="otherInsight-section">
					<div class="section-wrapper">
						<h3 class="section-title">Other Insights</h3>
					</div>
					<InsightCard
						:disliked="disliked"
						@openModal="toggleModalClass('dislikeModal')"
						content="On Twitter Boray interacts most with John Doe Boray shared a link to a Techcrunch article"
					/>
				</div>
			</div>

			<!-- company search -->
			<div class="contact searched__wrapper" v-if="searchType === 'company_research' || screenType === 'large'">
				<div class="section-wrapper">
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
								<p class="ml">Mentioned in <span class="main-info">6 news articles</span> in the past year</p>
							</div>
							<div class="flex flex__item-center postion">
								<img src="@/assets/icons/fund.svg" svg-inline />
								<p class="ml">Raised a round of <span class="main-info">funding</span> in March 2021</p>
							</div>
							<div class="flex flex__item-center postion">
								<img src="@/assets/icons/convo-bubble.svg" svg-inline />
								<p class="ml">
									Speaks most about <span class="main-info">data</span> and <span class="main-info">non-profit</span>
								</p>
							</div>
							<div class="flex flex__item-center postion">
								<img src="@/assets/icons/jobs.svg" svg-inline />
								<p class="ml">Have 12 <span class="main-info">open jobs</span></p>
							</div>
						</div>
					</div>
				</div>

				<div class="news-section">
					<div class="section-wrapper">
						<div class="news">
							<h3 class="section-title">News</h3>
							<div class="filter-sort">
								<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem">
									<template #dropdown-wrapper>
										<p class="sort">Relevant <img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline /></p>
									</template>
									<template #dropdown-items>
										<li class="dropdown__item">Recent</li>
										<li class="dropdown__item">Relevant</li>
									</template>
								</toggle-dropdown>
							</div>
						</div>
						<TextInput
							class="search-section mb-0"
							type="text"
							placeholder="Search"
							name="companySearch"
							v-model="companySearchQuery"
							:icon="{ type: 'search' }"
							backgroundColor="#F5F5F5"
							border="#F5F5F5"
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
					</div>
					<InsightCard
						@openModal="toggleModalClass('dislikeModal')"
						title="Kingsley Omin wins Gold at the Olympics!"
						content="Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quaerat, corporis. Distinctio voluptates tenetur molestias sunt libero?
            Voluptatem facilis optio qui natus velit explicabo. Quisquam fugit repudiandae iure atque eum minus!
            Quis et itaque nam"
					/>
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
			borderRadius="12px"
			marginTop="10%"
		>
			<template #title>
				<h4 class="modal__header-title">Not Relevant?</h4>
			</template>
			<template #info>
				<h5>Your feedback will help us improve your results.</h5>
			</template>
			<template #body>
				<div class="modal__content">
					<p class="modal__content-text">
						<RadioBtn
							style="display: block;"
							marginBottom="24px"
							id="dislikeOption"
							:options="dislikeOptions"
							name="dislikeChoices"
							v-model="dislikeOption"
						/>
					</p>

					<form v-if="dislikeOption === 'Other'" action="">
						<label class="textLabel" for="dislikeForm">Comment</label>
						<textarea class="textarea" id="dislikeForm" name="dislikeForm" placeholder="Comment here..." v-model="comment"> </textarea>
					</form>

					<div class="modal__content-btn">
						<v-button class="config__btn" buttonType="primary" size="full" @click="dislikeCard">
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
