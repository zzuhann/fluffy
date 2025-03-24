import { Metadata } from "next";
import Header from "src/component/Header";
import { Providers } from "src/reducers/providers";
import SideNotification from "src/component/SideNotification";
import { GlobalStyle } from "./ui/globalStyle";
import StyledJsxRegistry from "./registry";

export const metadata: Metadata = {
  title: "Fluffy",
  description: "Fluffy is the best!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <StyledJsxRegistry>
          <Providers>
            <GlobalStyle />
            <Header />
            <SideNotification />
            {children}
            <noscript>You need to enable JavaScript to run this app.</noscript>
          </Providers>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
