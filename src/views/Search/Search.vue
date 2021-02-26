<template>
	<div class="container container--lg">
		<nav class="navbar">
			<div class="nav-item logo">
				<img src="@/assets/icons/logo.svg" svg-inline />
				<h3 class="ml-1 logo-text">Volley App</h3>
			</div>
		</nav>
		<main class="main-section">
			<div class="hero">
				<h2 class="hero-title">More refined <span>research</span> .</h2>
				<p class="hero-desc">
					We provide industry-leading protection for the entire customer journey. Our verification system reduces chargebacks,
					manual reviews and false positives to increase approval rates and reviews.
				</p>
			</div>

			<ValidationObserver v-slot="{ invalid }">
				<div class="search-wrapper">
					<v-text-input class="search-input" rules="required" placeholder="Name" name="name" v-model="payload.full_name" />
					<v-text-input class="search-input" rules="required" placeholder="Title" name="title" v-model="payload.role" />
					<v-select
						:options="companies"
						@update="onChildUpdate"
						placeholder="Select Country"
						name="company"
						v-model="company"
						class="search-input"
						required
					></v-select>
					<!-- <button class="btn btn-primary" :disabled="invalid" v-on:click="submitSearch">Search</button> -->
					<v-button :disabled="invalid" @click="submitSearch">Search </v-button>
				</div>
			</ValidationObserver>
			<p class="more-filter" @click="showMoreSearch = !showMoreSearch">
				More search options <img src="@/assets/icons/arrow-drop-down.svg" class="ml-1" svg-inline />
			</p>
			<template v-if="showMoreSearch">
				<div class="table__wrapper mb-3">
					<table class="table">
						<thead class="table__header">
							<tr>
								<th class="table__header-item">Contact research</th>
								<th class="table__header-item">Include</th>
								<th class="table__header-item">Keywords</th>
								<th class="table__header-item"></th>
							</tr>
						</thead>
						<tbody>
							<tr class="table__header-space"></tr>
							<tr class="table__row">
								<td class="table__row-item">Events/conferences/Webinars</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											type="checkbox"
											value="events"
											true-value="true"
											checked
											false-value="false"
											@change="onOptionToggle('events', 'contact', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="event-keywords"
										v-model="keywords.events"
										@change="onKeywordsChange('events', 'contact', $event)"
									/>
								</td>
								<td class="table__row-item">
									<v-checkbox
										class=""
										name="all"
										@change="applyAllOptionsToggle"
										:disabled="disableApplyAll"
										:truthValue="applyAllChecked"
									>
										Apply keywords to all
									</v-checkbox>
								</td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">Blogs/Articles</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											value="articles"
											type="checkbox"
											checked
											true-value="true"
											false-value="false"
											@change="onOptionToggle('blogs', 'contact', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="blog-keywords"
										v-model="keywords.blogs"
										@change="onKeywordsChange('blogs', 'contact', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">Interviews/feature</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											value="articles"
											type="checkbox"
											checked
											true-value="true"
											false-value="false"
											@change="onOptionToggle('features', 'contact', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="features-keywords"
										v-model="keywords.features"
										@change="onKeywordsChange('features', 'contact', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">Awards</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											value="articles"
											type="checkbox"
											checked
											true-value="true"
											false-value="false"
											@change="onOptionToggle('awards', 'contact', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="awards-keywords"
										v-model="keywords.awards"
										@change="onKeywordsChange('awards', 'contact', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">New role/job/promotion</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											value="articles"
											type="checkbox"
											checked
											true-value="true"
											false-value="false"
											@change="onOptionToggle('promotion', 'contact', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="promotion-keywords"
										v-model="keywords.promotion"
										@change="onKeywordsChange('promotion', 'contact', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">Videos</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											value="articles"
											type="checkbox"
											checked
											true-value="true"
											false-value="false"
											@change="onOptionToggle('videos', 'contact', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="videos-keywords"
										v-model="keywords.videos"
										@change="onKeywordsChange('videos', 'contact', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">Podcasts</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											value="articles"
											type="checkbox"
											checked
											true-value="true"
											false-value="false"
											@change="onOptionToggle('podcasts', 'contact', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="podcasts-keywords"
										v-model="keywords.podcasts"
										@change="onKeywordsChange('podcasts', 'contact', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">Linkedin activity</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											value="articles"
											type="checkbox"
											checked
											true-value="true"
											false-value="false"
											@change="onOptionToggle('linkedin_activity', 'contact', $event)" /><span
											class="toggle-icon"
										></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="linkedin_activity-keywords"
										v-model="keywords.linkedin_activity"
										@change="onKeywordsChange('linkedin_activity', 'contact', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">Twitter activity</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											value="articles"
											type="checkbox"
											checked
											true-value="true"
											false-value="false"
											@change="onOptionToggle('twitter_activity', 'contact', $event)" /><span
											class="toggle-icon"
										></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="twitter_activity-keywords"
										v-model="keywords.twitter_activity"
										@change="onKeywordsChange('twitter_activity', 'contact', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- company search -->
				<div class="table__wrapper">
					<table class="table">
						<thead class="table__header">
							<tr>
								<th class="table__header-item">Company research</th>
								<th class="table__header-item">Include</th>
								<th class="table__header-item">Keywords</th>
								<th class="table__header-item"></th>
							</tr>
						</thead>
						<tbody>
							<tr class="table__header-space"></tr>
							<tr class="table__row">
								<td class="table__row-item">Job postings</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											type="checkbox"
											value="events"
											true-value="true"
											checked
											false-value="false"
											@change="onOptionToggle('job_postings', 'company', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="job_postings-keywords"
										v-model="companyKeywords.job_postings"
										@change="onKeywordsChange('job_postings', 'company', $event)"
									/>
								</td>
								<td class="table__row-item">
									<v-checkbox
										class=""
										name="all-company"
										@change="allCompanyOptionsToggle"
										:disabled="disableCompanyAll"
										:truthValue="AllCompanyChecked"
									>
										Apply keywords to all
									</v-checkbox>
								</td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">Mergers & Acquisitions</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											type="checkbox"
											value="events"
											true-value="true"
											checked
											false-value="false"
											@change="onOptionToggle('mergers_and_acquisitions', 'company', $event)" /><span
											class="toggle-icon"
										></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name="mergers_and_acquisitions-keywords"
										v-model="companyKeywords.mergers_and_acquisitions"
										@change="onKeywordsChange('mergers_and_acquisitions', 'company', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">Fundraise/ IPO</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											type="checkbox"
											value="events"
											true-value="true"
											checked
											false-value="false"
											@change="onOptionToggle('ipo', 'company', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name=" ipo-keywords"
										v-model="companyKeywords.ipo"
										@change="onKeywordsChange('ipo', 'company', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">New product launch</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											type="checkbox"
											value="events"
											true-value="true"
											checked
											false-value="false"
											@change="onOptionToggle('product_launch', 'company', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name=" product_launch-keywords"
										v-model="companyKeywords.product_launch"
										@change="onKeywordsChange('product_launch', 'company', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
							<tr class="table__row">
								<td class="table__row-item">Other news/press releases</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											type="checkbox"
											value="events"
											true-value="true"
											checked
											false-value="false"
											@change="onOptionToggle('others', 'company', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										name=" others-keywords"
										v-model="companyKeywords.others"
										@change="onKeywordsChange('others', 'company', $event)"
									/>
								</td>
								<td class="table__row-item"></td>
							</tr>
						</tbody>
					</table>
				</div>
			</template>
		</main>
	</div>
</template>

<script src="./search.js"></script>
<style lang="scss" scoped src="./search.scss"></style>
