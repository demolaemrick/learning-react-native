<template>
	<div class="">
		<!-- <v-nav /> -->
		<v-header />
		<main class="main container container--lg">
			<!-- <div class="notepad">
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
			</div> -->
			<template v-if="loading"></template>
			<template v-else>
				<div class="aside__left">
					<div class="section section__1">
						<div class="title">
							<div class="text">Contact Details</div>
							<div class="icon">
								<img src="@/assets/icons/carret-left.svg" svg-inline />
							</div>
						</div>
						<div class="contact__details">
							<div class="text__initials" v-if="searchedResult.full_name">
								{{
									searchedResult.full_name
										.match(/\b(\w)/g)
										.join('')
										.toUpperCase()
								}}
							</div>
							<div class="text__name__role">
								<div class="name">{{ searchedResult.full_name }}</div>
								<div class="role">{{ searchedResult.role }}</div>
							</div>
						</div>
					</div>
					<div class="section section__2">
						<div class="contact__address">
							<div class="title">Email Address</div>
							<div class="text">{{ searchedResult.email }}</div>
						</div>
						<div class="contact__address">
							<div class="title">Company</div>
							<div class="text">{{ searchedResult.company }}</div>
						</div>
						<div class="contact__icon__group">
							<span v-for="(social, i) in socials" :key="i">
								<a v-if="social.twitter && social.twitter.length !== 0" :href="social.twitter" target="_blank"
									><img src="@/assets/icons/twitter-icon.svg" svg-inline
								/></a>
								<a v-if="social.linkedin && social.linkedin.length !== 0" :href="social.linkedin" target="_blank"
									><img src="@/assets/icons/linkedin-icon.svg" svg-inline
								/></a>
								<a v-if="social.website && social.website.length !== 0" :href="validateURL(social.website)" target="_blank"
									><img src="@/assets/icons/world-icon.svg" svg-inline
								/></a>
							</span>
						</div>
					</div>
					<div class="section__3">
						<div class="title__text">Are you done with the research?</div>
						<div class="input__group">
							<input type="checkbox" />
							<div class="input__label__text">Yes Done</div>
						</div>
					</div>
					<div class="section__4">
						<div class="text">Bookmarked 2</div>
						<div class="link">See All</div>
					</div>
					<div class="section__5 bookmarks">
						<div class="title">Your guide to visit, enjoy, live, work …</div>
						<div class="content">
							Lorem ipsum dolor sit amet, dictum consectetur adipiscing elit. Nullam dictum felis eu ipsum sollicitudin
							semper.
						</div>
					</div>
					<div class="section__6">
						<div class="text">Notes</div>
						<div class="link"></div>
					</div>
					<div class="section__7">
						<div class="title">Your guide to visit, enjoy, live, work …</div>
						<div class="content">
							Lorem ipsum dolor sit amet, dictum consectetur adipiscing elit.
						</div>
					</div>
				</div>
				<!-- <div class="d-flex"> -->

				<!-- contact search -->
				<div class="contact searched__wrapper" v-if="searchType === 'contact_research' || screenType === 'large'">
					<div class="searched__wrapper-header">
						<h3 class="title" v-if="screenType === 'large'">Contact Research</h3>
						<toggle-dropdown v-else>
							<template #dropdown-wrapper>
								<h3 class="title">
									Contact Research
									<img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline />
								</h3>
							</template>
							<template #dropdown-items>
								<li class="dropdown__item" @click="searchType = 'company_research'">
									Company Research
								</li>
								<li class="dropdown__item" @click="searchType = 'contact_research'">
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
									<li class="dropdown__item" @click="sortByRecent('contact_research')">
										Recent
									</li>
									<li class="dropdown__item" @click="sortByRelevance('contact_research')">
										Relevance
									</li>
								</template>
							</toggle-dropdown>
							<dropdown-checkbox>
								<template #dropdown-wrapper>
									<span class="filter"><img src="@/assets/icons/filter.svg" svg-inline /></span>
								</template>
								<template #dropdown-items>
									<span v-for="(data, i) in searchedResult.contact_research" :key="i">
										<!-- <span v-for="(data, i) in response.data.contact_research" :key="i"> -->
										<li class="dropdown__item" v-if="searchedResult.contact_research[i].length !== 0">
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
						<span v-for="(dataItem, j) in data" :key="j">
							<div
								class="searched__item"
								@click="displaySearchItem('contact_research', dataItem)"
								v-if="dataItem.dontRender === null || !Object.keys(dataItem).includes('dontRender')"
							>
								<p class="searched__item-title">{{ dataItem.title }}</p>
								<p class="searched__item-desc" v-html="dataItem.meta.html.snippet"></p>
								<div class="url__bookmark__group">
									<a :href="dataItem.url" target="_blank" class="searched__item-url"
										><img src="@/assets/icons/planet-earth.svg" svg-inline />
										<p class="url-text">{{ dataItem.url }}</p></a
									>
									<img src="@/assets/icons/bookman-icon.svg" svg-inline />
								</div>
							</div>
						</span>
						<dot-loader v-if="loadMore" />
					</div>
				</div>

				<!-- company search -->
				<div class="contact searched__wrapper" v-if="searchType === 'company_research' || screenType === 'large'">
					<div class="searched__wrapper-header">
						<h3 class="title" v-if="screenType === 'large'">Company Research</h3>
						<toggle-dropdown v-else>
							<template #dropdown-wrapper>
								<h3 class="title">
									Company Research
									<img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline />
								</h3>
							</template>
							<template #dropdown-items>
								<li class="dropdown__item" @click="searchType = 'company_research'">
									Company Research
								</li>
								<li class="dropdown__item" @click="searchType = 'contact_research'">
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
									<li class="dropdown__item" @click="sortByRecent('company_research')">
										Recent
									</li>
									<li class="dropdown__item" @click="sortByRelevance('company_research')">
										Relevance
									</li>
								</template>
							</toggle-dropdown>
							<dropdown-checkbox>
								<template #dropdown-wrapper>
									<span class="filter"><img src="@/assets/icons/filter.svg" svg-inline /></span>
								</template>
								<template #dropdown-items>
									<span v-for="(data, i) in searchedResult.company_research" :key="i">
										<li class="dropdown__item" v-if="searchedResult.company_research[i].length !== 0">
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
						<span v-for="(dataItem, j) in data" :key="j">
							<div
								class="searched__item"
								:id="`searched__item-${j}`"
								@click="displaySearchItem('company_research', dataItem)"
								v-if="dataItem.dontRender === null || !Object.keys(dataItem).includes('dontRender')"
							>
								<p class="searched__item-title">{{ dataItem.title }}</p>
								<p class="searched__item-desc" v-html="dataItem.meta.html.snippet"></p>
								<div class="url__bookmark__group">
									<a :href="dataItem.url" target="_blank" class="searched__item-url"
										><img src="@/assets/icons/planet-earth.svg" svg-inline />
										<p class="url-text">{{ dataItem.url }}</p></a
									>
									<img src="@/assets/icons/bookman-icon.svg" svg-inline />
								</div>
							</div>
						</span>
						<dot-loader v-if="loadMore" />
					</div>
				</div>

				<!-- </div> -->
			</template>
		</main>
	</div>
</template>

<script src="./search-result.js"></script>
<style lang="scss" scoped src="./search-result.scss"></style>
