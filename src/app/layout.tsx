import type { Metadata } from "next";

// Firebase Auth 사용으로 정적 프리렌더링 불가 → 동적 렌더링 강제
export const dynamic = "force-dynamic";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "화성 바이브 | Hwaseong Vibe",
  description: "화성시 주민이 직접 만드는 동네 숨겨진 장소 지도. 무드별 데이트 코스를 추천받으세요.",
  keywords: ["화성시", "화성", "데이트 코스", "숨겨진 장소", "지역 지도"],
  openGraph: {
    title: "화성 바이브",
    description: "화성시 숨겨진 장소를 발견하세요",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full`}>
      <body className="h-full flex flex-col antialiased bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
