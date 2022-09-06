<template>
	<div>
		<header class="header">
			<logo />
		</header>
		<main>
			<div class="content-wrapper">
				<div class="heading__text">
					<h3 class="heading__text-lg mb-1">Choose your platform</h3>
				</div>
				<div class="flex">
					<router-link to="/contact-research">
						<div class="platform-card">
							<div class="platform-card__box">
								<img src="../../assets/icons/research-platform-icon.png" alt="volley research platform icon" />
							</div>
							<h5>Research Platform</h5>
							<p>Automate your contact research from multiple online sources.</p>
						</div>
					</router-link>
					<router-link to="/data-platform">
						<div class="platform-card">
							<div class="platform-card__box">
								<img src="../../assets/icons/data-platform-icon.png" alt="volley data platform icon" />
							</div>
							<h5>Data Platform</h5>
							<p>Extract and enrich a list of contacts from your Linkedln saved search.</p>
						</div>
					</router-link>
				</div>
			</div>
		</main>
	</div>
</template>

<script src="./choose-platform.js"></script>
<style lang="scss" scoped src="./choose-platform.scss"></style>
