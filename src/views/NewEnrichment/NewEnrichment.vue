<template>
	<div class="container container--lgs">
		<v-header />
		<main class="main">
			<div class="form-container">
				<div class="form-container-header">
					<template v-if="formPosition === 0"
						><h3>Start a new enrichment</h3>
						<p>
							Choose a data source and client to start <br />
							building a lead list.
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
					<ValidationObserver v-slot="{ invalid }">
						<template v-if="!isLastFormPosition">
							<div class="form-container-input">
								<div class="select-group flex flex__column">
									<label for="">Data Source</label>
									<select id="" v-model="form.source">
										<option value="">Select</option>
										<option v-for="option in availableDataSource" :value="option" :key="option">
											{{ option }}
										</option>
									</select>
								</div>
							</div>
							<div class="form-container-input">
								<div class="select-group flex flex__column">
									<label for="">Client Name</label>
									<select id="" v-model="form.client">
										<option value="">Select</option>
										<option v-for="option in availableClients" :value="option" :key="option.id">
											{{ option.name }}
										</option>
									</select>
								</div>
							</div>
							<div class="form-container-input">
								<div class="select-group flex flex__column">
									<label for="">Outreach record owner</label>
									<select id="" v-model="form.outreachOwner">
										<option value="">Select</option>
										<option
											v-for="option in availableClients"
											:value="option"
											:key="option.id"
											style="text-decoration: capitalize"
										>
											{{ option.email }}
										</option>
									</select>
								</div>
							</div>
							<div class="form-container-input">
								<div class="select-group flex flex__column">
									<label for="">Volley BDR owner</label>
									<select id="" v-model="form.bdrOwner">
										<option value="">Select</option>
										<option v-for="option in availableBdrOwners" :value="option" :key="option.id">
											{{ option.name }}
										</option>
									</select>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="form-container-input">
								<text-input
									type="text"
									rules="required"
									labelVisible
									v-model="form.lickedInCookie"
									width="100%"
									name="Linkedin Sales Nav Cookie"
									placeholder="Linkedin Sales Nav Cookie"
								/>
							</div>
							<div class="form-container-input">
								<text-input
									type="text"
									rules="required"
									labelVisible
									v-model="form.sourceUrl"
									width="100%"
									name="Linkedin Sales Nav Saved Search URL"
									placeholder="Linkedin Sales Nav Saved Search URL"
								/>
							</div>
						</template>

						<div class="flex mt-2 btn-flex" :class="formPosition > 0 ? 'flex-spaced' : 'flex-end'">
							<c-button @click="prevStep" buttonType="outline" v-if="formPosition > 0">Back</c-button>
							<c-button @click="submit" buttonType="primary" :disabled="invalidateNextButton || invalid">
								<template v-if="!loading">
									<template v-if="isLastFormPosition">Submit</template>
									<template v-else>Next</template>
								</template>
								<Loader v-else />
							</c-button>
						</div>
					</ValidationObserver>
				</form>
			</div>
		</main>
		<template v-if="showModal">
			<v-modal position="center" :useSlot="false" marginTop="6%">
				<template #settings>
					<div class="modal__wrapper">
						<div class="modal__content">
							<div class="modal__content__icon__wrapper">
								<img src="@/assets/icons/warning-icon.svg" alt="volley warning icon" class="ml-1" svg-inline />
							</div>
							<h3>{{ dataProgressStatus }}</h3>
							<div class="modal__text__wrapper">
								<p>{{ dataProgressMessage }}</p>
							</div>
							<div class="modal__btn__wrapper">
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
