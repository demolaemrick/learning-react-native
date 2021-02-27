<template>
	<nav class="nav">
		<div class="nav-wrapper">
			<div class="back-wrapper" @click="$router.push({ name: 'Search' })">
				<img src="@/assets/icons/back.svg" svg-inline class="mr-2" />
				<p class="ls-closer">Back to search results</p>
			</div>
			<div>
				<ValidationObserver v-slot="{ invalid }">
					<div class="search__wrapper-input">
						<v-text-input class="search-input" rules="required" placeholder="Name" name="name" v-model="payload.full_name" />
						<v-text-input class="search-input" rules="required" placeholder="Title" name="title" v-model="payload.role" />
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
						<v-button :disabled="invalid" @click="submitSearch">Search </v-button>
					</div>
				</ValidationObserver>
			</div>
			<p class="refine-keywords">Refine Keywords</p>
		</div>
	</nav>
</template>
<script>
import VButton from '@/components/Button';
import VSelect from '@/components/Select';
import VTextInput from '@/components/Input';
import { ValidationObserver } from 'vee-validate';
import { mapMutations, mapGetters } from 'vuex';
import companyList from '@/data/companies.json';
export default {
	components: {
		VTextInput,
		VButton,
		VSelect,
		ValidationObserver
	},
	data() {
		return {
			company: '',
			payload: {
				type: Object
			}
		};
	},
	computed: {
		...mapGetters({
			getPayload: 'search_services/getPayload'
		}),
		companies() {
			return Object.keys(companyList.companies);
		}
	},
	created() {
		this.payload = Object.assign({}, this.getPayload);
		this.company = this.payload.company;
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_services/saveSearchPayload'
		}),
		onChildUpdate(newValue) {
			this.payload.company = newValue;
		},
		submitSearch() {
			this.saveSearchPayload(this.payload);
			console.log('submit', this.getPayload);
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
.back-wrapper {
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
