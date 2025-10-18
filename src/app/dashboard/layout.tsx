import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Sua conta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div >
        {children}
      </div>
  );
}
