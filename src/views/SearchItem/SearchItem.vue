<template>
	<div>
		<v-nav />
		<main class="main container container--lg">
			<div class="searched__wrapper" :class="{ 'grey-color': hideSearch }">
				<div class="searched__wrapper-content" v-if="!hideSearch">
					<div class="searched__wrapper-header">
						<toggle-dropdown>
							<template #dropdown-wrapper>
								<h3 class="title">
									<template v-if="searchType === 'contact_research'">Contact Research</template>
									<template v-else>Company Research</template>
									<img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline />
								</h3>
							</template>
							<template #dropdown-items>
								<li class="dropdown__item" @click="(searchType = 'company_research'), (filterValue = [])">
									Company Research
								</li>
								<li class="dropdown__item" @click="(searchType = 'contact_research'), (filterValue = [])">
									Contact Research
								</li>
							</template>
						</toggle-dropdown>

						<div class="filter-sort">
							<toggle-dropdown>
								<template #dropdown-wrapper>
									<p class="sort">Sort by <img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline /></p>
								</template>
								<template #dropdown-items>
									<li class="dropdown__item">
										Recent
									</li>
									<li class="dropdown__item">
										Relevance
									</li>
								</template>
							</toggle-dropdown>
							<dropdown-checkbox>
								<template #dropdown-wrapper>
									<span class="filter"><img src="@/assets/icons/filter.svg" svg-inline /></span>
								</template>
								<template #dropdown-items>
									<span v-for="(data, i) in response.data[searchType]" :key="i">
										<li class="dropdown__item" v-if="response.data[searchType][i].length !== 0">
											<d-checkbox v-model="filterValue" inputType="checkbox" :truthValue="i" :name="i">
												{{ i }}
											</d-checkbox>
										</li>
									</span>
								</template>
							</dropdown-checkbox>
						</div>
					</div>

					<div class="searched-result" v-for="(data, i) in research" :key="i">
						<div
							class="searched__item"
							v-for="(dataItem, j) in data"
							:key="j"
							@click="displaySearchItem('company_research', dataItem)"
						>
							<p class="searched__item-title">{{ dataItem.title }}</p>
							<p class="searched__item-desc">
								{{ dataItem.description }}
							</p>
							<a :href="dataItem.url" target="_blank" class="searched__item-url"
								><img src="@/assets/icons/planet-earth.svg" svg-inline />{{ dataItem.url }}</a
							>
						</div>
					</div>
				</div>
				<div class="notepad">
					<span class="title-wrapper">
						<p class="notepad-title">Notepad</p>
						<img src="@/assets/icons/close.svg" svg-inline v-if="hideSearch" @click="hideSearch = false" />
					</span>
					<textarea
						class="notepad-input"
						:rows="rows"
						cols="50"
						name="text"
						@focus="expandNotepad()"
						v-model="notepad"
						id="textArea"
						placeholder="Write down findings from research."
					>
					</textarea>
				</div>
			</div>
			<div class="item__detail">
				<a :href="getSearchedItem.item.url" target="_blank" class="item__detail-url">{{ getSearchedItem.item.url }}</a>
				<p class="item__detail-title">{{ getSearchedItem.item.description }}</p>
				<p class="item__detail-date">23 February, 2021</p>
				<div class="filter__tags" v-if="getSearchedItem.item.tags.length > 0">
					<img class="tag__badge" src="@/assets/icons/tag.svg" alt="" />
					<div class="tag__wrapper">
						<c-tag v-for="(tag, i) in getSearchedItem.item.tags" :key="i">tag</c-tag>
					</div>
				</div>
				<p class="item__detail-content" v-for="(content, i) in getSearchedItem.item.content" :key="i">
					{{ content }}
				</p>
			</div>
		</main>
	</div>
</template>

<script src="./search-item.js"></script>

<style src="../SearchResult/search-result.scss" lang="scss"></style>
<style lang="scss" scoped>
.searched__wrapper {
	border-left: none;
	border-right: 1px solid #f2f2f2;
	padding-bottom: 0;
	&-content {
		max-height: 500px;
		overflow-y: scroll;
	}
	&-header {
		.title {
			display: flex;
			align-items: center;
			svg {
				width: 10px;
				margin-left: 15px;
			}
		}
	}
}
.grey-color {
	background: #fafafa;
}
.item__detail {
	padding: 40px 0 40px 64px;
	&-url {
		letter-spacing: -0.4px;
		color: #0ead69;
	}
	&-title {
		font-size: 20px;
		letter-spacing: -0.53px;
		font-weight: bold;
		margin: 16px 0;
	}
	&-content {
		margin-top: 32px;
		line-height: 1.6;
		letter-spacing: -0.4px;
		max-width: 742px;
	}
	&-date {
		letter-spacing: -0.4px;
		opacity: 0.23;
	}
}
.notepad {
	padding: 15px 0 24px 24px;
	background-color: #fafafa;
	.title-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		svg {
			cursor: pointer;
			width: 17px;
			height: 17px;
		}
	}
	&-input {
		width: 100%;
	}
}
.filter__tags {
	display: flex;
	margin-top: 20px;
	align-items: flex-start;
	.tag__badge {
		margin: 6px 18px 0 0;
	}
	.tag {
		margin: 6px 6px 0 0;
		&__wrapper {
			display: flex;
			flex-wrap: wrap;
		}
	}
}
</style>
