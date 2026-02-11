import { useState, useEffect } from "react";
import Button from "../../components/ui/button/Button";
import { Modal } from "antd";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
  initialData?: any;
  title: string;
}

const UserForm = ({ isOpen, onClose, onSubmit, initialData, title }: UserFormProps) => {
  // Initialize form data based on initialData if provided, otherwise empty
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nickname: "",
    isAdmin: false,
    email: "",
    phone: "",
    status: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data whenever initialData changes or when component mounts with initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.account || initialData.username || "",
        password: "", // Always reset password when editing
        nickname: initialData.nickname || "",
        isAdmin: initialData.isAdmin || false,
        email: initialData.email || "",
        phone: initialData.phone || "",
        status: initialData.status || 0,
      });
    } else {
      // Reset form when no initialData (add mode)
      setFormData({
        username: "",
        password: "",
        nickname: "",
        isAdmin: false,
        email: "",
        phone: "",
        status: 0,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) {
      newErrors.username = "账号是必填项";
    }
    if (!formData.password.trim() && (title === "Add User" || title === "添加用户")) {
      newErrors.password = "密码是必填项";
    }
    if (!formData.nickname.trim()) {
      newErrors.nickname = "昵称是必填项";
    }
    if (!formData.email.trim()) {
      newErrors.email = "邮箱是必填项";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "邮箱格式不正确";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      className="w-full max-w-md p-6"
    >
      <div>
        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              账号
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.username ? "border-red-500" : "border-gray-200"
              } rounded-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              placeholder="请输入账号"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          {/* Password Field */}
          {(title === "Add User" || title === "添加用户") && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                密码
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } rounded-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                placeholder="请输入密码"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}
          {/* Nickname Field */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              昵称
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.nickname ? "border-red-500" : "border-gray-200"
              } rounded-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              placeholder="请输入昵称"
            />
            {errors.nickname && (
              <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>
            )}
          </div>

          {/* Is Admin Field */}
          <div>
            <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={(e) => setFormData(prev => ({ ...prev, isAdmin: e.target.checked }))}
                className="w-5 h-5 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              管理员
            </label>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              邮箱
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } rounded-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              placeholder="请输入邮箱"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              手机号
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="请输入手机号"
            />
          </div>

          {/* Status Field */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              状态
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg bg-white dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value={0}>不可用</option>
                <option value={1}>可用</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <Button
              variant="outline"
              className="flex-1 py-3"
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              variant="primary"
              className="flex-1 py-3"
              onClick={() => {
                if (validateForm()) {
                  onSubmit(formData);
                  onClose();
                }
              }}
            >
              {(title === "Add User" || title === "添加用户") ? "添加" : "更新"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UserForm;
