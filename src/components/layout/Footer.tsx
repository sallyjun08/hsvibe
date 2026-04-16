export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary">화성 바이브</p>
            <p className="text-xs text-muted mt-0.5">화성시 주민이 만드는 동네 지도</p>
          </div>
          <p className="text-xs text-muted">
            © 2026 Hwaseong Vibe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
