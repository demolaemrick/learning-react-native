<template>
	<nav class="nav">
		<div class="nav-wrapper">
			<div class="back-wrapper" @click="back">
				<img src="@/assets/icons/back.svg" svg-inline class="mr-2" />
				<p class="ls-closer">Back to search results</p>
			</div>
			<div class="hamburger" :class="{ active: showNav }" @click="toggleNav">
				<div class="ham ham1"></div>
				<div class="ham ham2"></div>
				<div class="ham ham3"></div>
			</div>
			<div class="search__wrapper">
				<ValidationObserver v-slot="{ invalid }">
					<div class="search__wrapper-input">
						<v-text-input
							class="search-input"
							rules="required"
							placeholder="Name"
							name="name"
							v-model="researchedPayload.full_name"
						/>
						<v-text-input
							class="search-input"
							rules="required"
							placeholder="Title"
							name="title"
							v-model="researchedPayload.role"
						/>
						<v-text-input
							class="search-input"
							rules="required"
							placeholder="Company"
							name="company"
							v-model="researchedPayload.company"
						/>
						<v-button :disabled="invalid" @click="submitSearch"
							><template v-if="!loading">Search</template> <Loader v-else />
						</v-button>
					</div>
				</ValidationObserver>
			</div>
			<p class="refine-keywords" @click="openModal = !openModal">Refine Keywords</p>
		</div>
		<div class="nav-mb" v-if="showNav">
			<div class="nav-content">
				<div class="container">
					<ValidationObserver v-slot="{ invalid }">
						<div class="search__wrapper-input">
							<v-text-input
								class="search-input"
								rules="required"
								placeholder="Name"
								name="name"
								v-model="researchedPayload.full_name"
							/>
							<v-text-input
								class="search-input"
								rules="required"
								placeholder="Title"
								name="title"
								v-model="researchedPayload.role"
							/>
							<v-select
								:options="companies"
								@update="onChildUpdate"
								placeholder="Select Country"
								name="company-input"
								v-model="company"
								:value="company"
								class="search-input"
								required
							></v-select>
							<v-button :disabled="invalid" @click="submitSearch" class="search-nav_btn" name="search"
								><template v-if="!loading">Search</template>
								<Loader v-else />
							</v-button>
						</div>
					</ValidationObserver>
				</div>
			</div>
		</div>
		<modal
			v-if="openModal"
			@submit="submitSearch"
			:loading="loading"
			@close="openModal = !openModal"
			:researchedPayload="researchedPayload"
		/>
	</nav>
