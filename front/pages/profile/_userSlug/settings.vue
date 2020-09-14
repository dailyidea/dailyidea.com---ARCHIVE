<template>
  <user-profile :initial-profile-data="initialProfileData" :ideas="ideas">
    <div class="cards-container">
      <IdeaCard>
        <div class="card-header">
          <span>Edit Profile</span>
          <v-icon>mdi mdi-chevron-right</v-icon>
        </div>
        <div class="card-toggles">
          <span class="muted">Email Settings</span>
          <div class="toggles">
            <div class="toggle-container">
              <div class="toggle-info">
                <label>Unsubscribe From All</label>
                <div class="smaller muted">
                  Daily reminder email to respond with a new idea
                </div>
              </div>
              <div class="toggle">
                <v-switch
                  v-model="emailNotificationsState.unsubscribedAt"
                  inset
                  flat
                  hide-details
                  color="primary"
                  @change="changeNotificationsState"
                ></v-switch>
              </div>
            </div>
            <div class="toggle-container">
              <div class="toggle-info">
                <label>Idea Reminders</label>
                <div class="smaller muted">
                  Daily reminder email to respond with a new idea
                </div>
              </div>
              <div class="toggle">
                <v-switch
                  v-model="emailNotificationsState.ideaReminders"
                  inset
                  flat
                  hide-details
                  color="primary"
                  @change="changeNotificationsState"
                ></v-switch>
              </div>
            </div>
            <div class="toggle-container">
              <div class="toggle-info">
                <label>Weeky Digest</label>
                <div class="smaller muted">
                  Daily reminder email to respond with a new idea
                </div>
              </div>
              <div class="toggle">
                <v-switch
                  v-model="emailNotificationsState.weeklyDigests"
                  inset
                  flat
                  hide-details
                  color="primary"
                  @change="changeNotificationsState"
                ></v-switch>
              </div>
            </div>
            <div class="toggle-container">
              <div class="toggle-info">
                <label>Hot Streaks</label>
                <div class="smaller muted">
                  Daily reminder email to respond with a new idea
                </div>
              </div>
              <div class="toggle">
                <v-switch
                  v-model="emailNotificationsState.hotStreaks"
                  inset
                  flat
                  hide-details
                  color="primary"
                  @change="changeNotificationsState"
                ></v-switch>
              </div>
            </div>
            <div class="toggle-container">
              <div class="toggle-info">
                <label>Idea Activity</label>
                <div class="smaller muted">
                  Updates when people like and comment on your idea
                </div>
              </div>
              <div class="toggle">
                <v-switch
                  v-model="emailNotificationsState.ideaActivity"
                  inset
                  flat
                  hide-details
                  color="primary"
                  @change="changeNotificationsState"
                ></v-switch>
              </div>
            </div>
          </div>
          <div class="logout">
            <span class="muted">Logout</span>
          </div>
        </div>
      </IdeaCard>
    </div>
    <div class="links">
      <div class="link-col">
        <nuxt-link to="/about" class="link">
          <h3>About</h3>
          <v-icon>mdi mdi-chevron-right</v-icon>
        </nuxt-link>
        <nuxt-link to="/faq" class="link">
          <h3>FAQ</h3>
          <v-icon>mdi mdi-chevron-right</v-icon>
        </nuxt-link>
      </div>
      <div class="link-col">
        <nuxt-link to="/terms" class="link">
          <h3>Terms & Conditions</h3>
          <v-icon>mdi mdi-chevron-right</v-icon>
        </nuxt-link>
        <nuxt-link to="/privacy" class="link">
          <h3>Privacy Policy</h3>
          <v-icon>mdi mdi-chevron-right</v-icon>
        </nuxt-link>
      </div>
    </div>

    <visual-notifier ref="notifier"></visual-notifier>
  </user-profile>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import dayjs from 'dayjs'
import userInfoBySlug from '@/graphql/query/userInfoBySlug'
import getEmailNotificationSettings from '@/graphql/query/getEmailNotificationsSettings'
import updateEmailNotificationsSettings from '@/graphql/mutations/updateEmailNotificationsSettings'
import UserProfile from '@/components/profilePage/UsersProfile'
import IdeaCard from '@/components/ideaDetail/IdeaCard'
import VisualNotifier from '~/components/VisualNotifier'

export default {
  name: 'Settings',
  middleware: 'authenticated',
  components: {
    UserProfile,
    IdeaCard,
    VisualNotifier
  },

  async asyncData({ app, store }) {
    const slug = store.getters['userData/slug']
    const userInfoRequest = await app.$amplifyApi.graphql(
      graphqlOperation(userInfoBySlug, { slug })
    )

    const initialProfileData = userInfoRequest.data.userInfoBySlug.userInfo

    const { data } = await app.$amplifyApi.graphql(
      graphqlOperation(getEmailNotificationSettings, {})
    )

    const { unsubscribedAt, ...settings } = data.getEmailNotificationsSettings

    return {
      initialProfileData,
      ideas: [],
      emailNotificationsState: {
        ...settings,
        unsubscribedAt: !!unsubscribedAt
      }
    }
  },

  methods: {
    async changeNotificationsState() {
      const state = Object.assign({}, this.emailNotificationsState)
      state.unsubscribedAt = state.unsubscribedAt ? dayjs().toISOString() : null

      try {
        await this.$amplifyApi.graphql(
          graphqlOperation(updateEmailNotificationsSettings, { state })
        )
        this.$refs.notifier.success('Email Settings Updated')
      } catch (e) {
        this.$refs.notifier.error("Can't update Email Settings")
      }
    }
  }
}
</script>

<style scoped lang="scss">
.cards-container {
  margin: 0 auto;
  @media (min-width: $screen-md-min) {
    width: 40vw;
  }

  label {
    font-size: 1.2rem;
  }

  .card-header {
    cursor: pointer;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid $light-grey;
    padding-bottom: 0.25rem;
    margin-bottom: 1rem;

    .v-icon {
      color: $primary-color;
      font-size: 40px;
      font-weight: 100;
    }
  }

  .card-toggles {
    width: 100%;

    .card-toggles-header {
      color: $dark-grey;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .toggles {
      display: flex;
      flex-direction: column;
      width: 100%;

      .toggle-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 1rem;

        .toggle-info {
          width: 65%;
        }
      }
    }
  }

  .logout {
    border-top: 2px solid $light-grey;
    padding-top: 0.5rem;
    margin-top: 1rem;
    cursor: pointer;
  }
}

.links {
  width: 98%;
  margin: 0 auto;

  display: flex;
  flex-direction: column;

  @media (min-width: $screen-md-min) {
    width: 70%;
    flex-direction: row;
    justify-content: space-between;
  }

  .link-col {
    width: 100%;
    margin-right: 1rem;

    .link {
      text-decoration: none;
      color: black;
      width: 100%;
      background-color: white;
      border-radius: 10px;
      padding: 0.5rem;
      border-left: 10px solid $primary-color;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      @media (min-width: $screen-md-min) {
        margin: 1rem 0 1rem 0;
      }

      .v-icon {
        font-size: 40px;
      }
    }
  }
}
</style>
