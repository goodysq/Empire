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
  email     String   @unique @db.VarChar(254)
  createdAt DateTime @default(now())

  @@index([createdAt])
}
```

### API 路由

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/api/reservations` | 公开（有速率限制） | 提交邮箱预约 |
| GET | `/api/reservations` | `requireAdmin()` | 获取预约列表（分页） |
| GET | `/api/reservations/export` | `requireAdmin()` | 下载 CSV 文件 |

> **权限说明：** GET 列表和导出均使用 `requireAdmin()`（role === "admin"），而非普通编辑权限，防止邮箱列表泄露。

### 业务规则

- **邮箱规范化：** 存入前统一转小写（`email.toLowerCase().trim()`），避免大小写重复
- **邮箱长度限制：** 前端 input 设置 `maxLength={254}`，后端校验长度 ≤ 254 字符（RFC 5321 上限）
- **格式校验：** 前后端均用正则校验邮箱格式
- **重复邮箱：** 返回 HTTP 409，前端提示"该邮箱已预约"（黄色，非错误色）
- **邮箱不写入审计日志**（隐私保护）
- 预约数据为只读，不提供删除/编辑接口（GDPR 删除权待后续版本处理）

### 速率限制

`POST /api/reservations` 为公开接口，复用项目现有的内存速率限制模式（参考 `lib/auth.ts`），按 IP 限制：**同一 IP 每 10 分钟最多提交 5 次**，超限返回 HTTP 429。

> **限制说明：** 内存速率限制仅适用于单进程部署（项目当前为 PM2 单进程）。若未来横向扩展为多进程/多实例，需迁移至共享存储方案（如 Redis）。

---

## 前端组件

### ReservationSection

**位置：** landing page，硬编码插入在 `NewsSection` 之后、`DownloadSection` 之前（不通过数据库 section 系统管理，原因：该板块内容固定，不需要 CMS 编辑）

**视觉风格：** 沿用现有暗金色主题（背景 `#0A0806`，金色强调 `#C9A84C`，Cinzel 字体标题）

**多语言：** 使用现有 `loc(locale, zh, tw, en)` 工具函数，不使用 `next-intl` 的 `useTranslations()`，与其他 Section 组件保持一致

**布局：**
- 全宽深色背景，内容居中
- 标题（Cinzel）+ 副标题说明
- 邮箱输入框 + 提交按钮（桌面横排，移动端竖排）
- 底部显示隐私声明，三语均通过 `loc()` 提供：
  - 中文："提交即表示您同意我们收集您的邮箱用于公测通知"
  - 繁中："提交即表示您同意我們收集您的郵箱用於公測通知"
  - 英文："By submitting, you agree to us collecting your email for beta test notifications."
- 提交后就地显示提示，不跳转、不刷页

**交互状态：**

| 状态 | 表现 |
|------|------|
| 默认 | 输入框 + 提交按钮 |
| 格式错误（前端） | 红色提示："请输入有效的邮箱地址" |
| 加载中 | 按钮显示 loading 动画，输入框禁用 |
| 成功 | 绿色提示："预约成功！我们会在公测开始时通知您"；输入框隐藏，不可再次提交 |
| 重复邮箱（409） | 黄色提示："该邮箱已预约" |
| 速率超限（429） | 红色提示："提交过于频繁，请稍后再试" |
| 其他错误 | 红色提示："提交失败，请稍后重试" |

> **成功后行为：** 表单替换为成功提示，用户无法重新输入，刷新页面后恢复默认态。

---

## Admin 管理页面

**路径：** `app/admin/(protected)/reservations/page.tsx`（在 `(protected)` 路由组内，继承 auth 检查）
**导航：** 加入左侧 `AdminSidebar`

**功能：**
- 顶部显示总预约人数
- 表格：邮箱 / 预约时间（UTC+8 显示），按时间倒序
- **分页：** 每页 50 条，提供上一页/下一页控制
- **导出 CSV** 按钮：下载 `reservations.csv`
  - 编码：UTF-8 with BOM（兼容 Excel 打开中文）
  - 表头：`email,created_at`
  - 时间格式：ISO 8601（`2026-03-14T08:00:00.000Z`）
- 无编辑/删除功能

**样式：** 与现有 Admin 页面保持一致

---

## 文件清单

### 新增文件
- `app/api/reservations/route.ts` — POST（提交）/ GET（列表，分页）
- `app/api/reservations/export/route.ts` — CSV 导出
- `components/website/ReservationSection.tsx` — 前端预约组件
- `app/admin/(protected)/reservations/page.tsx` — Admin 管理页

### 修改文件
- `prisma/schema.prisma` — 新增 Reservation 模型
- `app/[locale]/page.tsx` — 硬编码插入 ReservationSection
- `components/admin/AdminSidebar.tsx` — 加入预约导航项

---

## 不在范围内

- 邮件发送功能（仅收集，不自动发邮件）
- 预约删除/GDPR 删除权（待后续版本）
- 预约关闭/截止日期控制（待后续版本）
- 用户账号系统
- 公测后数据迁移/归档方案
