<template>
  <v-card elevation="1" class="pa-3">
    <LoadingOverlay :loading="loading" />
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
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import USER from '@/graphql/queries/USER'
import UPDATE_USER from '@/graphql/mutations/UPDATE_USER'
import {
  Role,
  MutationUpdateUserArgs,
  UpdateUserMutation,
  UserByIdQuery,
  DeleteUserMutationVariables,
  RestoreUserMutationVariables,
} from '@/generated/graphql'
import useDataMonitor from '@/modules/useDataMonitor'
import useToast from '@/modules/useToast'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import DELETE_USER from '@/graphql/mutations/DELETE_USER'
import RESTORE_USER from '@/graphql/mutations/RESTORE_USER'

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

    const {
      refetch,
      result,
      loading: queryLoading,
      onResult: onUserResult,
    } = useQuery<UserByIdQuery>(
      USER,
      {
        id: Number(root.$route.params.id),
      },
      { fetchPolicy: 'no-cache' }
    )

    const user = useResult(result, {}, (data) => data.user)

    const { getDataDifference, isDataChanged, makeDataEqual } = useDataMonitor(
      user
    )

    onUserResult(() => {
      // After user fetched data monitor resets
      makeDataEqual()
    })

    const { mutate, onDone, loading: mutationLoading } = useMutation<
      UpdateUserMutation,
      MutationUpdateUserArgs
    >(UPDATE_USER)

    onDone(async (res) => {
      if (res && res.data && res.data.updateUser) {
        mutationLoading.value = true
        await refetch()
        mutationLoading.value = false
        addToast({ type: 'success', message: root.$t('changes-saved') })
      }
    })

    const updateData = () => {
      const input = getDataDifference()
      if (input) mutate({ id: Number(root.$route.params.id), input })
    }

    const { mutate: deleteUserMutation } = useMutation<
      boolean,
      DeleteUserMutationVariables
    >(DELETE_USER)
    const { mutate: restoreUserMutation } = useMutation<
      boolean,
      RestoreUserMutationVariables
    >(RESTORE_USER)

    const deleteUser = async () => {
      mutationLoading.value = true
      await deleteUserMutation({ id: Number(root.$route.params.id) })
      refetch()
      mutationLoading.value = false
    }

    const restoreUser = async () => {
      mutationLoading.value = true
      await restoreUserMutation({ id: Number(root.$route.params.id) })
      refetch()
      mutationLoading.value = false
    }

    const loading = computed(() => mutationLoading.value || queryLoading.value)

    return {
      user,
      loading,
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
