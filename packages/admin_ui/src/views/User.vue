<template>
  <v-card elevation="1" class="pa-3" v-if="!queryLoading">
    <LoadingOverlay :loading="mutationLoading" />
    <v-row cols="12">
      <v-col cols="6">
        <div class="caption grey--text">ID</div>
        <div>{{ user.id }}</div>
      </v-col>
      <v-col cols="6">
        <div class="caption grey--text">{{ $t('email') }}</div>
        <div>{{ user.email }}</div>
      </v-col>
      <v-col cols="6">
        <div class="caption grey--text">{{ $t('firstname') }}</div>
        <div>{{ user.firstname }}</div>
      </v-col>
      <v-col cols="6">
        <div class="caption grey--text">{{ $t('lastname') }}</div>
        <div>{{ user.lastname }}</div>
      </v-col>
      <v-col cols="12" xs="12" md="6">
        <div class="caption grey--text">{{ $t('roles') }}</div>
        <v-select
          v-model="user.roles"
          :items="roles"
          :menu-props="{ maxHeight: '400' }"
          class="mt-n3"
          :placeholder="$t('blank')"
          multiple
          chips
        ></v-select>
      </v-col>
      <v-col xs="12" md="6">
        <div class="caption grey--text">{{ $t('confirmed') }}</div>
        <v-switch
          inset
          class="mt-1 switch-red"
          color="success"
          v-model="user.confirmed"
        ></v-switch>
      </v-col>
      <v-col xs="12" md="4">
        <div class="caption grey--text">{{ $t('createdAt') }}</div>
        <div>{{ user.createdAt }}</div>
      </v-col>
      <v-col xs="12" md="4">
        <div class="caption grey--text">{{ $t('updatedAt') }}</div>
        <div>{{ user.updatedAt }}</div>
      </v-col>
      <v-col xs="12" md="4">
        <div class="caption grey--text">{{ $t('deletedAt') }}</div>
        <div>
          {{ user.deletedAt ? user.deletedAt : $t('blank') }}
        </div>
      </v-col>
    </v-row>
    <!-- Buttons -->
    <v-col class="mb-2 text-right">
      <v-btn
        color="success"
        :disabled="!isDataChanged"
        @click="updateData()"
        class="mr-5"
      >
        {{ $t('save') }}
      </v-btn>
      <v-btn
        outlined
        color="red"
        right
        @click="user.deletedAt ? restoreUser() : deleteUser()"
      >
        {{ user.deletedAt ? $t('restore') : $t('delete') }}
      </v-btn>
    </v-col>
    <!-- /Buttons -->
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import USER from '@/graphql/queries/USER'
import UPDATE_USER from '@/graphql/mutations/UPDATE_USER'
import {
  Role,
  MutationUpdateUserArgs,
  UpdateUserMutation,
  UserByIdQuery,
} from '@/generated/graphql'
import useDataMonitor from '@/modules/useDataMonitor'
import useToast from '@/modules/useToast'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default defineComponent({
  name: 'User',
  data() {
    return {
      roles: Object.values(Role),
    }
  },
  components: { LoadingOverlay },
  setup(props, { root }) {
    const { addToast } = useToast()

    const { refetch, result, loading: queryLoading } = useQuery<UserByIdQuery>(
      USER,
      {
        id: root.$route.params.id,
      },
      { fetchPolicy: 'no-cache' }
    )

    const user = useResult(result, null, (data) => data.user)

    const { mutate, onDone, loading: mutationLoading } = useMutation<
      UpdateUserMutation,
      MutationUpdateUserArgs
    >(UPDATE_USER)

    const { getDataDifference, isDataChanged, makeDataEqual } = useDataMonitor(
      user
    )

    onDone(async (res) => {
      if (res && res.data && res.data.updateUser) {
        mutationLoading.value = true
        await refetch()
        makeDataEqual()
        mutationLoading.value = false
        addToast({ type: 'success', message: root.$t('changes-saved') })
      }
    })

    const updateData = () => {
      const input = getDataDifference()
      if (input) mutate({ id: root.$route.params.id, input })
    }

    const deleteUser = async () => {
      mutate({
        id: root.$route.params.id,
        input: { deletedAt: new Date().toString() },
      })
    }

    const restoreUser = async () => {
      mutate({ id: root.$route.params.id, input: { deletedAt: null } })
    }

    return {
      user,
      queryLoading,
      mutationLoading,
      isDataChanged,
      updateData,
      deleteUser,
      restoreUser,
    }
  },
})
</script>
