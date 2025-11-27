export function useSkillLevelsIcons(){
    const skillLevelsIcons = ref({
        beginner: { icon: 'solar:alt-arrow-up-outline', color: 'text-gray-400' },
        intermediate: { icon: 'solar:double-alt-arrow-up-outline', color: 'text-blue-400' },
        advanced: { icon: 'solar:shield-star-bold', color: 'text-green-400' },
        expert: { icon: 'solar:crown-star-bold', color: 'text-amber-400' }
    })
    return {
        skillLevelsIcons
    }
}