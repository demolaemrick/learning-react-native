<template>
	<div class="user-wrapper">
		<div class="flex flex-spaced">
			<div class="flex flex-spaced flex__item-center">
				<img class="back-icon" src="@/assets/icons/arrow-back-icon.svg" svg-inline @click="backToUsers" />
				<h3 class="page-title">Back to Users</h3>
			</div>
			<template v-if="activeTab === 'details'">
				<c-button class="submit" size="medium" buttonType="secondary" @click="openEditModal({ ...userDetails })">Edit</c-button>
			</template>

			<template v-if="activeTab === 'contacts'">
				<c-button size="large" buttonType="primary" @click="toggleUploadContact">Upload Contact</c-button>
			</template>
		</div>

		<div class="tabs">
			<v-tabs>
				<v-tab style="max-width: 100%" title="Details" @getData="setActiveTab('details')" :selected="true">
					<template v-if="loading">
						<div v-for="n in 2" :key="n" class="grid grid__layout gap-3 py-1 row-group">
							<div v-for="n in 4" :key="n" class="col-3-12">
								<div class="loader-title item"></div>
								<div class="loader-content item" v-for="item in 1" :key="item"></div>
							</div>
						</div>
					</template>
					<template v-else>
						<div class="grid grid__layout gap-3 py-1 row-group">
							<div class="col-3-12">
								<p class="mb-1 detail-name">Name</p>
								<h4 class="detail-content">{{ userDetails.first_name }} {{ userDetails.last_name }}</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">Email Address</p>
								<h4 class="detail-content">{{ userDetails.email }}</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">Last Research Date</p>
								<h4 class="detail-content">Feb 20,2021 | 12:38 pm</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">Status</p>
								<div class="flex flex__item-center">
									<div class="mr-1">
										<Toggle :itemKey="userDetails.status === 'active' ? true : false" />
									</div>
									<h4 class="detail-content">{{ userDetails.status }}</h4>
								</div>
							</div>
						</div>
						<div class="grid grid__layout gap-3 py-1 row-group">
							<div class="col-3-12">
								<p class="mb-1 detail-name">Organisation</p>
								<h4 class="detail-content">{{ userDetails.organisation }}</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">No. Research/month</p>
								<h4 class="detail-content">{{ userDetails.researches_performed }} / {{ userDetails.monthly_research }}</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">Profession</p>
								<h4 class="detail-content">{{ userDetails.profession }}</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">Role</p>
								<h4 class="detail-content">{{ userDetails.role }}</h4>
							</div>
						</div>
					</template>
				</v-tab>
				<v-tab style="max-width: 100%" margin="25px 0 0 0" title="Contacts" @getData="setActiveTab('contacts')">
					<div>
						<v-table
							:tableHeaders="tableHeaders"
							:loading="pageLoading"
							:tableData="history"
							theme="contact__research"
							@rowClick="showResearch"
							@checkAll="checkAll"
						>
							<template name="table-row" slot-scope="{ item }">
								<td class="table__row-item">
									<div class="check-input">
										<input type="checkbox" :value="item.rowId" v-model="checkedContacts" :disabled="false" />
									</div>
								</td>
								<td class="table__row-item">
									<div class="table__td__name">
										<div class="initials__logo">
											{{
												item.full_name
													.match(/\b(\w)/g)
													.join('')
													.toUpperCase()
											}}
										</div>
										<div class="name__email__wrapper">
											<div class="text__name text-capitalize">{{ item.full_name }}</div>
											<div class="text__email">{{ item.email }}</div>
										</div>
									</div>
								</td>
								<td class="table__row-item text-capitalize">{{ item.company }}</td>
								<td class="table__row-item text-capitalize">{{ item.role }}</td>
								<td class="table__row-item linkedin">
									<template v-if="!item.linkedin"><p class="table__td__link">-</p></template>
									<template v-else
										><a class="table__td__link" :href="item.linkedin" target="_blank">
											<img src="@/assets/icons/link.svg" svg-inline /> </a
									></template>
								</td>
								<td class="table__row-item">
									<template v-if="item.research_score === 0.1 || item.research_score === null">-</template>
									<template v-else>{{ item.research_score.toPrecision(4) * 100 }}%</template>
								</td>
								<td class="table__row-item">{{ item.updatedAt | moment('from', 'now') }}</td>
								<td class="table__row-item status">
									<Status :status="item.status" />
								</td>
								<td class="table__row-item dropdown">
									<toggle-dropdown>
										<template #dropdown-wrapper>
											<img src="@/assets/icons/menu3dot.svg" svg-inline />
										</template>
										<template #dropdown-items>
											<li class="dropdown__item">Delete</li>
										</template>
									</toggle-dropdown>
								</td>
							</template>
						</v-table>

						<div v-if="!pageLoading && history && history.length < 1">
							<div class="emptyState">
								<img src="@/assets/icons/empty-state-image.svg" svg-inline />
								<p class="emptyState-text">No user record found</p>
								<p class="emptyState-subtext">Click on the button to to Upload Contact</p>
								<c-button size="large" buttonType="primary">Upload Contact</c-button>
							</div>
						</div>
					</div>
					<div class="table__pagination__wrapper" v-if="!usersLoading">
						<div class="title__left">
							<span>Showing Page</span>
							<span>
								{{ (currentPage - 1) * 10 + 1 }} - <template v-if="nextPage !== null">{{ currentPage * 10 }}</template>
								<template v-else>{{ count }}</template>
							</span>
							<span>of</span>
							<span>{{ count }}</span>
						</div>

						<paginate
							:page-count="total"
							:click-handler="clickCallback"
							:prev-text="'Prev'"
							:next-text="'Next'"
							:container-class="'pagination__list'"
							:page-class="'pagination__list-item'"
						>
						</paginate>
					</div>
				</v-tab>
				<v-tab title="Settings" @getData="setActiveTab('settings')">
					<h4 class="settings-header">Search preference</h4>
					<div class="search-terms">
						<div class="settings-group">
							<p class="text">Contact search terms</p>
							<p class="description">Add terms to refine your contact search results</p>
							<v-text-input
								class="search-input"
								placeholder="customer data, customer insights, NPS"
								name="contact search"
								v-model="settings.contact_research"
								@change="onKeywordsChange('contact_research', $event)"
								width="100%"
							/>
						</div>
						<div class="settings-group">
							<p class="text">Company search terms</p>
							<p class="description">Add terms to refine your company search results</p>
							<v-text-input
								class="search-input"
								placeholder="Terms (comma seperated)"
								@change="onKeywordsChange('company_research', $event)"
								v-model="settings.company_research"
								name="company search"
								width="100%"
							/>
						</div>
						<div class="flex flex-end">
							<c-button size="large" buttonType="primary" @click="submitForm()">
								<Loader v-if="loading" />
								<span v-else class="text">Save Changes</span>
							</c-button>
						</div>
					</div>
				</v-tab>
			</v-tabs>
		</div>

		<modal position="right" v-if="showEditModal" :toggleClass="toggleClass" @close="toggleEditModal">
			<template #title>
				<h3>Edit</h3>
			</template>
			<template #body>
				<form action="">
					<ValidationObserver v-slot="{}" color="#ff0000">
						<div class="auth-input">
							<div class="flex flex-spaced">
								<text-input
									rules="required"
									labelVisible
									labelColor="gray"
									v-model="userInfo.first_name"
									width="204px"
									name="First Name"
									placeholder="John"
								/>
								<text-input
									rules="required"
									labelVisible
									labelColor="gray"
									v-model="userInfo.last_name"
									width="204px"
									name="Last Name"
									placeholder="Doe"
								/>
							</div>

							<text-input
								type="email"
								rules="required"
								labelVisible
								labelColor="gray"
								:disabled="true"
								v-model="userInfo.email"
								width="100%"
								name="Email Address"
								placeholder="johndoe@email.com"
							/>
							<div class="flex flex-spaced">
								<text-input
									type="text"
									rules="required"
									labelVisible
									labelColor="gray"
									v-model="userInfo.organisation"
									width="204px"
									name="Organisation"
									placeholder="Microsoft"
								/>
								<text-input
									rules="required"
									labelVisible
									labelColor="gray"
									v-model="userInfo.monthly_research"
									width="204px"
									name="No. Research/month"
									placeholder="200"
								/>
							</div>
							<div class="flex flex-spaced">
								<text-input
									type="text"
									rules="required"
									labelVisible
									labelColor="gray"
									v-model="userInfo.profession"
									width="204px"
									name="Profession"
									placeholder="Product"
								/>
								<div class="form-group">
									<label class="select-label" for="admin">Role</label>
									<select class="select-input" v-model="userInfo.role" width="204px" name="adminRole" id="adminRole">
										<option value="user">User</option>
										<option value="admin">Admin</option>
										<option value="superAdmin">Super Admin</option>
									</select>
								</div>
							</div>
							<div class="flex flex__end">
								<c-button class="submit" size="large" buttonType="primary" @click="editUser">
									<template v-if="!loading">Save Changes</template>
									<Loader v-else />
								</c-button>
							</div>
						</div>
					</ValidationObserver>
				</form>
			</template>
		</modal>

		<modal position="right" v-if="contactModal" :toggleClass="toggleClass" @close="toggleUploadContact">
			<template #title>
				<h3>Import Contact</h3>
			</template>
			<template #body>
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
								<img src="@/assets/icons/image-icon.svg" svg-inline />
								<div class="text__content">
									<p><span class="link">Upload a file </span>or drag and drop</p>
								</div>
								<small class="text__desc">CSV up to 10MB</small>
							</div>
						</template>
					</file-upload>
				</div>
				<div class="flex flex-end">
					<c-button class="mt-2 submit" size="large" buttonType="primary">
						<template v-if="!loading">Search</template>
						<Loader v-else />
					</c-button>
				</div>
			</template>
		</modal>
	</div>
</template>

<script src="./user.js"></script>

<style lang="scss" scoped>
@import './User.scss';
</style>
