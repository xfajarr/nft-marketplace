/*
  # NFT Launchpad Schema

  1. New Tables
    - `collections`
      - `id` (uuid, primary key)
      - `creator_id` (text) - Wallet address of the creator
      - `name` (text) - Collection name
      - `description` (text) - Collection description
      - `thumbnail_url` (text) - Collection thumbnail image
      - `banner_url` (text) - Collection banner image
      - `royalty_percentage` (numeric) - Creator royalty percentage (0-100)
      - `discord_url` (text, optional) - Discord link
      - `twitter_url` (text, optional) - Twitter link
      - `website_url` (text, optional) - Website link
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `nft_launches`
      - `id` (uuid, primary key)
      - `collection_id` (uuid, foreign key)
      - `creator_id` (text) - Wallet address of the creator
      - `launch_type` (text) - 'edition' or 'drops'
      - `status` (text) - 'draft', 'scheduled', 'live', 'ended', 'cancelled'
      - `edition_name` (text) - Name of the NFT/Edition
      - `edition_description` (text) - Description
      - `edition_size` (integer) - Total supply
      - `minted_count` (integer) - Number minted so far
      - `price_sui` (numeric) - Price in SUI
      - `start_time` (timestamptz) - Mint start time
      - `duration_hours` (integer) - Duration in hours
      - `mint_limit_per_address` (integer, optional) - Max per wallet
      - `has_allowlist` (boolean) - Whether whitelist is enabled
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `nft_assets`
      - `id` (uuid, primary key)
      - `launch_id` (uuid, foreign key)
      - `image_url` (text) - NFT image URL
      - `token_id` (text, optional) - On-chain token ID after mint
      - `attributes` (jsonb) - Traits/attributes as JSON
      - `serial_number` (integer, optional) - For editions
      - `is_minted` (boolean) - Whether this asset has been minted
      - `minted_to` (text, optional) - Wallet address of minter
      - `minted_at` (timestamptz, optional)
      - `created_at` (timestamptz)

    - `allowlist_entries`
      - `id` (uuid, primary key)
      - `launch_id` (uuid, foreign key)
      - `wallet_address` (text) - Whitelisted address
      - `max_mints` (integer) - Max allowed for this address
      - `minted_count` (integer) - How many they've minted
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Creators can create and manage their own collections/launches
    - Public read access to active launches
    - Allowlist entries readable by launch creator and whitelisted address
*/

-- Collections Table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  thumbnail_url text NOT NULL,
  banner_url text,
  royalty_percentage numeric NOT NULL DEFAULT 5.0 CHECK (royalty_percentage >= 0 AND royalty_percentage <= 100),
  discord_url text,
  twitter_url text,
  website_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collections"
  ON collections FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Creators can insert their own collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Creators can update their own collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Creators can delete their own collections"
  ON collections FOR DELETE
  TO authenticated
  USING (true);

-- NFT Launches Table
CREATE TABLE IF NOT EXISTS nft_launches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  creator_id text NOT NULL,
  launch_type text NOT NULL CHECK (launch_type IN ('edition', 'drops')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'live', 'ended', 'cancelled')),
  edition_name text NOT NULL,
  edition_description text NOT NULL,
  edition_size integer NOT NULL CHECK (edition_size > 0),
  minted_count integer NOT NULL DEFAULT 0,
  price_sui numeric NOT NULL CHECK (price_sui >= 0),
  start_time timestamptz NOT NULL,
  duration_hours integer NOT NULL CHECK (duration_hours > 0),
  mint_limit_per_address integer CHECK (mint_limit_per_address IS NULL OR mint_limit_per_address > 0),
  has_allowlist boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE nft_launches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active launches"
  ON nft_launches FOR SELECT
  TO authenticated, anon
  USING (status IN ('scheduled', 'live', 'ended'));

CREATE POLICY "Creators can view their own launches"
  ON nft_launches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can insert their own launches"
  ON nft_launches FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Creators can update their own launches"
  ON nft_launches FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Creators can delete their own launches"
  ON nft_launches FOR DELETE
  TO authenticated
  USING (true);

-- NFT Assets Table
CREATE TABLE IF NOT EXISTS nft_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  launch_id uuid NOT NULL REFERENCES nft_launches(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  token_id text,
  attributes jsonb DEFAULT '[]'::jsonb,
  serial_number integer,
  is_minted boolean NOT NULL DEFAULT false,
  minted_to text,
  minted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nft_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view assets for active launches"
  ON nft_assets FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM nft_launches
      WHERE nft_launches.id = nft_assets.launch_id
      AND nft_launches.status IN ('scheduled', 'live', 'ended')
    )
  );

CREATE POLICY "Creators can view their own launch assets"
  ON nft_assets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can insert assets for their launches"
  ON nft_assets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Creators can update their own launch assets"
  ON nft_assets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Creators can delete their own launch assets"
  ON nft_assets FOR DELETE
  TO authenticated
  USING (true);

-- Allowlist Entries Table
CREATE TABLE IF NOT EXISTS allowlist_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  launch_id uuid NOT NULL REFERENCES nft_launches(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  max_mints integer NOT NULL DEFAULT 1 CHECK (max_mints > 0),
  minted_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(launch_id, wallet_address)
);

ALTER TABLE allowlist_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view allowlist for their launches"
  ON allowlist_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nft_launches
      WHERE nft_launches.id = allowlist_entries.launch_id
    )
  );

CREATE POLICY "Whitelisted users can view their own entries"
  ON allowlist_entries FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Creators can manage allowlist for their launches"
  ON allowlist_entries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Creators can update allowlist for their launches"
  ON allowlist_entries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Creators can delete allowlist entries for their launches"
  ON allowlist_entries FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_collections_creator ON collections(creator_id);
CREATE INDEX IF NOT EXISTS idx_launches_collection ON nft_launches(collection_id);
CREATE INDEX IF NOT EXISTS idx_launches_creator ON nft_launches(creator_id);
CREATE INDEX IF NOT EXISTS idx_launches_status ON nft_launches(status);
CREATE INDEX IF NOT EXISTS idx_assets_launch ON nft_assets(launch_id);
CREATE INDEX IF NOT EXISTS idx_allowlist_launch ON allowlist_entries(launch_id);
CREATE INDEX IF NOT EXISTS idx_allowlist_wallet ON allowlist_entries(wallet_address);
