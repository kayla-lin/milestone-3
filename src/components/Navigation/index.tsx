import React from "react";
import Logo from "../Logo";
import { Button, Layout, Menu, Space } from "antd";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SearchOutlined } from "@ant-design/icons";

const Navigation = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isStudent = session?.user?.roleID === 2;
  const homeLink = !isStudent ? "/app/instructor" : "/app/student";
  const logoLink = status === "unauthenticated" ? "/" : homeLink;

  return (
    <Layout.Header
      style={{
        background: "white",
        display: "flex",
        width: "100%",
        alignContent: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Link href={logoLink}>
          <Logo size="sm" />
        </Link>
      </div>

      <Menu
        selectedKeys={[router.pathname]}
        theme="light"
        mode="horizontal"
        style={{
          width: "500px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {status === "authenticated" ? (
          <>
            <Menu.Item key={homeLink}>
              <Link href={homeLink}>Home</Link>
            </Menu.Item>

            {isStudent && (
              <Menu.Item key="/app/student/enroll">
                <Space>
                  <SearchOutlined />
                  <Link href="/app/student/enroll">Courses</Link>
                </Space>
              </Menu.Item>
            )}

            <Menu.Item key="signout">
              <Button
                onClick={() => {
                  signOut();
                }}
              >
                Sign Out
              </Button>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key={"/auth/signin"}>
              <Link href="/auth/signin">Sign in</Link>
            </Menu.Item>
            <Menu.Item key={"/auth/signup"}>
              <Link href="/auth/signup">Sign up</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Layout.Header>
  );
};

export default Navigation;
