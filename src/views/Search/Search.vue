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
						name="company-input"
						v-model="company"
						class="search-input"
						required
					></v-select>
					<v-button :disabled="invalid" @click="submitSearch">Search </v-button>
				</div>
			</ValidationObserver>
			<p class="more-filter" @click="showMoreSearch = !showMoreSearch">
				More search options <img src="@/assets/icons/arrow-drop-down.svg" class="ml-1" svg-inline />
			</p>
			<template v-if="showMoreSearch">
				<div class="table__wrapper mb-3">
					<!-- Contact search -->
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
							<tr class="table__row" v-for="(keyword, itemKey) in keywords" :key="itemKey">
								<td class="table__row-item">
									<template v-if="itemKey === 'events'"> Events/conferences/Webinars</template>
									<template v-else-if="itemKey === 'blogs'"> Blogs/Articles</template>
									<template v-else-if="itemKey === 'features'"> Interviews/feature</template>
									<template v-else-if="itemKey === 'awards'"> Awards</template>
									<template v-else-if="itemKey === 'linkedin_activity'">Linkedin activity</template>
									<template v-else-if="itemKey === 'twitter_activity'"> Twitter activity</template>
									<template v-else-if="itemKey === 'promotion'"> New role/job/promotion</template>
									<template v-else-if="itemKey === 'videos'">Videos</template>
									<template v-else>Podcasts</template>
								</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											type="checkbox"
											:value="itemKey"
											true-value="true"
											checked
											false-value="false"
											@change="onOptionToggle(itemKey, 'contact', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										:name="`${itemKey}-keywords`"
										v-model="keywords[itemKey]"
										@change="onKeywordsChange(itemKey, 'contact', $event)"
									/>
								</td>
								<td class="table__row-item">
									<template v-if="itemKey === 'events'">
										<v-checkbox
											class=""
											name="all"
											@change="applyAllOptionsToggle"
											:disabled="disableApplyAll"
											:truthValue="applyAllChecked"
										>
											Apply keywords to all
										</v-checkbox>
									</template>
								</td>
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
							<tr class="table__row" v-for="(keyword, itemKey) in companyKeywords" :key="itemKey">
								<td class="table__row-item">
									<template v-if="itemKey === 'job_postings'"> Job postings</template>
									<template v-else-if="itemKey === 'mergers_and_acquisitions'"> Mergers & Acquisitions</template>
									<template v-else-if="itemKey === 'ipo'"> Fundraise/ IPO</template>
									<template v-else-if="itemKey === 'product_launch'">New product launch</template>
									<template v-else>Other news/press releases</template>
								</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											type="checkbox"
											value="events"
											true-value="true"
											checked
											false-value="false"
											@change="onOptionToggle(itemKey, 'company', $event)" /><span class="toggle-icon"></span
									></label>
								</td>
								<td class="table__row-item">
									<v-text-input
										class="keywords-input"
										placeholder="Keywords ( seperated by comma )"
										:name="`${itemKey}-keywords`"
										v-model="companyKeywords[itemKey]"
										@change="onKeywordsChange(itemKey, 'company', $event)"
									/>
								</td>
								<td class="table__row-item">
									<template v-if="itemKey === 'job_postings'">
										<v-checkbox
											class=""
											name="all-company"
											@change="allCompanyOptionsToggle"
											:disabled="disableCompanyAll"
											:truthValue="AllCompanyChecked"
										>
											Apply keywords to all
										</v-checkbox>
									</template>
								</td>
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
