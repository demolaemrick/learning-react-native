<template>
	<div>
		<v-nav />
		<main class="main container container--lg">
			<div class="searched__wrapper" :class="{ 'grey-color': hideSearch }">
				<div class="searched__wrapper-content" v-if="!hideSearch">
					<div class="searched__wrapper-header">
						<toggle-dropdown v-bind="$props">
							<template #dropdown-wrapper>
								<h3 class="title">Contact Research <img src="@/assets/icons/arrow-dropdown-plane.svg" svg-inline /></h3>
							</template>
							<template #dropdown-items>
								<li class="dropdown__item">
									Company Research
								</li>
								<li class="dropdown__item">
									Contact Research
								</li>
							</template>
						</toggle-dropdown>

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
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere.
								Donec dictum felis eu ipsum sollicitudin semper
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
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere.
								Donec dictum felis eu ipsum sollicitudin semper
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
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere.
								Donec dictum felis eu ipsum sollicitudin semper
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
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie mauris id orci tempor posuere.
								Donec dictum felis eu ipsum sollicitudin semper
							</p>
							<a href="/" class="searched__item-url"
								><img src="@/assets/icons/planet-earth.svg" svg-inline /> https://www.iamsterdam.com/</a
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
						id="textArea"
						placeholder="Write down findings from research."
					>
					</textarea>
				</div>
			</div>
			<div class="item__detail">
				<a href="/" class="item__detail-url">https://www.iamsterdam.com/</a>
				<p class="item__detail-title">I amsterdam - Your guide to visit, enjoy, live, work & Invest in.</p>

				<p class="item__detail-content">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu libero nibh. Proin blandit elit vitae convallis auctor.
					In hac habitasse platea dictumst. Integer tempor, metus eget laoreet mollis, dui tellus lacinia ligula, sit amet
					efficitur metus urna eu dui. Morbi dignissim vestibulum pharetra. In eu ipsum dolor. Praesent lobortis tristique tellus,
					elementum lacinia diam gravida quis. Vivamus vulputate lacus at augue eleifend, in blandit erat aliquam. Fusce auctor
					dapibus elit. Nullam sit amet metus ullamcorper, porta odio non, tincidunt ligula. Curabitur ultrices sagittis
					hendrerit. Sed imperdiet sem sit amet mollis elementum. Quisque pharetra gravida ipsum, a tincidunt elit viverra non.
				</p>
				<p class="item__detail-content">
					Mauris et metus ac eros interdum ullamcorper sit amet non sapien. Vestibulum tortor orci, molestie id arcu vitae,
					aliquet aliquet nibh. Aliquam eget tellus non ante porta auctor ac sit amet erat. Cras rutrum mauris nec dui
					condimentum, sed elementum enim auctor. Curabitur bibendum facilisis sapien eu elementum. Ut in tristique diam, dapibus
					ultricies ligula. Proin at lectus non mi pulvinar scelerisque egestas nec risus. Nullam eu enim sit amet erat rutrum
					tempus ut at ipsum. Integer tempor eros ac tellus posuere vulputate. Curabitur lobortis, mi quis tempus auctor, ante
					erat varius nibh, non vestibulum tellus turpis non sem. Etiam volutpat pharetra porttitor.
				</p>
				<p class="item__detail-content">
					Vivamus mi metus, facilisis at justo id, mollis consequat augue. Donec aliquet dolor eget viverra faucibus. Praesent
					sollicitudin ornare dui. Fusce tristique volutpat est ac porttitor. Nulla facilisi. Fusce ornare massa at dapibus
					pretium. Aliquam egestas metus ac pretium venenatis.
				</p>
			</div>
		</main>
	</div>
</template>

<script>
import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
export default {
	name: 'SearchResult',
	components: {
		VNav,
		ToggleDropdown
	},
	data() {
		return {
			hideSearch: false,
			rows: 1
		};
	},
	watch: {
		hideSearch(value) {
			value ? (this.rows = 30) : (this.rows = 1);
		}
	},
	methods: {
		expandNotepad() {
			this.hideSearch = true;
		}
	}
};
</script>

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
</style>
