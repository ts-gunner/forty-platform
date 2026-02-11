import SignInForm from "@/components/auth/SignInForm";
import PageMeta from "@/components/common/PageMeta";
import config from "@/constants/config";
import { doLogin } from "@/services/steins-admin/authController";
import { encryptMd5, handleResponse, Notify } from "@/utils/common";
import { useState } from "react";
import { useIntl } from "react-intl";
import { history } from "umi";
import AuthLayout from "./AuthPageLayout";
export default function SignIn() {
  const intl = useIntl();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const pwdLogin = async (account: string, pwd: string) => {
    setBtnLoading(true);
    if (!account || !pwd) {
      Notify.fail(intl.formatMessage({ id: "pages.login.not_allow_null" }));

      setBtnLoading(false);
      return;
    }
    const resp = await doLogin({
      username: account,
      password: encryptMd5(pwd),
    });
    handleResponse({
      resp: resp,
      onSuccess: () => {
        Notify.ok(resp.msg || "");

        history.push("/");
        localStorage.setItem("token", resp.data?.token || "");
      },
      onError: () => {
        Notify.fail(resp.msg || "");
      },
    });

    setBtnLoading(false);
  };
  return (
    <>
      <PageMeta title={`${config.title} | 登录`} description={config.description} />
      <AuthLayout>
        <SignInForm pwdLogin={pwdLogin} loading={btnLoading} />
      </AuthLayout>
    </>
  );
}
