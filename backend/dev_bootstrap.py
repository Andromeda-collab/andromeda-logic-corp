"""
Local dev bootstrap — creates every table from the SQLAlchemy models and
(optionally) seeds sample content, so the API can be run without hand-writing
migrations. Works against whatever DATABASE_URL is configured (SQLite or MySQL).

Usage (from the backend/ directory, with the venv active):

    python dev_bootstrap.py            # create tables + seed sample rows
    python dev_bootstrap.py --no-seed  # create tables only
    python dev_bootstrap.py --drop     # drop everything first, then recreate + seed

Point it at SQLite for a zero-setup run:

    # PowerShell
    $env:DATABASE_URL = "sqlite:///./andromeda_local.db"
    python dev_bootstrap.py

Or leave DATABASE_URL unset / set to your MySQL URL in .env to seed MySQL.
"""
import sys
from datetime import date

from app.db.base import Base
from app.db.session import engine, SessionLocal

# Import every model so Base.metadata knows all tables.
from app.models import (  # noqa: F401
    specialty, platform, persona_page, mission, press, job_requisition,
    library_resource, mission_consultation, nova_conversation, consent_log,
    about_content, investors_content, research_content, trust_content,
    research_access_request, nav_item,
)
from app.models.specialty import Specialty
from app.models.platform import Platform
from app.models.persona_page import PersonaPage
from app.models.mission import Mission
from app.models.press import PressItem
from app.models.job_requisition import JobRequisition
from app.models.library_resource import LibraryResource
from app.models.about_content import AboutContent
from app.models.investors_content import InvestorsContent
from app.models.research_content import ResearchContent
from app.models.trust_content import TrustContent
from app.models.admin_user import AdminUser
from app.models.home_content import HomeContent
from app.models.nav_item import NavItem
from app.core.security import hash_password

drop = "--drop" in sys.argv
seed = "--no-seed" not in sys.argv

if drop:
    Base.metadata.drop_all(bind=engine)
    print("dropped all tables")

Base.metadata.create_all(bind=engine)
print(f"created tables on {engine.url}")

if not seed:
    sys.exit(0)

db = SessionLocal()

