<template>
	<div class="container container--lg">
		<nav class="navbar">
			<div class="nav-item logo">
				<img src="@/assets/icons/logo.svg" svg-inline />
				<h3 class="ml-1 logo-text">Volley App</h3>
			</div>
			<div class="nav__menu__right">
				<div class="search__icon__wrapper">
					<img src="@/assets/icons/search-icon.svg" svg-inline />
				</div>
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
						<v-button disabled class="btn__export__csv" @click="submitSearch">
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
				<v-table :tableHeaders="tableHeaders" :tableData="tableData" theme="contact__research">
					<template name="table-row" slot-scope="{ item }">
						<td class="table__row-item">
							<input type="checkbox" />
						</td>
						<td class="table__row-item">
							<div class="table__td__name">
								<div class="initials__logo">{{ item.initials }}</div>
								<div class="name__email__wrapper">
									<div class="text__name">{{ item.name }}</div>
									<div class="text__email">{{ item.email }}</div>
								</div>
							</div>
						</td>
						<td class="table__row-item">
							{{ item.company }}
						</td>
						<td class="table__row-item">
							{{ item.title }}
						</td>
						<td class="table__row-item">
							<a class="table__td__link" :href="item.linkedin" target="_blank"> {{ item.linkedin }} </a>
						</td>
						<td class="table__row-item">
							{{ item.research_score }}
						</td>
						<td class="table__row-item">
							{{ item.last_updated }}
						</td>
						<td class="table__row-item">
							<div class="table__td__status">
								<span class="status_done" v-if="item.research_status === 'Done'">
									<span class="white__circle">
										<span class="pin"></span>
									</span>
									<span class="text">{{ item.research_status }}</span>
								</span>
								<span class="status_pending" v-else>
									<span class="white__circle">
										<span class="pin"></span>
									</span>
									<span class="text">{{ item.research_status }}</span>
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
				<div class="table__pagination__wrapper">
					<div class="title__left">
						<span>Showing Page</span>
						<span>1-10</span>
						<span>of</span>
						<span>20</span>
					</div>
					<div class="page__left">
						<span>Prev</span>
						<span class="active">1</span>
						<span>2</span>
						<span>3</span>
						<span>
							<img src="@/assets/icons/moredot3.svg" class="ml-1" svg-inline />
						</span>
						<span>10</span>
						<span>Next</span>
					</div>
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
		}
	}
}
</style>
