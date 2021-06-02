<template>
	<div>
		<div class="page-header">
			<h2 class="title">Users</h2>
			<c-button class="submit" size="large" buttonType="primary" @click="toggleCreateUser">
				Create User
			</c-button>
		</div>
		<div class="search-group">
			<h4>0 Users</h4>
			<div class="search-section">
				<TextInput class="mb-0" type="text" placeholder="Search" :icon="{ type: 'search' }" width="509px" />
				<span class="mx-1">
					<c-button size="small" buttonType="outline" @click="toggleFilterModal">
						Filter
						<img class="filter-icon" src="@/assets/icons/filter-icon.svg" svg-inline />
					</c-button>
				</span>
				<toggle-dropdown itemPadding="0">
					<template #dropdown-wrapper>
						<c-button size="icon" buttonType="outline">
							<img src="@/assets/icons/menu3dot.svg" svg-inline />
						</c-button>
					</template>
					<template #dropdown-items>
						<li class="dropdown__item"></li>
					</template>
				</toggle-dropdown>
			</div>
		</div>

		<modal position="right" :active="createUser" @close="createUser = !createUser">
			<template #title>
				<h3>Create User</h3>
			</template>
			<template #body>
				<form action="">
					<ValidationObserver v-slot="{}">
						<div class="auth-input">
							<div class="flex">
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
								rules="required"
								labelVisible
								v-model="form.mail"
								width="100%"
								name="Email Address"
								placeholder="johndoe@email.com"
							/>

							<text-input
								type="email"
								rules="required"
								labelVisible
								v-model="form.email"
								width="100%"
								name="Email Address"
								placeholder="yourmail@email.com"
							/>
							<div class="flex">
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
									type="number"
									rules="required"
									labelVisible
									v-model="form.researches"
									width="204px"
									name="No. Research/month"
									placeholder="200"
								/>
							</div>
							<div class="flex">
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
							<password-input
								type="password"
								v-model="form.password"
								rules="required"
								width="100%"
								name="Password"
								:showPasswordBar="false"
								placeholder="Enter Password"
							/>
							<div class="flex-end">
								<c-button class="submit" size="large" buttonType="primary">
									<template v-if="!loading">Create Account</template>
									<Loader v-else />
								</c-button>
							</div>
						</div>
					</ValidationObserver>
				</form>
			</template>
		</modal>

		<modal position="right" :active="filter" @close="filter = !filter">
			<template #title>
				<h3>Filter</h3>
			</template>
			<template #body>
				<form action="">
					<ValidationObserver v-slot="{}">
						<div class="auth-input">
							<text-input rules="required" labelVisible v-model="form.name" width="100%" name="Name" placeholder="John" />

							<div class="flex">
								<text-input
									type="date"
									rules="required"
									labelVisible
									v-model="form.startDate"
									width="204px"
									name="Start Date"
									placeholder="20-02-21"
								/>

								<text-input
									type="date"
									rules="required"
									labelVisible
									v-model="form.endDate"
									width="204px"
									name="End Date"
									placeholder="20-02-21"
								/>
							</div>
							<RadioBtn id="statusType" :options="statusType" name="status" v-model="statusOption" />

							<div class="flex-end">
								<c-button class="submit" size="large" buttonType="primary">
									<template v-if="!loading">Apply Search</template>
									<Loader v-else />
								</c-button>
							</div>
						</div>
					</ValidationObserver>
				</form>
			</template>
		</modal>

		<!-- <modal position="right" :active="editModal" @close="editModal = !editModal">
			<template #title>
				<h3>Edit</h3>
			</template>
			<template #body>
				<form action="">
					<ValidationObserver v-slot="{}">
						<div class="auth-input">
							<div class="flex">
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
								placeholder="yourmail@email.com"
							/>
							<div class="flex">
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
									type="number"
									rules="required"
									labelVisible
									v-model="form.researches"
									width="204px"
									name="No. Research/month"
									placeholder="200"
								/>
							</div>
							<div class="flex">
								<text-input
									type="text"
									rules="required"
									labelVisible
									v-model="form.email"
									width="204px"
									name="Profession"
									placeholder="Product"
								/>
								<text-input
									type="number"
									rules="required"
									labelVisible
									v-model="form.email"
									width="204px"
									name="Role"
									placeholder="Content Creator"
								/>
							</div>
							<div class="flex-end">
								<c-button class="submit"
								size="large"
								buttonType="primary">
									<template v-if="!loading">Save Changes</template>
									<Loader v-else />
								</c-button>
							</div>
						</div>
					</ValidationObserver>
				</form>
			</template>
		</modal> -->

		<!-- <modal position="right" :active="filter" @close="filter = !editModal">
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
				<div class="flex-end">
					<c-button class="mt-2 submit"
					size="large"
					buttonType="primary">
						<template v-if="!loading">Search</template>
						<Loader v-else />
					</c-button>
				</div>
			</template>
		</modal> -->

		<div>
			<v-table :tableHeaders="tableHeaders" :tableData="history" theme="contact__research">
				<template name="table-row" slot-scope="{ item }">
					<td class="table__row-item">
						<div class="check-input">
							<input type="checkbox" :value="item.rowId" v-model="checkedContacts" :disabled="false" />
						</div>
					</td>
					<td class="table__row-item">{{ item.name }}</td>
					<td class="table__row-item">{{ item.email }}</td>
					<td class="table__row-item">{{ item.researchNo }}</td>
					<td class="table__row-item status">
						<Status :status="item.status" />
					</td>
					<td class="table__row-item">
						{{ item.date }} |
						<span class="time">{{ item.time }}</span>
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
				</div>
			</div>
		</div>
	</div>
</template>

<script src="./users.js"></script>

<style lang="scss" scoped>
@import './Users.scss';
</style>
