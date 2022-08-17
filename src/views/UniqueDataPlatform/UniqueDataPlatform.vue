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
				<template>
					<div v-if="pageLoading" class="emails-text--loading"></div>
					<p v-else class="emails-text">Emails Found: {{ emailsFound }} ({{ percentageOfEmailsFound }})</p>
				</template>
			</div>
			<div class="mt-2">
				<v-table :tableHeaders="tableHeaders" :tableData="dataHistory" theme="data__platform" :loading="pageLoading">
					<template name="table-row" slot-scope="{ item }" class="pu">
						<td class="table__row-item">{{ item.firstName || '-' }} {{ item.lastName }}</td>
						<td class="table__row-item">
							{{ item.title || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.company || '-' }}
						</td>
						<td class="table__row-item">
							<a v-if="item.companyLl" class="table__td__link" :href="validateURL(item.companyLi)" target="_blank">
								<img src="@/assets/icons/link.svg" svg-inline />
							</a>
							<span v-else>-</span>
						</td>
						<td class="table__row-item">
							<a v-if="item.contactsLl" class="table__td__link" :href="validateURL(item.contactsLl)" target="_blank">
								<img src="@/assets/icons/link.svg" svg-inline />
							</a>
							<span v-else>-</span>
						</td>
						<td class="table__row-item">
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
								<span class="status_pending" v-else-if="item.stause === 'pending'">
									<span class="white__circle">
										<span class="pin"></span>
									</span>
									<span class="text">{{ item.status }}</span>
								</span>
								<span v-else>{{ '-' }}</span>
							</div>
						</td>
						<td class="table__row-item">
							{{ item.email || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.email_verification || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.seniority || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.function || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.compHeadcount || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.compIndustry || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.compRevenue || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.compCity || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.compState || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.compCountry || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.keywords || '-' }}
						</td>
						<td class="table__row-item">
							{{ item.compWebsite || '-' }}
						</td>
					</template>
				</v-table>
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
<style lang="scss">
.table--data__platform {
	overflow: auto;
	display: block;
	width: 100%;
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
