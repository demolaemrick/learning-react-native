import { mapMutations, mapActions } from 'vuex';

export default {
	// name: 'route Mixin',

	data() {
		return {
			contact_details: '',
			company_details: '',
			insightStatus: '',
			loading: true
		};
	},

	async beforeMount() {
		this.loading = true;
		if (this.$route.query.id) {
			this.rowId = this.$route.query.id;
			await this.getResult();
			await this.initUserBookmarks();
			await this.initUserNote(this.rowId);
		} else if (this.$route.name === 'Insights') {
			this.$router.push({ name: 'Search' });
		}
	},
	methods: {
		...mapMutations({
			saveSearchedItem: 'search_notes/saveSearchedItem',
			saveSearchedResult: 'search_services/saveSearchedResult'
		}),
		...mapActions({
			researchedResult: 'search_services/researchedResult'
		}),
		/** API response structure for single research
		 * changed. Function below is to handle the changes by refactoring the incoming data to it's previous structure
		 * and prevent discrepancies.
		 */
		changeToLegacyResponse(newData) {
			const oldData = JSON.parse(JSON.stringify(newData));
			let oldNews = {};
			newData.contact_insights.news.forEach((article) => {
				article.content.tag = article.content.tags;
				const tags = [...article.tags];

				if (!tags.length) {
					// use article url to create a dummy
					// tagf for articles that don't have tags
					tags.push(article.url);
				}
				tags.forEach((tag) => {
					if (oldNews[tag]) {
						oldNews[tag].push(article);
					} else {
						oldNews[tag] = [article];
					}
				});
			});
			oldData.contact_insights.news = oldNews;

			let oldOtherInsights = {};
			newData.contact_insights.other_insights.forEach((article) => {
				if (article.content) {
					article.content.tag = article.content.tags;
				}

				// other insights no longer includes tags so we group
				// by article url to adhere to the previous
				// code structure
				if (oldOtherInsights[article.url]) {
					oldOtherInsights[article.url].push(article);
				} else {
					oldOtherInsights[article.url] = [article];
				}
			});
			oldData.contact_insights.other_insights = oldOtherInsights;

			return oldData;
		},
		async getResult() {
			this.loading = true;
			try {
				const response = await this.researchedResult(this.$route.query.id);
				const { contact_details, company_details, status } = response.data.data;
				this.contact_details = contact_details;
				this.company_details = company_details;
				this.insightStatus = status;
				const refactored = this.changeToLegacyResponse(response.data.data);
				this.saveSearchedResult(refactored);
				this.insightStatus.statusCode === 'UPDATING' ? this.subscribe() : null;
				return true;
			} catch (error) {
				console.log(error);
			} finally {
				this.loading = false;
			}
		}
	}
};
