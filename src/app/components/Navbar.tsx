"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState("en"); // Default locale

  const t = useTranslations("Navbar");

  useEffect(() => {
    // Extract the current locale from the pathname
    const currentLocale = pathname.split("/")[1];
    setLocale(currentLocale || "en");
  }, [pathname]);

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    // Navigate to the new locale, preserving the path after the locale
    router.push(`/${newLocale}${pathname.replace(/^\/[a-z]{2}/, "") || "/"}`);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold ">{t("chatgpt")}</h1>
      <select
        value={locale}
        onChange={handleLocaleChange}
        className="bg-gray-700 text-white py-2 px-4 rounded"
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </nav>
  );
}
