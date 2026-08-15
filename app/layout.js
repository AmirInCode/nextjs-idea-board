import { Vazirmatn  } from "next/font/google";
import "./globals.css";


const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
});

;

export const metadata = {
  title: "ایده‌های کسب‌وکار",
  description: "ثبت و مدیریت ایده‌های کسب‌وکار",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazir.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
