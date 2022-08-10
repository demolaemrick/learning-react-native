<template>
	<div>
		<v-header />
		<main class="main-section">
			<div class="main_title flex flex-spaced">
				<div class="flex flex__item-center">
					<div class="mr-1" @click="[$router.go(-1), $forceUpdate()]">
						<img class="icon" src="@/assets/icons/arrow-back.svg" svg-inline />
					</div>
					<h2 class="text__title">Unique ID/tag</h2>
				</div>
				<div class="flex flex__item-center">
					<p class="emails-text mr-3">Emails Found: 50/100 (50%)</p>
					<v-button class="btn__import__contact" @click="toggleModal">Export to Outreach.io</v-button>
				</div>
			</div>
			<div class="contact__research__menu"></div>
			<div class="mt-2">
				<carousel :navigationEnabled="true" :perPage="1" navigationNextLabel="" navigationPrevLabel="">
					<slide>
						<v-table
							:tableHeaders="tableHeaders"
							:tableData="Array(10).fill(tableData)"
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
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.email }}
								</td>
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.email_verification }}
								</td>
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.seniority }}
								</td>
							</template>
						</v-table>
					</slide>
					<slide>
						<v-table
							:tableHeaders="tableHeaders2"
							:tableData="Array(10).fill(tableData2)"
							theme="contact__research"
							:loading="pageLoading"
						>
							<template name="table-row" slot-scope="{ item }" class="pu">
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.function }}
								</td>
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.company_headcount }}
								</td>
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.company_industry }}
								</td>
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.company_revenue }}
								</td>
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.company_city }}
								</td>
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.company_state }}
								</td>
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.company_country }}
								</td>
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.company_keywords }}
								</td>
								<td class="table__row-item" @click="clickResearch(item)">
									{{ item.company_website }}
								</td>
							</template>
						</v-table>
					</slide>
				</carousel>
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
						<p class="emptyState-text">No data enrichment record found</p>
					</div>
				</div>
			</div>

			<!-- SUSPENDED USER NOTIFICATION MODAL -->
			<suspended-modal :show="showSuspendedModal" :close="closeSuspendedModal" :user="getLoggedUser" />
			<!-- SUSPENDED USER NOTIFICATION MODAL -->
		</main>
		<template v-if="showModal">
			<v-modal position="center" :useSlot="false" marginTop="6%">
				<template #settings>
					<div class="modal__wrapper">
						<div class="modal__header">
							<div class="modal__header__btn__wrapper">
								<div class="modal__btn__content__wrapper" @click="closeModal()">
									<span class="text">Close</span>
									<span class="icon">
										<img src="@/assets/icons/close-sign.svg" alt="close button icon" class="ml-1" svg-inline />
									</span>
								</div>
							</div>
						</div>
						<div class="modal__content">
							<div class="modal__content__icon__wrapper">
								<img src="@/assets/icons/warning-icon.svg" alt="volley warning icon" class="ml-1" svg-inline />
							</div>
							<h3>Your outreach export is in progress</h3>
							<div class="modal__text__wrapper">
								<p>
									volley robots are currently helping import your leads to {outreach_user_name}'s account for
									{client_name}! You can leave this screen, we'll send you an email when everything is complete!
								</p>
							</div>
							<div class="modal__btn__wrapper">
								<v-button @click="$router.push({ name: 'DataPlatform' })" buttonType="primary"
									>Return to Data Platform</v-button
								>
							</div>
						</div>
					</div>
				</template>
			</v-modal>
		</template>
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

.VueCarousel-navigation-next {
	background: url('../../assets/icons/NextBtn.svg') !important;
	background-repeat: no-repeat !important;
}

.VueCarousel-navigation-prev {
	background: url('../../assets/icons/PrevBtn.svg') !important;
	background-repeat: no-repeat !important;
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
	padding: 0;
	cursor: pointer;
	outline: none;
	width: 32px;
	height: 32px;
	top: 398px;
	background: #ffffff;
	border: 1px solid #eaebeb;
	border-radius: 50%;
}
</style>