if db.query(Specialty).count() == 0:
    db.add_all([
        Specialty(slug="autonomous-gnc",
                  name="Autonomous Spacecraft Guidance & Navigation (GNC)",
                  short_description="Real-time hazard detection, autonomous landing, orbital station-keeping.",
                  long_description="Full-stack autonomous GNC for communication-denied deep-space operation.",
                  status="in-development",
                  capabilities='["Real-time hazard detection during autonomous descent and landing", '
                               '"Orbital station-keeping without continuous ground-in-the-loop control", '
                               '"Terrain-relative navigation for high-variance planetary surfaces", '
                               '"Operation across communication-denied and high-latency links"]',
                  related_products='["GNC Autonomy Stack"]',
                  mission_tag="Lunar Survey Program — Autonomous GNC Validation"),
        Specialty(slug="radiation-tolerant-ai",
                  name="Radiation-Tolerant AI & Machine Learning",
                  short_description="Neural nets and inference engines for radiation-hardened hardware.",
                  long_description="Model compression, fault-tolerant inference, and hardware-aware ML.",
                  status="roadmap",
                  capabilities='["Radiation-hardened neural network architectures for high-radiation orbital and deep-space environments", '
                               '"Model compression and quantization for constrained flight-computer hardware", '
                               '"Fault-tolerant inference with single-event-upset (SEU) mitigation", '
                               '"On-orbit model updates without a full software re-flash"]',
                  related_products='["Radiation-Tolerant Inference Engine"]'),
        Specialty(slug="edge-computing",
                  name="In-Orbit Edge Computing & Data Reduction",
                  short_description="Onboard processing of camera, optical, and telemetry data.",
                  long_description="Onboard data reduction and edge inference for missions where downlink "
                                   "bandwidth is the binding constraint, validated in continuous orbital operation.",
                  status="flight-proven",
                  capabilities='["Onboard optical and telemetry data triage before downlink", '
                               '"Real-time compression and priority scoring of sensor data", '
                               '"Bandwidth-constrained data reduction for deep-space communication links", '
                               '"Modular payload integration with standard satellite bus interfaces"]',
                  related_products='["EDGE Payload"]',
                  mission_tag="Mission Prarambh"),
        Specialty(slug="swarm-infrastructure",
                  name="Autonomous Outpost & Swarm Infrastructure",
                  short_description="Multi-agent decision engines for constellations, habitats, rover swarms.",
                  long_description="Distributed decision-making infrastructure for constellations, planetary "
                                   "outposts, and rover swarms operating without continuous ground supervision.",
                  status="roadmap",
                  capabilities='["Multi-agent coordination for satellite constellations and rover swarms", '
                               '"Distributed station-keeping and coverage optimization", '
                               '"Fault-tolerant consensus across heterogeneous outpost nodes", '
                               '"Autonomous task allocation without continuous ground supervision"]',
                  related_products='["Swarm Orchestrator"]'),
        Specialty(slug="hitl-simulation",
                  name="Hardware-in-the-Loop (HITL) Simulation & Digital Twins",
                  short_description="High-fidelity orbital and deep-space simulation for pre-deployment validation.",
                  long_description="Hardware-in-the-Loop simulation and digital twin technology for testing, validation, and real-time system modeling.",
                  status="in-development",
                  capabilities='["Real-time hardware-in-the-loop test rigs for GNC and payload validation", '
                               '"High-fidelity orbital and deep-space environment simulation", '
                               '"Digital twin modeling for pre-flight system verification", '
                               '"Fault injection and edge-case scenario testing"]',
                  related_products='["HITL Digital Twin Suite"]',
                  mission_tag="Lunar Survey Program — Autonomous GNC Validation"),
    ])
    db.add_all([
        Platform(slug="edge-payload", name="EDGE Payload",
                 one_line_pitch="Onboard edge-compute payload for data reduction.",
                 status="flight-proven", is_export_controlled=True,
                 capability_blocks='["Onboard filtering and compression of camera, optical, and telemetry data", '
                                   '"Priority scoring to select high-value data for downlink", '
                                   '"Bandwidth reduction of up to 80% in continuous orbital operation", '
                                   '"Drop-in integration with standard serial and SpaceWire bus interfaces"]',
                 spec_summary="Deployed on Mission Prarambh, reducing downlink volume by 80% and cutting "
                              "required ground contact windows from 4 to 1 pass per day."),
        Platform(slug="gnc-autonomy-stack", name="GNC Autonomy Stack",
                 one_line_pitch="Autonomous guidance, navigation & control software stack.",
                 status="in-development", is_export_controlled=True,
                 capability_blocks='["Autonomous hazard detection and terrain-relative navigation", '
                                   '"Real-time trajectory optimization for descent and landing", '
                                   '"Communication-denied operation with onboard decision-making", '
                                   '"Modular integration with standard spacecraft bus architectures"]',
                 spec_summary="Runs on radiation-tolerant flight computers with sub-100ms control-loop "
                              "latency; validated across 200+ simulated lunar descent scenarios using "
                              "the HITL Digital Twin Suite."),
        Platform(slug="swarm-orchestrator", name="Swarm Orchestrator",
                 one_line_pitch="Multi-agent orchestration for satellite constellations.",
                 status="roadmap", is_export_controlled=True,
                 capability_blocks='["Multi-agent task allocation and coverage optimization across constellations", '
                                   '"Distributed station-keeping without centralized ground control", '
                                   '"Fault-tolerant consensus for heterogeneous satellite and rover fleets", '
                                   '"Scalable orchestration from single-outpost to multi-node swarms"]',
                 spec_summary="In development toward flight qualification; designed for constellations and "
                              "planetary outposts requiring autonomous, ground-independent coordination."),
        Platform(slug="hitl-digital-twin-suite", name="HITL Digital Twin Suite",
                 one_line_pitch="Hardware-in-the-loop simulation and digital twin environment.",
                 status="flight-proven", is_export_controlled=False,
                 capability_blocks='["High-fidelity orbital and deep-space environment simulation", '
                                   '"Real hardware-in-the-loop integration with flight computers", '
                                   '"Digital twin modeling for pre-flight validation and regression testing", '
                                   '"Scenario libraries for terrain, sensor-failure, and communication-denied cases"]',
                 spec_summary="Used to validate the GNC Autonomy Stack across 200+ simulated lunar descent "
                              "scenarios ahead of the Lunar Survey Program."),
        Platform(slug="radiation-tolerant-inference-engine",
                 name="Radiation-Tolerant Inference Engine",
                 one_line_pitch="ML inference engine optimized for radiation-hardened hardware.",
                 status="roadmap", is_export_controlled=True,
                 capability_blocks='["Radiation-hardened neural network inference for high-radiation environments", '
                                   '"Model compression and quantization for constrained flight-computer hardware", '
                                   '"Single-event-upset (SEU) resilient execution pipeline", '
                                   '"Compatible with standard onboard ML model formats"]',
                 spec_summary="On the technology roadmap toward flight qualification; targets radiation-hardened "
                              "flight computers for deep-space and lunar surface missions."),
    ])
    db.add_all([
        PersonaPage(slug="space-agencies", name="Space Agencies",
                    narrative="National and multinational agencies evaluating autonomous GNC, radiation-tolerant compute, or HITL simulation partners."),
        PersonaPage(slug="commercial", name="Commercial Space Operators",
                    narrative="Satellite constellation operators, private launch providers, in-orbit servicing companies."),
        PersonaPage(slug="defense", name="Defense & National Security Programs",
                    narrative="Defense-adjacent programs requiring resilient, autonomous systems for contested environments."),
        PersonaPage(slug="research", name="Research Institutions & Academia",
                    narrative="Universities, national laboratories, and independent research institutions."),
    ])
    db.add_all([
        Mission(slug="mission-prarambh", title="Mission Prarambh",
                summary="First orbital validation of the EDGE Payload — 80% downlink reduction in real time.",
                challenge="A commercial LEO mission needed real-time onboard data reduction; data volume exceeded bandwidth by 5x.",
                approach="EDGE Payload integrated into the bus for onboard filtering, compression and priority scoring before downlink.",
                technology_used="EDGE Payload v1.2\nOnboard noise filter pipeline\nAutonomous priority scoring",
                outcome="Downlink volume reduced 80%; ground contact windows cut from 4 to 1 pass/day.",
                reference_rights_approved=True),
        Mission(slug="lunar-survey-gnc", title="Lunar Survey Program — Autonomous GNC Validation",
                summary="GNC Autonomy Stack validated across 200+ simulated lunar descent scenarios.",
                challenge="Validate autonomous hazard detection and soft-landing across high-variance terrain and sensor failures.",
                approach="HITL Digital Twin Suite with real flight hardware running the GNC Autonomy Stack across 200+ scenarios.",
                technology_used="GNC Autonomy Stack v2.1; HITL Digital Twin Suite — Lunar Module; Terrain Relative Navigation",
                outcome="Safe landing in 99.4% of scenarios; two edge cases resolved pre-flight.",
                reference_rights_approved=True),
    ])
    db.add_all([
        PressItem(slug="hitl-v2-launch",
                  title="Andromeda Logic Corp Announces HITL Digital Twin Suite v2.0",
                  body="v2.0 introduces high-fidelity lunar surface simulation, interplanetary trajectory modeling, and expanded radiation-environment emulation.",
                  is_external=False, source_outlet="Andromeda Logic Corp Press Release",
                  published_date=date(2026, 8, 1)),
        PressItem(slug="radiation-whitepaper",
                  title="Whitepaper: Sparse Neural Execution at the Radiation Boundary",
                  body="Architectural patterns for sparse neural networks on radiation-hardened processors with sub-100ms inference.",
                  is_external=False, source_outlet="Andromeda Logic Corp Research",
                  published_date=date(2026, 7, 1)),
        PressItem(slug="orbit-report-feature",
                  title="Indian Deep-Space AI Startups Are Building the Infrastructure Layer for Lunar Autonomy",
                  body="Feature on emerging Indian deep-space technology companies.",
                  is_external=True, source_outlet="The Orbit Report",
                  published_date=date(2026, 8, 15)),
    ])
    db.add_all([
        JobRequisition(slug="senior-gnc-engineer", title="Senior GNC Engineer",
                       discipline="Guidance, Navigation & Control", location="Bengaluru, India",
                       requires_clearance=False,
                       description="Design and validate autonomous GNC algorithms for deep-space mission profiles.",
                       is_open=True),
        JobRequisition(slug="ml-research-engineer", title="ML Research Engineer — Radiation-Tolerant AI",
                       discipline="AI & Machine Learning", location="Bengaluru, India",
                       requires_clearance=False,
                       description="Develop neural architectures and inference engines for radiation-hardened hardware.",
                       is_open=True),
        JobRequisition(slug="embedded-systems-engineer", title="Embedded Systems Engineer — Space Software",
                       discipline="Embedded & Flight Software", location="Pune, India",
                       requires_clearance=True,
                       description="Develop fault-tolerant embedded software for mission-critical payloads.",
                       is_open=True),
    ])
    db.add_all([
        LibraryResource(slug="gnc-deep-space-brief",
                        title="Autonomous GNC in Communication-Denied Deep-Space Environments",
                        asset_type="briefing", specialty_tag="autonomous-gnc", persona_tag="space-agencies",
                        is_gated=False, file_url="/uploads/gnc-deep-space-brief.pdf",
                        published_date=date(2026, 5, 1)),
        LibraryResource(slug="hitl-lunar-descent-whitepaper",
                        title="HITL Simulation Methodology for Lunar Descent Validation",
                        asset_type="whitepaper", specialty_tag="hitl-simulation", persona_tag="research",
                        is_gated=True, published_date=date(2026, 3, 1)),
        LibraryResource(slug="edge-payload-spec", title="EDGE Payload Spec Sheet",
                        asset_type="spec_sheet", specialty_tag="edge-computing", persona_tag="commercial",
                        is_gated=True, published_date=date(2026, 6, 15)),
    ])

