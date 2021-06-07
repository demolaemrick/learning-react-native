<template>
	<div>
		<modal position="right" :active="editModal" @close="closeEditModal">
			<template #title>
				<h3>Edit</h3>
			</template>
			<template #body>
				<form action="">
					<ValidationObserver v-slot="{}" color="#ff0000">
						<div class="auth-input">
							<div class="flex flex-spaced">
								<text-input
									rules="required"
									labelVisible
									v-model="form.firstName"
									width="204px"
									name="First Name"
									placeholder="John"
								/>
								<text-input
									rules="required"
									labelVisible
									v-model="form.lastName"
									width="204px"
									name="Last Name"
									placeholder="Doe"
								/>
							</div>

							<text-input
								type="email"
								rules="required"
								labelVisible
								v-model="form.email"
								width="100%"
								name="Email Address"
								placeholder="johndoe@email.com"
							/>
							<div class="flex flex-spaced">
								<text-input
									type="text"
									rules="required"
									labelVisible
									v-model="form.organisation"
									width="204px"
									name="Organisation"
									placeholder="Microsoft"
								/>
								<text-input
									rules="required"
									labelVisible
									v-model="form.researches"
									width="204px"
									name="No. Research/month"
									placeholder="200"
								/>
							</div>
							<div class="flex flex-spaced">
								<text-input
									type="text"
									rules="required"
									labelVisible
									v-model="form.profession"
									width="204px"
									name="Profession"
									placeholder="Product"
								/>
								<text-input
									rules="required"
									labelVisible
									v-model="form.role"
									width="204px"
									name="Role"
									placeholder="Content Creator"
								/>
							</div>
							<div class="flex flex__end">
								<c-button class="submit" size="large" buttonType="primary">
									<template v-if="!loading">Save Changes</template>
									<Loader v-else />
								</c-button>
							</div>
						</div>
					</ValidationObserver>
				</form>
			</template>
		</modal>
	</div>
</template>

<script src="./editUser.js"></script>

<style lang="scss" scoped>
@import './EditUser.scss';
</style>
