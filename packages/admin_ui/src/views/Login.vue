<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="secondary" dark fluid>
          <v-toolbar-title>{{ $t('login-form') }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form
            @submit.prevent="login({ email, password })"
            id="login-form"
            lazy-validation
          >
            <v-text-field
              required
              :label="$t('email')"
              v-model="email"
              name="email"
              prepend-icon="mdi-account"
              type="text"
            ></v-text-field>

            <v-text-field
              required
              :label="$t('password')"
              v-model="password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            type="submit"
            form="login-form"
            :loading="loginLoading"
            :disabled="loginLoading"
            class="px-2"
          >
            {{ $t('login') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import useAuth from '@/modules/useAuth'
import useMe from '@/modules/useMe'
import useToast from '@/modules/useToast'

export default defineComponent({
  name: 'Login',
  setup(props, { root }) {
    const email = ref('')
    const password = ref('')

    const { addToast } = useToast()
    const {
      mutate: login,
      onDone: onLogin,
      loading: loginLoading,
    } = useAuth().login

    const { setMe } = useMe()

    onLogin(async (result) => {
      if (result && result.data && result.data.login) {
        setMe(result.data.login)

        addToast({ type: 'success', message: root.$t('login-success') })
        root.$router.push({ path: '/' })
      } else {
        email.value = ''
        password.value = ''
        addToast({ type: 'error', message: root.$t('login-fail') })
      }
    })

    return { email, password, login, loginLoading }
  },
})
</script>
