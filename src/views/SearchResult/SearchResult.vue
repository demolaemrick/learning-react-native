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
						<toggle-dropdown v-bind="$props">
							<template #dropdown-wrapper>
								<p class="sort">Sort by <img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline /></p>
								<span class="filter"><img src="@/assets/icons/filter.svg" svg-inline /></span>
							</template>
							<template #dropdown-items>
								<li class="dropdown__item">
									Research type 1
								</li>
								<li class="dropdown__item">
									Research type 2
								</li>
							</template>
						</toggle-dropdown>
					</div>
				</div>
				<div class="searched-result" @click="$router.push({ name: 'SearchItem' })">
					<div class="searched__item">
						<p class="searched__item-title">I amsterdam - Your guide to visit, enjoy, live, work & Invest in …</p>
						<p class="searched__item-desc">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere. Donec
							dictum felis eu ipsum sollicitudin semper
						</p>
						<a href="/" class="searched__item-url"
							><img src="@/assets/icons/planet-earth.svg" svg-inline /> https://www.iamsterdam.com/</a
						>
					</div>
				</div>
				<div class="searched-result">
					<div class="searched__item">
						<p class="searched__item-title">I amsterdam - Your guide to visit, enjoy, live, work & Invest in …</p>
						<p class="searched__item-desc">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere. Donec
							dictum felis eu ipsum sollicitudin semper
						</p>
						<a href="/" class="searched__item-url"
							><img src="@/assets/icons/planet-earth.svg" svg-inline /> https://www.iamsterdam.com/</a
						>
					</div>
				</div>
				<div class="searched-result">
					<div class="searched__item">
						<p class="searched__item-title">I amsterdam - Your guide to visit, enjoy, live, work & Invest in …</p>
						<p class="searched__item-desc">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere. Donec
							dictum felis eu ipsum sollicitudin semper
						</p>
						<a href="/" class="searched__item-url"
							><img src="@/assets/icons/planet-earth.svg" svg-inline /> https://www.iamsterdam.com/</a
						>
					</div>
				</div>
				<div class="searched-result">
					<div class="searched__item">
						<p class="searched__item-title">I amsterdam - Your guide to visit, enjoy, live, work & Invest in …</p>
						<p class="searched__item-desc">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere. Donec
							dictum felis eu ipsum sollicitudin semper
						</p>
						<a href="/" class="searched__item-url"
							><img src="@/assets/icons/planet-earth.svg" svg-inline /> https://www.iamsterdam.com/</a
						>
					</div>
				</div>
			</div>

			<!-- company search -->
			<div class="contact searched__wrapper">
				<div class="searched__wrapper-header">
					<h3 class="title">Company Research</h3>
					<div class="filter-sort">
						<toggle-dropdown v-bind="$props">
							<template #dropdown-wrapper>
								<p class="sort">Sort by <img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline /></p>
								<span class="filter"><img src="@/assets/icons/filter.svg" svg-inline /></span>
							</template>
							<template #dropdown-items>
								<li class="dropdown__item">
									Research type 1
								</li>
								<li class="dropdown__item">
									Research type 2
								</li>
							</template>
						</toggle-dropdown>
					</div>
				</div>
				<div class="searched-result">
					<div class="searched__item">
						<p class="searched__item-title">I amsterdam - Your guide to visit, enjoy, live, work & Invest in …</p>
						<p class="searched__item-desc">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere. Donec
							dictum felis eu ipsum sollicitudin semper
						</p>
						<a href="/" class="searched__item-url"
							><img src="@/assets/icons/planet-earth.svg" svg-inline /> https://www.iamsterdam.com/</a
						>
					</div>
				</div>
				<div class="searched-result">
					<div class="searched__item">
						<p class="searched__item-title">I amsterdam - Your guide to visit, enjoy, live, work & Invest in …</p>
						<p class="searched__item-desc">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere. Donec
							dictum felis eu ipsum sollicitudin semper
						</p>
						<a href="/" class="searched__item-url"
							><img src="@/assets/icons/planet-earth.svg" svg-inline /> https://www.iamsterdam.com/</a
						>
					</div>
				</div>
				<div class="searched-result">
					<div class="searched__item">
						<p class="searched__item-title">I amsterdam - Your guide to visit, enjoy, live, work & Invest in …</p>
						<p class="searched__item-desc">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere. Donec
							dictum felis eu ipsum sollicitudin semper
						</p>
						<a href="/" class="searched__item-url"
							><img src="@/assets/icons/planet-earth.svg" svg-inline /> https://www.iamsterdam.com/</a
						>
					</div>
				</div>
				<div class="searched-result">
					<div class="searched__item">
						<p class="searched__item-title">I amsterdam - Your guide to visit, enjoy, live, work & Invest in …</p>
						<p class="searched__item-desc">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere. Donec
							dictum felis eu ipsum sollicitudin semper
						</p>
						<a href="/" class="searched__item-url"
							><img src="@/assets/icons/planet-earth.svg" svg-inline /> https://www.iamsterdam.com/</a
						>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script src="./search-result.js"></script>
<style lang="scss" scoped src="./search-result.scss"></style>
