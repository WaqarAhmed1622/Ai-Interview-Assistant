
-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone (anon and authenticated) to INSERT messages
-- This is crucial for the public contact form
CREATE POLICY "Public insert contact_messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Policy: Allow ONLY Admins to SELECT (view) messages
CREATE POLICY "Admins view contact_messages" ON public.contact_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Policy: Allow ONLY Admins to UPDATE messages (e.g. mark as read)
CREATE POLICY "Admins update contact_messages" ON public.contact_messages
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Policy: Allow ONLY Admins to DELETE messages
CREATE POLICY "Admins delete contact_messages" ON public.contact_messages
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
