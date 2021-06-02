<template>
	<div>
		<div class="page-header">
			<h2 class="title">Admin Management</h2>
			<c-button class="submit" size="large" buttonType="primary" @click="toggleSendInvites">
				Send Invite
			</c-button>
		</div>
		<div class="search-group">
			<h4>12 Admins</h4>
			<div class="search-section">
				<TextInput class="mb-0" type="text" placeholder="Search" :icon="{ type: 'search' }" width="509px" />
				<span class="mx-1"> </span>
			</div>
		</div>

		<div>
			<v-table :tableHeaders="tableHeaders" :tableData="history" theme="contact__research">
				<template name="table-row" slot-scope="{ item }">
					<td class="table__row-item">
						<div class="check-input">
							<input type="checkbox" :value="item.rowId" v-model="checkedContacts" :disabled="false" />
						</div>
					</td>
					<td class="table__row-item">
						<div class="flex flex__item-center ">
							<div class="detail__circle">
								<p class="detail__initials">KO</p>
							</div>
							<div>
								<p class="table-content">{{ item.name }}</p>
							</div>
						</div>
					</td>
					<td class="table__row-item">{{ item.email }}</td>
					<td class="table__row-item">{{ item.adminRole }}</td>
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
					<p class="emptyState-subtext">Click on the button to to Upload Contact</p>
					<c-button size="large" buttonType="primary">
						Upload Contact
					</c-button>
				</div>
			</div>
		</div>

		<!-- <modal position="right" :active="sendInvites" @close="sendInvites = !sendInvites">
			<template #title>
				<h3>Admin Invite</h3>
			</template>
			<template #body>
				<p class="modal-text">Enter a registered email address to send admin invite</p>
				<form action="">
					<ValidationObserver v-slot="{}">
						<div class="auth-input">

							<text-input
								type="email"
								rules="required"
								labelVisible
								v-model="form.email"
								width="100%"
								name="Email Address"
								placeholder="johndoe@email.com"
							/>

							<text-input
								rules="required"
								labelVisible
								v-model="form.role"
								width="100%"
								name="Role"
								placeholder="Admin"
							/>
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

		<modal position="right" :active="sendInvites" @close="sendInvites = !sendInvites">
			<template #title>
				<h3>Edit Info</h3>
			</template>
			<template #body>
				<p class="modal-text">Enter a registered email address to send admin invite</p>
				<form action="">
					<ValidationObserver v-slot="{}">
						<div class="auth-input">

							<text-input
								rules="required"
								labelVisible
								v-model="form.name"
								width="100%"
								name="Name"
								placeholder="Ronald Richards"
							/>
							<text-input
								type="email"
								rules="required"
								labelVisible
								v-model="form.email"
								width="100%"
								name="Email"
								placeholder="ronald@volley.com"
							/>

							<text-input
								rules="required"
								labelVisible
								v-model="form.role"
								width="100%"
								name="Role"
								placeholder="Admin User"
							/>

							<p class="toggle-prompt">Toggle to activate user</p>
							<div class="flex flex__item-center toggle-group">
								<div class="mr-1">
									<Toggle />
								</div>
								<h4 class="toggle-text">Active</h4>
							</div>
							<div class="flex flex-end">
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
		</modal>
	</div>
</template>

<script src="./admin.js"></script>

<style lang="scss" scoped>
@import './Admin.scss';
</style>
