/**
 * Phase 2 — Demo seed script (run with Supabase service role).
 * Creates: allowed_domains, hubs, sample track/module, no real PII.
 *
 * Usage (example with Supabase CLI):
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-demo.ts
 * Or run the SQL below manually in SQL Editor.
 */

export const SEED_SQL = `
-- Allowed domain for magic link login
INSERT INTO allowed_domains (domain) VALUES ('todogreen.com.br') ON CONFLICT (domain) DO NOTHING;

-- Demo hub
INSERT INTO hubs (id, name) VALUES ('00000000-0000-0000-0000-000000000001', 'Hub Demo') ON CONFLICT DO NOTHING;

-- Sample track (Portuguese + English)
INSERT INTO tracks (id, slug, name_pt, name_en, description_pt, description_en, target_roles, is_required, is_published, order_index)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'onboarding-verde',
  'Onboarding Entregas Verdes',
  'Green Delivery Onboarding',
  'Trilha inicial para novos colaboradores.',
  'Initial track for new collaborators.',
  ARRAY['DRIVER','EMPLOYEE','HUB_OPS']::text[],
  true,
  true,
  0
) ON CONFLICT (slug) DO NOTHING;

-- Sample module
INSERT INTO modules (track_id, slug, title_pt, title_en, content_type, content_pt, order_index, is_published, estimated_minutes)
SELECT id, 'modulo-1', 'Bem-vindo', 'Welcome', 'text', 'Conteúdo do primeiro módulo.', 0, true, 5
FROM tracks WHERE slug = 'onboarding-verde' LIMIT 1;
`;
