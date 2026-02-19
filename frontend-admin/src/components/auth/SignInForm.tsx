import { useEffect, useRef, useState } from "react";
import { Link } from "umi";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useIntl } from "react-intl";
import { ICONS_MAP } from "@/constants/config";
import { Smartphone } from "lucide-react";
import { Loader } from "../ui/loading/Loader";

export default function SignInForm({ 
  pwdLogin,
  loading
 }: { pwdLogin: (username: string, password: string) => void, loading: boolean

  }) {
  const intl = useIntl();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formValues, setFormValues] = useState({
    account: "", // 账号
    password: "", // 密码
  });
  useEffect(() => {
    let userForm = localStorage.getItem("userForm")
    if (userForm) {
      try {
        let formObj = JSON.parse(userForm)
        setIsChecked(formObj.isChecked)
        setFormValues({
          account: formObj.account,
          password: formObj.password,
        })
      }finally {
      }
    }
  }, [])
  useEffect(() => {
    if (isChecked) {
      localStorage.setItem("userForm", JSON.stringify({
        ...formValues,
        isChecked,
      }))
    }else {
      let form = localStorage.getItem("userForm")
      if (form !== null) {
        localStorage.removeItem("userForm")
      }
    }
  }, [formValues, isChecked])
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {intl.formatMessage({ id: "pages.login.header" })}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{intl.formatMessage({ id: "pages.login.description" })}</p>
          </div>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                pwdLogin(formValues.account, formValues.password);
              }}
            >
              <div className="space-y-6">
                <div>
                  <Label>
                    {intl.formatMessage({ id: "pages.login.form.account" })}
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    value={formValues.account}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, account: e.target.value }))}
                    placeholder={intl.formatMessage({ id: "pages.login.form.account.placeholder" })}
                  />
                </div>
                <div>
                  <Label>
                    {intl.formatMessage({ id: "pages.login.form.password" })}
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      value={formValues.password}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, password: e.target.value }))}
                      type={showPassword ? "text" : "password"}
                      placeholder={intl.formatMessage({ id: "pages.login.form.account.password" })}
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      {intl.formatMessage({ id: "pages.login.form.keep_login" })}
                    </span>
                  </div>
                  <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                    {intl.formatMessage({ id: "pages.login.form.forget_pwd" })}
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    {
                      loading && <Loader variant="circular" className="h-5"/>
                    }
                    {intl.formatMessage({ id: "pages.login.form.sign_in" })}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
