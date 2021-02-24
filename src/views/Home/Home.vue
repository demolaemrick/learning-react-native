<template>
	<div class="container container--lg">
		<nav class="navbar">
			<div class="nav-item logo">
				<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
					<g fill="none" fill-rule="evenodd">
						<g fill-rule="nonzero">
							<g>
								<g transform="translate(-149 -31) translate(150 32)">
									<path
										fill="#333758"
										stroke="#333758"
										stroke-width="1.3"
										d="M20 40c8.27 0 15.38-5.01 18.424-12.199l.004-.01C39.471 25.325 40 22.704 40 20 40 8.943 31.052 0 20 0 8.938 0 0 8.944 0 20c0 10.986 8.88 20 20 20zm8.376-3.569c3.012-6.71-.43-14.819-7.726-17.055-.61-2.682-.208-5.413 1.144-7.786 7.862 1.92 13.593 8.181 15.099 15.813-1.752 3.994-4.825 7.145-8.517 9.028h0zM38.437 20c0 1.619-.206 3.204-.613 4.74-2.215-7.027-7.813-12.542-15.105-14.526 2.237-2.846 5.71-4.41 9.344-4.16 4.058 3.505 6.374 8.568 6.374 13.946zM30.04 4.53c-3.765.384-7.188 2.462-9.282 5.752-1.809 2.844-2.379 6.188-1.625 9.467-2.019 1.87-4.585 2.888-7.316 2.903l-.119-.43c-.872-3.254-.926-6.687-.157-9.928.948-3.995 3.142-7.753 6.415-10.618.676-.074 1.362-.113 2.044-.113 3.71 0 7.162 1.094 10.04 2.967h0zM15.187 2.2c-2.528 2.757-4.316 6.15-5.166 9.734-.821 3.46-.771 7.122.145 10.604-3.583-.513-6.675-2.74-8.277-6.012C3.21 9.601 8.487 4.023 15.187 2.2zm-13.6 16.849c2.341 3.236 6.097 5.165 10.173 5.165 3.16 0 6.128-1.171 8.455-3.337 2.63.813 4.795 2.527 6.174 4.888-.202.167-2.641 2.967-6.95 4.745-.399.165-.589.621-.424 1.02.165.4.622.589 1.02.424 2.615-1.079 5.06-2.706 7.079-4.707 1.347 3.36.963 7.154-1.07 10.178-1.938.671-3.97 1.013-6.044 1.013-4.962 0-9.583-1.932-13.018-5.372 1.559.347 3.154.52 4.754.52.55 0 1.109-.02 1.658-.062.43-.032.753-.407.72-.837-.032-.43-.407-.754-.837-.72-.51.038-1.03.057-1.541.057-2.247 0-4.451-.365-6.587-1.093C2.854 27.819 1.562 24.04 1.562 20c0-.317.01-.634.026-.951z"
									/>
									<circle cx="16.25" cy="30.781" r="1" fill="#000" />
								</g>
							</g>
						</g>
					</g>
				</svg>
				<h3 class="ml-1 logo-text">Volley App</h3>
			</div>
		</nav>
		<main class="main">
			<div class="hero">
				<h2 class="hero-title">More refined <span>research</span> .</h2>
				<p class="hero-desc">
					We provide industry-leading protection for the entire customer journey. Our verification system reduces chargebacks,
					manual reviews and false positives to increase approval rates and reviews.
				</p>
			</div>
			<ValidationObserver v-slot="{ invalid }">
				<div class="search-wrapper">
					<v-text-input class="search-input" rules="required" placeholder="Name" name="name" v-model="payload.full_name" />
					<v-text-input class="search-input" rules="required" placeholder="Title" name="title" v-model="payload.role" />
					<v-select
						:options="countries"
						@update="onChildUpdate"
						placeholder="Select Country"
						name="company"
						v-model="company"
						class="search-input"
						required
					></v-select>
					<button class="btn btn-primary" :disabled="invalid">Search</button>
				</div>
			</ValidationObserver>
			<p class="more-filter">More search options</p>
			<div class="table__wrapper">
				<table class="table">
					<thead class="table__header">
						<tr>
							<th class="table__header-item">Contact research</th>
							<th class="table__header-item">Include</th>
							<th class="table__header-item">Keywords</th>
							<th class="table__header-item"></th>
						</tr>
					</thead>
					<tbody>
						<tr class="table__header-space"></tr>
						<tr class="table__row">
							<td class="table__row-item">Events/conferences/Webinars</td>
							<td class="table__row-item">
								<label class="toggle"
									><input type="checkbox" value="events" v-model="payload.contact_search.events" /><span
										class="toggle-icon"
									></span
								></label>
							</td>
							<td class="table__row-item">
								<v-text-input
									class="keywords-input"
									placeholder="Keywords ( seperated by comma )"
									name="event-keywords"
									v-model="eventKeywords"
								/>
							</td>
							<td class="table__row-item">
								<v-checkbox class="" name="all" truthValue="all">
									Apply keywords to all
								</v-checkbox>
							</td>
						</tr>
						<tr class="table__row">
							<td class="table__row-item">Blogs/Articles</td>
							<td class="table__row-item">
								<label class="toggle"
									><input value="articles" type="checkbox" v-model="payload.contact_search.articles" /><span
										class="toggle-icon"
									></span
								></label>
							</td>
							<td class="table__row-item">
								<v-text-input
									class="keywords-input"
									placeholder="Keywords ( seperated by comma )"
									name="blog-keywords"
									v-model="blogKeywords"
								/>
							</td>
							<td class="table__row-item"></td>
						</tr>
					</tbody>
				</table>
			</div>
		</main>
	</div>
</template>

<script>
import VCheckbox from '@/components/Checkbox';
import VSelect from '@/components/Select';
import VTextInput from '@/components/Input';
import { ValidationObserver } from 'vee-validate';
export default {
	name: 'Home',
	components: {
		VCheckbox,
		VSelect,
		VTextInput,
		ValidationObserver
	},
	data() {
		return {
			moreFilter: ['events', 'blogs'],
			search: {
				type: Object
			},
			company: '',
			eventKeywords: '',
			blogKeywords: '',
			payload: {
				full_name: '',
				company: '',
				role: '',
				contact_search: {
					events: [],
					articles: [],
					podcasts: [],
					features: [],
					awards: [],
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
			},

			countries: [
				'ICBC',
				'China Construction Bank',
				'JPMorgan Chase',
				'Berkshire Hathawa',
				'Agricultural Bank of China',
				'Saudi Arabian Oil Company (Saudi Aramco)',
				'Ping An Insurance Group',
				'Bank of America',
				'Apple',
				'Bank of China'
			]
		};
	},
	methods: {
		onChildUpdate(newValue) {
			this.payload.company = newValue;
		}
	}
};
</script>
<style lang="scss" scoped src="./home.scss"></style>
