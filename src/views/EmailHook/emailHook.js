import { mapGetters, mapActions } from 'vuex';
import { ValidationObserver } from 'vee-validate';

import VHeaderitem from '@/components/Header/singleSearch/Header';
import VButton from '@/components/Button';
import TextInput from '@/components/Input';
import Loader from '@/components/Loader';
import insightMixin from '@/mixins/insightMixin';
import InsightCard from '@/components/InsightCard';
import EmailHookCard from '@/components/EmailHookCard';

export default {
	name: 'EmailHook',
	components: {
		ValidationObserver,
		VHeaderitem,
		VButton,
		TextInput,
		Loader,
		InsightCard,
		EmailHookCard
	},
	mixins: [insightMixin],
	data() {
		return {
			loading: false,
			emailContent: false,
			emailHooks: [
				// {
				// 	email: {
				// 		subject: 'Dangote sets aside $1.2 billion for Nigerian foundation',
				// 		hook: 'How can a business person from a developing country give back to the community?'
				// 	}
				// },
				// {
				// 	_id: '6149f33dc23c03618436df10',
				// 	userId: '607ea1bf965bbe6414c00b13',
				// 	rowId: '478044c3-e841-40b2-bb2b-bf0241373985',
				// 	url:
				// 		'https://www.usatoday.com/story/tech/2020/03/13/bill-gates-steps-down-microsoft-and-warren-buffetts-firm-boards/5046369002/',
				// 	type: 'contact_research',
				// 	email: {
				// 		subject: 'Bill Gates to step down from Microsoft',
				// 		hook: 'Bill Gates says he&rsquo;s stepping down from Microsoft board'
				// 	}
				// }
			],
			editMode: false,
			displayEmail: [],
			editText: [],
			message: 'This is a mango',
			createdEmailHook: {
				subject: '',
				hook: ''
			},
			searchType: 'contact_insights',
			articlesOpened: false
		};
	},
	async mounted() {
		console.log('check', this.getSearchedItem);
		if(this.getSearchedItem.item) {
			this.fetchGeneratedHooks();
			this.searchType = this.getSearchedItem.type;
			const page = this.$refs.main.offsetTop;
			window.scrollTo(0, page);
		} else {
			this.articlesOpened = true;
		}
		// document.querySelector('.article-section').scrollTop = 0;
	},
	methods: {
		...mapActions({
			showAlert: 'showAlert',
			refresh: 'search_services/refresh',
			addEmailIntros: 'user/generateHooks',
			fetchEmailIntros: 'user/fetchHooks',
			deleteEmailHook: 'user/deleteEmailHook',
			editEmailHook: 'user/editEmailHook',
			createEmailHook: 'user/createEmailHook'
		}),
		toggleArticlePane() {
			this.articlesOpened = !this.articlesOpened;
		},
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
		async generateHook() {
			this.loading = true;

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
			} finally {
				this.loading = false;
			}
		},
		async fetchGeneratedHooks() {
			try {
				const response = await this.fetchEmailIntros({
					rowId: this.getSearchedResult.rowId,
					url: this.quotedArticle.url
				});

				if (response.status === 200 && response.statusText === 'OK' && response.data.emails.length) {
					this.showAlert({
						status: 'success',
						message: 'Generated email intros retrieved successfully',
						showAlert: true
					});
					this.emailHooks.push(...response.data.emails);
					return;
				}
				this.showAlert({
					status: 'info',
					message: 'No generated emails found',
					showAlert: true
				});
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		async deleteHook(hook) {
			try {
				const response = await this.deleteEmailHook(hook._id);

				console.log(response);

				if (response.status === 200 && response.statusText === 'OK') {
					this.showAlert({
						status: 'success',
						message: 'Email intro deleted successfully',
						showAlert: true
					});

					const index = this.emailHooks.findIndex((x) => {
						return x._id === hook._id;
					});
					if (index !== -1) {
						this.emailHooks.splice(index, 1);
					}
				}
			} catch (error) {
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			}
		},
		async editHook(hook, index) {
			const mailHook = hook.email.hook;
			const subject = hook.email.subject;

			if (!mailHook || !subject) {
				this.showAlert({
					status: 'error',
					message: 'Ensure no input field is empty',
					showAlert: true
				});
				return;
			}

			try {
				const response = await this.editEmailHook({
					id: hook._id,
					hook: hook.email.hook,
					subject: hook.email.subject
				});

				console.log(response);
				if (response.status === 200 && response.statusText === 'OK') {
					this.showAlert({
						status: 'success',
						message: 'Email intro edited successfully',
						showAlert: true
					});
				}
			} catch (error) {
				console.log(error);
				this.showAlert({
					status: 'error',
					message: error.response.data.message,
					showAlert: true
				});
			} finally {
				this.editContent(index);
			}
		},
		async addHook() {
			this.loading = true;

			const type = this.searchType === 'contact_insights' ? 'contact_research' : 'company_research';
			try {
				const response = await this.createEmailHook({
					rowId: this.getSearchedResult.rowId,
					url: this.quotedArticle.url,
					type,
					...this.createdEmailHook
				});

				console.log(response);
				if (response.status === 200 && response.statusText === 'OK') {
					this.showAlert({
						status: 'success',
						message: 'Email intro created successfully',
						showAlert: true
					});
				}
				this.createdEmailHook.subject = '';
				this.createdEmailHook.hook = '';
				this.toggleModalClass('hookModal');

				this.fetchGeneratedHooks();
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
		async displaySearchItem(type, item) {
			this.emailHooks = [];
			const data = {
				type: type,
				item: item
			};
			await this.saveSearchedItem(data);
			this.fetchGeneratedHooks();

			// this.$refs.openArticle.scrollTop = 0;
		}
	},
	computed: {
		...mapGetters({
			getSearchedItem: 'search_services/getSearchedItem',
			getSearchedResult: 'search_services/getSearchedResult'
		}),
		contact_details() {
			return JSON.parse(JSON.stringify(this.getSearchedResult.contact_details));
		},
		quotedArticle() {
			if (!this.getSearchedItem.item) {
				return null;
			}
			if (this.getSearchedItem.item.meta) {
				return this.getSearchedItem.item;
			}
			return [...this.contact_insights_categories, ...this.contact_other_insights].find(
				(article) => article.url === this.getSearchedItem.item.article_url
			);
		}
	}
};
