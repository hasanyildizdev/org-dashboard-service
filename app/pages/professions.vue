<script setup lang="ts">
import { useProfessionsStore } from '~/stores/professions_store'
const professionsStore = useProfessionsStore()
await professionsStore.getProfessions()
</script>
<template>
    <UPage>
        <UPageBody>
            <UContainer>
                <div class="flex flex-col items-center justify-center gap-4 p-4">
                    <UPageCard class="w-full max-w-md">
                        <AppLogo size="xl" class="mt-4 mb-2"/>
                    </UPageCard>
                    <UAlert v-if="professionsStore.error" color="error" icon="i-lucide-info" title="Error fetching professions" :description="professionsStore.error.message" />
                    <div v-else>
                        <UList>
                            <UListItem v-for="profession in professionsStore.professions" :key="profession.id">
                                {{ profession.name }}
                            </UListItem>
                        </UList>
                    </div>
                </div>
            </UContainer>
        </UPageBody>
    </UPage>
</template>