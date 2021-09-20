<template>
	<div>
		<VHeaderitem />
		<main ref="main" class="main container container--lg">
			<div class="hook-section">
				<div class="hook-section__header">
					<h4 class="hook-section__header-text">Personalized Email Intros</h4>
					<img src="@/assets/icons/arrow-dropdown-plane.svg" alt="down-arrow icon" svg-inline />
				</div>

				<div class="section section__1">
					<h5 class="title">Contact Details</h5>
					<div class="contact__details">
						<div class="text__initials" v-if="contact_details.full_name">
              {{
								contact_details.full_name
									.match(/\b(\w)/g)
									.join('')
									.toUpperCase()
							}}
						</div>
						<div class="text__name__role">
							<div class="name">{{ contact_details.full_name }}</div>
							<div class="role">{{ contact_details.role }}</div>
						</div>
					</div>
				</div>
				<div class="section section__2">
					<div class="contact__address">
						<div class="title">Company</div>
						<div class="text">{{ contact_details.company }}</div>
					</div>
					<!-- <div class="contact__icon__group">
						<img src="@/assets/icons/linkedin-icon.svg" alt="linkedin icon" svg-inline />
						<img src="@/assets/icons/world-icon.svg" alt="website icon" svg-inline />
						<img src="@/assets/icons/twitter-icon.svg" alt="twitter icon" svg-inline />
						<img src="@/assets/icons/crunchbase.svg" alt="crunchbase icon" svg-inline />
					</div> -->
					<div class="contact__icon__group">
            <span v-for="(social, i) in contact_details.socials" :key="i">
              <a
                v-if="social.twitter && Object.entries(social.twitter).length > 0"
                :href="validateURL(social.twitter)"
                target="_blank"
                ><img src="@/assets/icons/twitter-icon.svg" alt="twitter icon" svg-inline
              /></a>
              <a
                v-if="social.linkedin && Object.entries(social.linkedin).length > 0"
                :href="validateURL(social.linkedin)"
                target="_blank"
                ><img src="@/assets/icons/linkedin-icon.svg" alt="linkedin icon" svg-inline
              /></a>
              <a
                v-if="social.website && Object.entries(social.website).length > 0"
                :href="validateURL(social.website)"
                target="_blank"
                ><img src="@/assets/icons/world-icon.svg" alt="website icon" svg-inline
              /></a>
              <a
                v-if="social.crunchbase && Object.entries(social.crunchbase).length > 0"
                :href="validateURL(social.crunchbase)"
                target="_blank"
                ><img src="@/assets/icons/crunchbase.svg" alt="crunchbase icon" svg-inline
              /></a>
            </span>
          </div>
				</div>
				<div class="section__3">
					<p class="title">Generated Copy</p>
					<div class="email-intro__group">
						<template>
              <div class="email-intro__single" v-for="(hook, index) in emailHooks" :key="index">
                <div class="email-intro__single__header">
                  
                  <p class="subject" :ref="`emailSubject-${index}`">{{ hook.subject }}</p>
                  <button @click="showIntroHook(index)">
                    <img
                      src="@/assets/icons/email-hook-arrow.svg"
                      alt="down-arrow icon"
                      svg-inline
                    />
                  </button>
                </div>

                <div v-if="displayEmail[index]" :ref="`content-${index}`" class="email-intro__single__content">
                  <textarea
                   v-if="editText[index]" 
                    class="hookTextarea"
                    id="articleHook"
                    name="articleHook"
                    v-model="hook.content"
                  ></textarea>
                  <p v-else class="text" :ref="`emailContentText-${index}`">
                    {{ hook.content }}
                  </p>
                  <div class="editHook-icons">
                    <img class="icon" :ref="`copyBtn-${index}`" @click="copyIntroEmail(hook.subject, hook.content, index)" src="@/assets/icons/copy-icon.svg" alt="copy icon" svg-inline />
                    <img class="icon" :ref="`editBtn-${index}`" @click="editContent(index)" src="@/assets/icons/edit-icon.svg" alt="edit icon" svg-inline />
                    <img :ref="`deleteBtn-${index}`" src="@/assets/icons/delete-icon.svg" alt="delete icon" svg-inline />
                  </div>
                </div>
              </div>
						</template>
            <v-button class="generateBtn rad" size="full" buttonType="secondary">Generate more options</v-button>
					</div>
				</div>
			</div>


			<div class="article-section">
        <div class="flex flex__end">
          <v-button class="mt-1" size="large" buttonType="secondary">Create a personalized email intro</v-button>
        </div>
        <div v-if="quotedArticle && quotedArticle.meta" class="item__detail" ref="openArticle">
          <h4 class="item__detail-title mr-1">{{ quotedArticle.title }}</h4>
          <a class="item__detail-url" :href="quotedArticle.url" target="_blank">
            <img src="@/assets/icons/link.svg" alt="link icon" svg-inline />
          </a>
          <p class="item__detail-date" v-if="quotedArticle.meta.published || quotedArticle.date">
            {{ new Date(quotedArticle.meta.published || quotedArticle.date) | moment('Do, MMMM YYYY') }}
          </p>
          <div class="filter__tags" v-if="quotedArticle.meta.content && Object.keys(quotedArticle.meta.content).length > 0">
            <img class="tag__badge" src="@/assets/icons/tag.svg" alt="" />
            <div class="tag__wrapper">
              <span v-for="(tag, i) in quotedArticle.meta.content.tag" :key="i"
                ><c-tag v-if="tag !== null || tag !== ''">{{ tag }}</c-tag></span
              >
            </div>
          </div>

          <template>
            <div
              class="item__detail-content"
              v-if="quotedArticle.meta.content && Object.keys(quotedArticle.meta.content).length > 0"
            >
              <div class="item-content" v-html="quotedArticle.meta.content.html"></div>
            </div>
            <iframe v-else class="mt-2 iframe-wrapper" id="myframe" width="100%" height="500" :src="quotedArticle.url"></iframe>
          </template>
			  </div>
			</div>
		</main>
	</div>
</template>

<script src="./emailHook.js"></script>
<style lang="scss" scoped src="./emailHook.scss"></style>
