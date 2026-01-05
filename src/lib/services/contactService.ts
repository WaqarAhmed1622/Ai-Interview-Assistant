
import { supabase } from '../supabase';

export interface ContactMessageData {
    first_name: string;
    last_name: string;
    email: string;
    subject: string;
    message: string;
}

export const contactService = {
    async sendMessage(data: ContactMessageData) {
        const { error } = await supabase
            .from('contact_messages')
            .insert([data]);

        if (error) throw error;
    }
};
