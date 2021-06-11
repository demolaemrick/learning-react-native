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
											:checked="Object.keys(researchedPayload.contact_research).includes(itemKey)"
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
											:checked="Object.keys(researchedPayload.company_research).includes(itemKey)"
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
					<div class="modal-btn">
						<v-button @click="submitResearch" size="small"
							><template v-if="!loading">Apply Changes</template> <Loader v-else />
						</v-button>
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
import Loader from '@/components/Loader';
export default {
	name: 'Search',
	components: {
		VCheckbox,
		VTextInput,
		VButton,
		Loader
	},
	props: {
		researchedPayload: {
			type: Object
		},
		loading: {
			type: Boolean,
			default: false
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
				product_launch: []
			}
		};
	},
	created() {
		const { company_research, contact_research } = this.researchedPayload;
		this.companyKeywords = { ...this.companyKeywords, ...company_research };
		this.keywords = { ...this.keywords, ...contact_research };
	},
	methods: {
		...mapMutations({
			saveSearchresearchedPayload: 'search_services/saveSearchresearchedPayload'
		}),
		closeModal() {
			this.$emit('close');
		},
		async submitResearch() {
			await this.$emit('submit');
			this.closeModal();
		},
		onOptionToggle(optionTitle, searchType, event) {
			const isChecked = event.target.checked;
			if (searchType === 'contact') {
				const isValidOption = Object.keys(this.researchedPayload.contact_research).includes(optionTitle);
				let obj = {};
				if (isValidOption) {
					if (isChecked) {
						obj[optionTitle] = this.keywords[optionTitle];
						this.researchedPayload.contact_research = { ...this.researchedPayload.contact_research, ...obj };
						return;
					}
					this.researchedPayload.contact_research = this.deletePropertyFromObject(
						optionTitle,
						this.researchedPayload.contact_research
					);
				}
			} else {
				const isValidOption = Object.keys(this.researchedPayload.company_research).includes(optionTitle);
				let obj = {};
				if (isValidOption) {
					if (isChecked) {
						obj[optionTitle] = this.companyKeywords[optionTitle];
						this.researchedPayload.company_research = { ...this.researchedPayload.company_research, ...obj };
						return;
					}
					this.researchedPayload.company_research = this.deletePropertyFromObject(
						optionTitle,
						this.researchedPayload.company_research
					);
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
						this.researchedPayload.contact_research[optionTitle] = [];
						this.applyAllChecked = false;
						return;
					}
					this.keywords[optionTitle] = event.target.value.split(',');
					this.researchedPayload.contact_research[optionTitle] = this.keywords[optionTitle];
				}
			} else {
				const isValidOption = Object.keys(this.companyKeywords).includes(optionTitle);
				if (isValidOption) {
					if (optionTitle === 'job_postings' && event.target.value !== '') {
						this.disableCompanyAll = false;
					}
					if (optionTitle === 'job_postings' && event.target.value === '') {
						this.disableCompanyAll = true;
						this.researchedPayload.company_research[optionTitle] = [];
						this.AllCompanyChecked = false;
						return;
					}
					this.companyKeywords[optionTitle] = event.target.value.split(',');
					this.researchedPayload.company_research[optionTitle] = this.companyKeywords[optionTitle];
				}
			}
		},
		applyAllOptionsToggle() {
			this.applyAllChecked = !this.applyAllChecked;
		},
		allCompanyOptionsToggle() {
			this.AllCompanyChecked = !this.AllCompanyChecked;
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
		'keywords.events': function(newVal) {
			if (typeof newVal === 'string' && newVal === '') {
				this.applyAllChecked = false;
				this.researchedPayload.contact_research['events'] = [];
			}
		},
		applyAllChecked: function(newVal) {
			if (newVal) {
				Object.keys(this.researchedPayload.contact_research).forEach((single) => {
					this.researchedPayload.contact_research[single] = this.researchedPayload.contact_research.events;
					this.keywords[single] = this.researchedPayload.contact_research.events;
				});
				return;
			}
			Object.keys(this.researchedPayload.contact_research).forEach((single) => {
				if (single === 'events') {
					this.researchedPayload.contact_research[single] = this.researchedPayload.contact_research.events;
					this.keywords[single] = this.researchedPayload.contact_research.events;
					return;
				}
				this.researchedPayload.contact_research[single] = [];
				this.keywords[single] = [];
			});
		},
		'companyKeywords.job_postings': function(newVal) {
			if (typeof newVal === 'string' && newVal === '') {
				this.AllCompanyChecked = false;
				this.researchedPayload.company_research['job_postings'] = [];
			}
		},
		AllCompanyChecked: function(newVal) {
			if (newVal) {
				Object.keys(this.researchedPayload.company_research).forEach((single) => {
					this.researchedPayload.company_research[single] = this.researchedPayload.company_research.job_postings;
					this.companyKeywords[single] = this.researchedPayload.company_research.job_postings;
				});
				return;
			}
			Object.keys(this.researchedPayload.company_research).forEach((single) => {
				if (single === 'job_postings') {
					this.researchedPayload.company_research[single] = this.researchedPayload.company_research.events;
					this.companyKeywords[single] = this.researchedPayload.company_research.job_postings;
					return;
				}
				this.researchedPayload.company_research[single] = [];
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
