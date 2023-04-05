import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import { Layout } from "antd";
import Navigation from "~/components/Navigation";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // ! DELETE THIS
  //document?.body.style.margin = "0px";
  return (
    <SessionProvider session={session}>
      <Layout>
        <Navigation />
        <Layout.Content style={{ padding: "0 50px", minHeight: "100vh" }}>
          <Component {...pageProps} />
        </Layout.Content>
        <Layout.Footer style={{ textAlign: "center" }}>
          CSC 261 - Milestone 3 by Kayla Lin & Amaan Mujtaba Jaweed
        </Layout.Footer>
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
