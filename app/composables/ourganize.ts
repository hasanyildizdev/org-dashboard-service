
import type { OurganizeContactInterface } from '~/types/ourganize_types';
export function useOurganize(){
    const contactContent = ref<OurganizeContactInterface>({
        phone: '+90 540 075 10 00',
        phone_: '+905400751000',
        email: 'info@ourganize.com',
        address: 'Antalya, Turkey',
    });
    return {
        contactContent
    }
}