<template>
	<div class="">
		<v-nav />
		<main class="main container container--lg">
			<div class="notepad">
				<p class="notepad-title">Notepad</p>
				<textarea
					class="notepad-input"
					rows="20"
					cols="50"
					name="text"
					id="textArea"
					v-model="notepad"
					placeholder="Write down findings from research."
				>
				</textarea>
			</div>
			<!-- contact search -->
			<div class="contact searched__wrapper">
				<div class="searched__wrapper-header">
					<h3 class="title">Contact Research</h3>
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
								<span v-for="(data, i) in response.data.contact_research" :key="i">
									<li class="dropdown__item" v-if="response.data.contact_research[i].length !== 0">
										<d-checkbox v-model="contactFilter" inputType="checkbox" :truthValue="i" :name="i">
											{{ i }}
										</d-checkbox>
									</li>
								</span>
							</template>
						</dropdown-checkbox>
					</div>
				</div>
				<div class="searched-result" v-for="(data, i) in contact_research" :key="i">
					<div
						class="searched__item"
						v-for="(dataItem, j) in data"
						:key="j"
						@click="displaySearchItem('contact_research', dataItem)"
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

			<!-- company search -->
			<div class="contact searched__wrapper">
				<div class="searched__wrapper-header">
					<h3 class="title">Company Research</h3>
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
								<span v-for="(data, i) in response.data.company_research" :key="i">
									<li class="dropdown__item" v-if="response.data.company_research[i].length !== 0">
										<d-checkbox v-model="companyFilter" inputType="checkbox" :truthValue="i" :name="i">
											{{ i }}
										</d-checkbox>
									</li>
								</span>
							</template>
						</dropdown-checkbox>
					</div>
				</div>
				<div class="searched-result" v-for="(data, i) in company_research" :key="i">
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
		</main>
	</div>
</template>

<script src="./search-result.js"></script>
<style lang="scss" scoped src="./search-result.scss"></style>
