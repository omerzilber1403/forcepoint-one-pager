/**
 * LightAgentShowcase — wraps the existing AgentShowcase component and injects
 * light-theme CSS overrides for all .bot-* scoped classes without modifying
 * the original component.
 */
import AgentShowcase from "@/components/agent-showcase";

const LIGHT_OVERRIDES = `
/* ── Root & page background ──────────────────────────────────── */
.light-salesbot { background: #F5F5F4; }
.light-salesbot .bot-root { background: transparent; color: #1C1917; }

/* ── Header ──────────────────────────────────────────────────── */
.light-salesbot .bot-header-badge {
  background: #EEF2FF; border-color: #C7D2FE; color: #4338CA;
}
.light-salesbot .bot-header-dot  { background: #4F46E5; }
.light-salesbot .bot-title       { color: #1C1917; }
.light-salesbot .bot-title-em    { color: #4F46E5; }
.light-salesbot .bot-subtitle    { color: #57534E; }

/* ── Mobile tabs ─────────────────────────────────────────────── */
.light-salesbot .bot-tabs        { border-color: #E7E5E4; }
.light-salesbot .bot-tab--active   { background: #4F46E5; color: #fff; }
.light-salesbot .bot-tab--inactive { background: #fff; color: #57534E; }

/* ── Story section cards ─────────────────────────────────────── */
.light-salesbot .bot-section {
  background: #fff; border-color: #E7E5E4;
  backdrop-filter: none; -webkit-backdrop-filter: none;
}
.light-salesbot .bot-section--active {
  border-left: 3px solid #4F46E5;
  border-color: #C7D2FE; background: #FAFAFA;
  box-shadow: 0 8px 24px -4px rgba(28,25,23,0.10);
}
.light-salesbot .bot-step-badge  { background: #EEF2FF; color: #4338CA; border-color: #C7D2FE; }
.light-salesbot .bot-headline    { color: #1C1917; }
.light-salesbot .bot-body        { color: #57534E; }
.light-salesbot .bot-body code   { background: rgba(190,18,60,0.07); color: #BE123C; }

/* ── Trigger buttons ─────────────────────────────────────────── */
.light-salesbot .bot-trigger-btn {
  border-color: #4F46E5; color: #4F46E5; background: transparent;
}
.light-salesbot .bot-trigger-btn:hover:not(:disabled) {
  background: #4F46E5; color: #fff;
  box-shadow: 0 4px 16px rgba(79,70,229,0.28); transform: translateY(-1px);
}
.light-salesbot .bot-trigger-btn--active { background: #EEF2FF; box-shadow: none; }

/* ── Demo pane ───────────────────────────────────────────────── */
.light-salesbot .bot-demo-pane {
  background: #fff; border-color: #E7E5E4;
  backdrop-filter: none; -webkit-backdrop-filter: none;
}
.light-salesbot .bot-demo-header {
  background: #FAFAF9; border-bottom-color: #E7E5E4;
}
.light-salesbot .bot-demo-title  { color: #1C1917; }
.light-salesbot .bot-status-row  { color: #78716C; }

/* ── Company pills ───────────────────────────────────────────── */
.light-salesbot .bot-company-pill { border-color: #E7E5E4; color: #57534E; background: transparent; }
.light-salesbot .bot-company-pill:hover:not(.bot-company-pill--active) { border-color: #4F46E5; color: #4F46E5; }
.light-salesbot .bot-company-pill--active { background: #EEF2FF; color: #4F46E5; border-color: #4F46E5; }

/* ── Messages ────────────────────────────────────────────────── */
.light-salesbot .bot-messages    { background: #FAFAF9; }
.light-salesbot .bot-bubble--user { background: #4F46E5; color: #fff; border-radius: 1rem 1rem 0.25rem 1rem; }
.light-salesbot .bot-bubble--bot  { background: #fff; color: #1C1917; border-color: #E7E5E4; }
.light-salesbot .bot-bubble--system { background: rgba(79,70,229,0.06); color: #4338CA; border-color: rgba(79,70,229,0.2); }
.light-salesbot .bot-exec-path   { background: #F5F5F4; border-color: #E7E5E4; color: #78716C; }
.light-salesbot .bot-dot         { background: #4F46E5; }

/* ── Input bar ───────────────────────────────────────────────── */
.light-salesbot .bot-input-bar   { background: #F5F5F4; border-top-color: #E7E5E4; }
.light-salesbot .bot-input {
  background: #fff; border-color: #D6D3D1; color: #1C1917;
}
.light-salesbot .bot-input:focus { border-color: #4F46E5; }
.light-salesbot .bot-input::placeholder { color: #A8A29E; }
.light-salesbot .bot-send        { background: #4F46E5; color: #fff; }
.light-salesbot .bot-send:hover:not(:disabled) { background: #4338CA; }

/* ── Offline / checking ──────────────────────────────────────── */
.light-salesbot .bot-offline-title { color: #57534E; }
.light-salesbot .bot-offline-cmd {
  color: #4F46E5; background: #EEF2FF; border-color: #C7D2FE;
}
`;

export default function LightAgentShowcase({ lang }: { lang?: "en" | "he" } = {}) {
  return (
    <div className="light-salesbot">
      <style dangerouslySetInnerHTML={{ __html: LIGHT_OVERRIDES }} />
      <AgentShowcase lang={lang} />
    </div>
  );
}
