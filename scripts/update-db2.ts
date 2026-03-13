import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  // Add logo_url setting
  await prisma.siteSetting.upsert({
    where: { key: "logo_url" },
    update: {},
    create: { key: "logo_url", value: "", labelZh: "游戏Logo地址", group: "general" },
  });
  console.log("✅ logo_url setting added");

  // Add support page sections
  const supportSections = [
    {
      key: "support_privacy",
      titleZh: "隐私政策",
      titleEn: "Privacy Policy",
      contentZh: "<p>我们重视您的隐私。本隐私政策说明我们如何收集、使用和保护您的个人信息。</p><p>请在后台版块管理中编辑完善此内容。</p>",
      contentEn: "<p>We value your privacy. This policy explains how we collect, use, and protect your information.</p><p>Please edit this content in admin → Sections.</p>",
      order: 100,
    },
    {
      key: "support_terms",
      titleZh: "用户协议",
      titleEn: "Terms of Service",
      contentZh: "<p>欢迎使用帝国纪元。使用本服务即表示您同意以下条款。</p><p>请在后台版块管理中编辑完善此内容。</p>",
      contentEn: "<p>Welcome to Empire Chronicles. By using this service, you agree to these terms.</p><p>Please edit this content in admin → Sections.</p>",
      order: 101,
    },
    {
      key: "support_contact",
      titleZh: "联系我们",
      titleEn: "Contact Us",
      contentZh: "<p>如有任何问题或建议，请通过以下方式联系我们：</p><ul><li>邮箱：contact@empire.com</li></ul><p>请在后台版块管理中编辑完善此内容。</p>",
      contentEn: "<p>If you have any questions, please contact us:</p><ul><li>Email: contact@empire.com</li></ul><p>Please edit this content in admin → Sections.</p>",
      order: 102,
    },
    {
      key: "support_faq",
      titleZh: "常见问题",
      titleEn: "FAQ",
      contentZh: "<p><strong>Q: 游戏如何下载？</strong></p><p>A: 请在首页点击下载按钮，选择对应平台下载。</p><p>请在后台版块管理中编辑完善此内容。</p>",
      contentEn: "<p><strong>Q: How do I download the game?</strong></p><p>A: Visit the home page and click the download button for your platform.</p><p>Please edit this content in admin → Sections.</p>",
      order: 103,
    },
  ];

  for (const s of supportSections) {
    await prisma.pageSection.upsert({
      where: { key: s.key },
      update: {},
      create: { ...s, isVisible: true, isLocked: false },
    });
  }
  console.log("✅ Support page sections added");

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
