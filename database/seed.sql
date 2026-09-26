-- Andromeda Logic Corp — seed data stub.
-- Populates the fixed-cardinality taxonomies (5 Specialties, 5 Platforms,
-- 4 Personas) referenced throughout Section 9. Extend with real copy
-- from Sections 2.2 / 9.3 / 3.1-3.4 before use.

USE andromeda_logic_corp;

INSERT INTO specialties (slug, name, short_description) VALUES
  ('autonomous-gnc', 'Autonomous Spacecraft Guidance & Navigation (GNC)', 'Real-time hazard detection, autonomous landing, orbital station-keeping.'),
  ('radiation-tolerant-ai', 'Radiation-Tolerant AI & Machine Learning', 'Neural networks and inference engines optimized for radiation-hardened hardware.'),
  ('edge-computing', 'In-Orbit Edge Computing & Data Reduction', 'Onboard processing of camera, optical, and telemetry data.'),
  ('swarm-infrastructure', 'Autonomous Outpost & Swarm Infrastructure', 'Multi-agent decision engines for constellations, habitats, rover swarms.'),
  ('hitl-simulation', 'Hardware-in-the-Loop (HITL) Simulation & Digital Twins', 'High-fidelity orbital and deep-space simulation for pre-deployment validation.')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO platforms (slug, name, one_line_pitch, status, is_export_controlled) VALUES
  ('edge-payload', 'EDGE Payload', 'Onboard edge-compute payload for data reduction.', 'in-development', TRUE),
  ('gnc-autonomy-stack', 'GNC Autonomy Stack', 'Autonomous guidance, navigation & control software stack.', 'in-development', TRUE),
  ('swarm-orchestrator', 'Swarm Orchestrator', 'Multi-agent orchestration for satellite constellations.', 'roadmap', TRUE),
  ('hitl-digital-twin-suite', 'HITL Digital Twin Suite', 'Hardware-in-the-loop simulation and digital twin environment.', 'in-development', FALSE),
  ('radiation-tolerant-inference-engine', 'Radiation-Tolerant Inference Engine', 'ML inference engine optimized for radiation-hardened hardware.', 'roadmap', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO persona_pages (slug, name, narrative) VALUES
  ('space-agencies', 'Space Agencies', 'National and multinational agencies evaluating autonomous GNC, radiation-tolerant compute, or HITL simulation partners.'),
  ('commercial', 'Commercial Space Operators', 'Satellite constellation operators, private launch providers, in-orbit servicing companies.'),
  ('defense', 'Defense & National Security Programs', 'Defense-adjacent programs requiring resilient, autonomous systems for contested environments.'),
  ('research', 'Research Institutions & Academia', 'Universities, national laboratories, and independent research institutions.')
ON DUPLICATE KEY UPDATE name = VALUES(name);
