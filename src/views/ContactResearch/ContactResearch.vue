<template>
	<div class="container container--lg">
		<nav class="navbar">
			<div class="nav-item logo">
				<logo />
			</div>
			<div class="nav__menu__right">
				<!-- <div class="search__icon__wrapper">
					<img src="@/assets/icons/search-icon.svg" svg-inline />
				</div> -->
				<div class="user__menu__wrapper">
					<v-toggle-dropdown class="user__dropdown__menu">
						<template #dropdown-wrapper>
							<img class="mr-1" src="@/assets/icons/user-icon.svg" svg-inline />
							<img src="@/assets/icons/carret-down.svg" svg-inline />
						</template>
						<template #dropdown-items>
							<li class="dropdown__item">
								Settings
							</li>
							<li class="dropdown__item">
								Logout
							</li>
						</template>
					</v-toggle-dropdown>
				</div>
			</div>
		</nav>
		<main class="main-section">
			<div class="contact__research__menu">
				<div class="text__title">
					<h2>Contact Research</h2>
				</div>
				<div class="action__group">
					<div class="btn__wrapper">
						<v-button :disabled="checkedContacts.length === 0" class="btn__export__csv" @click="exportCSV">
							Export CSV
						</v-button>
					</div>
					<div class="btn__wrapper">
						<v-button class="btn__import__contact" @click="submitSearch">
							Import Contacts
						</v-button>
					</div>
				</div>
			</div>
			<div class="contact__research__table__wrapper">
				<v-table
					:tableHeaders="tableHeaders"
					:tableData="history"
					theme="contact__research"
					:loading="pageLoading"
					@checkAll="checkAll"
				>
					<template name="table-row" slot-scope="{ item }" class="pu">
						<td class="table__row-item">
							<input
								type="checkbox"
								:value="item.rowId"
								v-model="checkedContacts"
								:disabled="item.status.statusCode === 'IN_PROGRESS' || item.status.statesCode === 'IN_PROGRESS'"
							/>
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<div class="table__td__name">
								<div class="initials__logo">
									{{
										item.full_name
											.match(/\b(\w)/g)
											.join('')
											.toUpperCase()
									}}
								</div>
								<div class="name__email__wrapper">
									<div class="text__name">{{ item.full_name }}</div>
									<div class="text__email">{{ item.email }}</div>
								</div>
							</div>
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.company }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<template v-if="!item.role">No Data</template>
							<template v-else>{{ item.role }}</template>
						</td>
						<td class="table__row-item row-link" @click="clickResearch(item)">
							<template v-if="!item.linkedin">No Data</template>
							<template v-else
								><a class="table__td__link" :href="item.linkedin" target="_blank"> {{ item.linkedin }} </a></template
							>
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<template v-if="!item.research_score">No Data</template>
							<template v-else>{{ item.research_score }}</template>
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							{{ item.createdAt | moment('from', 'now') }}
						</td>
						<td class="table__row-item" @click="clickResearch(item)">
							<div class="table__td__status">
								<span class="status_done" v-if="item.status.statusCode === 'READY' || item.status.statusCode === 'DONE'">
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
						<td class="table__row-item">
							<!-- menu3dot -->
							<div class="user__menu__wrapper">
								<v-toggle-dropdown class="user__dropdown__menu">
									<template #dropdown-wrapper>
										<img src="@/assets/icons/menu3dot.svg" svg-inline />
									</template>
									<template #dropdown-items>
										<li class="dropdown__item">
											View
										</li>
										<li class="dropdown__item">
											Pause
										</li>
										<li class="dropdown__item">
											Delete
										</li>
									</template>
								</v-toggle-dropdown>
							</div>
						</td>
					</template>
				</v-table>
				<div class="table__pagination__wrapper" v-if="!pageLoading">
					<div class="title__left">
						<span>Showing Page</span>
						<span>
							<template v-if="currentPage === 1">{{ 10 * 0 + 1 }} -{{ (0 + 1) * 10 }}</template>
							<template v-else>{{ 10 * currentPage + 1 }} -{{ (currentPage + 1) * 10 }}</template>
						</span>
						<span>of</span>
						<span>{{ count }}</span>
					</div>

					<paginate
						:page-count="total"
						:margin-pages="2"
						:click-handler="clickCallback"
						:prev-text="'Prev'"
						:next-text="'Next'"
						:container-class="'pagination__list'"
						:page-class="'pagination__list-item'"
					>
					</paginate>
				</div>
			</div>
		</main>
	</div>
</template>

<script src="./contactResearch.js"></script>
<style lang="scss" scoped src="./contactresearch.scss"></style>
<style lang="scss">
.table--contact__research {
	tbody {
		.table__row {
			border-bottom: 1px solid #bac2c9;
			cursor: pointer;
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
	}
}
</style>
