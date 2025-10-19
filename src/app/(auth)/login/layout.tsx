import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page",
  description: "Conecte-se a sua conta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>{children}</div>
    
  );
}
