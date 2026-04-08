# NexTerra Platform — Master Development Index

### Decentralized Science Funding, Governance & Intelligence Infrastructure for Africa

> **Maintainer:** Dr. Nichar Gregory, PhD — CEO & Founder
> **Live App:** https://nexterra-app.vercel.app
> **Stack:** Expo / React Native + TypeScript · Hono.js + tRPC · Supabase (PostgreSQL) · Vercel
> **Target Launch:** October 31, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Current State Audit](#3-current-state-audit)
4. [Complete Gap Analysis — What's Missing](#4-complete-gap-analysis--whats-missing)
5. [All Required APIs & Integrations](#5-all-required-apis--integrations)
6. [Missing Supabase Database Schema](#6-missing-supabase-database-schema)
7. [Feature Implementation Checklist](#7-feature-implementation-checklist)
8. [Priority Build Order](#8-priority-build-order)
9. [Environment Variables Master List](#9-environment-variables-master-list)
10. [Smart Contract Integration Guide](#10-smart-contract-integration-guide)
11. [AkoPay Integration Specification](#11-akopay-integration-specification)
12. [AI Intelligence Layer Specification](#12-ai-intelligence-layer-specification)
13. [KYC/AML Flow Specification](#13-kycaml-flow-specification)
14. [Milestone & Disbursement Engine Specification](#14-milestone--disbursement-engine-specification)
15. [NXT Token Dashboard Specification](#15-nxt-token-dashboard-specification)
16. [Enterprise/Government Dashboard Specification](#16-enterprisegovernment-dashboard-specification)
17. [Testing Strategy](#17-testing-strategy)
18. [Deployment Checklist](#18-deployment-checklist)
19. [Contributing Guidelines](#19-contributing-guidelines)

---

## 1. Project Overview

NexTerra is the first DAO-native decentralized science funding, governance, and intelligence platform purpose-built for Africa — beginning with One Health research and expanding across the Global South.

**Core Value Proposition:** Convert fragmented, opaque science funding into a real-time, community-governed, AI-powered capital deployment engine — eliminating intermediaries, enforcing accountability through code, and transforming funded field work into trusted intelligence used by governments, DFIs, insurers, and the private sector.

**What the platform does (business plan spec):**

- DAO governance hierarchy (Parent DAO + programmatic Sub-DAOs)
- Milestone-based capital disbursement via AkoPay fiat rails (1.25% FX vs 8.2% industry)
- NXT token: 100M fixed supply, capital recycling model, governance + access utility
- AI intelligence layer: RVF early warning, pattern detection, research-funder matching
- 8 production smart contracts: proposalRegistry, votingEngine, escrowManager, disbursementManager, reportingEnforcement, auditTrail, permissionManager, paymentRails
- KYC/AML tiered onboarding (Tier 0–3 via AkoPay + Smile Identity)
- Enterprise/government intelligence dashboards ($50K–$300K/yr)
- Research marketplace with IPFS decentralized storage
- Field knowledge capture with geo-tagging
- Credibility scoring v2 (multi-signal reputation)

---

## 2. Repository Structure

```
nexterra-app-main/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── fund.tsx
│   │   ├── dao.tsx
│   │   └── match.tsx
│   ├── intelligence/
│   ├── vote/[id].tsx
│   ├── submit-proposal.tsx
│   ├── profile.tsx
│   ├── economics.tsx
│   ├── field-knowledge.tsx
│   └── research/[id].tsx
├── components/
├── services/
│   ├── daoContract/
│   │   ├── proposalRegistry.ts
│   │   ├── votingEngine.ts
│   │   ├── escrowManager.ts
│   │   ├── disbursementManager.ts
│   │   ├── reportingEnforcement.ts
│   │   ├── auditTrail.ts
│   │   ├── permissionManager.ts
│   │   ├── paymentRails.ts
│   │   └── types.ts
│   └── nxtToken.ts
├── mocks/
├── constants/
└── package.json
```

---

## 3. Current State Audit

| Module | Screen/Feature | Status | Issue |
|--------|---------------|--------|-------|
| Auth | Login / Signup | ⚠️ Partial | No Supabase auth session persistence |
| Governance | Proposal submission | ⚠️ Mock | Not written to database |
| Governance | DAO voting | ⚠️ Mock | No on-chain tx or Supabase write |
| Governance | Sub-DAO lifecycle | ❌ Missing | No instantiation logic |
| Funding | Fund modal / payments | ❌ Broken | Buttons call toast() only |
| Funding | Milestone tracking | ❌ Missing | No milestone table or UI |
| Funding | Disbursement engine | ❌ Missing | AkoPay not integrated |
| Token | NXT dashboard | ⚠️ Mock | No blockchain reads |
| Token | Capital recycling | ❌ Missing | No contract interaction |
| KYC | KYC notice shown | ❌ Broken | No actual verification flow |
| Intelligence | Alert patterns | ⚠️ Mock | Hardcoded demo data |
| Intelligence | AI analysis | ❌ Missing | No Anthropic API calls |
| Intelligence | RVF early warning | ❌ Missing | No real data sources |
| Research | Marketplace | ❌ Missing | Entire feature absent |
| Field | Geo-tagged capture | ⚠️ Partial | No Supabase write, no PostGIS |
| Enterprise | Gov dashboard | ❌ Missing | No enterprise auth or screens |
| Credibility | Score calculation | ⚠️ Mock | Static number, no aggregation |
| Notifications | Push alerts | ❌ Missing | No service worker or Expo push |
| Payments | Mobile money | ❌ Broken | API endpoints defined but never called |
| Payments | AkoPay rails | ❌ Missing | No AkoPay SDK integration |

---

## 4. Complete Gap Analysis — What's Missing

### 🔴 P1 — Critical (Blocks Core Value Proposition)

#### 4.1 AkoPay Payment Rails
Replace all mock payment calls with real AkoPay REST API calls. Wire MTN MoMo, Airtel Money, and bank transfer buttons to actual payment initiation. Store real AkoPay transaction references in Supabase. Handle AkoPay webhooks for payment confirmation.

#### 4.2 KYC/AML Verification
Implement AkoPay Tier 0–3 KYC onboarding. Add Smile Identity as fallback. Store kyc_tier and kyc_status on user profile. Gate funding actions behind minimum KYC tier checks.

#### 4.3 Milestone Tracking & Disbursement Engine
Create milestones, milestone_evidence, and disbursement_requests Supabase tables. Build milestone creation UI. Build evidence upload screen. Build milestone approval voting UI. Wire approved milestones to AkoPay disbursement API.

#### 4.4 Supabase Backend Connection
Install @supabase/supabase-js. Create lib/supabase.ts. Replace all mocks/*.ts imports with real Supabase query hooks. Implement Row Level Security policies. Set up Supabase Auth.

#### 4.5 NXT Token Dashboard
Initialize ethers.js with Polygon RPC. Deploy NXT ERC-20 contract. Fetch balanceOf(userAddress) on screen load. Fetch totalSupply() for treasury dashboard.

---

### 🟡 P2 — High Priority

#### 4.6 AI Intelligence Layer
Call Anthropic API with Claude. Build Supabase Edge Function: intelligence-analyzer. Integrate NewsAPI/GDELT for live signal aggregation. Replace mocks/intelligence.ts with real Supabase intelligence_patterns table.

#### 4.7 Enterprise/Government Dashboard
Add user_role types. Build protected enterprise route. Build government dashboard with capital deployed, milestone rates, intelligence alerts. Build PDF/Excel export.

#### 4.8 Sub-DAO Lifecycle Management
Add status enum to daos table. Build Sub-DAO instantiation flow. Build dissolution flow. Wire capital return to Parent DAO treasury.

#### 4.9 Research Marketplace
Create research_publications and datasets Supabase tables. Integrate Pinata IPFS API. Integrate CrossRef API. Build publication upload flow. Build marketplace transaction fee via AkoPay.

#### 4.10 Credibility Scoring v2
Build Supabase function calculate_credibility_score(user_id). Run recalculation trigger on relevant table updates. Display score breakdown on profile.

---

## 5. All Required APIs & Integrations

### 5.1 AkoPay
- **Purpose:** All fiat disbursement, cross-border payments, KYC
- **Docs:** https://developer.akopay.com
- **Base URL:** https://api.akopay.com/v1
- **Key endpoints:**
  - POST /wallets/create
  - GET /wallets/{id}/balance
  - POST /payments/initiate
  - GET /payments/{id}/status
  - POST /kyc/initiate
  - GET /kyc/{user_id}/status
  - POST /group-wallets/create
  - GET /fx/rates

### 5.2 Supabase
- **Purpose:** PostgreSQL database, user auth, real-time subscriptions, file storage
- **Docs:** https://supabase.com/docs
- **Install:** `npx expo install @supabase/supabase-js`

### 5.3 Anthropic API
- **Purpose:** Pattern detection, risk modeling, research-funder matching, report generation
- **Model:** claude-sonnet-4-20250514
- **Docs:** https://docs.anthropic.com

### 5.4 Smile Identity
- **Purpose:** African-first ID verification
- **Docs:** https://docs.smileidentity.com
- **Coverage:** 30+ African countries

### 5.5 Ethers.js / Viem
- **Purpose:** NXT token balance reads, on-chain governance state
- **Network:** Polygon (MATIC)
- **Install:** `npx expo install ethers`

### 5.6 WalletConnect / Web3Modal
- **Purpose:** Allow users to connect MetaMask, Trust Wallet, Valora
- **Docs:** https://docs.walletconnect.com
- **Install:** `npx expo install @walletconnect/modal-react-native`

### 5.7 Pinata IPFS
- **Purpose:** Research marketplace decentralized storage
- **Docs:** https://docs.pinata.cloud
- **Install:** `npm install pinata`

### 5.8 CrossRef API
- **Purpose:** DOI metadata, citation counts
- **Docs:** https://api.crossref.org
- **Free, no API key required**

### 5.9 NewsAPI / GDELT
- **Purpose:** Real-time news signals for RVF early warning
- **GDELT endpoint:** https://api.gdeltproject.org/api/v2/doc/doc

### 5.10 Expo Push Notifications
- **Purpose:** Intelligence alerts, vote deadlines, milestone approvals
- **Docs:** https://docs.expo.dev/push-notifications/overview/
- **Install:** `npx expo install expo-notifications`

---

## 6. Missing Supabase Database Schema

```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- KYC VERIFICATIONS
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL DEFAULT 0 CHECK (tier BETWEEN 0 AND 3),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'expired')),
  provider TEXT NOT NULL DEFAULT 'akopay' CHECK (provider IN ('akopay', 'smile_identity', 'manual')),
  provider_ref TEXT,
  document_type TEXT,
  document_country TEXT,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own KYC" ON kyc_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage KYC" ON kyc_verifications FOR ALL USING (auth.role() = 'service_role');

-- NXT BALANCES
CREATE TABLE IF NOT EXISTS nxt_balances (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT,
  balance DECIMAL(18, 8) NOT NULL DEFAULT 0,
  locked_balance DECIMAL(18, 8) NOT NULL DEFAULT 0,
  governance_weight DECIMAL(18, 8) NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'basic' CHECK (tier IN ('basic', 'standard', 'premium', 'enterprise')),
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE nxt_balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own NXT balance" ON nxt_balances FOR SELECT USING (auth.uid() = user_id);

-- NXT TRANSACTIONS
CREATE TABLE IF NOT EXISTS nxt_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES auth.users(id),
  to_user_id UUID REFERENCES auth.users(id),
  from_address TEXT,
  to_address TEXT,
  amount DECIMAL(18, 8) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('governance_lock', 'governance_unlock', 'incentive_reward', 'allocation', 'recycled', 'treasury_return')),
  tx_hash TEXT,
  block_number BIGINT,
  proposal_id UUID,
  milestone_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE nxt_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own NXT transactions" ON nxt_transactions FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- MILESTONES
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL,
  dao_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  milestone_number INTEGER NOT NULL,
  amount_usd DECIMAL(12, 2) NOT NULL,
  amount_nxt DECIMAL(18, 8),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'evidence_submitted', 'under_review', 'approved', 'disbursed', 'disputed', 'failed')),
  deadline TIMESTAMPTZ,
  evidence_requirement TEXT NOT NULL,
  evidence_url TEXT,
  evidence_submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  disbursed_at TIMESTAMPTZ,
  disbursement_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view milestones" ON milestones FOR SELECT USING (true);

-- MILESTONE VOTES
CREATE TABLE IF NOT EXISTS milestone_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'reject', 'abstain')),
  comment TEXT,
  nxt_weight DECIMAL(18, 8) DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(milestone_id, voter_id)
);
ALTER TABLE milestone_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can vote on milestones" ON milestone_votes FOR INSERT WITH CHECK (auth.uid() = voter_id);
CREATE POLICY "Public can view milestone votes" ON milestone_votes FOR SELECT USING (true);

-- DISBURSEMENTS
CREATE TABLE IF NOT EXISTS disbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES milestones(id),
  proposal_id UUID NOT NULL,
  recipient_user_id UUID NOT NULL REFERENCES auth.users(id),
  amount_usd DECIMAL(12, 2) NOT NULL,
  amount_local DECIMAL(18, 4),
  local_currency TEXT,
  exchange_rate DECIMAL(12, 6),
  fx_fee_usd DECIMAL(10, 4),
  platform_fee_usd DECIMAL(10, 4),
  net_amount_received DECIMAL(12, 2),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mobile_money', 'bank_transfer', 'papss', 'link_token')),
  payment_provider TEXT,
  akopay_ref TEXT,
  akopay_wallet_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'reversed')),
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  failure_reason TEXT,
  on_chain_tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE disbursements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipients can view own disbursements" ON disbursements FOR SELECT USING (auth.uid() = recipient_user_id);

-- FIELD OBSERVATIONS
CREATE TABLE IF NOT EXISTS field_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('disease_signal', 'climate_event', 'livestock_health', 'wildlife_observation', 'water_quality', 'vegetation', 'human_health', 'other')),
  location GEOGRAPHY(POINT, 4326),
  country TEXT,
  region TEXT,
  photo_url TEXT,
  photo_urls TEXT[],
  validation_status TEXT NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'rejected', 'flagged')),
  validated_by UUID REFERENCES auth.users(id),
  validated_at TIMESTAMPTZ,
  nxt_reward DECIMAL(8, 4) DEFAULT 0,
  intelligence_linked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE field_observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own observations" ON field_observations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Validators can view all observations" ON field_observations FOR SELECT USING (true);
CREATE INDEX idx_field_observations_location ON field_observations USING GIST (location);

-- RESEARCH PUBLICATIONS
CREATE TABLE IF NOT EXISTS research_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  abstract TEXT,
  doi TEXT UNIQUE,
  journal TEXT,
  published_year INTEGER,
  keywords TEXT[],
  ipfs_cid TEXT,
  file_url TEXT,
  file_size_bytes BIGINT,
  access_type TEXT NOT NULL DEFAULT 'open' CHECK (access_type IN ('open', 'paid', 'request_only')),
  price_usd DECIMAL(8, 2),
  citation_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'published', 'retracted')),
  peer_reviewed BOOLEAN DEFAULT false,
  one_health_domains TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE research_publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published research" ON research_publications FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can manage own research" ON research_publications FOR ALL USING (auth.uid() = author_id);

-- INTELLIGENCE PATTERNS
CREATE TABLE IF NOT EXISTS intelligence_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('outbreak_signal', 'climate_risk', 'funding_gap', 'research_overlap', 'rvf_early_warning', 'arbovirus_alert')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  confidence_score DECIMAL(4, 3) CHECK (confidence_score BETWEEN 0 AND 1),
  region TEXT,
  countries TEXT[],
  source_observations UUID[],
  source_news_urls TEXT[],
  ai_analysis TEXT,
  ai_model_used TEXT,
  is_public BOOLEAN DEFAULT true,
  is_enterprise_only BOOLEAN DEFAULT false,
  auto_generated BOOLEAN DEFAULT false,
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE intelligence_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view non-enterprise patterns" ON intelligence_patterns FOR SELECT USING (is_enterprise_only = false);

-- ENTERPRISE ACCOUNTS
CREATE TABLE IF NOT EXISTS enterprise_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  org_type TEXT NOT NULL CHECK (org_type IN ('government', 'dfi', 'foundation', 'insurance', 'agribusiness', 'ngo', 'university')),
  country TEXT,
  dashboard_tier TEXT NOT NULL DEFAULT 'basic' CHECK (dashboard_tier IN ('basic', 'standard', 'premium', 'white_label')),
  contract_value_usd DECIMAL(12, 2),
  contract_start TIMESTAMPTZ,
  contract_end TIMESTAMPTZ,
  allowed_regions TEXT[],
  allowed_countries TEXT[],
  akopay_ref TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE enterprise_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own enterprise account" ON enterprise_accounts FOR SELECT USING (auth.uid() = user_id);

-- CREDIBILITY SCORES
CREATE TABLE IF NOT EXISTS credibility_scores (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL DEFAULT 0 CHECK (overall_score BETWEEN 0 AND 100),
  funded_work_score INTEGER DEFAULT 0,
  dao_participation_score INTEGER DEFAULT 0,
  reporting_compliance_score INTEGER DEFAULT 0,
  peer_review_score INTEGER DEFAULT 0,
  field_contribution_score INTEGER DEFAULT 0,
  milestone_completion_score INTEGER DEFAULT 0,
  proposals_submitted INTEGER DEFAULT 0,
  proposals_funded INTEGER DEFAULT 0,
  milestones_completed INTEGER DEFAULT 0,
  milestones_failed INTEGER DEFAULT 0,
  votes_cast INTEGER DEFAULT 0,
  peer_reviews_written INTEGER DEFAULT 0,
  field_observations_validated INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE credibility_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view credibility scores" ON credibility_scores FOR SELECT USING (true);

-- PUSH NOTIFICATION TOKENS
CREATE TABLE IF NOT EXISTS user_push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expo_push_token TEXT NOT NULL,
  device_type TEXT CHECK (device_type IN ('ios', 'android', 'web')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, expo_push_token)
);

-- SUB-DAO LIFECYCLE
CREATE TABLE IF NOT EXISTS sub_dao_lifecycle (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dao_id UUID NOT NULL,
  proposal_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'instantiated', 'active', 'reporting', 'dissolved', 'emergency_paused')),
  capital_allocated_usd DECIMAL(12, 2) DEFAULT 0,
  capital_deployed_usd DECIMAL(12, 2) DEFAULT 0,
  capital_returned_usd DECIMAL(12, 2) DEFAULT 0,
  milestones_total INTEGER DEFAULT 0,
  milestones_completed INTEGER DEFAULT 0,
  on_chain_address TEXT,
  instantiated_at TIMESTAMPTZ,
  dissolved_at TIMESTAMPTZ,
  dissolution_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 7. Feature Implementation Checklist

### Phase 1 — Foundation
- [ ] Install Supabase client — `npx expo install @supabase/supabase-js`
- [ ] Create `lib/supabase.ts` — client initialization with AsyncStorage session persistence
- [ ] Replace `mocks/` data — switch all 8 mock files to real Supabase queries
- [ ] Auth flow — connect signup/login to Supabase auth
- [ ] Run database migration — execute full SQL from Section 6
- [ ] Set up Row Level Security — confirm all RLS policies are active

### Phase 2 — Payments & KYC
- [ ] AkoPay account — sign up at developer.akopay.com
- [ ] Create `services/akopay.ts` — HTTP client wrapping AkoPay REST API
- [ ] Replace `paymentRails.ts` mock — call real AkoPay payment initiation endpoint
- [ ] Wire fund modal buttons — MTN MoMo, Airtel, Bank Transfer call real API
- [ ] AkoPay webhook endpoint — Supabase Edge Function receives payment confirmations
- [ ] KYC flow — implement AkoPay Tier 0 on signup, Tier 2+ before proposal submission
- [ ] Smile Identity fallback — integrate for document verification
- [ ] KYC gate — funding actions check kyc_verifications.tier >= 1

### Phase 3 — Milestone Engine
- [ ] Milestones table populated on proposal submission
- [ ] Milestone list view under each funded proposal
- [ ] Evidence upload — expo-document-picker + Supabase Storage
- [ ] Milestone vote UI — approve/reject/comment for Sub-DAO members
- [ ] Vote aggregation — transition milestone to approved status
- [ ] AkoPay disbursement trigger on milestone approved
- [ ] Disbursement status display in funder dashboard

### Phase 4 — NXT Token & Blockchain
- [ ] Install ethers — `npx expo install ethers`
- [ ] Deploy NXT ERC-20 contract on Polygon
- [ ] Create `lib/blockchain.ts` — RPC provider and contract instance
- [ ] economics.tsx live data — balanceOf, totalSupply from on-chain
- [ ] nxt_balances sync — Edge Function mirrors on-chain holdings hourly
- [ ] WalletConnect integration — wallet connect button on profile screen
- [ ] Governance vote signing — DAO votes signed on-chain via connected wallet

### Phase 5 — AI Intelligence Layer
- [ ] Supabase Edge Function `intelligence-analyzer` — runs on cron every 6 hours
- [ ] NewsAPI integration — fetch RVF/arbovirus/climate news
- [ ] Replace mocks/intelligence.ts — query intelligence_patterns table
- [ ] Alert generation — high severity patterns trigger push notifications
- [ ] Proposal AI review — score quality and relevance on submission
- [ ] Funder-project matching AI — ranked matches with rationale
- [ ] Government report export — Anthropic + jsPDF

### Phase 6 — Enterprise Dashboard
- [ ] Enterprise auth guard — protected route checks enterprise_accounts
- [ ] Government dashboard screen — capital by region, milestone rates, Sub-DAOs
- [ ] Intelligence product view — enterprise_only patterns visible
- [ ] PDF/Excel export — jsPDF + SheetJS
- [ ] RLS for enterprise data — allowed_countries gates access

### Phase 7 — Research Marketplace
- [ ] Install Pinata SDK — `npm install pinata`
- [ ] Publication upload flow — PDF + metadata → Pinata → IPFS CID stored
- [ ] CrossRef DOI lookup — auto-populate metadata on DOI input
- [ ] Marketplace browse screen — published research with filters
- [ ] Purchase flow — AkoPay payment → signed Pinata URL
- [ ] Citation tracking — increment citation_count on cross-reference

### Phase 8 — Field Knowledge & Notifications
- [ ] Geo observation write — save to field_observations with PostGIS coordinates
- [ ] Photo upload — expo-image-picker → Supabase Storage
- [ ] Offline sync — AsyncStorage queue for offline submissions
- [ ] Validator workflow — approve/reject pending observations
- [ ] NXT reward on validation — Supabase trigger awards NXT to observer
- [ ] Expo push tokens — register device token on login
- [ ] Push Edge Function — send-push-notification triggered by database events

### Phase 9 — Credibility v2 & Sub-DAO Lifecycle
- [ ] calculate_credibility_score(user_id) Supabase function
- [ ] Trigger on relevant tables — auto-recalculate on milestone/vote/observation changes
- [ ] Profile score breakdown — show component scores on profile screen
- [ ] Sub-DAO state machine — instantiation on approval, dissolution on final milestone
- [ ] Capital return on dissolution — unused escrow returned to Parent DAO treasury

---

## 8. Priority Build Order

```
Week 1–2:   Supabase connection + auth + database migration
Week 3–4:   AkoPay account + payment service + KYC flow
Week 5–6:   Milestone tables + evidence upload + approval voting
Week 7:     AkoPay disbursement trigger on milestone approval
Week 8:     NXT token reads (ethers.js) + economics screen live data
Week 9–10:  Anthropic intelligence Edge Function + replace mock intelligence
Week 11–12: Enterprise dashboard + PDF export
Week 13–14: Research marketplace (Pinata + CrossRef)
Week 15:    Field observation write + geo storage
Week 16:    Push notifications
Week 17:    Credibility v2 + Sub-DAO lifecycle state machine
Week 18:    QA pass + smart contract audit prep
```

---

## 9. Environment Variables Master List

```bash
# SUPABASE
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AKOPAY
EXPO_PUBLIC_AKOPAY_BASE_URL=https://api.akopay.com/v1
EXPO_PUBLIC_AKOPAY_API_KEY=ak_live_...
EXPO_PUBLIC_AKOPAY_ENVIRONMENT=sandbox
AKOPAY_WEBHOOK_SECRET=whsec_...

# ANTHROPIC (Edge Functions only — never client-side)
ANTHROPIC_API_KEY=sk-ant-api03-...

# BLOCKCHAIN
EXPO_PUBLIC_RPC_URL=https://polygon-rpc.com
EXPO_PUBLIC_CHAIN_ID=137
EXPO_PUBLIC_NXT_CONTRACT_ADDRESS=0x...
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=

# KYC (Edge Functions only)
SMILE_IDENTITY_PARTNER_ID=
SMILE_IDENTITY_API_KEY=
SMILE_IDENTITY_ENVIRONMENT=sandbox

# STORAGE / IPFS (Edge Functions only)
PINATA_JWT=
EXPO_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud

# INTELLIGENCE (Edge Functions only)
NEWS_API_KEY=
```

**Set Supabase Edge Function secrets via CLI:**
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set AKOPAY_WEBHOOK_SECRET=whsec_...
supabase secrets set SMILE_IDENTITY_API_KEY=...
supabase secrets set NEWS_API_KEY=...
supabase secrets set PINATA_JWT=...
```

---

## 10. Smart Contract Integration Guide

### Recommended Network: Polygon (MATIC)
- Low gas fees (~$0.001 per transaction)
- EVM-compatible (Solidity contracts)
- USDC native support
- Active African developer community

### Install dependencies
```bash
npx expo install ethers
```

### Replace mock contract calls

Current pattern (broken):
```typescript
castVote(proposalId: string, vote: 'for' | 'against') {
  console.log('[VotingEngine] Vote cast'); // MOCK
  return { success: true };
}
```

Required pattern (production):
```typescript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.EXPO_PUBLIC_RPC_URL);

export const getVotingEngineContract = (signer?: ethers.Signer) => {
  return new ethers.Contract(
    VOTING_ENGINE_ADDRESS,
    VOTING_ENGINE_ABI,
    signer || provider
  );
};

export async function castVoteOnChain(
  proposalId: string,
  vote: boolean,
  signer: ethers.Signer
) {
  const contract = getVotingEngineContract(signer);
  const tx = await contract.castVote(proposalId, vote);
  const receipt = await tx.wait();
  await supabase.from('nxt_transactions').insert({
    type: 'governance_lock',
    tx_hash: receipt.hash,
    proposal_id: proposalId,
  });
  return receipt;
}
```

### Smart Contract Audit Requirement
All 8 contracts must pass a 3rd-party security audit before public launch.
Recommended auditors:
- **Code4rena** — competitive audit, cost-effective
- **Halborn** — strong DeFi/DeSci track record
- **Consensys Diligence** — gold standard

---

## 11. AkoPay Integration Specification

```typescript
// services/akopay.ts
const AKOPAY_BASE = process.env.EXPO_PUBLIC_AKOPAY_BASE_URL!;
const AKOPAY_KEY = process.env.EXPO_PUBLIC_AKOPAY_API_KEY!;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${AKOPAY_KEY}`,
  'X-Environment': process.env.EXPO_PUBLIC_AKOPAY_ENVIRONMENT || 'sandbox',
};

export const akopay = {
  async createEscrowWallet(daoId: string, currency = 'USD') {
    const res = await fetch(`${AKOPAY_BASE}/wallets/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ entity_type: 'sub_dao', entity_id: daoId, wallet_type: 'escrow', currency }),
    });
    return res.json();
  },

  async initiateDisbursement(params: {
    from_wallet_id: string;
    recipient_phone?: string;
    recipient_bank_account?: string;
    amount_usd: number;
    destination_currency: string;
    destination_country: string;
    payment_method: 'mobile_money' | 'bank_transfer' | 'papss';
    reference: string;
  }) {
    const res = await fetch(`${AKOPAY_BASE}/payments/initiate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async getPaymentStatus(akoPayRef: string) {
    const res = await fetch(`${AKOPAY_BASE}/payments/${akoPayRef}/status`, { headers });
    return res.json();
  },

  async initiateKYC(params: {
    user_id: string;
    phone_number: string;
    tier_requested: 1 | 2 | 3;
    redirect_url: string;
  }) {
    const res = await fetch(`${AKOPAY_BASE}/kyc/initiate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async getFXRates(fromCurrency: string, toCurrencies: string[]) {
    const params = new URLSearchParams({ from: fromCurrency, to: toCurrencies.join(',') });
    const res = await fetch(`${AKOPAY_BASE}/fx/rates?${params}`, { headers });
    return res.json();
  },
};
```

---

## 12. AI Intelligence Layer Specification

```typescript
// supabase/functions/intelligence-analyzer/index.ts
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

const systemPrompt = `You are NexTerra's intelligence analysis engine — an expert in One Health 
surveillance, disease ecology, and climate-health interactions across Africa. 

You analyze field observations, research proposals, and news signals to identify:
1. Emerging disease outbreak patterns (especially RVF, arbovirus, zoonotic spillover)
2. Climate-health risk signals
3. Research funding gaps
4. Cross-sector collaboration opportunities

Always return structured JSON with:
pattern_type, title, summary, severity (low/medium/high/critical), 
confidence_score (0-1), region, countries[], key_indicators[], recommended_actions[].`;
```

---

## 13. KYC/AML Flow Specification

### Tier Structure

| Tier | Requirement | Unlocks |
|------|------------|---------|
| 0 | Phone number only | View proposals, community feed |
| 1 | Phone + email verified | Submit proposals, vote |
| 2 | ID document (national ID / passport) | Receive disbursements up to $5,000 |
| 3 | Full institutional KYC | Unlimited disbursements, enterprise features |

### KYC Gate Implementation

```typescript
import { useKYCGate } from '@/hooks/useKYCGate';

const { kycTier, requiresKYC, promptKYCUpgrade } = useKYCGate();

if (kycTier < 1) {
  promptKYCUpgrade(1, 'You need to verify your identity before submitting a proposal.');
  return;
}
```

---

## 14. Milestone & Disbursement Engine Specification

### Milestone Lifecycle State Machine

```
pending → active → evidence_submitted → under_review → approved → disbursed
                                                      ↘ disputed → failed
```

### Disbursement Trigger (Edge Function)

On `milestones.status` update to `approved`:
1. Fetch Sub-DAO AkoPay escrow wallet
2. Fetch recipient payment details
3. Call `akopay.initiateDisbursement()`
4. Write `akopay_ref` to `disbursements` table
5. Update `milestones.disbursement_id`
6. Send push notification to recipient and funder

### Funder Dashboard View

```
Milestone 1  ✅  Disbursed $15,000 → Recipient in 2h 14m
Milestone 2  🔄  Evidence submitted — under review
Milestone 3  ⏳  Pending
Milestone 4  ⏳  Pending
```

---

## 15. NXT Token Dashboard Specification

### Live Data Points

| Data Point | Source | How to Fetch |
|-----------|--------|-------------|
| My NXT balance | nxt_balances + on-chain | contract.balanceOf(address) |
| Total supply | On-chain | contract.totalSupply() |
| DAO Treasury pool | nxt_balances WHERE entity = 'treasury' | Supabase query |
| My governance weight | nxt_balances.governance_weight | Supabase query |
| My tier | nxt_balances.tier | Supabase query |
| NXT transactions | nxt_transactions WHERE user_id = me | Supabase query |
| Active governance locks | nxt_balances.locked_balance | Supabase query |
| Recycled this month | nxt_transactions WHERE type = 'recycled' | Supabase aggregate |

### Token Allocation (100M NXT)

- DAO Treasury Pool: 45M (45%)
- Public / Institutional Access: 20M (20%)
- Ecosystem Incentives: 15M (15%)
- Core Contributors: 10M (10%)
- Strategic Partners: 5M (5%)
- Liquidity & Stability: 5M (5%)

---

## 16. Enterprise/Government Dashboard Specification

### Route: `/enterprise/dashboard`

Protected by `enterprise_accounts` record check.

### Dashboard Widgets

| Widget | Data Source |
|--------|------------|
| Capital deployed map | disbursements JOIN milestones with coordinates |
| Active Sub-DAOs by country | sub_dao_lifecycle WHERE status = 'active' |
| Milestone completion rate | milestones aggregate |
| Intelligence alerts feed | intelligence_patterns WHERE is_enterprise_only = true |
| Top researchers by credibility | credibility_scores JOIN profiles |
| Field observation heatmap | field_observations PostGIS clustering |
| Monthly capital flow chart | disbursements time series |
| Export buttons | PDF (jsPDF) + Excel (SheetJS) |

---

## 17. Testing Strategy

### Unit Tests
- `services/akopay.ts` — mock fetch, test all payment scenarios
- `services/daoContract/` — test contract call argument formatting
- Supabase Edge Functions — use `supabase test functions`

### Integration Tests
- Payment flow: initiate → webhook → milestone update → push notification
- KYC flow: initiate → verification URL → webhook → tier update
- Milestone flow: evidence submit → votes → approval → disbursement

### End-to-End Tests (Playwright)
- Full proposal submission → DAO vote → milestone creation
- Payment initiation → AkoPay sandbox → confirmation
- Intelligence alert generation → push delivery

---

## 18. Deployment Checklist

- [ ] All .env secrets set in Vercel dashboard and Supabase secrets
- [ ] AkoPay switched from sandbox to production
- [ ] Smart contract 3rd-party audit complete (Code4rena or Halborn)
- [ ] NXT genesis mint executed on Polygon mainnet
- [ ] Supabase production project created (separate from dev)
- [ ] RLS policies audited by external reviewer
- [ ] Database migration run and verified on production
- [ ] AkoPay webhook URL registered in AkoPay dashboard
- [ ] Expo app submitted to App Store and Google Play
- [ ] Monitoring set up: Sentry + Supabase dashboard
- [ ] Smart contract addresses updated in env vars
- [ ] GDPR / POPIA compliance review completed
- [ ] Load test: 500 concurrent users

---

## 19. Contributing Guidelines

### Branch Naming
```
feature/akopay-payment-rails
feature/milestone-engine
fix/voting-supabase-write
chore/replace-mocks-with-supabase
```

### Commit Format
```
feat(payments): wire AkoPay milestone disbursement API
fix(kyc): correct Smile Identity webhook signature validation
chore(db): add credibility_scores trigger function
```

### Pull Request Requirements
1. All mock data in `mocks/` replaced by real Supabase queries before merge
2. No `console.log('[ServiceName]...')` in service files
3. New Supabase tables must include RLS policies
4. New API calls must use env vars — no hardcoded URLs or keys
5. Edge Functions must handle errors and return appropriate HTTP status codes

### Priority Labels
- `p1-critical` — payment infrastructure, KYC, milestone engine
- `p2-core` — AI intelligence, enterprise dashboard, token dashboard
- `p3-complete` — research marketplace, push notifications, credibility v2

---

*Built by Dr. Nichar Gregory, PhD · NexTerra DAO · Johannesburg, South Africa*

*"Africa's scientific sovereignty is not a development goal. It is a right. NexTerra is the infrastructure to claim it."*
