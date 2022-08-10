<template>
	<div>
		<v-header />
		<main class="main-section">
			<div class="contact__research__menu">
				<div class="main_title">My Data Enrichments</div>
				<div class="action__group">
					<div class="btn__wrapper">
						<v-button class="btn__import__contact" @click="$router.push({ name: 'NewEnrichment' })"
							>Start new enrichment</v-button
						>
					</div>
				</div>
			</div>
			<div class="mt-2">
				<v-table class="mt-2" :tableHeaders="tableHeaders" :tableData="Array(5).fill(tableData)" :loading="pageLoading">
					<template slot-scope="{ item }">
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.search_id }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.search_type }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<ol>
								<li><span>Industry:</span> {{ item.parameters.industry }}</li>
								<li><span>CompanySize: </span> {{ item.parameters.size }}</li>
								<li><span>Seniority: </span> {{ item.parameters.seniority }}</li>
								<li><span>Keywords:</span> {{ item.parameters.keywords }}</li>
							</ol>
						</td>
						<td class="table__row-item row-link" @click="clickResearch(item)">
							{{ item.original_data_source }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.total_contacts }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.emails_found }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.client }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.outreach_owner_email }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.bdr_owner }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.date }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<div class="table__td__status">
								<span class="status_done" v-if="item.status === 'DONE'">
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
				<div class="table__pagination__wrapper">
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
		<v-modal v-if="showModal" position="center" :toggleClass="toggleClass" @close="toggleModal('showModal')" maxWidth="400px">
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
						<div class="cancel" @click="[toggleModal('showModal'), (deleting = false), (checkedContacts = [])]">Cancel</div>
						<v-button :disabled="deleting" class="config__btn" buttonType="warning" size="modal" @click="deleteResearch">
							<Loader v-if="deleting" color="#ca1c1c" />
							<span v-else>Delete</span>
						</v-button>
					</div>
				</div>
			</template>
		</v-modal>

		<v-modal
			v-if="showExportModal"
			position="center"
			:toggleClass="toggleClass"
			@close="toggleModal('showExportModal')"
			maxWidth="400px"
		>
			<template #title>
				<h4 class="modal__header-title">Export Research</h4>
			</template>
			<template #body>
				<div class="modal__content">
					<p class="modal__content-text">This action will download all your contact researches.</p>
					<div class="modal__content-btn">
						<div class="cancel" @click="[toggleModal('showExportModal'), (checkedContacts = [])]">Cancel</div>
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
	</div>
</template>

<script src="./data-platform.js"></script>
<style lang="scss" scoped src="./data-platform.scss"></style>
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
