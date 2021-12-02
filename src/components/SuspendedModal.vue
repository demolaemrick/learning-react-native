<template>
	<!-- SUSPENDED USER NOTIFICATION MODAL -->
	<div v-if="show">
		<v-modal position="center" :useSlot="false">
			<template #settings>
				<div class="suspended__modal__wrapper">
					<div class="suspended__modal__header">
						<div class="suspended__modal__header__btn__wrapper">
							<v-button class="suspended__btn__close" ref="suspended__btn__close" @click="close()">
								<div class="btn__content__wrapper">
									<span class="text">Close</span>
									<span class="icon">
										<img src="@/assets/icons/close-sign.svg" alt="close button icon" class="ml-1" svg-inline />
									</span>
								</div>
							</v-button>
						</div>
					</div>
					<div class="suspended__modal__content">
						<div class="suspended__icon__wrapper">
							<img src="@/assets/icons/suspended-icon.svg" alt=" image" class="ml-1" svg-inline />
						</div>
						<div class="suspended__text__wrapper">
							<p>
								Your account has been suspended. <br />
								Click the button below to request reactivation.
							</p>
						</div>
						<div class="suspended__btn__wrapper">
							<v-button class="suspended__btn" @click="sendmail()">Reactivate Account</v-button>
						</div>
					</div>
				</div>
			</template>
		</v-modal>
	</div>
	<!-- SUSPENDED USER NOTIFICATION MODAL -->
</template>

<script>
import VButton from '@/components/Button';
import VModal from '@/components/Modal';
export default {
	name: 'SuspendedModal',
	components: {
		VButton,
		VModal
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		close: {
			type: Function
		},
		user: {
			type: Object,
			default: () => {}
		}
	},
	methods: {
		sendmail() {
			const subject = 'Request Reactivation';
			const body = `Hello Volley Team.%0D%0A %0D%0A 
			I noticed my account has been suspended and I will like to request that it be reactivated.
			%0D%0A %0D%0A
			My Volley details are:
			%0D%0A %0D%0A
			Full Name: ${this.user.first_name} ${this.user.last_name}
			%0D%0A
			Email: ${this.user.email}
			%0D%0A %0D%0A
			Best Regards,
			%0D%0A
			${this.user.first_name} ${this.user.last_name}.
			`;
			window.location.href = `mailto:support@volley.com?subject=${subject}&body=${body}`;
		}
	}
};
</script>

<style lang="scss">
// Modal
.suspended__modal__wrapper {
	.suspended__modal__header {
		.suspended__modal__header__btn__wrapper {
			display: flex;
			justify-content: flex-end;
			.suspended__btn__close {
				padding: 1em;
				border: 0;
				background: 0;
				outline: none;
				.btn__content__wrapper {
					.text {
						font-family: Karla;
						font-style: normal;
						font-weight: normal;
						font-size: 15px;
						letter-spacing: -0.4px;
						color: #333758;
					}
				}
			}
		}
	}
	.suspended__modal__content {
		padding: 1em;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.suspended__text__wrapper {
			p {
				margin: 27px 0;
				text-align: center;
				font-family: Karla;
				font-style: normal;
				font-weight: normal;
				font-size: 18px;
				line-height: 34px;
				letter-spacing: -0.3px;
				color: #202f44;
			}
		}
		.suspended__btn {
			padding: 10px 40px;
		}
	}
}
</style>
