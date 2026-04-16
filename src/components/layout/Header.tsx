"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">화성 바이브</span>
          <span className="text-xs text-muted hidden sm:inline">Hwaseong Vibe</span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            지도
          </Link>
          <Link href="/places" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            장소 목록
          </Link>
          <Link href="/courses" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            코스 추천
          </Link>
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-3">
          <Link
            href="/places/new"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-secondary text-white text-sm font-semibold rounded-full hover:bg-secondary-dark transition-colors"
          >
            <span>+ 장소 등록</span>
          </Link>

          {user ? (
            /* 로그인 상태: 아바타 + 드롭다운 */
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border hover:bg-surface transition-colors"
              >
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? ""}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {user.displayName?.[0] ?? "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-foreground hidden sm:inline max-w-[80px] truncate">
                  {user.displayName?.split(" ")[0]}
                </span>
                <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-border rounded-xl shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-foreground truncate">{user.displayName}</p>
                    <p className="text-[11px] text-muted truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/places/new"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-surface transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    장소 등록
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-surface transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 비로그인 상태: 로그인 버튼 */
            <Link
              href="/auth"
              className="px-4 py-2 border border-primary text-primary text-sm font-medium rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              로그인
            </Link>
          )}

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 rounded-md text-muted hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴 열기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-3">
          <Link href="/" className="text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>지도</Link>
          <Link href="/places" className="text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>장소 목록</Link>
          <Link href="/courses" className="text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>코스 추천</Link>
          <Link
            href="/places/new"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-secondary text-white text-sm font-semibold rounded-full"
            onClick={() => setMenuOpen(false)}
          >
            + 장소 등록
          </Link>
          {user && (
            <button
              onClick={() => { handleSignOut(); setMenuOpen(false); }}
              className="text-sm text-red-500 py-2 text-left"
            >
              로그아웃
            </button>
          )}
        </div>
      )}
    </header>
  );
}
