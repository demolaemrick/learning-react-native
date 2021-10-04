<template>
	<div>
		<VHeaderitem />
		<main class="hook-page">
			<div class="hookArticles" :class="articlesOpened ? 'open' : 'closed'">
				<div class="hookArticles__header mb-1">
					<h3 class="section-title">News & Articles</h3>
				</div>
				<div class="hookArticles__body">
					<!-- <EmailHookCard
						v-for="(article, j) in contact_insights_categories"
						:key="j"
						:published="article.meta.published"
						:article="article"
						@displayInsight="displaySearchItem('contact_insights', article)"
					/> -->
				</div>
			</div>
			<div class="emailgen-group" :class="articlesOpened ? 'open' : 'closed'">
				<template v-if="quotedArticle && quotedArticle.meta">
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
								<div class="text__initials" v-if="contactDetails.full_name">
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
								<img src="@/assets/icons/no-content.svg" alt="empty content" svg-inline />
								<p class="emptyState-text">No content found!</p>
								<v-button class="generateBtn rad" size="full" buttonType="secondary" @click="generateHook">
									<template v-if="!loading">Generate Email Intro</template>
									<Loader v-else />
								</v-button>
							</div>

							<template v-else>
								<div class="email-intro__group">
									<template>
										<div class="email-intro__single" v-for="(hook, index) in emailHooks" :key="index">
											<div class="email-intro__single__header">
												<textarea
													v-if="editText[index]"
													class="subjectTextarea"
													id="articleSubject"
													name="articleSubject"
													v-model="hook.email.subject"
												></textarea>

												<p v-else @click="showIntroHook(index)" class="subject" :ref="`emailSubject-${index}`">
													{{ hook.email.subject }}
												</p>

												<button v-if="!editText[index]" @click="showIntroHook(index)">
													<img src="@/assets/icons/email-hook-arrow.svg" alt="down-arrow icon" svg-inline />
												</button>
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
									<v-button class="generateBtn rad" size="full" buttonType="secondary" @click="generateHook">
										<template v-if="!loading">Generate more options</template>
										<Loader v-else />
									</v-button>
								</div>
							</template>
						</div>
					</div>

					<div v-if="quotedArticle && quotedArticle.meta" class="article-section" ref="main">
						<div class="flex flex__end">
							<v-button @click="toggleModalClass('hookModal')" class="mt-1 mb-1" size="large" buttonType="primary"
								>Create Email Intro</v-button
							>
						</div>
						<div v-if="quotedArticle && quotedArticle.meta" class="item__detail">
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
									<span v-for="(tag, i) in quotedArticle.meta.content.tag" :key="i"
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

		<!-- Hook Modal -->
		<modal
			position="center"
			v-if="hookModal"
			:active="true"
			:toggleClass="toggleClass"
			@close="toggleModalClass('hookModal', '')"
			maxWidth="492px"
			borderRadius="12px"
			marginTop="10%"
			:showInfo="true"
		>
			<template #title>
				<h4 class="modal__header-title">Create a personalized email intro</h4>
			</template>

			<template #body>
				<form @submit.prevent="">
					<ValidationObserver v-slot="{ invalid }" color="#ff0000">
						<div class="auth-input">
							<label class="hook-label">Subject</label>
							<text-input
								type="text"
								rules="required"
								labelColor="gray"
								v-model="createdEmailHook.subject"
								width="100%"
								name="Subject"
								placeholder="Enter email subject"
							/>
							<textarea
								class="hookTextarea"
								id="emailHook"
								name="emailHook"
								v-model="createdEmailHook.hook"
								placeholder="Input your email intro..."
							>
							</textarea>

							<div class="flex flex__end">
								<v-button @click="addHook" :disabled="invalid || !createdEmailHook.hook" submitType="submit">
									<template v-if="!loading">Save</template>
									<Loader v-else />
								</v-button>
							</div>
						</div>
					</ValidationObserver>
				</form>
			</template>
		</modal>
	</div>
</template>

<script src="./emailHook.js"></script>
<style lang="scss" scoped src="./emailHook.scss"></style>
