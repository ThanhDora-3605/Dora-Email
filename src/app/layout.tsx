import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dora-Email - Email Tạm Thời Nhanh Chóng & Bảo Mật",
  description: "Dora-Email - Dịch vụ email tạm thời miễn phí. Tạo email dùng một lần tức thì. Không cần đăng ký. Bảo vệ quyền riêng tư của bạn.",
  keywords: "temporary email, disposable email, dora email, email tạm thời, anonymous email",
  icons: {
    icon: "/doraemail.png",
    apple: "/doraemail.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
