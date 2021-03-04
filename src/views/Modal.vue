<template>
	<div class="keywords__modal">
		<div class="container container--lg">
			<div class="close-wrapper">
				<p class="close" @click="closeModal"><img src="@/assets/icons/close.svg" svg-inline /> Close</p>
			</div>
			<main class="main-section">
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
											:checked="Object.keys(payload.contact_search).includes(itemKey)"
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
											:checked="Object.keys(payload.company_search).includes(itemKey)"
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
					<div class="modal-btn">
						<v-button @click="submitSearch" size="small">Apply Changes </v-button>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script>
import VCheckbox from '@/components/Checkbox';
import VButton from '@/components/Button';
import VTextInput from '@/components/Input';
import { mapMutations } from 'vuex';
export default {
	name: 'Search',
	components: {
		VCheckbox,
		VTextInput,
		VButton
	},
	props: {
		payload: {
			type: Object
		}
	},
	data() {
		return {
			company: '',
			showMoreSearch: false,
			disableApplyAll: true,
			applyAllChecked: false,
			disableCompanyAll: true,
			AllCompanyChecked: false,
			keywords: {
				events: [],
				blogs: [],
				features: [],
				awards: [],
				linkedin_activity: [],
				twitter_activity: [],
				promotion: [],
				videos: [],
				podcasts: []
			},
			companyKeywords: {
				job_postings: [],
				mergers_and_acquisitions: [],
				ipo: [],
				product_launch: [],
				others: []
			}
		};
	},
	created() {
		const { company_search, contact_search } = this.payload;
		this.companyKeywords = { ...this.companyKeywords, ...company_search };
		this.keywords = { ...this.keywords, ...contact_search };
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_services/saveSearchPayload'
		}),
		closeModal() {
			this.$emit('close');
		},
		onOptionToggle(optionTitle, searchType, event) {
			const isChecked = event.target.checked;
			if (searchType === 'contact') {
				const isValidOption = Object.keys(this.payload.contact_search).includes(optionTitle);
				let obj = {};
				if (isValidOption) {
					if (isChecked) {
						obj[optionTitle] = this.keywords[optionTitle];
						this.payload.contact_search = { ...this.payload.contact_search, ...obj };
						return;
					}
					this.payload.contact_search = this.deletePropertyFromObject(optionTitle, this.payload.contact_search);
				}
			} else {
				const isValidOption = Object.keys(this.payload.company_search).includes(optionTitle);
				let obj = {};
				if (isValidOption) {
					if (isChecked) {
						obj[optionTitle] = this.companyKeywords[optionTitle];
						this.payload.company_search = { ...this.payload.company_search, ...obj };
						return;
					}
					this.payload.company_search = this.deletePropertyFromObject(optionTitle, this.payload.company_search);
				}
			}
		},
		onKeywordsChange(optionTitle, searchType, event) {
			if (searchType === 'contact') {
				const isValidOption = Object.keys(this.keywords).includes(optionTitle);
				if (isValidOption) {
					if (optionTitle === 'events' && event.target.value !== '') {
						this.disableApplyAll = false;
					}
					if (optionTitle === 'events' && event.target.value === '') {
						this.disableApplyAll = true;
						this.payload.contact_search[optionTitle] = [];
						this.applyAllChecked = false;
						return;
					}
					this.keywords[optionTitle] = event.target.value.split(',');
					this.payload.contact_search[optionTitle] = this.keywords[optionTitle];
				}
			} else {
				const isValidOption = Object.keys(this.companyKeywords).includes(optionTitle);
				if (isValidOption) {
					if (optionTitle === 'job_postings' && event.target.value !== '') {
						this.disableCompanyAll = false;
					}
					if (optionTitle === 'job_postings' && event.target.value === '') {
						this.disableCompanyAll = true;
						this.payload.company_search[optionTitle] = [];
						this.AllCompanyChecked = false;
						return;
					}
					this.companyKeywords[optionTitle] = event.target.value.split(',');
					this.payload.company_search[optionTitle] = this.companyKeywords[optionTitle];
				}
			}
		},
		applyAllOptionsToggle() {
			this.applyAllChecked = !this.applyAllChecked;
		},
		allCompanyOptionsToggle() {
			this.AllCompanyChecked = !this.AllCompanyChecked;
		},
		submitSearch() {
			console.log('Here is the payload to be send', this.payload);
			// this.saveSearchPayload(this.payload);
			// this.$router.push({ name: 'SearchResult' });
		},
		deletePropertyFromObject(property, object) {
			return Object.keys(object).reduce((obj, key) => {
				if (key !== property) {
					obj[key] = object[key];
				}
				return obj;
			}, {});
		}
	},
	watch: {
		'keywords.events': function (newVal) {
			if (typeof newVal === 'string' && newVal === '') {
				this.applyAllChecked = false;
				this.payload.contact_search['events'] = [];
			}
		},
		applyAllChecked: function (newVal) {
			if (newVal) {
				Object.keys(this.payload.contact_search).forEach((single) => {
					this.payload.contact_search[single] = this.payload.contact_search.events;
					this.keywords[single] = this.payload.contact_search.events;
				});
				return;
			}
			Object.keys(this.payload.contact_search).forEach((single) => {
				if (single === 'events') {
					this.payload.contact_search[single] = this.payload.contact_search.events;
					this.keywords[single] = this.payload.contact_search.events;
					return;
				}
				this.payload.contact_search[single] = [];
				this.keywords[single] = [];
			});
		},
		'companyKeywords.job_postings': function (newVal) {
			if (typeof newVal === 'string' && newVal === '') {
				this.AllCompanyChecked = false;
				this.payload.company_search['job_postings'] = [];
			}
		},
		AllCompanyChecked: function (newVal) {
			if (newVal) {
				Object.keys(this.payload.company_search).forEach((single) => {
					this.payload.company_search[single] = this.payload.company_search.job_postings;
					this.companyKeywords[single] = this.payload.company_search.job_postings;
				});
				return;
			}
			Object.keys(this.payload.company_search).forEach((single) => {
				if (single === 'job_postings') {
					this.payload.company_search[single] = this.payload.company_search.events;
					this.companyKeywords[single] = this.payload.company_search.job_postings;
					return;
				}
				this.payload.company_search[single] = [];
				this.companyKeywords[single] = [];
			});
		}
	},
	computed: {}
};
</script>
<style scoped src="./Search/search.scss" lang="scss"></style>
<style lang="scss" scoped>
.keywords__modal {
	position: fixed;
	left: 0;
	width: 100%;
	z-index: 9;
	top: 0;
	height: 100vh;
	overflow-y: auto;
	background: #fff;
}
.close-wrapper {
	margin: 64px 0;
	.close {
		font-weight: bold;
		letter-spacing: -0.4px;
		display: flex;
		align-items: center;
		cursor: pointer;
		svg {
			width: 20px;
			height: 20px;
			margin-right: 12px;
		}
	}
}
.table {
	margin: 0 auto;
}
.modal-btn {
	max-width: 920px;
	margin: 80px auto 0;
	display: flex;
	justify-content: flex-end;
}
</style>
