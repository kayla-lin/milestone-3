import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user.roleID === 1) {
      router.push("/app/instructor");
    }
    if (session?.user.roleID === 2) {
      router.push("/app/student");
    } else {
      router.push("/auth/signin");
    }
  }, [session]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      {status === "loading" && <Spin size="large" />}
    </div>
  );
};

export default Home;