if db.query(AboutContent).count() == 0:
    db.add(AboutContent(
        mission_statement="To design, build, and deploy high-reliability intelligent systems that empower autonomous exploration, accelerate scientific discovery, and expand human reach into deep space.",
        vision_statement="To become the fundamental computational backbone for humanity's multi-planetary future.",
        leadership="[]", heritage_timeline="[]", locations="[]",
    ))
if db.query(InvestorsContent).count() == 0:
    db.add(InvestorsContent(
        company_snapshot="Andromeda Logic Corp builds autonomous, radiation-tolerant computing for deep-space missions, validated across orbital and simulation programs.",
        partner_program="Partnership tracks: technology licensing, joint mission development, and research collaboration with institutions and national labs.",
        disclosures="Forward-looking statements reflect current expectations and are subject to change.",
    ))
if db.query(ResearchContent).count() == 0:
    db.add(ResearchContent(
        overview="Andromeda Logic Corp's research division operates a high-fidelity HITL simulation environment for deep-space mission validation.",
        partnership_program="Universities and national laboratories can engage via simulation access, joint publication, and algorithm co-development.",
    ))
if db.query(TrustContent).count() == 0:
    db.add(TrustContent(
        export_control_posture="Andromeda Logic Corp develops technology that may be subject to ITAR and EAR. Controlled technical content is never placed behind a simple email-capture form alone.",
        gated_content_policy="Export-control classification of specific assets is reviewed with qualified counsel before any public release decision.",
        data_privacy_practices="Mission Consultation submissions and gated-download lead captures are retained only as long as necessary for the disclosed business purpose.",
        responsible_disclosure_email="security@andromedalogiccorp.com",
        certifications='["ISO 9001 (in process)", "ISO/IEC 27001 (in process)", "WCAG 2.2 AA (implemented)"]',
    ))

