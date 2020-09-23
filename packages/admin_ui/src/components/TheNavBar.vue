<template>
  <nav>
    <v-app-bar flat app>
      <v-app-bar-nav-icon
        class="grey--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-thin mr-2">Soultic</span>
        <span class="font-weight text-body-2">Admin panel</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="grey" @click="logout()">
        <span>{{ $t('logout') }}</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" class="indigo">
      <v-row class="mt-5" justify="center">
        <v-avatar size="100">
          <img :src="me.avatar ? me.avatar : '/no-avatar.png'" />
        </v-avatar>
      </v-row>
      <v-row justify="center">
        <p class="white--text subheading mt-2">
          {{ me.firstname }} {{ me.lastname }}
        </p>
      </v-row>
      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.route"
          router
          :to="link.route"
        >
          <v-list-item-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">
              {{ link.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import useMe from '@/modules/useMe'
import useAuth from '@/modules/useAuth'
import { TranslateResult } from 'vue-i18n'

interface NavLink {
  icon: string
  text: TranslateResult
  route: string
}

export default defineComponent({
  name: 'NavBar',
  setup(props, { root }) {
    const $t = (key: string) => root.$t(key)

    const { me } = useMe()

    const drawer = ref(true)
    const links: NavLink[] = [
      { icon: 'mdi-view-dashboard', text: $t('dashboard'), route: '/' },
      { icon: 'mdi-shopping', text: $t('products'), route: '/products' },
      { icon: 'mdi-account', text: $t('users'), route: '/users' },
    ]

    // Logout
    const { mutate: logout, onDone: onLogout } = useAuth().logout
    onLogout(() => {
      root.$router.go(0)
    })

    return { me, logout, drawer, links }
  },
})
</script>
