<template>
	<div>
		<div class="container container--lg">
			<v-header />

			<main class="main-section">
				<div class="main_title flex flex-spaced ml-2">
					<h2 class="text__title">My Data Enrichments</h2>
					<v-button @click="$router.push({ name: 'NewEnrichment' })">Start new enrichment</v-button>
				</div>
				<div class="mt-1">
					<v-table
						:tableHeaders="tableHeaders"
						:tableData="Array(4).fill(tableData)"
						theme="data__platform"
						:loading="pageLoading"
					>
						<template name="table-row" slot-scope="{ item }" class="pu">
							<td class="table__row-item" @click="clickResearch(item)">
								{{ item.search_id }}
							</td>
							<td class="table__row-item" @click="clickResearch(item)">
								{{ item.search_type }}
							</td>
							<td class="table__row-item" @click="clickResearch(item)">
								<div v-for="[key, value] of Object.entries(item.parameters)" :key="key">
									<strong> {{ key }}: </strong>
									<span>{{ value }}</span>
								</div>
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

				<!-- SUSPENDED USER NOTIFICATION MODAL -->
				<suspended-modal :show="showSuspendedModal" :close="closeSuspendedModal" :user="getLoggedUser" />
				<!-- SUSPENDED USER NOTIFICATION MODAL -->
			</main>
		</div>
	</div>
</template>

<script src="./data-platform.js"></script>
<style lang="scss" scoped src="./data-platform.scss"></style>
<style lang="scss">
.table--data__platform {
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

.table {
	overflow: auto;
	display: block;
	width: 100%;
}
</style>
