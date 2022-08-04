<template>
	<div class="container container--lg">
		<v-header />
		<main class="main-section">
			<div class="text__title main_title flex flex-spaced">
				<h2>My Data Enrichments</h2>
				<v-button class="btn__import__contact">Start new enrichment</v-button>
			</div>
			<div class="contact__research__menu"></div>
			<div class="mt-2">
				<v-table
					:tableHeaders="tableHeaders"
					:tableData="history"
					theme="contact__research"
					:loading="pageLoading"
					@checkAll="checkAll"
					@sortTable="sortTable"
					:allchecked="checkedContacts.length === limit"
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
