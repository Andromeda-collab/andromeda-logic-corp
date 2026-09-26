"""
Shared taxonomy enums referenced across content models.
Source: Section 2-3 (Personas, Specialties), Section 7.2 (Status badges).
"""
import enum


class StatusBadge(str, enum.Enum):
    FLIGHT_PROVEN = "flight-proven"
    IN_DEVELOPMENT = "in-development"
    ROADMAP = "roadmap"


class Persona(str, enum.Enum):
    SPACE_AGENCIES = "space-agencies"
    COMMERCIAL = "commercial"
    DEFENSE = "defense"
    RESEARCH = "research"
