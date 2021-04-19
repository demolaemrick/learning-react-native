<template>
	<div class="container container--lg">
		<nav class="navbar">
			<div class="nav-item logo">
				<img src="@/assets/icons/logo.svg" svg-inline />
				<h3 class="ml-1 logo-text">Volley App</h3>
			</div>
		</nav>
		<main class="main-section">
			<div class="hero">
				<h2 class="hero-title">More refined <span>research</span> .</h2>
				<p class="hero-desc">
					Aggregated sales research to power your personalized outreach.
				</p>
			</div>

			<ValidationObserver v-slot="{ invalid }">
				<div class="search-wrapper">
					<v-text-input class="search-input" rules="required" placeholder="Name" name="name" v-model="payload.full_name" />
					<v-text-input class="search-input" rules="required" placeholder="Title" name="title" v-model="payload.role" />
					<v-text-input class="search-input" rules="required" placeholder="Company" name="company" v-model="payload.company" />
					<v-button :disabled="invalid" class="search_btn" @click="submitSearch">
						<template v-if="!loading">Search</template>
						<Loader v-else />
					</v-button>
				</div>
			</ValidationObserver>
			<p class="more-filter" @click="openConfigModal()">
				More search options <img src="@/assets/icons/arrow-drop-down.svg" class="ml-1" svg-inline />
			</p>
			<!-- CONFIG MODAL -->
			<template v-if="showConfigModal">
				<v-modal>
					<div class="config__modal__wrapper">
						<div class="config__modal__header">
							<div class="config__modal__header__btn__wrapper">
								<v-button class="config__btn__close" @click="closeConfigModal()">
									<div class="btn__content__wrapper">
										<span class="text">Close</span>
										<span class="icon">
											<img src="@/assets/icons/close-sign.svg" class="ml-1" svg-inline />
										</span>
									</div>
								</v-button>
							</div>
						</div>
						<div class="config__modal__content">
							<div class="config__icon__wrapper">
								<img src="@/assets/icons/empty-state-image.svg" class="ml-1" svg-inline />
							</div>
							<div class="config__text__wrapper">
								<p>
									Configure your search preferences on the <br />
									settings page to get customised search result
								</p>
							</div>
							<div class="config__btn__wrapper">
								<v-button class="config__btn" @click="gotoSettings">
									Settings
								</v-button>
							</div>
						</div>
					</div>
				</v-modal>
			</template>
			<!-- CONFIG MODAL END -->
		</main>
		<template v-if="showMoreSearchSettings">
			<div class="more__settings__modal__wrapper">
				<div class="more__settings__modal__content">
					<router-view></router-view>
				</div>
			</div>
		</template>
	</div>
</template>

<script src="./search.js"></script>
<style lang="scss" scoped src="./search.scss"></style>
