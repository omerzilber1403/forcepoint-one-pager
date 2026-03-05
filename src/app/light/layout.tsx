/**
 * Light theme layout — sits inside the root app/layout.tsx.
 * Uses :has(.light-route) to override the root body's dark background
 * and hide the animated orb field, without touching any dark-theme files.
 */
export default function LightLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Kill the dark page background when the light route is active */
        body:has(.light-route) {
          background: #FAFAF9 !important;
        }
        /* Hide the animated dark orbs */
        body:has(.light-route) .orb-field {
          display: none !important;
        }
        /* The light surface itself */
        .light-route {
          position: relative;
          min-height: 100vh;
          background: #FAFAF9;
          color: #1C1917;
        }
      `}</style>
      <div className="light-route">
        {children}
      </div>
    </>
  );
}
