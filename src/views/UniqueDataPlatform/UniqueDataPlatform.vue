<template>
	<div class="container container--lg">
		<v-header />
		<main class="main-section">
			<div class="text__title main_title flex flex-spaced">
				<div class="flex flex__item-center">
					<div class="mr-1" @click="[$router.go(-1), $forceUpdate()]">
						<img class="icon" src="@/assets/icons/arrow-back.svg" svg-inline />
					</div>
					<h2>Unique ID/tag</h2>
				</div>
				<div class="flex flex__item-center">
					<p class="mr-3 emails-text">Emails Found: 50/100 (50%)</p>
					<v-button class="btn__import__contact">Export to Outreach.io</v-button>
				</div>
			</div>
			<div class="contact__research__menu"></div>
			<div class="mt-2">
				<v-table
					:tableHeaders="tableHeaders"
					:tableData="Array(4).fill(tableData)"
					theme="contact__research"
					:loading="pageLoading"
				>
					<template name="table-row" slot-scope="{ item }" class="pu">
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.name }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.title }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.company }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<!-- {{ item.company_ll }} -->
							<img class="icon" src="@/assets/icons/link.svg" svg-inline />
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<img class="icon" src="@/assets/icons/link.svg" svg-inline />
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.outreach_status }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.email }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.email_verification }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.seniority }}
						</td>

						<!-- <td class="table__row-item" @click="clickResearch(item)">
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
						</td> -->
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

<script src="./unique-data-platform.js"></script>
<style lang="scss" scoped src="./unique-data-platform.scss"></style>
<style lang="scss" scoped src="../ContactResearch/contactresearch.scss"></style>
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
</style>
