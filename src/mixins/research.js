import { mapMutations, mapActions } from 'vuex';
const researchMixin = {
	data() {
		return {
			loading: false,
			payload: {
				full_name: '',
				company: '',
				role: '',
				contact_research: {
					events: [],
					blogs: [],
					podcasts: [],
					features: [],
					awards: [],
					promotion: [],
					videos: [],
					linkedin_activity: [],
					twitter_activity: []
				},
				company_research: {
					job_postings: [],
					mergers_and_acquisitions: [],
					ipo: [],
					product_launch: [],
					others: []
				}
			}
		};
	},
	methods: {
		...mapMutations({
			saveSearchPayload: 'search_services/saveSearchPayload',
			saveSearchedResult: 'search_services/saveSearchedResult'
		}),
		...mapActions({
			research: 'search_services/research'
		}),
		submitSearch() {
			this.loading = true;
			this.research(this.payload)
				.then(async (response) => {
					if (response.data.status === 'success') {
						await this.saveSearchedResult(response.data.data);
						await this.saveSearchPayload(this.payload);
						this.$router.push({ name: 'SearchResult' });
						return true;
					}
					// this.showAlert({
					// 	status: 'error',
					// 	message: 'Something went wrong',
					// 	showAlert: true
					// });
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
					// this.showAlert({
					// 	status: 'error',
					// 	message: error.response.data.message,
					// 	showAlert: true
					// });
				})
				.finally(() => {
					this.loading = false;
				});
		}
	}
};
export default researchMixin;
