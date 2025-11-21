import { defineStore } from 'pinia'
import type { Profession, ProfessionsData } from "~/types/core_types";
import { GET_PROFESSIONS } from '~/graphql/queries'

export const useProfessionsStore = defineStore('professions', {
  state: () => ({
    professions: [] as Profession[],
    loading: false,
    error: null as Error | null,
  }),

  actions: {
    async getProfessions() {
      if (this.professions.length > 0) return
      try {
        this.loading = true
        const { data, error } = await useAsyncQuery<ProfessionsData>(GET_PROFESSIONS)
        if (error.value) {
          console.error('Error fetching professions:', error.value)
          this.error = error.value
        }
        this.professions = data.value?.professions || []
      } catch (error: any) {
        console.error('Error fetching professions:', error)
        this.error = error as Error
      } finally {
        this.loading = false
      }
    },
  }
})