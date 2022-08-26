<template>
	<div class="container container--lg">
		<v-header />
		<main class="main-section">
			<div class="data__enrichment__menu">
				<div>
					<h2 class="main_title mb-1">My Data Enrichments</h2>
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
									<li
										class="dropdown__item"
										v-if="checkedDataEnrichments.length === 0"
										:disabled="history && history.length === 0"
									>
										<button @click="toggleModal('showExportModal')" :disabled="history && history.length === 0">
											Export as csv
										</button>
									</li>
									<li class="dropdown__item" v-else :disabled="checkedDataEnrichments.length === 0">
										<button :disabled="checkedDataEnrichments.length === 0" @click="exportCSV">Export Contacts</button>
									</li>
									<li class="dropdown__item" :disabled="checkedDataEnrichments.length === 0">
										<button :disabled="checkedDataEnrichments.length === 0" @click="[openDeleteModal($event, null)]">
											Delete
										</button>
									</li>
								</template>
							</v-toggle-dropdown>
						</div>
					</div>
				</div>
				<div class="action__group">
					<div class="btn__wrapper" v-if="getLoggedUser.status !== 'suspended'">
						<v-button class="btn__import__contact" @click="$router.push({ name: 'NewEnrichment' })"
							>Start new enrichment</v-button
						>
					</div>
				</div>
			</div>
			<div class="mt-2">
				<v-table
					class="mt-2"
					:tableHeaders="tableHeaders"
					:tableData="history"
					theme="data__platform"
					:loading="pageLoading"
					@checkAll="checkAll"
					:allchecked="checkedDataEnrichments.length === limit"
				>
					<template slot-scope="{ item }">
						<td v-if="getLoggedUser.status !== 'suspended'" class="table__row-item">
							<input
								type="checkbox"
								:value="item.rowId"
								v-model="checkedDataEnrichments"
								:disabled="item.status === 'in-progress' || item.status === 'in-progress'"
							/>
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							{{ item.clientName }} | {{ Object.values(item.parameters)[0] }}
						</td>

						<td class="table__row-item" @click="handleRowClick(item)">
							<div class="table__td__status">
								<span class="status_done" v-if="item.status === 'done'">
									<span class="white__circle">
										<span class="pin"></span>
									</span>
									<span class="text">{{ item.status }}</span>
								</span>
								<span class="status_ready" v-else-if="item.status === 'ready'">
									<span class="white__circle">
										<span class="pin"></span>
									</span>
									<span class="text">{{ item.status }}</span>
								</span>
								<span class="status_pending" v-else>
									<span class="white__circle">
										<span class="pin"></span>
									</span>
									<span class="text">{{ item.status }}</span>
								</span>
							</div>
						</td>

						<td class="table__row-item row-link" @click="handleRowClick(item)">
							<a class="table__td__link" :href="validateURL(item.sourceUrl)" target="_blank">
								<img src="@/assets/icons/link.svg" svg-inline />
							</a>
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							<span v-if="item.status === 'in-progress' || item.status === 'updating'">-</span>
							<span v-else>{{ item.totalContacts }}</span>
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							<span v-if="item.status === 'in-progress' || item.status === 'updating'">-</span>
							<span v-else>{{ item.totalEmails }}</span>
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							<template v-if="item.parameters">
								<ol v-for="[key, value] of Object.entries(item.parameters)" :key="key">
									<strong> {{ key }}: </strong>
									<span>{{ (Array.isArray(value) ? value.join(', ') : value) || '-' }}</span>
								</ol>
							</template>
							<span v-else>-</span>
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							{{ item.clientName }}
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							{{ item.outreachOwnerEmail }}
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							{{ item.bdrOwner }}
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							{{ runTime(item.endTime, item.startTime) }}
						</td>

						<td class="table__row-item" @click="handleRowClick(item)">
							{{ item.createdAt | moment('MMMM D, YYYY') }}
						</td>

						<td class="table__row-item dropdown">
							<!-- menu3dot -->
							<div class="user__menu__wrapper" v-if="item.status !== 'updating'">
								<v-toggle-dropdown class="user__dropdown__menu">
									<template #dropdown-wrapper>
										<img src="@/assets/icons/menu3dot.svg" svg-inline />
									</template>
									<template #dropdown-items>
										<li class="dropdown__item" @click="[refreshResearch($event, item.rowId)]">Refresh</li>
										<li class="dropdown__item" @click="[openDeleteModal($event, item.rowId)]">Delete</li>
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
		<!-- EXPORT MODAL -->
		<v-modal
			v-if="showExportModal"
			position="center"
			:toggleClass="toggleClass"
			@close="toggleModal('showExportModal')"
			maxWidth="400px"
		>
			<template #title>
				<h4 class="modal__header-title">Export as csv</h4>
			</template>
			<template #body>
				<div class="modal__content">
					<p class="modal__content-text">This action will download all your data enrichments history.</p>
					<div class="modal__content-btn">
						<div class="cancel" @click="[toggleModal('showExportModal'), (checkedDataEnrichments = [])]">Cancel</div>
						<v-button
							ref="exportCsvBtn"
							class="config__btn"
							buttonType="primary"
							size="modal"
							@click="[exportCSV(), toggleModal('showExportModal')]"
						>
							<span style="color: #fff">Continue</span>
						</v-button>
					</div>
				</div>
			</template>
		</v-modal>
		<!-- DELETE MODAL -->
		<v-modal v-if="showModal" position="center" :toggleClass="toggleClass" @close="toggleModal('showModal')" maxWidth="400px">
			<template #title>
				<h4 class="modal__header-title">Delete Data</h4>
			</template>
			<template #body>
				<div class="modal__content">
					<p class="modal__content-text" v-if="dataToDelete.rowId">
						Kindly confirm that you want to delete this deta enrichment.
					</p>
					<p class="modal__content-text" v-else>
						Kindly confirm that you want to delete
						{{
							checkedDataEnrichments.length > 1
								? `${checkedDataEnrichments.length} data enrichments`
								: `${checkedDataEnrichments.length} data enrichment`
						}}.
					</p>
					<div class="modal__content-btn">
						<div class="cancel" @click="[toggleModal('showModal'), (deleting = false), (checkedDataEnrichments = [])]">
							Cancel
						</div>
						<v-button :disabled="deleting" class="config__btn" buttonType="warning" size="modal" @click="deleteEnrichmentData">
							<Loader v-if="deleting" color="#ca1c1c" />
							<span v-else>Delete</span>
						</v-button>
					</div>
				</div>
			</template>
		</v-modal>
	</div>
</template>

<script src="./data-platform.js"></script>
<style lang="scss" scoped src="./data-platform.scss"></style>
<style lang="scss">
.table--data__platform {
	overflow: auto;
	display: block;
	width: 100%;
	tbody {
		.table__row {
			border-bottom: 1px solid #bac2c9;
			cursor: pointer !important;
			&:hover {
				background-color: #ebedfe57;
			}
			&-item {
				white-space: nowrap;
				overflow: hidden;
				max-width: 195px;
				text-overflow: ellipsis;
				span {
					font-weight: 400;
				}
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
</style>
