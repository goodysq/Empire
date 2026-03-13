import { prisma } from "../lib/db";

async function main() {
  // Show current NavItems
  const navItems = await prisma.navItem.findMany({ orderBy: { order: "asc" } });
  console.log("Current NavItems:", JSON.stringify(navItems, null, 2));

  // Fix "世界观" → "文明"
  for (const item of navItems) {
    if (item.labelZh === "世界观") {
      await prisma.navItem.update({
        where: { id: item.id },
        data: { labelZh: "文明", labelEn: "Civilizations" },
      });
      console.log(`Updated nav item: 世界观 → 文明`);
    }
  }

  // Fix news section subtitle
  const newsSection = await prisma.pageSection.findUnique({ where: { key: "news" } });
  console.log("News section subtitleZh:", newsSection?.subtitleZh);

  if (newsSection && newsSection.subtitleZh?.includes("帝国动态")) {
    await prisma.pageSection.update({
      where: { key: "news" },
      data: { subtitleZh: "精彩内容，随时掌握" },
    });
    console.log("Updated news subtitle: 帝国动态，实时更新 → 精彩内容，随时掌握");
  }

  // Verify
  const updated = await prisma.navItem.findMany({ orderBy: { order: "asc" } });
  console.log("Updated NavItems:", JSON.stringify(updated, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
