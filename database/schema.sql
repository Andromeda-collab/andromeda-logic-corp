-- Andromeda Logic Corp — MySQL Schema
-- Mirrors backend/app/models/*. Source of truth is Alembic migrations;
-- this file is a readable reference / manual bootstrap option.
-- Content types per Section 12.2 of the technical specification.

CREATE DATABASE IF NOT EXISTS andromeda_logic_corp
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE andromeda_logic_corp;

-- Section 2.2 / 9.2 — five Core Specialties
CREATE TABLE IF NOT EXISTS specialties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT NULL
);

-- Section 9.3 — five named Products/Platforms
CREATE TABLE IF NOT EXISTS platforms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  one_line_pitch VARCHAR(300) NOT NULL,
  status ENUM('flight-proven', 'in-development', 'roadmap') NOT NULL,
  capability_blocks JSON NULL,
  spec_sheet_url VARCHAR(500) NULL,
  is_export_controlled BOOLEAN NOT NULL DEFAULT TRUE
);

-- Section 9.4 — four Solutions-by-Audience personas
CREATE TABLE IF NOT EXISTS persona_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug ENUM('space-agencies', 'commercial', 'defense', 'research') NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  narrative TEXT NOT NULL,
  engagement_paths JSON NULL
);

-- Section 9.6 — Case Studies & Mission Stories
CREATE TABLE IF NOT EXISTS missions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(150) NOT NULL UNIQUE,
  title VARCHAR(250) NOT NULL,
  summary VARCHAR(400) NOT NULL,
  challenge TEXT NULL,
  approach TEXT NULL,
  technology_used TEXT NULL,
  outcome TEXT NULL,
  reference_rights_approved BOOLEAN NOT NULL DEFAULT FALSE
);

-- Section 9.7 — Newsroom (self-published + external coverage)
CREATE TABLE IF NOT EXISTS press_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(300) NOT NULL,
  body TEXT NULL,
  is_external BOOLEAN NOT NULL DEFAULT FALSE,
  source_outlet VARCHAR(200) NULL,
  published_date DATE NOT NULL
);

-- Section 9.8 — Careers (ATS-fed)
CREATE TABLE IF NOT EXISTS job_requisitions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(250) NOT NULL,
  discipline VARCHAR(120) NOT NULL,
  location VARCHAR(150) NULL,
  requires_clearance BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT NULL,
  is_open BOOLEAN NOT NULL DEFAULT TRUE
);

-- Section 9.10 — Technical Library (filterable, export-control gated)
CREATE TABLE IF NOT EXISTS library_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(300) NOT NULL,
  asset_type VARCHAR(50) NOT NULL, -- whitepaper | spec_sheet | briefing | case_study
  specialty_tag VARCHAR(120) NULL,
  persona_tag VARCHAR(120) NULL,
  is_gated BOOLEAN NOT NULL DEFAULT TRUE,
  file_url VARCHAR(500) NULL,
  published_date DATE NOT NULL
);

-- Section 9.13 — Mission Consultation form submissions
CREATE TABLE IF NOT EXISTS mission_consultations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  persona VARCHAR(100) NOT NULL,
  mission_phase VARCHAR(100) NULL,
  target_orbit_or_destination VARCHAR(200) NULL,
  timeframe VARCHAR(100) NULL,
  name VARCHAR(200) NOT NULL,
  organization VARCHAR(200) NOT NULL,
  role VARCHAR(150) NULL,
  email VARCHAR(200) NOT NULL,
  country VARCHAR(100) NOT NULL,
  rfp_document_url VARCHAR(500) NULL,
  consent_given BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Section 10.6 — NOVA conversation logs (privacy-policy governed, 14.2)
CREATE TABLE IF NOT EXISTS nova_conversation_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL, -- user | assistant
  message TEXT NOT NULL,
  cited_sources JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_nova_session (session_id)
);

-- Section 8.3 — Cookie/privacy consent audit log
CREATE TABLE IF NOT EXISTS consent_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  visitor_id VARCHAR(100) NOT NULL,
  necessary BOOLEAN NOT NULL DEFAULT TRUE,
  analytics BOOLEAN NOT NULL DEFAULT FALSE,
  marketing BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_consent_visitor (visitor_id)
);


-- Section 9.9 — About Us (single-row content record)
CREATE TABLE IF NOT EXISTS about_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mission_statement TEXT NOT NULL,
  vision_statement TEXT NOT NULL,
  heritage_timeline JSON NULL,
  locations JSON NULL
);