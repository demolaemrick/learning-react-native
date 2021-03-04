<template>
	<nav class="nav">
		<div class="nav-wrapper">
			<div class="back-wrapper" @click="back">
				<img src="@/assets/icons/back.svg" svg-inline class="mr-2" />
				<p class="ls-closer">Back to search results</p>
			</div>
			<div>
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
						<v-button :disabled="invalid" @click="submitSearch"
							><template v-if="!loading">Search</template> <Loader v-else />
						</v-button>
					</div>
				</ValidationObserver>
			</div>
			<p class="refine-keywords" @click="openModal = !openModal">Refine Keywords</p>
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
			openModal: false
		};
	},
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
		submitSearch() {
			this.loading = true;
			this.research(this.researchedPayload)
				.then(async (response) => {
					if (response.data.status === 'success') {
						await this.saveSearchedResult(response.data.data);
						await this.saveSearchPayload(this.researchedPayload);
						return true;
					}
					this.showAlert({
						status: 'error',
						message: 'Something went wrong',
						showAlert: true
					});
				})
				.catch((error) => {
					this.showAlert({
						status: 'error',
						message: error.response.data.message,
						showAlert: true
					});
				})
				.finally(() => {
					this.loading = false;
					this.showAlert({
						status: 'success',
						message: 'Research data was fetched successfully',
						showAlert: true
					});
				});
		},
		back() {
			this.currentRoute === 'SearchItem' ? this.$router.push({ name: 'SearchResult' }) : this.$router.push({ name: 'Search' });
		},
		onChildUpdate(newValue) {
			this.researchedPayload.company = newValue;
		}
	}
};
</script>
<style lang="scss" scoped>
.nav {
	border: 1px solid #f2f2f2;
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
</style>
