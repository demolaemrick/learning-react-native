<template>
	<div class="container">
		<header class="header">
			<logo />
		</header>
		<main class="main">
			<div class="content-wrapper">
				<div class="heading__text">
					<h3 class="heading__text-lg mb-1">Choose your platform</h3>
					<p class="heading__text-sm">Subtext goes here</p>
				</div>
				<div class="flex">
					<router-link to="/contact-research">
						<div class="platform-card">
							<div class="platform-card__box"></div>
							<h5>Research Platform</h5>
							<p>Lorem ipsum dolor sit amert plerusa deauteir accumsan nibh tortor accumsan benelit.</p>
						</div>
					</router-link>
					<router-link to="/data-platform">
						<div class="platform-card">
							<div class="platform-card__box"></div>
							<h5>Data Platform</h5>
							<p>Lorem ipsum dolor sit amert plerusa deauteir accumsan nibh tortor accumsan benelit.</p>
						</div>
					</router-link>
				</div>
			</div>
		</main>
	</div>
</template>

<script src="./choose-platform.js"></script>
<style lang="scss" scoped src="./choose-platform.scss"></style>
