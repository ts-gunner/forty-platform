import config, { ICONS_MAP } from "@/constants/config";
import React from "react";
import { Link } from "umi";
import GridShape from "../../components/common/GridShape";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4 flex items-center gap-2">
                <img width={48} height={48} src={ICONS_MAP.navbarLogoDark} alt="Logo" />
                <span className="text-white font-bold text-3xl">{config.title}</span>
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">Do yourself.</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/4 -translate-x-1/2 z-10">
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            粤ICP备2021141816号
          </a>
        </div>
      </div>
    </div>
  );
}
