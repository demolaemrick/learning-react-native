import VNav from '../Nav.vue';
import ToggleDropdown from '@/components/ToggleDropdown';
import DropdownCheckbox from '@/components/DropdownCheckbox';
import { mapMutations, mapGetters } from 'vuex';
import DCheckbox from '@/components/DefaultCheckbox';
const response = {
	response: {
		message: 'Search Completed Successfully',
		status: 'success',
		data: {
			id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
			full_name: 'Ayomide Onigbinde',
			company: 'Enyata',
			role: 'Software Engineer',
			contact_research: {
				events: [
					{
						url: 'https://techytechytech.com/hackathon/compiler-developmemt-hackaton-oayomide',
						description: 'some description here',
						title: 'I amsterdam - Your guide to visit, enjoy, live, work & Invest in Lorem ipsum dolor',
						content: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Ut eu tristique lacus. Sed lobortis'],
						tags: [],
						meta: {}
					}
				],
				articles: [
					{
						url: 'https://devto.com/oayomide/go-wasm-tutorial',
						description: 'some description here',
						title: 'I amsterdam - Your guide to visit, enjoy, live, work & Invest in Lorem ipsum dolor',
						content: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Ut eu tristique lacus. Sed lobortis'],
						tags: ['webassembly', 'jvm', 'go'],
						meta: {
							relevance_score: 5,
							timestamp: '2020-02-18 5:15:43TZ'
						}
					}
				],
				podcasts: [],
				features: [],
				awards: [],
				linkedin_activity: [],
				twitter_activity: [
					{
						url: 'https://twitter.com/oayomide/34394834394839',
						meta: {
							timestamp: '2020-02-18 5:15:43TZ'
						}
					}
				]
			},
			company_research: {
				job_postings: [
					{
						url: 'https://jobbrman.co/enyata/mid-senior-engineer-fullstack',
						meta: {}
					}
				],
				mergers_and_acquisitions: [],
				ipo: [],
				product_launch: [],
				others: [
					{
						url: 'https://bendadablogg.com/news/enyata-community-50-macbooks',
						tags: ['buildup', 'community', 'enyata', 'macbooks', 'tech'],
						meta: {
							timestamp: '2020-02-18 5:15:43TZ'
						}
					}
				]
			}
		}
	}
};

export default {
	name: 'SearchResult',
	components: {
		VNav,
		ToggleDropdown,
		DCheckbox,
		DropdownCheckbox
	},
	data() {
		return {
			response: response.response,
			companyFilter: [],
			contactFilter: []
		};
	},
	computed: {
		...mapGetters({
			getNotepad: 'search_services/getNotepad'
		}),
		notepad: {
			get() {
				return this.getNotepad;
			},
			set(value) {
				this.saveNotepad(value);
			}
		},
		contact_research: {
			get() {
				let newObj = {};
				const data = this.response.data.contact_research;
				if (this.contactFilter.length === 0) {
					for (const key in data) {
						if (Object.hasOwnProperty.call(data, key) && data[key].length !== 0) {
							const element = data[key];

							newObj[key] = element;
						}
					}
				} else {
					this.contactFilter.map((value) => {
						const element = Object.keys(data).includes(value) ? data[value] : null;
						newObj[value] = element;
					});
				}
				return newObj;
			}
		},
		company_research: {
			get() {
				let newObj = {};
				const data = this.response.data.company_research;
				if (this.companyFilter.length === 0) {
					for (const key in data) {
						if (Object.hasOwnProperty.call(data, key) && data[key].length !== 0) {
							const element = data[key];
							newObj[key] = element;
						}
					}
				} else {
					this.companyFilter.map((value) => {
						const element = Object.keys(data).includes(value) ? data[value] : null;
						newObj[value] = element;
					});
				}
				return newObj;
			}
		}
	},
	methods: {
		...mapMutations({
			saveNotepad: 'search_services/saveNotepad',
			saveSearchedItem: 'search_services/saveSearchedItem'
		}),
		displaySearchItem(type, item) {
			const data = {
				type: type,
				item: item
			};
			this.saveSearchedItem(data);
			this.$router.push({ name: 'SearchItem' });
		}
	}
};
