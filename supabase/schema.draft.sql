-- ============================================================
-- Ledgerly — Draft Supabase Schema
-- STATUS: PLANNING ONLY — DO NOT APPLY until Supabase project exists
-- Generated: 2026-06-08
-- ============================================================
--
-- Notes:
-- • auth.users is managed by Supabase Auth — do not recreate it.
-- • All user-scoped tables use user_id UUID referencing auth.users(id).
-- • Row Level Security (RLS) must be enabled on every table.
-- • created_at / updated_at are timestamptz, defaulting to now().
-- ============================================================


-- ─── business_profiles ────────────────────────────────────────
-- Created during onboarding (BusinessProfileForm + BusinessTypeSelector).
-- Updated from SettingsScreen.

CREATE TABLE business_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  business_name   TEXT NOT NULL,
  email           TEXT NOT NULL,
  state           TEXT NOT NULL CHECK (state IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT')),
  business_type   TEXT NOT NULL CHECK (business_type IN (
                    'Sole Trader','Retail','Hospitality','Trades','Consulting','Small Team'
                  )),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT business_profiles_user_id_key UNIQUE (user_id)
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile"
  ON business_profiles FOR ALL
  USING (auth.uid() = user_id);


-- ─── tasks ────────────────────────────────────────────────────
-- Seeded from businessTypeTasks on first login.
-- Custom tasks added via CustomTaskModal (is_custom = true).
-- Status is recomputed client-side; stored value is a cache.

CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  due_date        DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'upcoming'
                    CHECK (status IN ('overdue','due-soon','upcoming','completed')),
  steps           JSONB NOT NULL DEFAULT '[]',  -- array of { label: string, done: boolean }
  priority        TEXT DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  notes           TEXT,
  is_custom       BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX tasks_user_id_idx ON tasks (user_id);
CREATE INDEX tasks_due_date_idx ON tasks (due_date);
CREATE INDEX tasks_status_idx ON tasks (status);


-- ─── notifications ────────────────────────────────────────────
-- Generated server-side or client-side when tasks go overdue,
-- are completed, or system events occur.

CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id         UUID REFERENCES tasks(id) ON DELETE SET NULL,
  type            TEXT NOT NULL CHECK (type IN ('overdue','upcoming','completed','system')),
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications"
  ON notifications FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX notifications_user_id_idx ON notifications (user_id);
CREATE INDEX notifications_is_read_idx ON notifications (user_id, is_read);


-- ─── user_preferences ─────────────────────────────────────────
-- Stored preferences from SettingsScreen toggle switches.
-- One row per user (upsert on change).

CREATE TABLE user_preferences (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_reminders         BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications      BOOLEAN NOT NULL DEFAULT TRUE,
  monthly_summary_email   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_preferences_user_id_key UNIQUE (user_id)
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);


-- ─── subscriptions ────────────────────────────────────────────
-- Plan tracking for Free/Pro tiers shown in PricingPlans.jsx.
-- Payment integration (Stripe etc.) will extend this table.

CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan            TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro')),
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_user_id_key UNIQUE (user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only backend service role can update subscriptions (payment webhook)


-- ─── updated_at triggers ──────────────────────────────────────
-- Auto-update updated_at on row change.

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
