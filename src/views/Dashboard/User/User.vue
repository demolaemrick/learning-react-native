<template>
	<div class="user-wrapper">
		<div class="flex flex-spaced">
			<div class="flex flex-spaced flex__item-center ">
				<img class="back-icon" src="@/assets/icons/arrow-back-icon.svg" svg-inline />
				<h3 class="page-title">Back to Users</h3>
			</div>
			<template v-if="activeTab === 'details'">
				<c-button class="submit" size="medium" buttonType="secondary" @click="toggleEditModal">
					Edit
				</c-button>
			</template>

			<template v-if="activeTab === 'contacts'">
				<c-button size="large" buttonType="primary" @click="toggleUploadContact">
					Upload Contact
				</c-button>
			</template>
		</div>

		<div class="tabs">
			<v-tabs>
				<v-tab style="max-width: 100%" title="Details" @getData="setActiveTab('details')" :selected="true">
					<template>
						<div class="grid grid__layout gap-3 py-1 row-group">
							<div class="col-3-12">
								<p class="mb-1 detail-name">Name</p>
								<h4 class="detail-content">Ronald Richards</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">Email Address</p>
								<h4 class="detail-content">ronald@gmail.com</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">Last Research Date</p>
								<h4 class="detail-content">Feb 20,2021 | 12:38 pm</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">Status</p>
								<div class="flex flex__item-center ">
									<div class="mr-1">
										<Toggle />
									</div>
									<h4 class="detail-content">Active</h4>
								</div>
							</div>
						</div>
						<div class="grid grid__layout gap-3 py-1 row-group">
							<div class="col-3-12">
								<p class="mb-1 detail-name">Organisation</p>
								<h4 class="detail-content">Microsoft</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">No. Research/month</p>
								<h4 class="detail-content">80 / 200</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">Profession</p>
								<h4 class="detail-content">Product</h4>
							</div>
							<div class="col-3-12">
								<p class="mb-1 detail-name">Role</p>
								<h4 class="detail-content">Business Analyst</h4>
							</div>
						</div>
					</template>
				</v-tab>
				<v-tab style="max-width: 100%" title="Contacts" @getData="setActiveTab('contacts')">
					<div>
						<v-table :tableHeaders="tableHeaders" :tableData="history" theme="contact__research">
							<template name="table-row" slot-scope="{ item }">
								<td class="table__row-item">
									<div class="check-input">
										<input type="checkbox" :value="item.rowId" v-model="checkedContacts" :disabled="false" />
									</div>
								</td>
								<td class="table__row-item">
									<div class="flex">
										<div class="detail__circle">
											<p class="detail__initials">KO</p>
										</div>
										<div class="flex flex__column">
											<p class="table-content">{{ item.name }}</p>
											<p class="small">{{ item.email }}</p>
										</div>
									</div>
								</td>
								<td class="table__row-item">{{ item.company }}</td>
								<td class="table__row-item">{{ item.title }}</td>
								<td class="table__row-item">{{ item.linkedin }}</td>
								<td class="table__row-item">{{ item.score }}</td>
								<td class="table__row-item">{{ item.lastUpdated }}</td>
								<td class="table__row-item status">
									<Status :status="item.status" />
								</td>
								<td class="">
									<toggle-dropdown itemPadding="0">
										<template #dropdown-wrapper>
											<img src="@/assets/icons/menu3dot.svg" svg-inline />
										</template>
										<template #dropdown-items>
											<li class="dropdown__item">
												Edit Info
											</li>
											<li class="dropdown__item">
												Suspend
											</li>
											<li class="dropdown__item">
												Delete
											</li>
										</template>
									</toggle-dropdown>
								</td>
							</template>
						</v-table>

						<div v-if="history.length < 1">
							<div class="emptyState">
								<img src="@/assets/icons/empty-state-image.svg" svg-inline />
								<p class="emptyState-text">No user record found</p>
								<p class="emptyState-subtext">Click on the button to to Upload Contact</p>
								<c-button size="large" buttonType="primary">
									Upload Contact
								</c-button>
							</div>
						</div>
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
								rules="required"
								placeholder="customer data, customer insights, NPS"
								name="contact search"
								width="100%"
							/>
						</div>
						<div class="settings-group">
							<p class="text">Company search terms</p>
							<p class="description">Add terms to refine your company search results</p>
							<v-text-input
								class="search-input"
								rules="required"
								placeholder="Terms (comma seperated)"
								name="company search"
								width="100%"
							/>
						</div>
						<div class="flex flex-end">
							<c-button size="large" buttonType="primary">
								Save Changes
							</c-button>
						</div>
					</div>
				</v-tab>
			</v-tabs>
		</div>

		<modal position="right" :active="editModal" @close="editModal = !editModal">
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
									v-model="form.firstName"
									width="204px"
									name="First Name"
									placeholder="John"
								/>
								<text-input
									rules="required"
									labelVisible
									v-model="form.lastName"
									width="204px"
									name="Last Name"
									placeholder="Doe"
								/>
							</div>

							<text-input
								type="email"
								rules="required"
								labelVisible
								v-model="form.email"
								width="100%"
								name="Email Address"
								placeholder="johndoe@email.com"
							/>
							<div class="flex flex-spaced">
								<text-input
									type="text"
									rules="required"
									labelVisible
									v-model="form.organisation"
									width="204px"
									name="Organisation"
									placeholder="Microsoft"
								/>
								<text-input
									rules="required"
									labelVisible
									v-model="form.researches"
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
									v-model="form.profession"
									width="204px"
									name="Profession"
									placeholder="Product"
								/>
								<text-input
									rules="required"
									labelVisible
									v-model="form.role"
									width="204px"
									name="Role"
									placeholder="Content Creator"
								/>
							</div>
							<div class="flex flex__end">
								<c-button class="submit" size="large" buttonType="primary">
									<template v-if="!loading">Save Changes</template>
									<Loader v-else />
								</c-button>
							</div>
						</div>
					</ValidationObserver>
				</form>
			</template>
		</modal>

    <modal position="right" :active="contactModal" @close="contactModal = !contactModal">
			<template #title>
				<h3>Import Contact</h3>
			</template>
			<template #body>
				<div class="file-wrapper">
					<img src="@/assets/icons/image-icon.svg" svg-inline />
					<a href="">
						<span class="file-uploads">Upload a file </span>
						<span class="file-text">or drag and drop</span>
					</a>
					<small class="csv ">CSV up to 10MB</small>
				</div>
				<div class="flex flex-end">
					<c-button class="mt-2 submit"
					size="large"
					buttonType="primary">
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
