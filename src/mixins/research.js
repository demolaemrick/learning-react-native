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
		getInitials(string) {
			var names = string.split(' '),
				initials = names[0].substring(0, 1).toUpperCase();

			if (names.length > 1) {
				initials += names[names.length - 1].substring(0, 1).toUpperCase();
			}
			return initials;
		}
	}
};
export default researchMixin;
