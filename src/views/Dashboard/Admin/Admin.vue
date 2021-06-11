<template>
	<div>
		<div class="page-header">
			<h2 class="title">Admin Management</h2>
			<c-button class="submit" size="large" buttonType="primary" @click="toggleSendInvites">
				<div class="flex">
					<span class="add-icon">
						<img src="@/assets/icons/add-icon.svg" svg-inline />
					</span>
					<p>Send Invite</p>
				</div>
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
			<v-table
				:loading="adminLoading"
				:tableHeaders="tableHeaders"
				:tableData="admins"
				theme="contact__research"
				@checkAll="checkAll"
			>
				<template name="table-row" slot-scope="{ item }">
					<td class="table__row-item">
						<div class="check-input">
							<input type="checkbox" :value="item.rowId" v-model="checkedContacts" :disabled="false" />
						</div>
					</td>
					<td class="table__row-item">
						<div class="flex flex__item-center">
							<div class="detail__circle">
								<p class="detail__initials" v-if="item.first_name">
									{{ item.first_name.charAt(0).toUpperCase() }}{{ item.last_name.charAt(0).toUpperCase() }}
								</p>
							</div>
							<div>
								<p class="table-content">{{ item.first_name }} {{ item.last_name }}</p>
							</div>
						</div>
					</td>
					<td class="table__row-item">{{ item.email }}</td>
					<td class="table__row-item">{{ item.role }}</td>
					<td class="table__row-item status">
						<status-tag :status="item.status === 'active' ? 'active' : item.status === 'inactive' ? 'inactive' : 'pending'"
							>{{ item.status }}
						</status-tag>
						<!-- <Status :status="item.status" /> -->
					</td>
					<td class="table__row-item">
						{{ item.updatedAt | moment('MMMM D, YYYY') }} |
						<span class="time">{{ item.updatedAt | moment(' h:mm:ss a') }}</span>
					</td>
					<td class="">
						<toggle-dropdown itemPadding="0">
							<template #dropdown-wrapper>
								<img src="@/assets/icons/menu3dot.svg" svg-inline />
							</template>
							<template #dropdown-items>
								<li class="dropdown__item" @click="toggleEditModal">
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
		<div class="table__pagination__wrapper" v-if="!adminLoading">
			<div class="title__left">
				<span>Showing Page</span>
				<span>
					{{ currentPage }}
				</span>
				<span>of</span>
				<span>{{ totalPages }}</span>
			</div>

			<paginate
				:page-count="totalPages"
				:click-handler="clickCallback"
				:prev-text="'Prev'"
				:next-text="'Next'"
				:container-class="'pagination__list'"
				:page-class="'pagination__list-item'"
			>
			</paginate>
		</div>

		<modal position="right" v-if="sendInvites" :toggleClass="toggleClass" @close="toggleSendInvites">
			<template #title>
				<h3>Admin Invite</h3>
			</template>
			<template #body>
				<p class="modal-text">Enter a registered email address to send admin invite</p>
				<div>
					<ValidationObserver v-slot="{}">
						<form @submit.prevent="" class="auth-input">
							<label class="form-label form-group" for="">Email</label>
							<div class="email-field">
								<span v-for="(email, index) in emailList" :key="index">
									<InputTag @close="deleteEmail(index)">{{ email }} </InputTag>
								</span>

								<input
									v-if="emailList.length < 1"
									placeholder="johndoe@example.com"
									class="inputField"
									type="email"
									@keyup.enter="addEmail"
									v-model="emailInput"
								/>
								<input v-else class="inputField" type="email" @keyup.enter="addEmail" v-model="emailInput" />
							</div>

							<!-- <label class="select-label" for="admin">Role</label><br />
							<select class="select-input" width="100%" name="admin" id="admin">
								<option value="adminUser">Admin</option>
								<option value="admin">Admin User</option>
								<option value="superAdmin">Super Admin</option>
							</select> -->
							<div class="flex flex__end">
								<c-button @click="inviteAdmin" class="submit" size="large" buttonType="primary">
									<template v-if="!loading">Send Invite</template>
									<Loader v-else />
								</c-button>
							</div>
						</form>
					</ValidationObserver>
				</div>
			</template>
		</modal>

		<modal position="right" v-if="showEditModal" :toggleClass="toggleClass" @close="toggleEditModal">
			<template #title>
				<h3>Edit Info</h3>
			</template>
			<template #body>
				<form action="">
					<div class="auth-input">
						<text-input
							:disabled="true"
							labelVisible
							labelColor="gray"
							v-model="info.name"
							width="100%"
							name="Name"
							placeholder="Ronald Richards"
						/>
						<text-input
							type="email"
							:disabled="true"
							labelVisible
							labelColor="gray"
							v-model="info.email"
							width="100%"
							name="Email"
							placeholder="ronald@volley.com"
						/>

						<label class="select-label" for="admin">Role</label><br />
						<select class="select-input" width="100%" name="adminRole" id="adminRole">
							<option value="user">User</option>
							<option value="admin">Admin</option>
							<option value="superAdmin">Super Admin</option>
						</select>

						<p class="toggle-prompt">Toggle to activate user</p>
						<div class="flex flex__item-center toggle-group">
							<div class="mr-1">
								<Toggle />
							</div>
							<h4 class="toggle-text">Active</h4>
						</div>
						<div class="flex flex-end">
							<c-button class="submit" size="large" buttonType="primary">
								<template v-if="!loading">Save Changes</template>
								<Loader v-else />
							</c-button>
						</div>
					</div>
				</form>
			</template>
		</modal>
	</div>
</template>

<script src="./admin.js"></script>

<style lang="scss" scoped>
@import './Admin.scss';
</style>
