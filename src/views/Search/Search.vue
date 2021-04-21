<template>
	<div class="container container--lg">
		<nav class="navbar">
			<div class="nav-item logo">
				<img src="@/assets/icons/logo.svg" svg-inline />
				<h3 class="ml-1 logo-text">Volley App</h3>
			</div>
			<div class="nav__menu__right">
				<div class="search__icon__wrapper">
					<img src="@/assets/icons/search-icon.svg" svg-inline />
				</div>
				<div class="user__menu__wrapper">
					<v-toggle-dropdown class="user__dropdown__menu">
						<template #dropdown-wrapper>
							<img class="mr-1" src="@/assets/icons/user-icon.svg" svg-inline />
							<img src="@/assets/icons/carret-down.svg" svg-inline />
						</template>
						<template #dropdown-items>
							<li class="dropdown__item">
								Settings
							</li>
							<li class="dropdown__item">
								Logout
							</li>
						</template>
					</v-toggle-dropdown>
				</div>
			</div>
		</nav>
		<main class="main-section">
			<div class="hero">
				<h2 class="hero-title">More refined <span>research</span> .</h2>
				<p class="hero-desc">
					Aggregated sales research to power your personalized outreach.
				</p>
			</div>
			<v-tabs>
				<v-tab title="Manual Search" @getData="setActiveTab('manual_search')" :selected="true">
					<ValidationObserver v-slot="{ invalid }">
						<div class="search-wrapper">
							<v-text-input
								class="search-input"
								rules="required"
								placeholder="Name"
								name="name"
								v-model="payload.full_name"
							/>
							<v-text-input class="search-input" rules="required" placeholder="Title" name="title" v-model="payload.role" />
							<v-text-input
								class="search-input"
								rules="required"
								placeholder="Company"
								name="company"
								v-model="payload.company"
							/>
							<v-button :disabled="invalid" class="search_btn" @click="submitSearch">
								<template v-if="!loading">Search</template>
								<Loader v-else />
							</v-button>
						</div>
					</ValidationObserver>
				</v-tab>
				<v-tab title="Import Contacts" @getData="setActiveTab('import_contacts')">
					<div class="upload__wrapper">
						<file-upload
							:drop="true"
							ref="upload"
							:extensions="extensions"
							:accept="accept"
							@input-file="inputFile"
							v-model="files"
						>
							<template>
								<div class="upload__placeholder__content">
									<img class="mr-1" src="@/assets/icons/upload-icon.svg" svg-inline />
									<div class="text__content">
										<p><span class="link">Upload a file</span> or drag and drop</p>
									</div>
									<div class="text__desc">CSV up to 10MB</div>
								</div>
							</template>
						</file-upload>
					</div>
				</v-tab>
			</v-tabs>

			<template v-if="activeTab === 'manual_search'">
				<p class="more-filter" @click="openConfigModal()">
					More search options <img src="@/assets/icons/arrow-drop-down.svg" class="ml-1" svg-inline />
				</p>
				<!-- <p class="more-filter" @click="showMoreSearch = !showMoreSearch">
					More search options <img src="@/assets/icons/arrow-drop-down.svg" class="ml-1" svg-inline />
				</p> -->
			</template>
			<!-- CONFIG MODAL -->
			<template v-if="showConfigModal">
				<v-modal>
					<div class="config__modal__wrapper">
						<div class="config__modal__header">
							<div class="config__modal__header__btn__wrapper">
								<v-button class="config__btn__close" @click="closeConfigModal()">
									<div class="btn__content__wrapper">
										<span class="text">Close</span>
										<span class="icon">
											<img src="@/assets/icons/close-sign.svg" class="ml-1" svg-inline />
										</span>
									</div>
								</v-button>
							</div>
						</div>
						<div class="config__modal__content">
							<div class="config__icon__wrapper">
								<img src="@/assets/icons/empty-state-image.svg" class="ml-1" svg-inline />
							</div>
							<div class="config__text__wrapper">
								<p>
									Configure your search preferences on the <br />
									settings page to get customised search result
								</p>
							</div>
							<div class="config__btn__wrapper">
								<v-button class="config__btn" @click="gotoSettings">
									Settings
								</v-button>
							</div>
						</div>
					</div>
				</v-modal>
			</template>
			<!-- CONFIG MODAL END -->
			<!-- __inpage -->
			<template v-if="showMoreSearch && activeTab === 'manual_search'">
				<div class="table__wrapper mb-3 table__inpage">
					<div class="table__wrapper__header">
						<div class="text__content">Search Preference</div>
						<div class="table__wrapper__header__btn__wrapper">
							<v-button class="table__wrapper__btn__close" @click="showMoreSearch = !showMoreSearch">
								<div class="btn__content__wrapper">
									<span class="icon pr-1">
										<img src="@/assets/icons/close-sign.svg" class="ml-1" svg-inline />
									</span>
									<span class="text">Close</span>
								</div>
							</v-button>
						</div>
					</div>
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
				<div class="table__wrapper table__inpage">
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
					<div class="additional__option__wrapper">
						<div class="additional__option__label">Addition Option</div>
						<div>
							<textarea placeholder="Type product description here..."></textarea>
						</div>
						<div class="secondary__search__btn__wrapper">
							<v-button class="secondary__search__btn" @click="submitSearch">
								<div>Search</div>
							</v-button>
						</div>
					</div>
				</div>
			</template>
			<!-- __inpage END -->
		</main>
		<template v-if="showMoreSearchSettings">
			<div class="more__settings__modal__wrapper">
				<div class="more__settings__modal__header">
					<div class="more__settings__modal__header__btn__wrapper">
						<v-button class="config__btn__close" @click="closeMoreSearchSettings()">
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
					<router-view></router-view>
				</div>
				<div class="more__settings__modal__footer">
					<div class="more__settings__modal__footer__btn__wrapper">
						<v-button class="config__btn__close" @click="btnApplyChanges()">
							<div class="btn__content__wrapper">
								<span class="text">Apply Changes</span>
							</div>
						</v-button>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script src="./search.js"></script>
<style lang="scss" scoped src="./search.scss"></style>
<style lang="scss">
.nav__menu__right {
	.user__menu__wrapper {
		.user__dropdown__menu {
			.dropdown__list-wrapper {
				top: 80%;
			}
		}
	}
}
.upload__wrapper {
	.file-uploads {
		width: 100%;
		height: 140px;
		display: flex;
		justify-content: center;
		align-items: center;
		&:hover {
			cursor: pointer;
		}
		label {
			&:hover {
				cursor: pointer;
			}
		}
	}
}
</style>
