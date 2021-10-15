<template>
	<div>
		<VHeaderitem />
		<template v-if="loading">
			<PageLoader />
		</template>
		<main class="hook-page" v-else>
			<div class="hookArticles" :class="articlesOpened ? 'open' : 'closed'">
				<!-- <div class="hookArticles__header mb-1">
					<h3 class="section-title">News & Articles</h3>
				</div> -->
				<!-- <div v-if="hookArticles.length" class="hookArticles__body">
					<EmailHookCard
						v-for="(article, j) in hookArticles"
						:key="j"
						:article="article"
						:published="article.meta.published"
						@displayInsight="displaySearchItem(article)"
					/>
				</div> -->

				<div class="searched__wrapper-content">
					<div class="searched__wrapper-header">
						<toggle-dropdown itemPadding="0">
							<template #dropdown-wrapper>
								<h3 class="title">
									<template v-if="searchType === 'contact_insights'">Contact Insights</template>
									<template v-else>Company Insights</template>
									<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
								</h3>
							</template>
							<template #dropdown-items>
								<li class="dropdown__item" @click="searchType = 'company_insights'">Company Insights</li>
								<li class="dropdown__item" @click="searchType = 'contact_insights'">Contact Insights</li>
							</template>
						</toggle-dropdown>
					</div>
					<div class="" v-if="searchType === 'contact_insights'">
						<div class="news-section mt-2">
							<div class="section-wrapper top-section">
								<div class="news">
									<h3 class="section-title">News & Articles</h3>
									<div class="filter-sort flex flex__item-center" v-if="contact_insights_categories.length">
										<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem" class="mr-1">
											<template #dropdown-wrapper>
												<p class="sort">
													Sort by
													<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
												</p>
											</template>
											<template #dropdown-items>
												<li class="dropdown__item" @click="contactSortMethod = 'recent'">Recent</li>
												<li class="dropdown__item" @click="contactSortMethod = 'relevance'">Relevant</li>
											</template>
										</toggle-dropdown>

										<span class="btn-separator"></span>

										<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem" class="btn-margin" :closeOnClick="false">
											<template #dropdown-wrapper>
												<p class="sort">
													Filter
													<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
												</p>
											</template>
											<template #dropdown-items>
												<li class="dropdown__item">
													<div class="flex flex__item-center">
														<input
															id="bookmarks"
															class="check-input"
															type="checkbox"
															:value="bookmarkFilterOption"
															v-model="filterContactOptions"
														/>
														<label for="bookmarks">Bookmarks</label>
													</div>
												</li>
												<li class="dropdown__item">
													<div class="flex flex__item-center">
														<input
															id="intros"
															class="check-input"
															type="checkbox"
															:value="introFilterOption"
															v-model="filterContactOptions"
														/>
														<label for="intros">Email Intros</label>
													</div>
												</li>
											</template>
										</toggle-dropdown>
									</div>
								</div>
								<div class="flex flex__space-center">
									<div ref="content" class="tab-group sm flex">
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
									<div class="tab-circle" @click="scrollTab">
										<img src="@/assets/icons/arrow-right.svg" alt="arrow right icon" svg-inline />
									</div>
								</div>
							</div>
							<template v-if="filterContactArticles(contact_insights_categories).length">
								<InsightCard
									v-for="(article, j) in filterContactArticles(contact_insights_categories)"
									:key="contact_insights_categories[article]"
									:published="
										article.meta.published
											? article.meta.published
											: article.meta.timestamp
											? article.meta.timestamp
											: null
									"
									:article="article"
									@openModal="
										toggleModalClass(
											'dislikeModal',
											{ type: 'contact_insights', index: j, section: 'news', ...article },
											$event
										)
									"
									@removeDislike="toggleDislike({ type: 'contact_insights', index: j, section: 'news', ...article })"
									@displayInsight="displaySearchItem(article, 'contact_insights')"
									@bookmark="
										btnUpdateBookMarks({ type: 'contact_insights', index: j, section: 'news', ...article }, $event)
									"
								/>
							</template>
							<div class="emptyState-wrapper" v-else>
								<div class="emptyState">
									<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
									<p class="emptyState-text">No content found!</p>
								</div>
							</div>
						</div>

						<!-- Other insights section -->
						<div class="otherInsight-section" ref="others" v-if="filterContactArticles(contact_other_insights).length">
							<div class="section-wrapper" v-if="filterContactArticles(contact_other_insights)">
								<h3 class="section-title">Other Insights</h3>
							</div>
							<InsightCard
								v-for="(article, j) in filterContactArticles(contact_other_insights)"
								:key="contact_other_insights[article]"
								:published="
									article.meta.published ? article.meta.published : article.meta.timestamp ? article.meta.timestamp : null
								"
								:article="article"
								@openModal="
									toggleModalClass(
										'dislikeModal',
										{ type: 'contact_insights', index: j, section: 'other_insights', ...article },
										$event
									)
								"
								@removeDislike="
									toggleDislike({ type: 'contact_insights', index: j, section: 'other_insights', ...article })
								"
								@bookmark="
									btnUpdateBookMarks(
										{ type: 'contact_insights', index: j, section: 'other_insights', ...article },
										$event
									)
								"
								@displayInsight="displaySearchItem(article, 'contact_insights')"
							/>
						</div>
					</div>

					<div class="" v-if="searchType === 'company_insights'">
						<div class="news-section mt-2">
							<div class="section-wrapper">
								<div class="news">
									<h3 class="section-title">News</h3>
									<div class="filter-sort flex flex__item-center" v-if="company_insights_categories.length">
										<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem" class="mr-1">
											<template #dropdown-wrapper>
												<p class="sort">
													Sort by
													<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
												</p>
											</template>
											<template #dropdown-items>
												<li class="dropdown__item" @click="companySortMethod = 'recent'">Recent</li>
												<li class="dropdown__item" @click="companySortMethod = 'relevance'">Relevant</li>
											</template>
										</toggle-dropdown>

										<span class="btn-separator"></span>

										<toggle-dropdown itemPadding=".5rem 0 .5rem .5rem" class="btn-margin" :closeOnClick="false">
											<template #dropdown-wrapper>
												<p class="sort">
													Filter
													<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="dropdown icon" svg-inline />
												</p>
											</template>
											<template #dropdown-items>
												<li class="dropdown__item">
													<div class="flex flex__item-center">
														<input
															id="bookmarks"
															class="check-input"
															type="checkbox"
															:value="bookmarkFilterOption"
															v-model="filterCompanyOptions"
														/>
														<label for="bookmarks">Bookmarks</label>
													</div>
												</li>
												<li class="dropdown__item">
													<div class="flex flex__item-center">
														<input
															id="intros"
															class="check-input"
															type="checkbox"
															:value="introFilterOption"
															v-model="filterCompanyOptions"
														/>
														<label for="intros">Email Intros</label>
													</div>
												</li>
											</template>
										</toggle-dropdown>
									</div>
								</div>
								<div class="flex flex__space-center">
									<div ref="content" class="tab-group sm flex">
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
									<div class="tab-circle" @click="scrollTab">
										<img src="@/assets/icons/arrow-right.svg" alt="arrow right icon" svg-inline />
									</div>
								</div>
							</div>
							<template v-if="filterCompanyArticles(company_insights_categories).length">
								<InsightCard
									v-for="(article, j) in filterCompanyArticles(company_insights_categories)"
									:key="company_insights_categories[article]"
									:published="
										article.meta.published
											? article.meta.published
											: article.meta.timestamp
											? article.meta.timestamp
											: null
									"
									:article="article"
									@openModal="
										toggleModalClass(
											'dislikeModal',
											{ type: 'company_insights', index: j, section: 'news', ...article },
											$event
										)
									"
									@removeDislike="toggleDislike({ type: 'company_insights', index: j, section: 'news', ...article })"
									@bookmark="
										btnUpdateBookMarks({ type: 'company_insights', index: j, section: 'news', ...article }, $event)
									"
									@displayInsight="displaySearchItem(article, 'company_insights')"
								/>
							</template>
							<div class="emptyState-wrapper" v-else>
								<div class="emptyState">
									<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
									<p class="emptyState-text">No content found!</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- <div class="emptyState-wrapper" v-else>
					<div class="emptyState">
						<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
						<p class="emptyState-text">No content found!</p>
					</div>
				</div> -->
			</div>
			<div class="emailgen-group" :class="articlesOpened ? 'open' : 'closed'">
				<template v-if="quotedArticle">
					<div class="hook-section">
						<div class="toggle-arrow" :class="articlesOpened ? 'open' : 'closed'" @click="toggleArticlePane">
							<img src="@/assets/icons/hook-back-arrow.svg" alt="back-arrow icon" svg-inline />
						</div>
						<div class="hook-section__header">
							<h4 class="hook-section__header-text">Personalized Email Intros</h4>
						</div>

						<div class="section__1" v-if="contactDetails">
							<h5 class="title">Contact Details</h5>
							<div class="contact__details">
								<div class="text__initials">
									<template v-if="searchImage">
										<img class="searchImage" :src="searchImage" alt="" />
									</template>
									<template v-else>
										{{
											contact_details.full_name
												.match(/\b(\w)/g)
												.join('')
												.toUpperCase()
										}}
									</template>
								</div>
								<div class="text__name__role">
									<div class="name">{{ contactDetails.full_name }}</div>
									<div class="role">{{ contactDetails.role }}</div>
								</div>
							</div>
							<div class="section section__2">
								<div class="contact__address">
									<div class="title">Company</div>
									<div class="text">{{ contactDetails.company }}</div>
								</div>
								<div class="contact__icon__group">
									<a v-if="socials.twitter" :href="validateURL(socials.twitter)" target="_blank"
										><img src="@/assets/icons/twitter-icon.svg" alt="twitter icon" svg-inline
									/></a>
									<a v-if="socials.linkedin" :href="validateURL(socials.linkedin)" target="_blank"
										><img src="@/assets/icons/linkedin-icon.svg" alt="linkedin icon" svg-inline
									/></a>
									<a v-if="socials.website" :href="validateURL(socials.website)" target="_blank"
										><img src="@/assets/icons/world-icon.svg" alt="website icon" svg-inline
									/></a>
									<a v-if="socials.crunchbase" :href="validateURL(socials.crunchbase)" target="_blank"
										><img src="@/assets/icons/crunchbase.svg" alt="crunchbase icon" svg-inline
									/></a>
								</div>
							</div>
						</div>
						<div class="section__3">
							<div class="emptyState email-intro__group" v-if="!emailHooks.length">
								<img v-if="!loadIcon" src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
								<p v-if="!loadIcon" class="emptyState-text">No content found!</p>

								<div v-if="loadIcon" class="spinner">
									<LoadIcon />
								</div>

								<v-button
									:disabled="loadIcon"
									class="generateBtn rad"
									size="full"
									buttonType="secondary"
									@click="generateHook"
								>
									<template>Generate Email Intro</template>
									<!-- <Loader v-else /> -->
								</v-button>
							</div>

							<template v-else>
								<div class="email-intro__group">
									<template>
										<div class="email-intro__single" v-for="(hook, index) in emailHooks" :key="index">
											<div>
												<textarea
													v-if="editText[index]"
													class="subjectTextarea"
													id="articleSubject"
													name="articleSubject"
													v-model="hook.email.subject"
												></textarea>

												<div class="email-intro__single__header" v-else @click="showIntroHook(index)">
													<p class="subject" :ref="`emailSubject-${index}`">
														{{ hook.email.subject }}
													</p>

													<button>
														<img src="@/assets/icons/email-hook-arrow.svg" alt="down-arrow icon" svg-inline />
													</button>
												</div>
											</div>

											<div v-if="displayEmail[index]" :ref="`content-${index}`" class="email-intro__single__content">
												<textarea
													v-if="editText[index]"
													class="hookTextarea"
													id="articleHook"
													name="articleHook"
													v-model="hook.email.hook"
												></textarea>
												<p v-else class="text" :ref="`emailContentText-${index}`">
													{{ hook.email.hook }}
												</p>
												<div class="flex flex-end" v-if="editText[index]">
													<button @click="editHook(hook, index)" style="margin-right: 9px">
														<img class="icon" src="@/assets/icons/check.svg" alt="save icon" svg-inline />
													</button>
													<button @click="cancelEdit(index)">
														<img class="icon" src="@/assets/icons/cancel.svg" alt="cancel icon" svg-inline />
													</button>
												</div>
												<div v-else class="editHook-icons">
													<button>
														<img
															class="icon"
															:ref="`copyBtn-${index}`"
															@click="copyIntroEmail(hook.email.subject, hook.email.hook, index)"
															src="@/assets/icons/copy-icon.svg"
															alt="copy icon"
															svg-inline
														/>
													</button>
													<button>
														<img
															class="icon"
															:ref="`editBtn-${index}`"
															@click="editContent(index, hook)"
															src="@/assets/icons/edit-icon.svg"
															alt="edit icon"
															svg-inline
														/>
													</button>
													<button>
														<img
															@click="deleteHook(hook)"
															:ref="`deleteBtn-${index}`"
															src="@/assets/icons/delete-icon.svg"
															alt="delete icon"
															svg-inline
														/>
													</button>
												</div>
											</div>
										</div>
									</template>
									<v-button
										:disabled="emailHooks.length >= 5"
										:title="emailHooks.length >= 5 ? 'Maximum of 5 email hooks' : ''"
										class="generateBtn rad"
										size="full"
										buttonType="secondary"
										@click="generateHook"
									>
										<template v-if="!btnLoading">Generate more options</template>
										<Loader v-else />
									</v-button>
								</div>
							</template>
						</div>
					</div>

					<div v-if="quotedArticle" class="article-section" ref="main">
						<div v-if="quotedArticle" class="item__detail mt-2">
							<h4 class="item__detail-title mr-1">{{ quotedArticle.title }}</h4>
							<a class="item__detail-url" :href="quotedArticle.url" target="_blank">
								<img src="@/assets/icons/link.svg" alt="link icon" svg-inline />
							</a>
							<p class="item__detail-date" v-if="quotedArticle.meta.published || quotedArticle.date">
								{{ new Date(quotedArticle.meta.published || quotedArticle.date) | moment('Do, MMMM YYYY') }}
							</p>
							<div
								class="filter__tags"
								v-if="quotedArticle.meta.content && Object.keys(quotedArticle.meta.content).length > 0"
							>
								<img class="tag__badge" src="@/assets/icons/tag.svg" alt="" />
								<div class="tag__wrapper">
									<span v-for="(tag, i) in quotedArticle.meta.content.tags" :key="i"
										><c-tag v-if="tag !== null || tag !== ''">{{ tag }}</c-tag></span
									>
								</div>
							</div>

							<template>
								<div
									class="item__detail-content"
									v-if="quotedArticle.meta.content && Object.keys(quotedArticle.meta.content).length > 0"
								>
									<div class="item-content" v-html="quotedArticle.meta.content.html"></div>
								</div>
								<iframe
									v-else
									class="mt-2 iframe-wrapper"
									id="myframe"
									width="100%"
									height="500"
									:src="quotedArticle.url"
									title=""
								></iframe>
							</template>
						</div>
					</div>
				</template>
				<div v-else class="emptyState article">
					<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
					<p class="emptyState-text">No content found!</p>
				</div>
			</div>
		</main>

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
						<textarea class="textarea" id="dislikeForm" name="dislikeForm" placeholder="Comment here..."> </textarea>
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

<script src="./emailHook.js"></script>
<style lang="scss" scoped src="./emailHook.scss"></style>
