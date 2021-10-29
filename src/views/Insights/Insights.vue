<template>
	<div>
		<v-header :isFromAdmin="isFromAdmin" />
		<template v-if="loading">
			<page-load />
		</template>
		<main v-else class="main container container--lg">
			<div v-if="!editNote" class="aside__left">
				<div class="section section__1">
					<h5 class="title">Contact Details</h5>
					<div class="contact__details">
						<div class="text__initials" v-if="contact_details.full_name">
							<template v-if="contactImage">
								<img class="searchImage" @error="removeBrokenImage" :src="contactImage" alt="" />
							</template>
							<template v-else>
								{{ profileImagePlaceholder(contact_details.full_name) }}
							</template>
						</div>
						<div class="text__name__role">
							<div class="name">{{ contact_details.full_name }}</div>
							<div class="role">{{ contact_details.role }}</div>
						</div>
					</div>
				</div>
				<div class="section section__2">
					<div class="contact__address" v-if="contact_details.email !== ''">
						<div class="title">Email Address</div>
						<div class="text">{{ contact_details.email }}</div>
					</div>
					<div class="contact__address">
						<div class="title">Company</div>
						<div class="text">{{ contact_details.company }}</div>
					</div>
					<div class="contact__icon__group">
						<a v-if="contact_details.socials.twitter" :href="validateURL(contact_details.socials.twitter)" target="_blank"
							><img src="@/assets/icons/twitter-icon.svg" alt="twitter icon" svg-inline
						/></a>
						<a v-if="contact_details.socials.linkedin" :href="validateURL(contact_details.socials.linkedin)" target="_blank"
							><img src="@/assets/icons/linkedin-icon.svg" alt="linkedin icon" svg-inline
						/></a>
						<a v-if="contact_details.socials.website" :href="validateURL(contact_details.socials.website)" target="_blank"
							><img src="@/assets/icons/world-icon.svg" alt="website icon" svg-inline
						/></a>
						<a v-if="contact_details.socials.crunchbase" :href="validateURL(contact_details.socials.crunchbase)" target="_blank"
							><img src="@/assets/icons/crunchbase.svg" alt="crunchbase icon" svg-inline
						/></a>
					</div>
				</div>
				<div class="section__3">
					<h5 class="last__refresh">
						Last refresh:
						<span
							>{{ contact_details.last_refresh | moment('MMMM D, YYYY') }} |
							{{ contact_details.last_refresh | moment(' h:mm a') }}</span
						>
					</h5>
					<div class="input__group" v-if="!isFromAdmin">
						<div @click="RefreshResearch" class="icon refresh mr-1">
							<img
								:class="{ refresh__loading: insightStatus.statusCode === 'UPDATING' || refreshLoading }"
								src="@/assets/icons/refresh.svg"
								svg-inline
								alt="refresh"
							/>
						</div>
						<input type="checkbox" :checked="insightStatus.statusCode === 'DONE'" @change="markResearch($event)" />
						<div class="input__label__text" v-if="!isFromAdmin">Mark as done</div>
					</div>
				</div>
				<div class="section section__4">
					<h5 class="title">Contact Insight</h5>
					<div class="contact-tabs">
						<p
							v-for="(tab, index) in getTabs"
							:key="index"
							class="contact-tab"
							:class="{ active: tab.title === selectedInsightTab }"
							@click="scrollToSection(tab)"
						>
							{{ tab.title }}
						</p>
					</div>
				</div>

				<div class="section__5 first" v-if="!isFromAdmin">
					<div class="text">Bookmarked {{ userBookmarksCount }}</div>
					<div v-if="userBookmarksCount !== 0" @click="goToBookmarks" class="link">
						See All
					</div>
				</div>
				<div class="section__5" v-if="loggedInUser.can_generate_email && !isFromAdmin">
					<div class="text">Personalized Email Intros</div>
					<div @click="generateIntroEmail(null, null)" class="link">See All</div>
				</div>
				<div class="section__7" v-if="!isFromAdmin" @click="editNote = !editNote">
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
			<!-- <div v-else class="notePad">
				<notepad :handleTextareaBlur="handleTextareaBlur" :sending="sendingNote" @editNoteF="editNote = false" />
			</div> -->
			<div v-else class="notepad">
				<span class="title-wrapper">
					<p class="notepad-title">Notepad</p>
					<img src="@/assets/icons/collapse.svg" alt="close notepad icon" svg-inline @click="editNote = false" />
				</span>
				<textarea
					class="notepad-input"
					rows="20"
					cols="50"
					name="text"
					id="textArea"
					v-model="notepadTXT"
					@blur="handleTextareaBlur(notepadTXT)"
					placeholder="Write down findings from research."
				>
				</textarea>
			</div>

			<!-- contact search -->
			<div class="contact searched__wrapper" v-if="searchType === 'contact_research' || screenType === 'large'">
				<div class="searched__wrapper-header">
					<div class="section-wrapper">
						<h3 class="title" v-if="screenType === 'large'">Contact Insights</h3>
						<toggle-dropdown v-else>
							<template #dropdown-wrapper>
								<h3 class="title">
									Contact Insights
									<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
								</h3>
							</template>
							<template #dropdown-items>
								<li class="dropdown__item" @click="searchType = 'company_research'">Company Research</li>
								<li class="dropdown__item" @click="searchType = 'contact_research'">Contact Research</li>
							</template>
						</toggle-dropdown>
					</div>
				</div>
				<div v-if="Object.values(contact_insights.snapshot).length" class="snapshot-section" ref="snapshot">
					<div class="section-wrapper">
						<h3 class="section-title">Snapshot</h3>
						<div v-if="contact_insights.snapshot" class="snapshot-info">
							<div class="flex flex__item-center postion" v-if="contact_insights.snapshot.current_employer">
								<img src="@/assets/icons/work.svg" alt="company icon" svg-inline />
								<p class="ml">
									{{ contact_details.full_name }} has
									<template v-if="contact_insights.snapshot.current_employer.current">been working</template>
									<template v-else>worked</template> at
									<span class="main-info">{{ contact_details.company }}</span>
									<template v-if="contact_insights.snapshot.current_employer.start_date">
										for
										{{ contact_insights.snapshot.current_employer.start_date | moment('from', 'now', true) }}</template
									>
								</p>
							</div>
							<div class="flex flex__item-center postion" v-if="contact_insights.snapshot.mentions">
								<img src="@/assets/icons/articles.svg" alt="contact article icon" svg-inline />
								<p class="ml">
									Mentioned in
									<span
										class="main-info"
										@click="scrollToSection((section = { title: 'News & article', ref: 'news-section' }))"
										>{{ contact_insights.snapshot.mentions }}
										<template v-if="contact_insights.snapshot.mentions <= 1">article</template>
										<template v-else>articles</template>
									</span>
								</p>
							</div>
							<div
								class="flex flex__item-center postion"
								v-if="contact_insights.snapshot.interests && contact_insights.snapshot.interests.length > 0"
							>
								<img src="@/assets/icons/convo-bubble.svg" alt="convo icon" svg-inline />
								<p class="ml">
									Speaks most about
									<span class="main-info" v-for="(interest, i) in contact_insights.snapshot.interests" :key="i">
										{{ interest }}
										<template v-if="i !== contact_insights.snapshot.interests.length - 1">, </template>
									</span>
								</p>
							</div>
							<div class="flex flex__item-center postion" v-if="getLinkedinUrl">
								<img src="@/assets/icons/linkedin-icon2.svg" alt="linkedin icon" svg-inline />
								<p
									class="ml"
									v-if="
										contact_insights.snapshot.last_linkedin_activity &&
											Object.entries(contact_insights.snapshot.last_linkedin_activity).length !== 0
									"
								>
									Posted on <a :href="getLinkedinUrl" target="_blank" class="main-info">LinkedIn</a>
									{{ contact_insights.snapshot.last_linkedin_activity | moment('LL') }}
								</p>
								<p class="ml" v-else>Posts on <a :href="getLinkedinUrl" target="_blank" class="main-info">LinkedIn</a></p>
							</div>
							<div class="flex flex__item-center postion" v-if="contact_insights.snapshot.most_viral_tweet">
								<img src="@/assets/icons/twitter-icon2.svg" alt="twitter icon" svg-inline />
								<p class="ml">Most viral tweet from the past 3 months:</p>
							</div>
						</div>
						<template v-if="contact_insights.snapshot.most_viral_tweet">
							<Tweet
								:id="contact_insights.snapshot.most_viral_tweet"
								error-message="This tweet could not be loaded"
								error-message-class="tweet--error"
							>
								<div class="spinner">
									<LoadIcon />
								</div>
							</Tweet>
						</template>
					</div>
				</div>
				<!-- News and Articles Section -->
				<div v-if="Object.values(contact_insights.news).length" class="news-section" ref="news-section">
					<div class="section-wrapper">
						<div class="news">
							<h3 class="section-title">News & Articles</h3>
							<div class="filter-sort" v-if="!isFromAdmin">
								<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem">
									<template #dropdown-wrapper>
										<p class="sort">
											Sort by <img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
										</p>
									</template>
									<template #dropdown-items>
										<li
											class="dropdown__item"
											:class="{ active: contactSortMethod === 'recent' }"
											@click="contactSortMethod = 'recent'"
										>
											Recent
										</li>
										<li
											class="dropdown__item"
											:class="{ active: contactSortMethod === 'relevance' }"
											@click="contactSortMethod = 'relevance'"
										>
											Relevant
										</li>
									</template>
								</toggle-dropdown>
							</div>
						</div>

						<div v-if="isFromAdmin" class="relevant_add_article">
							<div class="filter-sort">
								<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem">
									<template #dropdown-wrapper>
										<p class="sort">
											Sort by <img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
										</p>
									</template>
									<template #dropdown-items>
										<li
											class="dropdown__item"
											:class="{ active: contactSortMethod === 'recent' }"
											@click="contactSortMethod = 'recent'"
										>
											Recent
										</li>
										<li
											class="dropdown__item"
											:class="{ active: contactSortMethod === 'relevance' }"
											@click="contactSortMethod = 'relevance'"
										>
											Relevant
										</li>
									</template>
								</toggle-dropdown>
							</div>

							<v-button
								class="submit"
								size="large"
								buttonType="primary"
								@click="[addArticleModal(loggedInUser), (articleDecript = ''), (articleTitle = ''), (articleUrl = '')]"
							>
								<div class="flex">
									<span class="add-icon mr-1">
										<img src="@/assets/icons/add-icon.svg" alt="add admin icon" svg-inline />
									</span>
									<p>Add Article</p>
								</div>
							</v-button>
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
							@clear="clearContactSearch"
							searchIconColor="#3A434B"
						/>
					</div>
					<modal position="right" v-if="addArticle" :toggleClass="toggleClass" @close="toggleModalClass('addArticle')">
						<template #title>
							<h3>Add Article</h3>
						</template>

						<template #body>
							<text-input
								labelVisible
								labelColor="gray"
								v-model="articleUrl"
								width="100%"
								name="URL"
								type="url"
								placeholder="Enter article url here"
							/>

							<text-input
								labelVisible
								labelColor="gray"
								v-model="articleTitle"
								width="100%"
								name="Title"
								type="text"
								placeholder="Enter article title"
							/>

							<div class="artcile_des_conatiner">
								<label for="article_desc">Description</label>
								<textarea
									required
									rows="5"
									name="article_desc"
									id=""
									class="article_snippet"
									v-model="articleDecript"
								></textarea>
							</div>

							<div class="mb-2 mt-1">
								<radio-boxes
									:resetChecked="articleType"
									v-model="articleType"
									:datas="articleTypes"
									inputName="Article Type"
									@radiocheckUpdate="radiocheckUpdate"
								/>
							</div>

							<div class="flex flex__end" id="addArticle">
								<v-button
									:disabled="
										!articleUrl || !articleTitle || !articleDecript || !articleType || sending || !validURL(articleUrl)
									"
									class="submit"
									size="large"
									submitType="submit"
									buttonType="primary"
									ref="addArticle"
									@click="addArticleFunc"
								>
									<template v-if="!sending">Add Article</template>
									<Loader v-else color="#3B48F7" />
								</v-button>
							</div>
						</template>
					</modal>
					<!-- TODO: Refactor to use computed property to handle search result
						and reuse one InsightCard Component
					 -->
					<div class="mt-2" v-if="contactFilter === 'search'">
						<InsightCard
							:isFromAdmin="isFromAdmin"
							:isContact="true"
							type="contact_insights"
							section="news"
							v-for="(article, j) in contactSearchResult"
							:key="contactSearchResult[article]"
							:index="j"
							@openModal="
								toggleModalClass(
									'dislikeModal',
									{ type: 'contact_insights', index: j, section: 'news', ...article },
									$event
								)
							"
							@createEmailIntro="generateIntroEmail('contact_insights', article)"
							@removeDislike="toggleDislike({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)"
							:published="article.meta.published || article.content.date || article.meta.timestamp || null"
							:article="article"
							@bookmark="btnUpdateBookMarks({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)"
							@displayInsight="displaySearchItem('contact_insights', article)"
						/>
					</div>
					<div ref="tabWrapper" class="section-wrapper flex flex__space-center">
						<div ref="content" v-if="!contactFilter" class="tab-group sm flex">
							<h5 class="tab" :class="{ active: selectedTab === 'All' }" @click="selectedTab = 'All'">All</h5>
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
						<div v-if="!contactFilter" class="tab-circle" @click="scrollTab">
							<img src="@/assets/icons/arrow-right.svg" alt="arrow-right icon" svg-inline />
						</div>
					</div>
					<div class="section-wrapper">
						<p class="search--error mt-2" v-if="contactFilter === 'empty'">No data found</p>
					</div>
					<template v-if="!contactFilter">
						<InsightCard
							:isFromAdmin="isFromAdmin"
							:isContact="true"
							v-for="(article, j) in contact_insights_categories"
							:key="j"
							:index="j"
							type="contact_insights"
							section="news"
							@openModal="
								toggleModalClass(
									'dislikeModal',
									{ type: 'contact_insights', index: j, section: 'news', ...article },
									$event
								)
							"
							@createEmailIntro="generateIntroEmail('contact_insights', article)"
							@removeDislike="toggleDislike({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)"
							:published="article.meta.published || article.content.date || article.meta.timestamp || null"
							:article="article"
							@bookmark="btnUpdateBookMarks({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)"
							@displayInsight="displaySearchItem('contact_insights', article)"
						/>
						<div v-if="contact_insights_categories.length === 0" class="emptyState">
							<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
							<p class="emptyState-text">No content found!</p>
						</div>
					</template>
				</div>
				<div v-else class="news-section" ref="news-section">
					<div class="section-wrapper">
						<div class="news">
							<h3 class="section-title">News & Articles</h3>
						</div>
						<div v-if="isFromAdmin" class="relevant_add_article">
							<div class="filter-sort">
								<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem">
									<template #dropdown-wrapper>
										<p class="sort">
											Sort by <img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
										</p>
									</template>
									<template #dropdown-items>
										<li
											class="dropdown__item"
											:class="{ active: contactSortMethod === 'recent' }"
											@click="contactSortMethod = 'recent'"
										>
											Recent
										</li>
										<li
											class="dropdown__item"
											:class="{ active: contactSortMethod === 'relevance' }"
											@click="contactSortMethod = 'relevance'"
										>
											Relevant
										</li>
									</template>
								</toggle-dropdown>
							</div>

							<v-button
								class="submit"
								size="large"
								buttonType="primary"
								@click="[addArticleModal(loggedInUser), (articleDecript = ''), (articleTitle = ''), (articleUrl = '')]"
							>
								<div class="flex">
									<span class="add-icon mr-1">
										<img src="@/assets/icons/add-icon.svg" alt="add admin icon" svg-inline />
									</span>
									<p>Add Article</p>
								</div>
							</v-button>
						</div>
						<div class="emptyState">
							<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
							<p class="emptyState-text">No content found!</p>
						</div>
					</div>
				</div>
				<!-- Quotes Section -->
				<div v-if="!contactFilter && contact_insights.quotes.length > 0" class="quote-section" ref="quotes">
					<div class="section-wrapper flex flex__space-center mb-1">
						<h3 class="section-title">Quotes</h3>
						<v-button
							v-if="!showAllQuotes && allQuotes.length >= 3"
							@click="showAllQuotes = true"
							size="icon"
							buttonType="clear"
							>See all</v-button
						>
						<v-button
							v-if="showAllQuotes && allQuotes.length >= 3"
							@click="showAllQuotes = false"
							size="icon"
							buttonType="clear"
							>See less</v-button
						>
					</div>
					<div ref="quoteList" class="quote-section__content">
						<InsightCard
							:isFromAdmin="isFromAdmin"
							:isContact="true"
							type="contact_insights"
							section="quotes"
							v-for="(quote, j) in contactQuotes"
							:index="j"
							:key="
								`${quote.id}-${quote.article_url}` /* some quotes may have the same id so the article url and id are used as the key */
							"
							:published="quote.date"
							:article="quote"
							@bookmark="updateQuoteBookMarks({ type: 'contact_insights', index: j, section: 'quotes', ...quote }, $event)"
							@displayInsight="displaySearchItem('contact_insights', quote)"
							@openModal="updateQuoteDislike({ type: 'contact_insights', index: j, section: 'quotes', ...quote }, $event)"
							@removeDislike="updateQuoteDislike({ type: 'contact_insights', index: j, section: 'quotes', ...quote }, $event)"
						/>
					</div>
				</div>
				<!-- Topic Section -->
				<div v-if="!contactFilter && Object.values(contact_insights.topics).length" class="topics-section" ref="topics">
					<div class="section-wrapper">
						<h3 class="section-title">Topics</h3>
					</div>
					<PieChart class="topics-chart" :chartData="chartData.values" :labels="chartData.labels" />
				</div>
				<!-- Other Insights -->
				<div
					v-if="!contactFilter && Object.values(contact_insights.other_insights).length"
					class="otherInsight-section"
					ref="others"
				>
					<div class="section-wrapper">
						<h3 class="section-title">Other Insights</h3>
					</div>
					<InsightCard
						:isFromAdmin="isFromAdmin"
						:isContact="true"
						type="contact_insights"
						section="other_insights"
						v-for="(otherInsight, j) in contact_other_insights"
						:key="contact_other_insights[otherInsight]"
						:index="j"
						@openModal="
							toggleModalClass(
								'dislikeModal',
								{ type: 'contact_insights', index: j, section: 'other_insights', ...otherInsight },
								$event
							)
						"
						@createEmailIntro="generateIntroEmail('other_insights', article)"
						@removeDislike="
							toggleDislike({ type: 'contact_insights', index: j, section: 'other_insights', ...otherInsight }, $event)
						"
						:published="otherInsight.meta.published || otherInsight.meta.timestamp"
						:article="otherInsight"
						@bookmark="
							btnUpdateBookMarks({ type: 'contact_insights', index: j, section: 'other_insights', ...otherInsight }, $event)
						"
						@displayInsight="displaySearchItem('contact_insights', otherInsight)"
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
									<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
								</h3>
							</template>
							<template #dropdown-items>
								<li class="dropdown__item" @click="searchType = 'company_research'">Company Research</li>
								<li class="dropdown__item" @click="searchType = 'contact_research'">Contact Research</li>
							</template>
						</toggle-dropdown>
					</div>
					<div v-if="showSnapshots" class="snapshot-section">
						<h3 class="section-title">Snapshot</h3>
						<div v-if="company_insights.snapshot" class="snapshot-info">
							<div class="flex flex__item-center postion" v-if="company_insights.snapshot.mentions">
								<span>
									<img src="@/assets/icons/articles.svg" alt="company article icon" svg-inline />
								</span>
								<p class="ml" v-if="company_insights.snapshot.mentions">
									Mentioned in
									<span
										class="main-info"
										@click="scrollToSection((section = { title: 'News', ref: 'company-news-section' }))"
										>{{ company_insights.snapshot.mentions }} relevant articles</span
									>
									in the past year
								</p>
							</div>
							<div class="flex flex__item-center postion" v-if="company_insights.snapshot.last_funding">
								<img src="@/assets/icons/fund.svg" alt="funds icon" svg-inline />
								<p class="ml">
									Raised a round of
									<span
										class="main-info"
										@click="
											scrollToSection(
												(section = {
													title: 'Funding',
													ref: 'company-tab',
													activate: () => switchToCompanyTab('funding')
												})
											)
										"
										>funding</span
									>
									in
									{{ company_insights.snapshot.last_funding | moment('MMMM YYYY') }}
								</p>
							</div>
							<div class="flex flex__item-center postion" v-if="company_insights.snapshot.interests.length > 0">
								<span>
									<img src="@/assets/icons/convo-bubble.svg" alt="convo icon" svg-inline />
								</span>
								<p class="ml">
									Speaks most about
									<span class="main-info" v-for="(interest, i) in company_insights.snapshot.interests" :key="i">
										{{ interest }}
										<template v-if="i !== company_insights.snapshot.interests.length - 1">, </template>
									</span>
								</p>
							</div>
							<div class="flex flex__item-center postion" v-if="getCrunchbaseUrl">
								<img style="width: 24px" src="@/assets/icons/crunchbase.svg" alt="crunchbase icon" svg-inline />
								<p class="ml">
									Company is on
									<a class="main-info" v-if="getCrunchbaseUrl" :href="getCrunchbaseUrl" target="_blank">Crunchbase</a>
								</p>
							</div>

							<div class="flex flex__item-center postion" v-if="company_insights.jobs.length > 0">
								<img src="@/assets/icons/jobs.svg" alt="open jobs icon" svg-inline />
								<p class="ml">Have {{ company_insights.snapshot.jobs }} <span class="main-info">open jobs</span></p>
							</div>
						</div>
					</div>
				</div>

				<div v-if="showNewsSection && Object.keys(company_insights.news).length" class="news-section" ref="company-news-section">
					<div class="section-wrapper">
						<div class="news">
							<h3 class="section-title">News</h3>
							<div class="filter-sort">
								<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem">
									<template #dropdown-wrapper>
										<p class="sort">
											Sort by
											<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
										</p>
									</template>
									<template #dropdown-items>
										<li
											class="dropdown__item"
											:class="{ active: companySortMethod === 'recent' }"
											@click="companySortMethod = 'recent'"
										>
											Recent
										</li>
										<li
											class="dropdown__item"
											:class="{ active: companySortMethod === 'relevance' }"
											@click="companySortMethod = 'relevance'"
										>
											Relevant
										</li>
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
							@clear="clearCompanySearch"
							searchIconColor="#3A434B"
						/>
					</div>
					<div class="mt-2" v-if="companyFilter === 'search'">
						<InsightCard
							:isFromAdmin="isFromAdmin"
							:isContact="false"
							type="company_insights"
							section="news"
							v-for="(article, j) in companySearchResult"
							:key="companySearchResult[article]"
							:index="j"
							@openModal="
								toggleModalClass(
									'dislikeModal',
									{ type: 'company_insights', index: j, section: 'news', ...article },
									$event
								)
							"
							@createEmailIntro="generateIntroEmail('company_insights', article)"
							@removeDislike="toggleDislike({ type: 'company_insights', index: j, section: 'news', ...article }, $event)"
							:published="article.meta.published || article.content.date || article.meta.timestamp || null"
							:article="article"
							@bookmark="btnUpdateBookMarks({ type: 'company_insights', index: j, section: 'news', ...article }, $event)"
							@displayInsight="displaySearchItem('company_insights', article)"
						/>
					</div>
					<div v-if="!companyFilter" class="section-wrapper tab-group flex" ref="company-tab">
						<h5
							v-for="(tab, index) in companyTabs"
							:key="index"
							class="tab"
							:class="{ active: tab === companyTab }"
							@click="switchToCompanyTab(tab)"
						>
							<p>{{ tab }}</p>
						</h5>
					</div>
					<div class="section-wrapper">
						<p class="search--error mt-2" v-if="companyFilter === 'empty'">No data found</p>
					</div>
					<template v-if="!companyFilter">
						<InsightCard
							:isFromAdmin="isFromAdmin"
							:isContact="false"
							type="company_insights"
							section="news"
							v-for="(article, j) in company_insights_categories"
							:key="company_insights_categories[article]"
							:index="j"
							@openModal="
								toggleModalClass(
									'dislikeModal',
									{ type: 'company_insights', index: j, section: 'news', ...article },
									$event
								)
							"
							@createEmailIntro="generateIntroEmail('company_insights', article)"
							@removeDislike="toggleDislike({ type: 'company_insights', index: j, section: 'news', ...article })"
							:published="article.meta.published || article.content.date || article.meta.timestamp || null"
							:article="article"
							@bookmark="btnUpdateBookMarks({ type: 'company_insights', index: j, section: 'news', ...article }, $event)"
							@displayInsight="displaySearchItem('company_insights', article)"
						/>
						<div v-if="company_insights_categories.length === 0" class="emptyState">
							<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
							<p class="emptyState-text">No content found!</p>
						</div>
					</template>
				</div>

				<div v-else class="news-section" ref="company-news-section">
					<div class="section-wrapper">
						<div class="news mt-1">
							<h3 class="section-title">News</h3>
						</div>
						<div class="emptyState">
							<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
							<p class="emptyState-text">No content found!</p>
						</div>
					</div>
				</div>
				<div class="jobs-section" v-if="company_insights.jobs.length > 0">
					<div class="jobs-header flex flex__space-center">
						<h3 class="section-title">Open Jobs</h3>
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
			@close="toggleModalClass('dislikeModal', '')"
			maxWidth="400px"
			borderRadius="12px"
			marginTop="10%"
			:showInfo="true"
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
							style="display: block"
							marginBottom="24px"
							id="dislikeOption"
							:options="dislikeOptions"
							name="dislikeChoices"
							v-model="dislikeOption"
						/>
					</p>

					<form v-if="dislikeOption === 'Other'" action="">
						<label class="textLabel" for="dislikeForm">Comment</label>
						<textarea class="textarea" id="dislikeForm" name="dislikeForm" placeholder="Comment here..." v-model="otherComment">
						</textarea>
					</form>

					<div class="modal__content-btn">
						<v-button class="config__btn" buttonType="primary" size="full" @click="dislikeResearch">
							<template v-if="!dislikeLoading">Submit</template>
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
