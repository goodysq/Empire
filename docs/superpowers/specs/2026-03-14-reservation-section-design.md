# 预约板块设计文档

**日期：** 2026-03-14
**功能：** 公测预约 — 收集玩家邮箱，公测开始时通知

---

## 目标

在游戏官网 landing page 新增预约板块，供玩家填写邮箱预约公测资格。后台管理员可查看预约列表并导出 CSV。

---

## 数据层

### Prisma 模型

```prisma
model Reservation {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
}
```

### API 路由

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/api/reservations` | 公开 | 提交邮箱预约 |
| GET | `/api/reservations` | 需登录 | 获取全部预约列表 |
| GET | `/api/reservations/export` | 需登录 | 下载 CSV 文件 |

### 业务规则

- 邮箱格式校验在前后端各做一遍
- 重复邮箱返回 HTTP 409，提示"该邮箱已预约"
- 邮箱不写入审计日志（隐私保护）

---

## 前端组件

### ReservationSection

**位置：** landing page，插入在 `NewsSection` 之后、`DownloadSection` 之前

**视觉风格：** 沿用现有暗金色主题（背景 `#0A0806`，金色强调 `#C9A84C`，Cinzel 字体标题）

**布局：**
- 全宽深色背景，内容居中
- 标题（Cinzel）+ 副标题说明
- 邮箱输入框 + 提交按钮（桌面横排，移动端竖排）
- 提交后就地显示提示，不跳转、不刷页

**交互状态：**

| 状态 | 表现 |
|------|------|
| 默认 | 输入框 + 提交按钮 |
| 加载中 | 按钮显示 loading 动画，禁用输入 |
| 成功 | 绿色提示："预约成功！我们会在公测开始时通知您" |
| 重复邮箱 | 黄色提示："该邮箱已预约" |
| 格式错误 | 红色提示："请输入有效的邮箱地址" |

**多语言：** 中文 / 繁中 / 英文，通过现有 `loc()` 工具函数处理

---

## Admin 管理页面

**路径：** `/admin/reservations`
**导航：** 加入左侧 AdminSidebar

**功能：**
- 顶部显示总预约人数
- 表格：邮箱 / 预约时间，按时间倒序排列
- **导出 CSV** 按钮：点击下载 `reservations.csv`，包含所有邮箱和时间
- 无编辑/删除功能（数据只读）

**样式：** 与现有 Admin 页面保持一致

---

## 文件清单

### 新增文件
- `prisma/migrations/xxxx_add_reservation/migration.sql`
- `app/api/reservations/route.ts` — POST / GET
- `app/api/reservations/export/route.ts` — CSV 导出
- `components/website/ReservationSection.tsx` — 前端预约组件
- `app/admin/reservations/page.tsx` — Admin 管理页

### 修改文件
- `prisma/schema.prisma` — 新增 Reservation 模型
- `app/[locale]/page.tsx` — 插入 ReservationSection
- `components/admin/AdminSidebar.tsx` — 加入预约导航项
- `messages/zh.json` / `messages/zh-TW.json` / `messages/en.json` — 新增翻译文本

---

## 不在范围内

- 邮件发送功能（仅收集，不自动发邮件）
- 预约删除/编辑
- 用户账号系统