if db.query(HomeContent).count() == 0:
    db.add(HomeContent(
        mission_label="Flagship Mission",
        mission_title="Mission Prarambh",
        mission_description="As missions venture farther into the solar system, communication delays "
                             "demand unprecedented onboard autonomy. Andromeda Logic builds fault-tolerant "
                             "computational platforms and real-time data processing tools designed to "
                             "operate seamlessly in deep-space environments.",
    ))
if db.query(AdminUser).count() == 0:
    db.add(AdminUser(
        email="admin@andromedalogic.local",
        password_hash=hash_password("Andromeda@2026"),
    ))

if db.query(NavItem).count() == 0:
    db.add_all([
        NavItem(label="Technology", url="/technology", is_cta=False),
        NavItem(label="Products", url="/products", is_cta=False),
        NavItem(label="Solutions", url="/solutions", is_cta=False),
        NavItem(label="Research", url="/research", is_cta=False),
        NavItem(label="Company", url="/about", is_cta=False),
        NavItem(label="Resources", url="/library", is_cta=False),
        NavItem(label="Request Mission Consultation", url="/contact", is_cta=True),
    ])

db.commit()
print("seed complete:",
      db.query(Specialty).count(), "specialties,",
      db.query(Platform).count(), "platforms,",
      db.query(Mission).count(), "missions,",
      db.query(JobRequisition).count(), "roles,",
      db.query(LibraryResource).count(), "library resources")
db.close()
