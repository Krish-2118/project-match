"use client";

import React from "react";
import { ThemeProvider } from "styled-components";

// Match providers
import { ThemeContextProvider } from "./context/theme";
import { CursorContextProvider } from "./context/cursor";
import { MenuContextProvider } from "./context/menu";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import GlobalStyles from "./styles/global";
import darkTheme from "./styles/themes/dark";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import dynamic from "next/dynamic";

const Cursor = dynamic(() => import("./components/shared/Cursor"), {
  ssr: false,
});

export default function ClientProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/landing";

  useEffect(() => {
    const root = document.documentElement;
    if (isLandingPage) {
      root.classList.add("landing-cursor");
    } else {
      root.classList.remove("landing-cursor");
    }

    return () => {
      root.classList.remove("landing-cursor");
    };
  }, [isLandingPage]);

  return (
    <SessionProvider session={session}>
      <ThemeContextProvider>
        <ThemeProvider theme={darkTheme}>
          <GlobalStyles />
          <MenuContextProvider>
            <CursorContextProvider>
              {isLandingPage ? <Cursor /> : null}
              {children}
            </CursorContextProvider>
          </MenuContextProvider>
        </ThemeProvider>
      </ThemeContextProvider>
    </SessionProvider>
  );
}
