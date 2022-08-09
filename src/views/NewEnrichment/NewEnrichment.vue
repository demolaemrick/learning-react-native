<template>
	<div class="container">
		<main class="main">
			<div class="form-container">
				<div class="form-container-header">
					<template v-if="formPosition === 0"
						><h3>Start a new enrichment</h3>
						<p>
							Choose a data source and client to start <br />
							building a lead list
						</p></template
					>
					<template v-else>
						<h3>Details</h3>
						<div class="details-wrapper">
							<ul>
								<li><router-link to="#">Watch this video</router-link> on how to get your LinkedIn Sales Nav Cookie</li>
								<li>
									<router-link to="#">Watch this video</router-link> to make sure your sales nav search URL is properly
									formatted
								</li>
								<li>Inputting the wrong cookie or search URL will result in a failed list!</li>
							</ul>
						</div>
					</template>
				</div>
				<form @submit.prevent="submit" :class="animation">
					<div class="form-container-input" v-for="(field, index) in formGroup[formPosition].fields" :key="'field' + index">
						<div class="select-group flex flex__column" v-if="!isLastFormPosition">
							<label for="">{{ field.label }}</label>
							<select :name="field.label" id="">
								<option value="">Select</option>
							</select>
						</div>

						<text-input
							type="text"
							labelVisible
							v-model="field.value"
							width="100%"
							:name="field.label"
							:placeholder="field.label"
							v-else
						/>
					</div>
					<div class="flex mt-2" :class="formPosition > 0 ? 'flex-spaced' : 'flex-end'">
						<c-button @click="prevStep" buttonType="outline" v-if="formPosition > 0">Back</c-button>
						<c-button @click="submit" buttonType="primary">
							<template v-if="!loading">
								<template v-if="isLastFormPosition">Submit</template>
								<template v-else>Next</template>
							</template>
							<Loader v-else />
						</c-button>
					</div>
				</form>
			</div>
		</main>
		<template v-if="showModal">
			<v-modal position="center" :useSlot="false" marginTop="6%">
				<template #settings>
					<div class="config__modal__wrapper">
						<div class="config__modal__header">
							<div class="config__modal__header__btn__wrapper">
								<c-button class="config__btn__close" ref="config__btn__close" @click="closeModal()">
									<div class="btn__content__wrapper">
										<span class="text">Close</span>
										<span class="icon">
											<img src="@/assets/icons/close-sign.svg" alt="close button icon" class="ml-1" svg-inline />
										</span>
									</div>
								</c-button>
							</div>
						</div>
						<div class="config__modal__content">
							<div class="config__icon__wrapper">
								<img src="@/assets/icons/warning-icon.svg" alt="volley warning icon" class="ml-1" svg-inline />
							</div>
							<h3>Your run is in progress</h3>
							<div class="config__text__wrapper">
								<p>
									volley robots are currently working hard to get your data! You can close this window without affecting
									your results – we'll email you when your list is ready!
								</p>
							</div>
							<div class="config__btn__wrapper">
								<c-button @click="$router.push({ name: 'DataPlatform' })" buttonType="primary"
									>Return to Data Platform</c-button
								>
							</div>
						</div>
					</div>
				</template>
			</v-modal>
		</template>
	</div>
</template>
<script src="./new-enrichment.js"></script>
<style lang="scss" scoped src="./new-enrichment.scss"></style>
