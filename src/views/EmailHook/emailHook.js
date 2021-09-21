import { mapGetters, mapActions } from 'vuex';
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
					email: {
						subject: 'Dangote sets aside $1.2 billion for Nigerian foundation',
						hook: 'How can a business person from a developing country give back to the community?'
					}
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
			showAlert: 'showAlert',
			refresh: 'search_services/refresh',
			addEmailIntros: 'user/generateAdditionalHooks'
		}),
		showIntroHook(index) {
			this.$set(this.displayEmail, index, !this.displayEmail[index]);
		},
		editContent(index) {
			this.$set(this.editText, index, !this.editText[index]);
		},
		validateURL(link) {
			if (link.indexOf('https://') === 0 || link.indexOf('http://') === 0) {
				return link;
			} else {
				return `https://${link}`;
			}
		},
		async copyIntroEmail(subject, content) {
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
		},
		async generateHook() {
			const article = { ...this.getSearchedItem };
			const type = article.type === 'contact_insights' ? 'contact_research' : 'company_research';

			try {
				const response = await this.addEmailIntros({
					rowId: this.getSearchedResult.rowId,
					url: article.item.url,
					type: type
				});

				console.log(response);
				if (response.status === 200 && response.statusText === 'OK') {
					this.showAlert({
						status: 'success',
						message: 'Email intros generated successfully',
						showAlert: true
					});
					this.emailHooks.push(...response.data.emails);
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: 'Unable to generate email intros',
					showAlert: true
				});
			}
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
