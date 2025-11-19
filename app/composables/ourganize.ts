
import type { OurganizeContactInterface } from '~/types/core_types';
export function useOurganize(){
    const contactContent = ref<OurganizeContactInterface>({
        name: 'Ourganize',
        domain: 'ourganize.com',
        url: 'https://ourganize.com',
        phone: '+90 540 075 10 00',
        phone_clean: '+905400751000',
        whatsapp_phone: '905400751000',
        email: 'info@ourganize.com',
        address: 'Antalya, Turkey',
        slogan: 'Ourganize',
        social_media_links: [
            {
                name: 'Facebook',
                url: 'https://facebook.com/ourganize',
                icon: 'facebook'
            },
            {
                name: 'Instagram',
                url: 'https://instagram.com/ourganize',
                icon: 'instagram'
            },
            {
                name: 'Twitter',
                url: 'https://twitter.com/ourganize',
                icon: 'twitter'
            },
            {
                name: 'Linkedin',
                url: 'https://linkedin.com/ourganize',
                icon: 'linkedin'
            }
        ]
    });
    return {
        contactContent
    }
}