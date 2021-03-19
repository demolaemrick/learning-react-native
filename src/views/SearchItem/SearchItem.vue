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
									<span v-for="(data, i) in getSearchedResult[searchType]" :key="i">
										<li class="dropdown__item" v-if="getSearchedResult[searchType][i].length !== 0">
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
						<img src="@/assets/icons/collapse.svg" svg-inline v-if="hideSearch" @click="hideSearch = false" />
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
				<p class="item__detail-date">{{ new Date(getSearchedItem.item.meta.published) | moment('Do, MMMM YYYY') }}</p>
				<div class="filter__tags" v-if="getSearchedItem.item.tags.length > 0">
					<img class="tag__badge" src="@/assets/icons/tag.svg" alt="" />
					<div class="tag__wrapper">
						<span v-for="(tag, i) in getSearchedItem.item.tags" :key="i"
							><c-tag v-if="tag !== null">{{ tag }}</c-tag></span
						>
					</div>
				</div>
				<loading-state v-if="loading" />
				<template v-else>
					<iframe v-if="can_render" class="mt-2 iframe-wrapper" id="myframe" width="500" height="500" :src="getSearchedItem.item.url"></iframe>

					<p v-else class="item__detail-content" v-for="(content, i) in itemContent" :key="i">
						{{ content }}
					</p>
				</template>
			</div>
		</main>
	</div>
</template>

<script src="./search-item.js"></script>

<style src="../SearchResult/search-result.scss" lang="scss" scoped></style>
<style lang="scss" src="./search-item.scss" scoped></style>
