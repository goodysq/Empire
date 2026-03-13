import { prisma } from "../lib/db";

async function main() {
  // Upsert guides PageSection (so it appears in sections admin & is orderable)
  await prisma.pageSection.upsert({
    where: { key: "guides" },
    update: {},
    create: {
      key: "guides",
      titleZh: "攻略中心",
      titleEn: "Game Guides",
      subtitleZh: "从入门到精通，全面掌握游戏技巧",
      subtitleEn: "Master every aspect of the game",
      isVisible: true,
      isLocked: false,
      showInNav: false,
      order: 45, // after news (40), before download (50)
    },
  });
  console.log("✅ guides PageSection created/updated");

  // Seed a few example guides
  const existing = await prisma.guide.count();
  if (existing === 0) {
    await prisma.guide.createMany({
      data: [
        {
          titleZh: "新手入门完全指南",
          titleEn: "Complete Beginner's Guide",
          excerptZh: "零基础快速上手，掌握基本操作与核心玩法，让你在第一天就能建立强大帝国。",
          excerptEn: "Get up to speed quickly and master the core mechanics from day one.",
          category: "新手入门",
          isVisible: true,
          order: 0,
        },
        {
          titleZh: "英雄搭配与阵容攻略",
          titleEn: "Hero Synergy & Team Composition",
          excerptZh: "深度解析各英雄之间的协同效应，打造最强阵容组合，称霸战场。",
          excerptEn: "In-depth analysis of hero synergies and how to build the strongest team.",
          category: "英雄攻略",
          isVisible: true,
          order: 1,
        },
        {
          titleZh: "联盟战争策略指南",
          titleEn: "Alliance War Strategy Guide",
          excerptZh: "带领联盟走向胜利的战略思维，从进攻部署到防御布局，全方位提升联盟战斗力。",
          excerptEn: "Strategic thinking to lead your alliance to victory in large-scale battles.",
          category: "联盟策略",
          isVisible: true,
          order: 2,
        },
      ],
    });
    console.log("✅ 3 example guides seeded");
  } else {
    console.log(`ℹ️  ${existing} guides already exist, skipping seed`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
