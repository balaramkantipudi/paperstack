-- Create a private bucket for documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

-- Policy: Allow authenticated users to upload files to their own folder
create policy "Allow authenticated uploads"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'documents' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to view their own files
create policy "Allow users to view their own files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'documents' and
  (storage.foldername(name))[1] = auth.uid()::text
);
