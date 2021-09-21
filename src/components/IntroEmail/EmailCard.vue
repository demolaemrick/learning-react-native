<template>
	<div class="email-intro__single">
		<div class="email-intro__single__header">
			<p class="subject">Subject Line Here</p>
			<button>
				<img @click="emailIntro = !emailIntro" src="@/assets/icons/email-hook-arrow.svg" alt="down-arrow icon" svg-inline />
			</button>
		</div>
		<div v-if="emailIntro" class="email-intro__single__content">
			<p class="text">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu libero nibh. Proin blandit elit vitae convallis auctor. In
				hac habitasse platea dictumst.
			</p>
			<div class="editHook-icons">
				<button @click="$emit('copyHook')">
					<img class="icon" src="@/assets/icons/copy-icon.svg" alt="copy icon" svg-inline />
				</button>
				<button @click="$emit('copyHook')">
					<img class="icon" src="@/assets/icons/edit-icon.svg" alt="edit icon" svg-inline />
				</button>
				<button @click="$emit('deleteHook')">
					<img src="@/assets/icons/delete-icon.svg" alt="delete icon" svg-inline />
				</button>
			</div>
		</div>
	</div>
</template>
