import { mapMutations, mapGetters, mapActions } from 'vuex';
import VHeaderitem from '@/components/Header/singleSearch/Header';
import VButton from '@/components/Button';
import TextInput from '@/components/Input';


export default {
	name: 'EmailHook',
	components: {
		VHeaderitem,
		VButton,
		TextInput
	},
	data() {
		return {
			emailContent: false,
			emailHooks: [
				{
					subject: 'Test 1',
					content:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu libero nibh. Proin blandit elit vitae convallis auctor. In hac habitasse platea dictumst.'
				},
				{
					subject: 'Test 2',
					content:
						'consectetur adipiscing elit. In eu libero nibh. Proin blandit elit vitae convallis auctor. In hac habitasse platea dictumst Lorem ipsum dolor sit amet, .'
				},
				{
					subject: 'Test 3',
					content:
						'fugndivjoierpome; nwoirfnwimflw k consectetur adipiscing elit. In eu libero nibh. Proin blandit elit vitae convallis auctor. In hac habitasse platea dictumst Lorem ipsum dolor sit amet, .'
				},
				{
					subject: 'Test ',
					content:
						'wrnlwnliknlwrijrijroipmpwmw wrniwnconsectetur adipiscing elit. In eu libero nibh. Proin blandit elit vitae convallis auctor. In hac habitasse platea dictumst Lorem ipsum dolor sit amet, .'
				}
			],
			editMode: false,
			contact_details: '',
			displayEmail: [],
			editText: [],
			message: 'This is a mango'
		};
	},
	async mounted() {
		this.currentSearch();
		this.searchType = this.getSearchedItem.type;
		this.$refs.main.scrollTop = 0;
	},
	methods: {
		...mapActions({
			showAlert: 'showAlert'
		}),
		showIntroHook(index) {
			this.$set(this.displayEmail, index, !Boolean(this.displayEmail[index]));
		},
		editContent(index) {
			this.$set(this.editText, index, !Boolean(this.editText[index]));
		},
		validateURL(link) {
			if (link.indexOf('https://') === 0 || link.indexOf('http://') === 0) {
				return link;
			} else {
				return `https://${link}`;
			}
		},
		async copyIntroEmail(subject, content, index) {
			if (subject && content) {
				await navigator.clipboard
					.writeText('subject: ' + subject + ' ' + 'content: ' + content)
					.then(() => {
						this.showAlert({
							status: 'success',
							message: 'Email hook copied',
							showAlert: true
						});
					})
					.catch((error) => {
						console.log('eerrr', error);
						this.showAlert({
							status: 'error',
							message: 'Unable to copy email hook',
							showAlert: true
						});
					});
			}
		},
		currentSearch() {
			return (this.contact_details = { ...this.getSearchedResult.contact_details });
		}
	},
	computed: {
		...mapGetters({
			getSearchedItem: 'search_services/getSearchedItem',
			getSearchedResult: 'search_services/getSearchedResult'
		}),

		quotedArticle() {
			if (this.getSearchedItem.item.meta) {
				return this.getSearchedItem.item;
			}
			return [...this.contact_insights_categories, ...this.contact_other_insights].find(
				(article) => article.url === this.getSearchedItem.item.article_url
			);
		}
		// socials: {
		// 	get() {
		// 		if (this.searchedResult.socials) {
		// 			return this.searchedResult.socials.filter((x) => {
		// 				return !Object.values(x).every((i) => i === null);
		// 			});
		// 		}
		// 	}
		// },
	}
};
