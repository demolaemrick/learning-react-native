<template>
	<div>
		<v-header />
		<main class="main-section">
			<div class="main_title flex flex-spaced">
				<div class="flex flex__item-center main_title">
					<div class="mr-1" @click="[$router.go(-1), $forceUpdate()]">
						<img class="icon" src="@/assets/icons/arrow-back.svg" svg-inline />
					</div>
					Unique ID/tag
				</div>
				<p class="emails-text">Emails Found: 50/100 (50%)</p>
			</div>
			<div class="contact__research__menu"></div>
			<div class="mt-2">
				<horizontal-scroll>
					<div class="info" v-if="hasScroll" @touchmove.prevent="scrollHorizontal($event)" :class="{ show: showInfo }">
						<img src="@/assets/icons/next-icon.svg" alt="next-icon" />
					</div>
					<div class="table-responsive" ref="table" @scroll.prevent="scrollHorizontal($event)">
						<v-table :tableHeaders="tableHeaders" :tableData="dataHistory" theme="contact__research" :loading="pageLoading">
							<template name="table-row" slot-scope="{ item }" class="pu">
								<td class="table__row-item">
									{{ item.firstName }} {{item.lastName}}
								</td>
								<td class="table__row-item">
									{{ item.title }}
								</td>
								<td class="table__row-item">
									{{ item.company }}
								</td>
								<td class="table__row-item">
									<!-- {{ item.company_ll }} -->
									<img class="icon" src="@/assets/icons/link.svg" svg-inline />
								</td>
								<td class="table__row-item">
									<img class="icon" src="@/assets/icons/link.svg" svg-inline />
								</td>
								<td class="table__row-item">
									<!-- <div class="table__td__status">
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
									</div> -->
								</td>
								<td class="table__row-item">
									<!-- {{ item.email }} -->
								</td>
								<td class="table__row-item">
									<!-- {{ item.email_verification }} -->
								</td>
								<td class="table__row-item">
									{{ item.seniority }}
								</td>
								<td class="table__row-item">
									<!-- {{ item.function }} -->
								</td>
								<td class="table__row-item">
									{{ item.compHeadcount }}
								</td>
								<td class="table__row-item">
									{{ item.compIndustry }}
								</td>
								<td class="table__row-item">
									<!-- {{ item.compRevenue }} -->
								</td>
								<td class="table__row-item">
									{{ item.compCity }}
								</td>
								<td class="table__row-item">
									{{ item.compState }}
								</td>
								<td class="table__row-item">
									{{ item.compCountry }}
								</td>
								<td class="table__row-item" v-for="(keyword, index) in item.compKeywords" :key="index">
									{{ keyword }}
								</td>
								<td class="table__row-item">
									{{ item.compWebsite }}
								</td>
							</template>
						</v-table>
					</div>
					<div class="info prev-icon" v-if="hasScroll" @touchmove.prevent="scrollHorizontal($event)" :class="{ show: showInfo }">
						<img src="@/assets/icons/prev-icon.svg" alt="next-icon" />
					</div>
				</horizontal-scroll>
				<div class="table__pagination__wrapper" v-if="!pageLoading && dataHistory && dataHistory.length > 0">
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
				<div v-if="dataHistory && dataHistory.length < 1">
					<div class="emptyState">
						<img src="@/assets/icons/empty-state-image.svg" svg-inline />
						<p class="emptyState-text">No record found</p>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script src="./unique-data-platform.js"></script>
<style lang="scss" scoped src="./unique-data-platform.scss"></style>
<!-- <style lang="scss" scoped src="../ContactResearch/contactresearch.scss"></style> -->
<style lang="scss">
.table--contact__research {
	tbody {
		.table__row {
			border-bottom: 1px solid #bac2c9;
			cursor: pointer;
			scrollWidth &:hover {
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

/* CAROUSEL */
.VueCarousel-navigation-button:focus {
	outline: none !important;
}
.VueCarousel-pagination {
	display: none !important;
}
.VueCarousel-navigation-button {
	position: absolute;
	box-sizing: border-box;
	color: #000;
	text-decoration: none;
	appearance: none;
	border: none;
	background-color: transparent;
	margin: 10px !important;
	cursor: pointer;
	outline: none;
	/* width: 32px;
	height: 32px; */
	top: 398px;
	background: #ffffff;
	border: 1px solid #eaebeb;
	border-radius: 50%;
	opacity: none !important;
}
</style>
