import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar-se",
  description: "Crie uma conta no sistema.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
