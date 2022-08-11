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
				<v-table class="mt-2" :tableHeaders="tableHeaders" :tableData="history" :loading="pageLoading">
					<template slot-scope="{ item }">
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.rowId }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.searchType }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<!-- <ol>
								<li><span>Industry:</span> {{ item.parameters.industry }}</li>
								<li><span>CompanySize: </span> {{ item.parameters.size }}</li>
								<li><span>Seniority: </span> {{ item.parameters.seniority }}</li>
								<li><span>Keywords:</span> {{ item.parameters.keywords }}</li>
							</ol> -->
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
							{{ item.createdAt | moment('MMMM D, YYYY') }}
						</td>
						<td class="table__row-item" @click="handleRowClick(item)">
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
		</main>
	</div>
</template>

<script src="./data-platform.js"></script>
<style lang="scss" scoped src="./data-platform.scss"></style>
<style lang="scss">
.table--data__platform {
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
