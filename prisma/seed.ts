import "dotenv/config";
import bcrypt from "bcryptjs";

async function main() {
  const { PrismaClient } = await import("../lib/generated/prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");

  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Starting database seed...");

  // 1. Admin user
  const hashedPassword = await bcrypt.hash("Admin123456", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@empire.com" },
    update: {},
    create: {
      email: "admin@empire.com",
      name: "管理员",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
  });
  console.log("✅ Admin user created");

  // 2. Heroes
  const heroes = [
    { nameZh: "亚历山大", nameEn: "Alexander", titleZh: "马其顿征服者", titleEn: "Macedonian Conqueror", descZh: "亚历山大大帝，马其顿王国的伟大征服者，建立了横跨欧亚非的庞大帝国。", descEn: "Alexander the Great, conqueror who built a vast empire spanning three continents.", imageUrl: "/art/characters/亚历山大.png", faction: "europe", rarity: "SSR", order: 1 },
    { nameZh: "秦始皇", nameEn: "Qin Shi Huang", titleZh: "千古一帝", titleEn: "First Emperor", descZh: "中国历史上第一位皇帝，统一六国，建立秦朝，开创了中央集权制度。", descEn: "The first emperor in Chinese history, unified the six kingdoms and pioneered centralized governance.", imageUrl: "/art/characters/秦始皇-临时.png", faction: "asia", rarity: "SSR", order: 2 },
    { nameZh: "布迪卡", nameEn: "Boudica", titleZh: "不列颠女王", titleEn: "Queen of Iceni", descZh: "伊塞尼部落的女王，率领不列颠人对抗罗马帝国的统治，是英国历史上的民族英雄。", descEn: "Queen of the Iceni tribe, led the Britons against Roman rule.", imageUrl: "/art/characters/布迪卡-带英雄.png", faction: "europe", rarity: "SSR", order: 3 },
    { nameZh: "善德女王", nameEn: "Queen Seondeok", titleZh: "新罗女王", titleEn: "Queen of Silla", descZh: "新罗王国第一位女性君主，以智慧和外交手腕著称，推动了新罗文化的繁荣发展。", descEn: "First female monarch of the Silla Kingdom, known for wisdom and diplomacy.", imageUrl: "/art/characters/善德女王-女王.png", faction: "asia", rarity: "SSR", order: 4 },
    { nameZh: "华莱士", nameEn: "William Wallace", titleZh: "苏格兰守护者", titleEn: "Guardian of Scotland", descZh: "苏格兰独立战争的英雄，率领苏格兰军队对抗英格兰统治，被誉为苏格兰的民族英雄。", descEn: "Hero of the Scottish War of Independence, led the army against English rule.", imageUrl: "/art/characters/华莱士.png", faction: "europe", rarity: "SR", order: 5 },
    { nameZh: "吉尔伽美什", nameEn: "Gilgamesh", titleZh: "乌鲁克之王", titleEn: "King of Uruk", descZh: "苏美尔史诗中的英雄，乌鲁克城的伟大国王，寻求永生之谜的传奇人物。", descEn: "Hero of the Sumerian epic, great king of Uruk who sought the secret of immortality.", imageUrl: "/art/characters/吉尔伽-临时.png", faction: "middleeast", rarity: "SSR", order: 6 },
    { nameZh: "托米里斯", nameEn: "Tomyris", titleZh: "马萨革泰女王", titleEn: "Queen of Massagetae", descZh: "马萨革泰部落的女王，击败并杀死了波斯皇帝居鲁士大帝，保卫了自己的民族。", descEn: "Queen of the Massagetae, defeated and killed the Persian Emperor Cyrus the Great.", imageUrl: "/art/characters/托米里斯.png", faction: "middleeast", rarity: "SSR", order: 7 },
    { nameZh: "特丽布瓦娜", nameEn: "Tribhuvana", titleZh: "满者伯夷女王", titleEn: "Queen of Majapahit", descZh: "满者伯夷帝国的女王，在位期间帝国版图不断扩张，成为东南亚历史上最伟大的帝国之一。", descEn: "Queen of the Majapahit Empire, expanded the realm into one of Southeast Asia's greatest empires.", imageUrl: "/art/characters/特丽布瓦娜.png", faction: "asia", rarity: "SR", order: 8 },
    { nameZh: "狄多女王", nameEn: "Queen Dido", titleZh: "迦太基创始者", titleEn: "Founder of Carthage", descZh: "迦太基城的传奇创始人，以智慧和谋略建立了北非最强大的海上帝国。", descEn: "Legendary founder of Carthage, built the most powerful maritime empire in North Africa.", imageUrl: "/art/characters/狄多女王-临时.png", faction: "middleeast", rarity: "SR", order: 9 },
    { nameZh: "腓特烈", nameEn: "Frederick", titleZh: "神圣罗马皇帝", titleEn: "Holy Roman Emperor", descZh: "神圣罗马帝国皇帝腓特烈一世，外号巴巴罗萨（红胡子），第三次十字军东征的领袖。", descEn: "Frederick I Barbarossa, Holy Roman Emperor and leader of the Third Crusade.", imageUrl: "/art/characters/腓特烈-临时.png", faction: "europe", rarity: "SR", order: 10 },
    { nameZh: "阿尔特米西亚", nameEn: "Artemisia", titleZh: "哈利卡纳苏斯女王", titleEn: "Queen of Halicarnassus", descZh: "哈利卡纳苏斯的女王和海军指挥官，在萨拉米斯海战中率领波斯舰队，是历史上著名的女性军事领袖。", descEn: "Queen and naval commander of Halicarnassus, led Persian fleet at the Battle of Salamis.", imageUrl: "/art/characters/阿尔特米西亚.png", faction: "europe", rarity: "SR", order: 11 },
    { nameZh: "丰臣秀吉", nameEn: "Toyotomi Hideyoshi", titleZh: "太阁", titleEn: "The Taiko", descZh: "日本战国时代的统一者，从普通农民出身成为掌握日本最高权力的太阁，开创了桃山时代。", descEn: "Unifier of Japan's Warring States, rose from peasant to the most powerful ruler in Japan.", imageUrl: "/art/characters/Y英雄-丰臣秀吉.png", faction: "asia", rarity: "SSR", order: 12 },
    { nameZh: "大卫王", nameEn: "King David", titleZh: "以色列之王", titleEn: "King of Israel", descZh: "以色列王国的第二位国王，击败巨人歌利亚的英勇战士，将以色列统一成强大的王国。", descEn: "Second king of Israel, the warrior who defeated Goliath and united the kingdom.", imageUrl: "/art/characters/最新大卫王-临时.jpg", faction: "middleeast", rarity: "SSR", order: 13 },
  ];

  for (const hero of heroes) {
    const existing = await prisma.hero.findFirst({ where: { nameEn: hero.nameEn } });
    if (!existing) {
      await prisma.hero.create({ data: hero });
    }
  }
  console.log(`✅ ${heroes.length} heroes created`);

  // 3. Page sections
  const sections = [
    { key: "hero",           titleZh: "帝国纪元",     titleEn: "Empire Chronicles",    subtitleZh: "纵横千古，逐鹿天下",             subtitleEn: "Command History. Conquer the World.",                    order: 10 },
    { key: "features",       titleZh: "游戏特色",     titleEn: "Game Features",        subtitleZh: "五大核心优势，打造极致帝国体验",    subtitleEn: "Five core advantages for the ultimate empire experience", order: 20 },
    { key: "video",          titleZh: "精彩视频",     titleEn: "Featured Video",       subtitleZh: "观看游戏宣传片",                 subtitleEn: "Watch the game trailer",                                 order: 25 },
    { key: "heroes_gallery", titleZh: "传奇英雄",     titleEn: "Legendary Heroes",     subtitleZh: "跨越时空，群雄荟萃",             subtitleEn: "Across Time, United in Glory",                          order: 30 },
    { key: "world",          titleZh: "联盟世界",     titleEn: "Alliance World",       subtitleZh: "四大文明圈，史诗战场",            subtitleEn: "Four Civilizations, Epic Battlefields",                  order: 40 },
    { key: "news",           titleZh: "最新资讯",     titleEn: "Latest News",          subtitleZh: "精彩内容，随时掌握",             subtitleEn: "Stay Updated, Stay Ahead",                              order: 50 },
    { key: "download",       titleZh: "立即开始征途", titleEn: "Begin Your Journey",   subtitleZh: "加入全球数百万玩家",             subtitleEn: "Join millions of players worldwide",                    order: 60 },
  ];

  for (const section of sections) {
    await prisma.pageSection.upsert({ where: { key: section.key }, update: { order: section.order }, create: section });
  }
  console.log(`✅ ${sections.length} page sections created`);

  // 4. Nav items
  const navItems = [
    { labelZh: "英雄", labelEn: "Heroes", href: "#heroes", order: 1 },
    { labelZh: "文明", labelEn: "Civilizations", href: "#world", order: 2 },
    { labelZh: "资讯", labelEn: "News", href: "#news", order: 3 },
    { labelZh: "下载", labelEn: "Download", href: "#download", order: 4 },
  ];

  for (const item of navItems) {
    const existing = await prisma.navItem.findFirst({ where: { href: item.href } });
    if (!existing) await prisma.navItem.create({ data: item });
  }
  console.log(`✅ ${navItems.length} nav items created`);

  // 5. Site settings
  const settings = [
    { key: "game_name_zh", value: "帝国纪元", labelZh: "游戏名称（中文）", group: "general" },
    { key: "game_name_en", value: "Empire Chronicles", labelEn: "Game Name (EN)", group: "general" },
    { key: "site_tagline_zh", value: "纵横千古，逐鹿天下", labelZh: "网站标语", group: "general" },
    { key: "site_tagline_en", value: "Command History. Conquer the World.", labelEn: "Tagline", group: "general" },
    { key: "ios_link", value: "https://apps.apple.com", labelZh: "App Store 链接", group: "download" },
    { key: "android_link", value: "https://play.google.com", labelZh: "Google Play 链接", group: "download" },
    { key: "weibo_url", value: "", labelZh: "微博", group: "social" },
    { key: "wechat_id", value: "", labelZh: "微信公众号链接", group: "social" },
    { key: "tiktok_url", value: "", labelZh: "抖音/TikTok", group: "social" },
    { key: "youtube_url", value: "", labelZh: "YouTube", group: "social" },
    { key: "twitter_url", value: "", labelZh: "Twitter/X", group: "social" },
    { key: "discord_url", value: "", labelZh: "Discord", group: "social" },
    { key: "telegram_url", value: "", labelZh: "Telegram", group: "social" },
    { key: "privacy_url", value: "", labelZh: "隐私政策链接", group: "links" },
    { key: "terms_url", value: "", labelZh: "用户协议链接", group: "links" },
    { key: "contact_url", value: "", labelZh: "联系我们链接", group: "links" },
    { key: "faq_url", value: "", labelZh: "常见问题链接", group: "links" },
    { key: "seo_title_zh", value: "帝国纪元 - 史诗策略手游", labelZh: "SEO 标题", group: "seo" },
    { key: "seo_title_en", value: "Empire Chronicles - Epic Strategy Game", labelEn: "SEO Title", group: "seo" },
    { key: "video_url", value: "", labelZh: "游戏宣传视频链接（YouTube/Bilibili 嵌入地址）", labelEn: "Game Trailer Video URL (YouTube/Bilibili embed)", group: "general" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({ where: { key: setting.key }, update: {}, create: setting });
  }
  console.log(`✅ ${settings.length} site settings created`);

  // 6. Sample news articles
  const newsArticles = [
    {
      titleZh: "1.5版本更新：全新英雄「托米里斯」震撼登场",
      titleEn: "Version 1.5 Update: New Hero 'Tomyris' Makes Grand Debut",
      excerptZh: "全新女王英雄托米里斯携带独特的骑射技能加入战场，同时带来全面优化的战斗系统与全新的赛季玩法。",
      excerptEn: "The new queen hero Tomyris joins the battlefield with unique mounted archery skills.",
      contentZh: "# 1.5版本更新说明\n\n亲爱的帝国领主们，今日起，帝国纪元1.5版本正式上线！\n\n## 新英雄：托米里斯\n\n马萨革泰女王托米里斯正式加入英雄行列！",
      contentEn: "# Version 1.5 Update Notes\n\nDear Empire Lords, Empire Chronicles 1.5 is officially live!\n\n## New Hero: Tomyris\n\nQueen Tomyris officially joins the hero roster!",
      isPublished: true,
      publishedAt: new Date("2024-03-15"),
    },
    {
      titleZh: "春季联盟战争活动：百万奖励等你来拿",
      titleEn: "Spring Alliance War Event: Million Rewards Await",
      excerptZh: "春季限定联盟战争活动正式开启，参与排名前三的联盟将获得独家英雄皮肤与海量资源奖励。",
      excerptEn: "The spring limited alliance war event is now open. Top alliances will receive exclusive hero skins.",
      contentZh: "# 春季联盟战争活动\n\n活动时间：2024年3月10日 - 3月31日\n\n丰厚奖励等你来拿！",
      contentEn: "# Spring Alliance War Event\n\nEvent Duration: March 10 - March 31, 2024\n\nRich rewards await!",
      isPublished: true,
      publishedAt: new Date("2024-03-10"),
    },
    {
      titleZh: "世界观解析：亚特兰蒂斯文明的消失之谜",
      titleEn: "Lore Deep Dive: The Mystery of Atlantis Civilization",
      excerptZh: "探索帝国纪元世界中亚特兰蒂斯文明的起源与消亡，揭开这片神秘大陆背后隐藏的史诗故事。",
      excerptEn: "Explore the origin and fall of Atlantis civilization in Empire Chronicles.",
      contentZh: "# 亚特兰蒂斯文明世界观解析\n\n在帝国纪元的宏大世界观中，亚特兰蒂斯并非仅仅是传说...",
      contentEn: "# Atlantis Civilization Lore Analysis\n\nIn the grand world of Empire Chronicles, Atlantis is not merely a legend...",
      isPublished: true,
      publishedAt: new Date("2024-03-05"),
    },
  ];

  for (const article of newsArticles) {
    const existing = await prisma.news.findFirst({ where: { titleZh: article.titleZh } });
    if (!existing) await prisma.news.create({ data: article });
  }
  console.log(`✅ ${newsArticles.length} news articles created`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("Admin credentials: admin@empire.com / Admin123456");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
