import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/layout/navbar";

export const metadata = {
  title: "GoatPen",
  description:
    "INE's first ever Open source CTF. Join us to challenge your skills and learn from the best in a collaborative environment.",
  metadataBase: new URL("https://my.ine.com"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <QueryProvider>
          <NavBar />
          <main>{children}</main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
