<template>
	<div class="privacy">
		<div class="container container--lg">
			<v-header :notglobal="false" />
		</div>
		<header class="privacy_header">
			<h1>Privacy Policy</h1>
		</header>
		<main>
			<div class="container container--lg">
				<p class="updatedon">Last updated: December 01, 2021</p>
				<section class="intro">
					<h4>Privacy Policy</h4>
					<p>
						This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information
						when You use the Service and tells You about Your privacy rights and how the law protects You. <br />We use Your
						Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of
						information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the
						Privacy Policy Generator.
					</p>
				</section>

				<h1>Interpretation and Definitions</h1>

				<section class="interpretation">
					<h4>Interpretation</h4>
					<p>
						The words of which the initial letter is capitalized have meanings defined under the following conditions. The
						following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
					</p>
				</section>

				<!-- Definition-->
				<definition />
				<!-- /Definition-->

				<h1>Collecting and Using Your Personal Data</h1>
				<h2>Types of Data Collected</h2>

				<!-- personal-->
				<personal />
				<!-- /personal-->

				<section class="retention">
					<h2 class="subs">Retention of Your Personal Data</h2>
					<p>
						The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy
						Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for
						example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our
						legal agreements and policies.
					</p>
					<p>
						The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a
						shorter period of time, except when this data is used to strengthen the security or to improve the functionality of
						Our Service, or We are legally obligated to retain this data for longer time periods.
					</p>
				</section>

				<section class="transfer">
					<h2 class="subs">Transfer of Your Personal Data</h2>
					<p>
						Your information, including Personal Data, is processed at the Company's operating offices and in any other places
						where the parties involved in the processing are located. It means that this information may be transferred to — and
						maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where
						the data protection laws may differ than those from Your jurisdiction.
					</p>

					<p>
						Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to
						that transfer.
					</p>

					<p>
						The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance
						with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country
						unless there are adequate controls in place including the security of Your data and other personal information.
					</p>
				</section>
				<!-- Others -->
				<others />
				<!-- /Others -->

				<section class="contactus">
					<h2 class="subs">Contact Us</h2>
					<p>If you have any questions about this Privacy Policy, You can contact us:</p>
					<ul>
						<li>By email: support@volley.com</li>
					</ul>
				</section>
			</div>
		</main>
	</div>
</template>

<script>
import VHeader from '@/components/Header/search/Header';
import Definition from './Definition.vue';
import Personal from './Personal.vue';
import Others from './Others.vue';
export default {
	name: 'PrivacyPolicy',
	components: {
		VHeader,
		Definition,
		Personal,
		Others
	}
};
</script>

<style lang="scss">
.privacy {
	transform: translateY(-30px);
	main {
		transform: translateY(-32px);
		& .updatedon {
			font-style: normal;
			font-weight: normal;
			font-size: 16px;
			line-height: 32px;
			color: #989aaa;
			margin-bottom: 32px;
		}
		& h1 {
			font-style: normal;
			font-weight: bold;
			font-size: 40px;
			line-height: 40px;
			color: #202f44;
			margin-top: 64px;
		}
		& h2 {
			margin: 32px 0;
			font-style: normal;
			font-weight: bold;
			font-size: 32px;
			line-height: 40px;
			color: #989aaa;
		}
		& h4 {
			font-style: normal;
			font-weight: bold;
			font-size: 30px;
			line-height: 40px;

			letter-spacing: -0.01em;

			color: #202f44;
		}
		& .interpretation,
		& .definition {
			& > h4 {
				margin-top: 64px;
			}
		}

		& .personal,
		.disclosure {
			h4 {
				margin-top: 24px;
			}
		}
		& h2.subs {
			font-size: 38px !important;
			color: #202f44;
		}
		.list_heading {
			margin-bottom: 24px;
		}
	}
	& p {
		margin-top: 24px;
		font-weight: normal;
		font-size: 18px;
		line-height: 30px;
		color: #202f44;
	}
	& ul {
		list-style: disc;
		padding: 0 15px;
		& li {
			margin-bottom: 24px;
			font-size: 18px;
			line-height: 30px;
			color: #202f44;
			font-weight: normal;
		}
	}
	&_header {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 229px;
		background-color: #041237;
		transform: translateY(-80px);
		& > h1 {
			color: #fff;
			font-style: normal;
			font-weight: bold;
			font-size: 72px;
			line-height: 72px;
		}
	}
}

a {
	&:hover {
		color: #4576be;
	}
}

@media (min-width: 1380px) {
	.privacy {
		&_header {
			height: 329px;
		}
	}
}
</style>
