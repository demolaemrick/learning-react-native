<template>
	<div class="container container--lg">
		<v-header />
		<config-data
			v-if="openConfigPage"
			@closeConfig="openConfigPage = false"
			:headers="csvHeaders"
			:dataFields="dataFields"
			:csvFields="csvFields"
			@submitImportCSV="submitImportCSV"
			:loading="loading"
		/>
		<main class="main-section">
			<div class="text__title main_title">
				<h2>Contact Research</h2>
			</div>
			<div class="contact__research__menu">
				<div class="btn__wrapper" v-if="getLoggedUser.status !== 'suspended'">
					<div class="btn__export__csv user__menu__wrapper">
						<v-toggle-dropdown class="user__dropdown__menu" width="185px" left="0" itemPadding="0.9rem">
							<template #dropdown-wrapper>
								<p class="flex action_text">
									<span>Actions</span>
									<img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline />
								</p>
							</template>
							<template #dropdown-items>
								<li class="dropdown__item" v-if="checkedContacts.length === 0" @click="exportCSV">Export Contacts</li>
								<li class="dropdown__item" v-else :disabled="checkedContacts.length === 0" @click="exportCSV">
									Export Contacts
								</li>
								<li
									class="dropdown__item"
									:disabled="checkedContacts.length === 0"
									@click="[openDeleteModal($event, null, null)]"
								>
									Delete
								</li>
							</template>
						</v-toggle-dropdown>
					</div>
				</div>
				<div class="action__group">
					<!-- <div class="btn__wrapper"> -->
					<VTextInput
						class="mb-0"
						type="text"
						placeholder="Search"
						v-model="searchQuery"
						:icon="{ type: 'search' }"
						width="509px"
						@clear="clearSearch"
					/>
					<!-- <v-button :disabled="checkedContacts.length === 0" class="btn__export__csv" @click="exportCSV">
							<template v-if="!exportLoading">Export CSV</template>
							<Loader v-else />
						</v-button> -->
					<!-- </div> -->
					<div class="btn__wrapper" v-if="getLoggedUser.status !== 'suspended'">
						<file-upload
							:drop="false"
							ref="upload"
							:extensions="extensions"
							:accept="accept"
							@input-file="inputFile"
							v-model="files"
						>
							<v-button class="btn__import__contact">Import Contacts</v-button>
						</file-upload>
					</div>
				</div>
			</div>
			<div class="mt-2">
				<v-table
					:tableHeaders="tableHeaders"
					:tableData="history"
					theme="contact__research"
					:loading="pageLoading"
					@checkAll="checkAll"
					@sortTable="sortTable"
				>
					<template name="table-row" slot-scope="{ item }" class="pu">
						<td v-if="getLoggedUser.status !== 'suspended'" class="table__row-item">
							<input
								type="checkbox"
								:value="item.rowId"
								v-model="checkedContacts"
								:disabled="item.status.statusCode === 'IN_PROGRESS' || item.status.statesCode === 'IN_PROGRESS'"
							/>
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<div class="table__td__name">
								<template v-if="item.status.statusCode === 'READY' && item.images && item.images.length">
									<img class="searchImage" :src="item.images[0]" alt="" />
								</template>

								<div v-else class="initials__logo">
									{{ getInitials(item.full_name) }}
								</div>

								<div class="name__email__wrapper">
									<div class="text__name">{{ stringElipsis(item.full_name, 15) }}</div>
									<div class="text__email">{{ item.email }}</div>
								</div>
							</div>
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.company }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<template v-if="!item.role">-</template>
							<template v-else
								><p class="text__title">{{ item.role }}</p></template
							>
						</td>
						<td class="table__row-item row-link" @click="clickResearch(item)">
							<template v-if="!item.linkedin"><p class="table__td__link">-</p></template>
							<template v-else
								><a class="table__td__link" :href="validateURL(item.linkedin)" target="_blank">
									<img src="@/assets/icons/link.svg" svg-inline /> </a
							></template>
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<template v-if="item.research_score === 0.1">-</template>
							<template v-else>{{ (item.research_score * 100).toFixed(2) }}%</template>
						</td>
						<td class="table__row-item" @click="clickResearch">
							{{ item.updatedAt | moment('from', 'now') }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<div class="table__td__status">
								<span class="status_done" v-if="item.status.statusCode === 'DONE'">
									<span class="white__circle">
										<span class="pin"></span>
									</span>
									<span class="text">{{ item.status.message }}</span>
								</span>
								<span class="status_ready" v-else-if="item.status.statusCode === 'READY'">
									<span class="white__circle">
										<span class="pin"></span>
									</span>
									<span class="text">{{ item.status.message }}</span>
								</span>
								<span class="status_pending" v-else>
									<span class="white__circle">
										<span class="pin"></span>
									</span>
									<span class="text">{{ item.status.message }}</span>
								</span>
							</div>
						</td>
						<td class="table__row-item dropdown">
							<!-- menu3dot -->
							<div class="user__menu__wrapper" v-if="item.status.message.toLowerCase() !== 'updating'">
								<v-toggle-dropdown class="user__dropdown__menu">
									<template #dropdown-wrapper>
										<img src="@/assets/icons/menu3dot.svg" svg-inline />
									</template>
									<template #dropdown-items>
										<li class="dropdown__item" @click="[RefreshResearch($event, item.rowId)]">Refresh</li>
										<li class="dropdown__item" @click="[openDeleteModal($event, item.rowId, item.full_name)]">
											Delete
										</li>
									</template>
								</v-toggle-dropdown>
							</div>
						</td>
					</template>
				</v-table>
				<div class="table__pagination__wrapper" v-if="!pageLoading && history && history.length > 0">
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
						v-model="page"
						:click-handler="clickCallback"
						:prev-text="'Prev'"
						:next-text="'Next'"
						:container-class="'pagination__list'"
						:page-class="'pagination__list-item'"
					>
					</paginate>
				</div>
				<div v-if="history && history.length < 1">
					<div class="emptyState">
						<img src="@/assets/icons/empty-state-image.svg" svg-inline />
						<p class="emptyState-text">No research record found</p>
					</div>
				</div>
			</div>

			<!-- SUSPENDED USER NOTIFICATION MODAL -->
			<suspended-modal :show="showSuspendedModal" :close="closeSuspendedModal" :user="getLoggedUser" />
			<!-- SUSPENDED USER NOTIFICATION MODAL -->
		</main>
		<v-modal v-if="showModal" position="center" :toggleClass="toggleClass" @close="toggleModal" maxWidth="400px">
			<template #title>
				<h4 class="modal__header-title">Delete Research</h4>
			</template>
			<template #body>
				<div class="modal__content">
					<p class="modal__content-text" v-if="contactToDelete.rowId">
						Kindly confirm that you want to delete this research <span class="name">({{ contactToDelete.full_name }})</span>.
					</p>
					<p class="modal__content-text" v-else>
						Kindly confirm that you want to delete
						{{ checkedContacts.length > 1 ? `${checkedContacts.length} researches` : `${checkedContacts.length} research` }}.
					</p>
					<div class="modal__content-btn">
						<div class="cancel" @click="[toggleModal(), (deleting = false), (checkedContacts = [])]">Cancel</div>
						<v-button :disabled="deleting" class="config__btn" buttonType="warning" size="modal" @click="deleteResearch">
							<Loader v-if="deleting" color="#ca1c1c" />
							<span v-else>Delete</span>
						</v-button>
					</div>
				</div>
			</template>
		</v-modal>
	</div>
</template>

<script src="./contactResearch.js"></script>
<style lang="scss" scoped src="./contactresearch.scss"></style>
<style lang="scss">
.table--contact__research {
	tbody {
		.table__row {
			border-bottom: 1px solid #bac2c9;
			cursor: pointer;
			&:hover {
				background-color: #ebedfe57;
			}
			&-item {
				white-space: nowrap;
				overflow: hidden;
				max-width: 195px;
				text-overflow: ellipsis;
				&.dropdown {
					overflow: unset;
					padding: 0.5rem;
				}
			}
		}
		.disable-row {
			cursor: not-allowed;
		}
	}
}
.pagination__list {
	display: flex;
	align-items: center;
	li {
		margin-left: 0.5em;
		font-size: 16px;

		a {
			color: #333758;
		}
		&.active {
			background: rgba(47, 46, 128, 0.1);
			border-radius: 2px;
			padding: 5px 10px;
		}
		&.disabled {
			a {
				cursor: not-allowed;
			}
		}
	}
}
.file-uploads.file-uploads-html4 input,
.file-uploads.file-uploads-html5 label {
	cursor: pointer !important;
}
</style>
