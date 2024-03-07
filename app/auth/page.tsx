"use client";
import { deleteCookie, getCookie } from "cookies-next";
import { useLayoutEffect, useState } from "react";
import { login, signup } from "./actions";
import { Box, Button, Center, Divider, Title } from "@mantine/core";
import { LoginForm, SignupForm } from "./authForm";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isAllValid, setIsAllValid] = useState<boolean>(false);

  function toggle() {
    const newAuthMode = authMode === "login" ? "signup" : "login";
    setAuthMode(newAuthMode);
    window.history.replaceState(null, "", `/${newAuthMode}`);
  }

  useLayoutEffect(() => {
    const cookieAuthMode = getCookie("authmode") ?? "login";
    console.log(`[page.tsx] CookieAuthMode: ${getCookie("authmode")}`);
    setAuthMode(cookieAuthMode);
    window.history.replaceState(null, "", `/${cookieAuthMode}`);
    // setTimeout(() => {
    //   // deleteCookie("authmode");
    // }, 1000);
    // router.refresh();
  }, []);

  async function callLogin() {
    try {
      await login(email, password);
    } catch (error: any) {
      console.error(error.message);
      alert(error.message);
    }
  }
  async function callSignup() {
    const result = await signup(email, password);
    if (result.isError) {
      console.error(result.message);
      alert(result.message);
    } else {
      if (result.statusCode === "01") {
        alert(
          "新規登録されました!\n入力されたメールアドレスに、認証リンクが送信されています\n迷惑メールに振り分けられていないか注意してください"
        );
      } else {
        alert("存在し得ないエラーが発生しているようです");
      }
    }
  }
  return (
    <>
      <Center>
        <Box maw="500px" w="95%" px="2.5%">
          <Title order={2} c="gray.7" pb={5}>
            {authMode === "login" ? "ログイン" : "新規登録"}
          </Title>
          {authMode === "login" ? (
            <LoginForm
              email={email}
              setEmail={(newState: string) => setEmail(newState)}
              password={password}
              setPassword={(newState: string) => setPassword(newState)}
              setIsAllValid={(newState: boolean) => setIsAllValid(newState)}
            />
          ) : (
            <SignupForm
              email={email}
              setEmail={(newState: string) => setEmail(newState)}
              password={password}
              setPassword={(newState: string) => setPassword(newState)}
              setIsAllValid={(newState: boolean) => setIsAllValid(newState)}
            />
          )}
          <Divider my={15} />
          {authMode === "login" ? (
            <div>
              <Button
                fullWidth
                my={3}
                disabled={!isAllValid}
                onClick={() => callLogin()}
              >
                ログイン
              </Button>
              <Button
                fullWidth
                my={3}
                variant="default"
                onClick={() => toggle()}
              >
                新規登録に切り替える
              </Button>
            </div>
          ) : (
            <div>
              <Button
                fullWidth
                my={3}
                disabled={!isAllValid}
                onClick={() => callSignup()}
              >
                新規登録
              </Button>
              <Button
                fullWidth
                my={3}
                variant="default"
                onClick={() => toggle()}
              >
                ログインに切り替える
              </Button>
            </div>
          )}
        </Box>
      </Center>
    </>
  );
}
