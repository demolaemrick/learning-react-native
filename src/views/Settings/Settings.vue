<template>
	<div class="more__settings__modal__wrapper">
		<div class="more__settings__modal__header">
			<div class="more__settings__modal__header__btn__wrapper">
				<v-button class="config__btn__close" @click="closeMoreSearchSettings">
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
				<div class="table__wrapper">
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
	</div>
</template>

<script src="./settings.js"></script>
<style lang="scss" scoped src="./settings.scss"></style>
<style lang="scss">
.no__scroll {
	overflow-y: hidden !important;
}
</style>
