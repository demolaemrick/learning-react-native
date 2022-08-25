<template>
	<div>
		<v-header />
		<main class="main-section">
			<div class="main_title flex flex-spaced">
				<div v-if="!pageLoading" class="flex flex__item-center" style="min-height: 100px">
					<div class="mr-1" @click="[$router.go(-1), $forceUpdate()]">
						<img class="icon" src="@/assets/icons/arrow-back.svg" svg-inline alt="back icon" />
					</div>
					{{ clientName }} | {{ parameter }}
				</div>
				<div v-else class="text--loading"></div>

				<template>
					<div v-if="pageLoading" class="text--loading"></div>
					<div v-else class="flex flex__item-center">
						<p class="emails-text mr-1">Emails Found: {{ emailsFound }} ({{ percentageOfEmailsFound }})</p>
						<div class="btn__wrapper">
							<v-button class="btn__import__contact" @click="downloadCSV">
								<template v-if="!downloading">Download CSV</template>
								<Loader v-else />
							</v-button>
						</div>
					</div>
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
							<a
								v-if="item.linkedInCompany"
								class="table__td__link"
								:href="validateURL(item.linkedInCompany)"
								target="_blank"
							>
								<img src="@/assets/icons/link.svg" svg-inline alt="" />
							</a>
							<span v-else>-</span>
						</td>
						<td class="table__row-item">
							<a v-if="item.profileUrl" class="table__td__link" :href="validateURL(item.profileUrl)" target="_blank">
								<img src="@/assets/icons/link.svg" svg-inline alt="" />
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
							<span v-if="!item.emails || item.emails.length <= 0">-</span>
							<span v-else> {{ item.emails[0].address || '-' }} </span>
						</td>
						<td class="table__row-item">
							{{ item.emailVerification || '-' }}
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
							<a v-if="item.compWebsite" class="table__td__link" :href="validateURL(item.compWebsite)" target="_blank">
								{{ item.compWebsite }}
							</a>
							<span v-else>-</span>
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
						<img src="@/assets/icons/empty-state-image.svg" svg-inline alt="" />
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
.main__title {
	text-transform: capitalize;
}
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
.icon {
	cursor: pointer;
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
