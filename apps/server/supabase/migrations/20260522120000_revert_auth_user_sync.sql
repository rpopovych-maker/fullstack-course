drop trigger if exists create_user_from_auth_trg on auth.users;
drop trigger if exists sync_user_from_auth_trg on auth.users;

drop function if exists public.create_user_from_auth();
drop function if exists public.sync_user_from_auth();

alter table public.users
drop constraint if exists users_sub_id_auth_users_id_fk;
