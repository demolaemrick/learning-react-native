import { mapGetters, mapActions } from 'vuex';
import { ValidationObserver } from 'vee-validate';

import VHeaderitem from '@/components/Header/singleSearch/Header';
import VButton from '@/components/Button';
import TextInput from '@/components/Input';
import Loader from '@/components/Loader';
import insightMixin from '@/mixins/insightMixin';
import InsightCard from '@/components/InsightCard';
import EmailHookCard from '@/components/EmailHookCard';
import routeMixin from '@/mixins/routeMixin';

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
	mixins: [insightMixin, routeMixin],
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
			currentHooks: [],
			message: 'This is a mango',
			createdEmailHook: {
				subject: '',
				hook: ''
			},
			searchType: 'contact_insights',
			articlesOpened: false,
			hookArticles: []
		};
	},
	async mounted() {
		if (this.getSearchedItem.item) {
			await this.fetchGeneratedHooks();
			await this.fetchHookArticles();
			this.searchType = this.getSearchedItem.type;
		} else {
			await this.fetchHookArticles();
			this.articlesOpened = true;
		}
	},
	methods: {
		...mapActions({
			showAlert: 'showAlert',
			refresh: 'search_services/refresh',
			addEmailIntros: 'user/generateHooks',
			fetchEmailIntros: 'user/fetchHooks',
			deleteEmailHook: 'user/deleteEmailHook',
			editEmailHook: 'user/editEmailHook',
			createEmailHook: 'user/createEmailHook',
			fetchArticles: 'user/fetchArticlesWithEmailHook'
		}),
		toggleArticlePane() {
			this.articlesOpened = !this.articlesOpened;
		},
		showIntroHook(index) {
			this.$set(this.displayEmail, index, !this.displayEmail[index]);
		},
		editContent(index, hook) {
			this.$set(this.currentHooks, index, { subject: hook.email.subject, hook: hook.email.hook });
			this.toggleEditMode(index);
		},
		toggleEditMode(index) {
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
						console.log(error);
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
					rowId: this.rowId,
					url: article.item.url,
					type: type
				});

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
				await this.fetchHookArticles();
			}
		},
		async fetchGeneratedHooks() {
			try {
				const response = await this.fetchEmailIntros({
					rowId: this.rowId,
					url: this.quotedArticle.url
				});

				if (response.status === 200 && response.statusText === 'OK' && response.data.emails.length) {
					this.showAlert({
						status: 'success',
						message: 'Email intros retrieved successfully',
						showAlert: true
					});
					this.emailHooks.push(...response.data.emails);
					return;
				}
				this.showAlert({
					status: 'info',
					message: 'No Emails found',
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
		async fetchHookArticles() {
			try {
				const response = await this.fetchArticles(this.rowId);
				if (response.status === 200 && response.statusText === 'OK') {
					this.showAlert({
						status: 'success',
						message: response.data.message,
						showAlert: true
					});
					this.hookArticles = [...response.data.articles];
				}
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
				this.toggleEditMode(index);
			}
		},
		cancelEdit(index) {
			this.emailHooks[index].email = this.currentHooks[index];
			this.toggleEditMode(index);
		},
		async addHook() {
			this.loading = true;

			const type = this.searchType === 'contact_insights' ? 'contact_research' : 'company_research';
			try {
				const response = await this.createEmailHook({
					rowId: this.rowId,
					url: this.quotedArticle.url,
					type,
					...this.createdEmailHook
				});

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
				type,
				item
			};
			this.saveSearchedItem(data);
			this.fetchGeneratedHooks();
		}
	},
	computed: {
		...mapGetters({
			getSearchedItem: 'search_notes/getSearchedItem',
			getSearchedResult: 'search_services/getSearchedResult'
		}),
		contactDetails() {
			if (!this.getSearchedResult.contact_details) {
				return null;
			}
			return JSON.parse(JSON.stringify(this.getSearchedResult.contact_details));
		},
		searchImage() {
			const images = this.getSearchedResult.contact_details.images;
			if (images) {
				return images[Math.floor(Math.random() * images.length)];
			}
		},
		quotedArticle: {
			get() {
				if (!this.getSearchedItem.item) {
					return null;
				}
				if (this.getSearchedItem.item.meta) {
					return this.getSearchedItem.item;
				}
			}
		}
	}
};
