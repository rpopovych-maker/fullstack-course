do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_sub_id_auth_users_id_fk'
  ) then
    alter table public.users
    add constraint users_sub_id_auth_users_id_fk
    foreign key (sub_id)
    references auth.users(id)
    on delete cascade;
  end if;
end $$;

create or replace function public.create_user_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (sub_id, email)
  values (new.id, new.email)
  on conflict (sub_id) do update
  set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists create_user_from_auth_trg on auth.users;

create trigger create_user_from_auth_trg
after insert on auth.users
for each row
execute function public.create_user_from_auth();

create or replace function public.sync_user_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set
    email = new.email,
    updated_at = now()
  where sub_id = new.id;

  return new;
end;
$$;

drop trigger if exists sync_user_from_auth_trg on auth.users;

create trigger sync_user_from_auth_trg
after update of email on auth.users
for each row
execute function public.sync_user_from_auth();

insert into public.users (sub_id, email)
select a.id, a.email
from auth.users a
on conflict (sub_id) do update
set
  email = excluded.email,
  updated_at = now();
