--create schema extensions if not exists;
-- CREATE SCHEMA IF NOT EXISTS extensions;
-- CreateExtension
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;

-- CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


-- CREATE SCHEMA IF NOT EXISTS pgsodium;
-- CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;

-- CREATE SCHEMA IF NOT EXISTS "vault";
-- CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA "vault";

-- CREATE SCHEMA IF NOT EXISTS graphql;

-- CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;