</template>
<script>
import VButton from '@/components/Button';
import VSelect from '@/components/Select';
import VTextInput from '@/components/Input';
import { ValidationObserver } from 'vee-validate';
import researchMixin from '@/mixins/research';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import companyList from '@/data/companies.json';
import Modal from './Modal.vue';
import Loader from '@/components/Loader';
export default {
	mixins: [researchMixin],
	components: {
		VTextInput,
		VButton,
		VSelect,
		ValidationObserver,
		Modal,
		Loader
	},
	data() {
		return {
			loading: false,
			company: '',
			researchedPayload: {
				type: Object
			},
			openModal: false,
			showNav: false
		};
	},
	// watch: {
	// 	showNav(value) {
	// 		if (value) {
	// 			document.querySelector('#app').classList.add('sticky-page');
	// 		} else {
	// 			document.querySelector('#app').classList.remove('sticky-page');
	// 		}
	// 	}
	// },
	computed: {
		...mapGetters({
			getPayload: 'search_services/getPayload'
		}),
		companies() {
			return Object.keys(companyList.companies);
		},
		currentRoute() {
			return this.$route.name;
		}
	},
	created() {
		this.researchedPayload = Object.assign({}, this.getPayload);
		this.company = this.researchedPayload.company;
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_services/saveSearchPayload',
			saveSearchedResult: 'search_services/saveSearchedResult'
		}),
		...mapActions({
			research: 'search_services/research',
			showAlert: 'showAlert'
		}),
		toggleNav() {
			if (!this.showNav) {
				this.showNav = true;
				document.querySelector('#app').classList.add('sticky-page');
			} else {
				this.showNav = !this.showNav;
				document.querySelector('#app').classList.remove('sticky-page');
			}
		},
		async submitSearch() {
			this.loading = true;
			try {
				const response = await this.research(this.researchedPayload);
				if (response.data.status === 'success') {
					await this.saveSearchedResult(response.data.data);
					await this.saveSearchPayload(this.researchedPayload);
					if (this.currentRoute === 'SearchItem') {
						this.$router.push({ name: 'SearchResult' }).catch(() => {});
					}
					return true;
				}
				this.showAlert({
					status: 'error',
					message: 'Something went wrong',
					showAlert: true
				});
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			} finally {
				this.loading = false;
			}
		},
		back() {
			this.currentRoute === 'SearchItem'
				? this.$router.push('/search-result').catch(() => {})
				: this.$router.push('/').catch(() => {});
		},
		onChildUpdate(newValue) {
			this.researchedPayload.company = newValue;
		}
	}
};
</script>
<style lang="scss" scoped>
@import '../assets/scss/main.scss';
.nav {
	border-bottom: 1px solid #f2f2f2;
}
.nav-wrapper {
	display: flex;
	padding: 24px 24px;
	justify-content: space-between;
	align-items: center;
	max-width: 1500px;
	margin: 0 auto;
}
.refine-keywords {
	color: #3b48f7;
	letter-spacing: -0.36px;
	text-decoration: underline;
}
.back-wrapper,
.refine-keywords {
	cursor: pointer;
}
.search__wrapper-input,
.back-wrapper {
	display: flex;
}
.search__wrapper-input {
	padding: 0 71px;
}
.search-input {
	margin-right: 12px;
}
.hamburger {
	position: relative;
	width: 28px;
	height: 20px;
	cursor: pointer;
	margin: 10px 0;
	transition: all 0.218s ease-out;
	@include query(tablet, min) {
		display: none;
	}
	.ham {
		position: absolute;
		width: 100%;
		height: 3px;
		background-color: #333758;
	}
	.ham1 {
		top: 0;
		left: 0;
		transition: top 0.218s ease-out 0.218s, transform 0.218s ease-out 0s;
	}
	.ham2 {
		top: 8.5px;
		transition: opacity 0.218s ease-out 0.436s;
	}
	.ham3 {
		bottom: 0;
		transition: bottom 0.218s ease-out 0.218s, transform 0.218s ease-out 0s;
	}
	&.active {
		.ham1 {
			top: 8.5px;
			transform: rotate(45deg);
			transform-origin: center;
			transition: top 0.218s ease-out 0.218s, transform 0.218s ease-out 0.436s;
		}
		.ham2 {
			opacity: 0;
			transition: opacity 0.218s ease-out 0s;
		}
		.ham3 {
			bottom: 8.5px;
			transform: rotate(-45deg);
			transform-origin: center;
			transition: bottom 0.218s ease-out 0.218s, transform 0.218s ease-out 0.436s;
		}
	}
}
.nav-mb {
	display: none;
	position: fixed;
	height: calc(100% - 88px);
	-webkit-backdrop-filter: blur(2px);
	backdrop-filter: blur(2px);
	background-color: rgba(68, 68, 68, 0.1);
	border-top: 1px solid #f2f2f2;
	z-index: 10;
	width: 100%;
	-webkit-animation: fadeIn 0.3s;
	animation: fadeIn 0.3s;
}
@include query(tablet, max) {
	.search__wrapper,
	.refine-keywords {
		display: none;
	}
	.nav-mb {
		display: block;
	}
	.nav-content {
		background: #fff;
		padding: 20px 0;
	}
	.search__wrapper-input {
		padding: 20px 0;
		max-width: 508px;
		flex-wrap: wrap;
	}
	.search-input {
		margin-bottom: 20px;
	}
}
@include query(tablet, max) {
	.search-input {
		width: 100%;
	}
}
</style>
