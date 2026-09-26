from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.db.base import Base


class NovaConversationLog(Base):
    """NOVA conversation log — Section 10.6 Data Governance.
    Stateless per-session by default (10.5); retained per privacy policy (14.2).
    No cross-session data leakage between organizations."""
    __tablename__ = "nova_conversation_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(String(100), index=True)
    role: Mapped[str] = mapped_column(String(20))  # user | assistant
    message: Mapped[str] = mapped_column(Text)
    cited_sources: Mapped[str] = mapped_column(Text, nullable=True)  # JSON-encoded
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
