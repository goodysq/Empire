"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Globe, Download, Share2, Search } from "lucide-react";

interface Setting {
  key: string;
  value: string;
  labelZh?: string;
  labelEn?: string;
  group?: string;
}

const tabs = [
  { key: "general", label: "通用设置", icon: Globe },
  { key: "download", label: "下载链接", icon: Download },
  { key: "social", label: "社交媒体", icon: Share2 },
  { key: "seo", label: "SEO 设置", icon: Search },
];

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data: Setting[] = await res.json();
    const map: Record<string, string> = {};
    data.forEach((s) => {
      map[s.key] = s.value;
    });
    setSettings(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const fieldGroups: Record<string, { key: string; label: string; placeholder?: string; type?: string }[]> = {
    general: [
      { key: "logo_url", label: "游戏 Logo 图片地址（留空使用默认图标）", placeholder: "https://..." },
      { key: "game_name_zh", label: "游戏名称（中文）", placeholder: "帝国纪元" },
      { key: "game_name_en", label: "游戏名称（英文）", placeholder: "Empire Chronicles" },
      { key: "site_tagline_zh", label: "网站标语（中文）", placeholder: "纵横千古，逐鹿天下" },
      { key: "site_tagline_en", label: "网站标语（英文）", placeholder: "Command History. Conquer the World." },
      { key: "contact_email", label: "联系邮箱", placeholder: "contact@empire.com", type: "email" },
      { key: "video_url", label: "游戏宣传视频链接（YouTube/Bilibili 嵌入地址，如 https://www.youtube.com/embed/xxxxx）", placeholder: "https://www.youtube.com/embed/..." },
    ],
    download: [
      { key: "ios_link", label: "App Store 链接", placeholder: "https://apps.apple.com/..." },
      { key: "android_link", label: "Google Play 链接", placeholder: "https://play.google.com/..." },
      { key: "apk_link", label: "APK 直链", placeholder: "https://..." },
    ],
    social: [
      { key: "discord_url", label: "Discord", placeholder: "https://discord.gg/..." },
      { key: "telegram_url", label: "Telegram", placeholder: "https://t.me/..." },
      { key: "youtube_url", label: "YouTube", placeholder: "https://youtube.com/..." },
      { key: "twitter_url", label: "Twitter / X", placeholder: "https://twitter.com/..." },
      { key: "tiktok_url", label: "抖音 / TikTok", placeholder: "https://..." },
      { key: "weibo_url", label: "微博", placeholder: "https://weibo.com/..." },
      { key: "wechat_id", label: "微信公众号链接", placeholder: "https://mp.weixin.qq.com/..." },
    ],
    seo: [
      { key: "seo_title_zh", label: "SEO 标题（中文）", placeholder: "帝国纪元 - 史诗策略手游" },
      { key: "seo_title_en", label: "SEO 标题（英文）", placeholder: "Empire Chronicles - Epic Strategy Game" },
      { key: "seo_description_zh", label: "SEO 描述（中文）", placeholder: "纵横千古..." },
      { key: "seo_description_en", label: "SEO 描述（英文）", placeholder: "Command History..." },
      { key: "seo_keywords", label: "关键词", placeholder: "strategy game, mobile slg, empire..." },
    ],
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-400">加载中...</div>;
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">站点设置</h1>
          <p className="text-gray-400 text-sm mt-0.5">管理网站全局配置</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${
            saved
              ? "bg-green-500 text-white"
              : "bg-[#C9A84C] hover:bg-[#E8C96A] text-black"
          } disabled:opacity-50`}
        >
          <Save size={14} />
          {saving ? "保存中..." : saved ? "已保存!" : "保存设置"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
              activeTab === tab.key
                ? "text-[#E8C96A] border-[#C9A84C]"
                : "text-gray-400 border-transparent hover:text-gray-200"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5 space-y-4">
        {fieldGroups[activeTab]?.map((field) => (
          <div key={field.key}>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              value={settings[field.key] || ""}
              onChange={(e) => updateSetting(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-gray-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
