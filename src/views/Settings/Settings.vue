<template>
	<div class="more__settings__modal__wrapper">
		<div class="more__settings__modal__header">
			<div class="more__settings__modal__header__btn__wrapper">
				<v-button class="config__btn__close" @click="checkSettingChanges">
					<div class="btn__content__wrapper">
						<span class="icon pr-1">
							<img src="@/assets/icons/close-sign.svg" class="ml-1" svg-inline />
						</span>
						<span class="text">Close</span>
					</div>
				</v-button>
			</div>
		</div>
		<div class="more__settings__modal__content">
			<div>
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
							<tr class="table__row" v-for="(keyword, itemKey) in keywords" :key="itemKey">
								<td class="table__row-item">
									<template v-if="itemKey === 'events'"> Events/conferences/Webinars</template>
									<template v-if="itemKey === 'blogs'"> Blogs/Articles</template>
									<template v-if="itemKey === 'features'"> Interviews/feature</template>
									<template v-if="itemKey === 'awards'"> Awards</template>
									<template v-if="itemKey === 'linkedin_activity'">Linkedin activity</template>
									<template v-if="itemKey === 'twitter_activity'"> Twitter activity</template>
									<template v-if="itemKey === 'promotion'"> New role/job/promotion</template>
									<template v-if="itemKey === 'videos'">Videos</template>
									<template v-if="itemKey === 'podcasts'">Podcasts</template>
								</td>
								<td class="table__row-item">
									<label class="toggle"
										><input
											type="checkbox"
											:value="itemKey"
											true-value="true"
											checked
											false-value="false"
											@change="onOptionToggle(itemKey, 'contact', $event)"/><span class="toggle-icon"></span
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
											@change="onOptionToggle(itemKey, 'company', $event)"/><span class="toggle-icon"></span
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
			</div>
		</div>
		<div class="more__settings__modal__footer">
			<div class="more__settings__modal__footer__btn__wrapper">
				<v-button class="config__btn__close" @click="submitForm()">
					<div class="btn__content__wrapper">
						<Loader v-if="loading" />
						<span v-else class="text">Save Changes</span>
					</div>
				</v-button>
			</div>
		</div>
		<v-modal v-if="showModal" :toggleClass="toggleClass" @close="toggleModal" maxWidth="400px" position="center">
			<template #title>
				<h4 class="modal__header-title">Unsave Changes</h4>
			</template>
			<template #body>
				<div class="modal__content">
					<p class="modal__content-text">
						You have some unsaved changes, are you sure you want to exit this page?
					</p>
					<div class="modal__content-btn">
						<div class="cancel" @click="closeMoreSearchSettings">Exit</div>
						<v-button class="update__btn" buttonType="primary" size="modal" @click="submitForm">
							<Loader v-if="loading" />
							<span v-else class="text">Save & Exit</span>
						</v-button>
					</div>
				</div>
			</template>
		</v-modal>
	</div>
</template>

<script src="./settings.js"></script>
<style lang="scss" scoped src="./settings.scss"></style>
<style lang="scss">
.no__scroll {
	overflow-y: hidden !important;
}
.update__btn {
	width: 135px;
}
</style>
