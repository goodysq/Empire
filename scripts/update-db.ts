import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  // Update nav item 世界观 → 文明
  await prisma.navItem.updateMany({
    where: { href: "#world" },
    data: { labelZh: "文明", labelEn: "Civilizations" },
  });
  console.log("✅ Nav item updated");

  // Update news section subtitle
  await prisma.pageSection.update({
    where: { key: "news" },
    data: { subtitleZh: "精彩内容，随时掌握", subtitleEn: "Stay Updated, Stay Ahead" },
  });
  console.log("✅ News section subtitle updated");

  // Add new settings
  const newSettings = [
    { key: "twitter_url", value: "", labelZh: "Twitter/X", group: "social" },
    { key: "discord_url", value: "", labelZh: "Discord", group: "social" },
    { key: "telegram_url", value: "", labelZh: "Telegram", group: "social" },
    { key: "privacy_url", value: "", labelZh: "隐私政策链接", group: "links" },
    { key: "terms_url", value: "", labelZh: "用户协议链接", group: "links" },
    { key: "contact_url", value: "", labelZh: "联系我们链接", group: "links" },
    { key: "faq_url", value: "", labelZh: "常见问题链接", group: "links" },
  ];

  for (const s of newSettings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log("✅ New settings added");

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
