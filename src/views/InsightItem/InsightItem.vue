<template>
	<div>
		<v-header />
		<main class="main container container--lg">
			<div class="searched__wrapper" :class="{ 'grey-color': hideSearch }">
				<div class="searched__wrapper-content">
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
								<li class="dropdown__item" @click="(searchType = 'company_research')">
									Company Research
								</li>
								<li class="dropdown__item" @click="(searchType = 'contact_research')">
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
									<li class="dropdown__item" @click="sortByRecent">Recent</li>
									<li class="dropdown__item" @click="sortByRelevance">Relevance</li>
								</template>
							</toggle-dropdown>
						</div>
					</div>

					<!-- <div class="searched-result"> -->
            <!-- <div class="contact searched__wrapper" v-if="searchType === 'contact_research'">
              <div class="news-section">
                <div class="section-wrapper">
                  <div class="news">
                    <h3 class="section-title">News & Articles</h3>
                    <div class="filter-sort">
                      <toggle-dropdown itemPadding=".5rem 0 .5rem .5rem">
                        <template #dropdown-wrapper>
                          <p class="sort">Relevant <img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline /></p>
                        </template>
                        <template #dropdown-items>
                          <li class="dropdown__item">Recent</li>
                          <li class="dropdown__item">Relevant</li>
                        </template>
                      </toggle-dropdown>
                    </div>
                  </div>
                  <TextInput
                    class="search-section mb-0"
                    type="text"
                    placeholder="Search"
                    name="contactSearch"
                    v-model="contactSearchQuery"
                    :icon="{ type: 'search' }"
                    backgroundColor="#F5F5F5"
                    border="#F5F5F5"
                    borderRadius="12px"
                    searchIconColor="#3A434B"
                  />

                  <div class="tab-group flex">
                    <h5
                      v-for="(tab, index) in tabs"
                      :key="index"
                      class="tab"
                      :class="{ active: tab === selectedTab }"
                      @click="selectedTab = tab"
                    >
                      {{ tab }}
                    </h5>
                  </div>
                </div>

                <InsightCard
                  :disliked="disliked"
                  @openModal="toggleModalClass('dislikeModal')"
                  title="Journey to the Center of the Earth"
                  content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, corporis. 
                    Distinctio voluptates tenetur molestias sunt libero? Voluptatem facilis optio qui natus velit explicabo. 
                    Quisquam fugit repudiandae iure atque eum minus!
                    Quis et itaque nam"
                />
                <InsightCard
                  :disliked="disliked"
                  @openModal="toggleModalClass('dislikeModal')"
                  title="Kingsley Omin wins Gold at the Olympics!"
                  content="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quaerat, corporis. Distinctio voluptates tenetur molestias sunt libero?
                    Voluptatem facilis optio qui natus velit explicabo. Quisquam fugit repudiandae iure atque eum minus!
                    Quis et itaque nam"
                />
              </div>
              <div class="quote-section">
                <div class="section-wrapper">
                  <h3 class="section-title">Quotes</h3>
                </div>
                <InsightCard
                  :disliked="disliked"
                  @openModal="toggleModalClass('dislikeModal')"
                  quote="We've seen rapid acceleration in the category and in our business this year, 
                    and as we look to 2021 its clear that every consumer-facing business in the world is focused 
                    on how to use data"
                />
              </div>
            </div> -->
					<!-- </div> -->
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
						v-model="notepadTXT"
						@focus="expandNotepad"
						@blur="handleTextareaBlur"
						id="textArea"
						placeholder="Write down findings from research."
					>
					</textarea>
				</div>
			</div>
			<div class="item__detail">
				<a :href="getSearchedItem.item.url" target="_blank" class="item__detail-url">{{ getSearchedItem.item.url }}</a>
				<p class="item__detail-title">{{ getSearchedItem.item.description }}</p>
				<p class="item__detail-date" v-if="getSearchedItem.item.meta.published !== null">
					{{ new Date(getSearchedItem.item.meta.published) | moment('Do, MMMM YYYY') }}
				</p>
				<div
					class="filter__tags"
					v-if="getSearchedItem.item.meta.content && Object.keys(getSearchedItem.item.meta.content).length > 0"
				>
					<img class="tag__badge" src="@/assets/icons/tag.svg" alt="" />
					<div class="tag__wrapper">
						<span v-for="(tag, i) in getSearchedItem.item.meta.content.tag" :key="i"
							><c-tag v-if="tag !== null || tag !== ''">{{ tag }}</c-tag></span
						>
					</div>
				</div>

				<template>
					<div
						class="item__detail-content"
						v-if="getSearchedItem.item.meta.content && Object.keys(getSearchedItem.item.meta.content).length > 0"
					>
						<div class="item-content" v-html="getSearchedItem.item.meta.content.html"></div>
					</div>
					<iframe
						v-else
						class="mt-2 iframe-wrapper"
						id="myframe"
						width="100%"
						height="500"
						:src="getSearchedItem.item.url"
					></iframe>
				</template>
			</div>
		</main>
	</div>
</template>

<script src="./insight-item.js"></script>

<style src="../SearchResult/search-result.scss" lang="scss" scoped></style>
<style lang="scss" src="./insight-item.scss" scoped></style>
<style lang="scss">
.item-content {
	p {
		margin-bottom: 15px;
	}
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin-bottom: 10px;
	}
	.default-blue {
		background: #fdd4e1;
	}
}
</style>
