<template>
	<div class="container container--lg">
		<v-header />
		<main class="main-section">
			<div class="contact__research__menu">
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
										<button @click="showExportModal = true" :disabled="history && history.length === 0">
											Export as csv
										</button>
									</li>
									<li class="dropdown__item" v-else :disabled="checkedDataEnrichments.length === 0">
										<button :disabled="checkedDataEnrichments.length === 0" @click="exportCSV">Export Contacts</button>
									</li>
									<li class="dropdown__item" :disabled="checkedDataEnrichments.length === 0">
										<button
											:disabled="checkedDataEnrichments.length === 0"
											@click="[openDeleteModal($event, null, null)]"
										>
											Delete
										</button>
									</li>
								</template>
							</v-toggle-dropdown>
						</div>
					</div>
				</div>
				<div class="action__group">
					<div class="btn__wrapper">
						<v-button class="btn__import__contact" @click="$router.push({ name: 'NewEnrichment' })" :disabled="pageLoading"
							>Start new enrichment</v-button
						>
					</div>
				</div>
			</div>
			<div class="contact__research__menu"></div>
			<div class="mt-2">
				<v-table
					class="mt-2"
					:tableHeaders="tableHeaders"
					:tableData="history"
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
								:disabled="item.status === 'IN_PROGRESS' || item.status === 'IN_PROGRESS'"
							/>
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							{{ item.rowId }}
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							{{ item.searchType }}
						</td>

						<td class="table__row-item row-link" @click="handleRowClick(item)">
							{{ stringElipsis(item.sourceUrl, 24) }}
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							{{ item.totalContacts }}
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							{{ item.totalEmails }}
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
							{{ item.parameters || '-' }}
							<!-- <ol>
								<li><span>Industry:</span> {{ item.industry || '-' }}</li>
								<li><span>CompanySize: </span> {{ item.size || '-' }}</li>
								<li><span>Seniority: </span> {{ item.seniority || '-' }}</li>
								<li><span>Keywords:</span> {{ item.keywords || '-' }}</li>
							</ol> -->
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
							{{ item.createdAt | moment('MMMM D, YYYY') }}
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
						<p class="emptyState-text">No data enrichment record found</p>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script src="./data-platform.js"></script>
<style lang="scss" scoped src="./data-platform.scss"></style>
<style lang="scss">
.table {
	overflow: auto;
	display: block;
	width: 100%;
}
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
