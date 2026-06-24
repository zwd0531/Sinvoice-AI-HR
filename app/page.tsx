'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, FileText, Bot, Mic, BarChart3 } from 'lucide-react'
import { HeroCanvas } from '@/components/HeroCanvas'
import { CountingNumber } from '@/components/CountingNumber'

// ─── 数据 ───────────────────────────────────────────────────

const features = [
  {
    icon: FileText,
    title: '简历智能筛选',
    tagline: '多格式解析，JD 匹配自动计算',
    desc: '支持 PDF、Word、在线简历等格式，基于语义匹配自动计算岗位匹配度，批量处理候选池',
    href: '/resume',
  },
  {
    icon: Bot,
    title: 'AI 面试官',
    tagline: '同步异步双模式，多维评分',
    desc: '同步视频面试 + 异步作答两种模式，从技术、沟通、逻辑、动机等多维度自动生成评分报告',
    href: '/ai-interview',
  },
  {
    icon: Mic,
    title: 'HR 面试助手',
    tagline: '实时转写，情绪感知，智能追问',
    desc: '基于思必驰 ASR 引擎，毫秒级实时转写，识别候选人情绪状态，自动生成结构化追问建议',
    href: '/hr',
  },
  {
    icon: BarChart3,
    title: '候选人复盘',
    tagline: '面试回放，竞争力分析',
    desc: '完整面试音视频回放，雷达图竞争力分析，同批次候选人横向对比，支持导出评估报告',
    href: '/candidate',
  },
]

const stats = [
  { value: '98.5%', label: '语音识别准确率', sub: '业界领先的思必驰 ASR 引擎' },
  { value: '5x',    label: '简历筛选效率提升', sub: '相较传统人工筛选方式' },
  { value: '<300ms',label: '实时转写延迟',     sub: '端到端处理时延' },
]

const ctaModules = [
  { label: 'HR 工作台',  href: '/hr' },
  { label: '候选人复盘', href: '/candidate' },
  { label: '简历筛选',   href: '/resume' },
  { label: 'AI 面试官',  href: '/ai-interview' },
  { label: '政策咨询',   href: '/chatbot' },
]

const waveHeights = [
  3, 6, 9, 5, 11, 7, 14, 9, 12, 15, 11, 8, 13, 10, 7, 12, 15, 9, 11, 6,
  13, 10, 8, 14, 11, 9, 12, 7, 10, 15, 8, 12, 6, 10, 13, 9, 11, 5, 8, 12,
]
const PLAYED = 28

// ─── 动画 variants ──────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0  },
}

const stagger = (delay = 0.12) => ({
  hidden: {},
  show:   { transition: { staggerChildren: delay } },
})

const sectionTransition = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }
const itemTransition     = { duration: 0.5, ease: 'easeOut' as const }

// ─── 页面 ───────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="-mt-6 -mx-6">

      {/* ══════════════════════════════════════════
          第一屏 · HERO
      ══════════════════════════════════════════ */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden px-6"
        style={{
          minHeight: 'calc(100vh - 5.5rem)',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      >
        {/* Canvas 动态网格（鼠标交互） */}
        <HeroCanvas />

        {/* 中央渐变光晕 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 50%,' +
              'oklch(0.79 0.14 200 / 10%) 0%,' +
              'oklch(0.62 0.19 258 / 7%) 45%,' +
              'transparent 70%)',
          }}
        />

        {/* 内容 */}
        <motion.div
          className="relative z-10 text-center space-y-7 max-w-5xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06] text-xs text-muted-foreground backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-primary inline-block animate-pulse" />
            思必驰 AI 办公本 · 智慧招聘平台
          </div>

          <h1
            className="font-bold leading-[1.1] tracking-tight text-foreground"
            style={{ fontSize: 'clamp(48px, 5vw, 72px)' }}
          >
            AI 时代的
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, oklch(0.79 0.14 200), oklch(0.62 0.19 258))',
              }}
            >
              {' '}智慧招聘体验
            </span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            基于思必驰 AI 办公本 · 构建听—说—记—析—导全流程闭环
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/hr"
              className="group inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{
                background: 'oklch(0.79 0.14 200)',
                color: 'oklch(0.11 0.04 255)',
                boxShadow: '0 8px 30px oklch(0.79 0.14 200 / 35%)',
              }}
            >
              HR 工作台
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/candidate"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md border border-border/60 text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              候选人入口
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>

        {/* 底部遮罩 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, oklch(0.11 0.04 255))',
          }}
        />

        {/* 向下箭头 */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-1.5 text-muted-foreground/40">
          <span className="text-[10px] tracking-widest uppercase">scroll</span>
          <ArrowDown className="size-3.5 animate-bounce" />
        </div>
      </section>

      <div className="border-t border-border/30" />

      {/* ══════════════════════════════════════════
          工作流导览 · 三方分工
      ══════════════════════════════════════════ */}
      <motion.section
        className="px-16 pt-20 pb-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div variants={fadeUp} transition={sectionTransition} className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-3">
            一站式面试分析闭环
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            AI 执面 · HR 决策 · 候选人成长，分工明确
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
            从 AI 自动面试，到 HR 实时分析辅助决策，再到候选人自助复盘——三个角色，一条工作流，数据全程贯通。
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-4"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {[
            { step: '01', role: 'AI 面试官', icon: Bot, href: '/ai-interview', who: 'AI 全程主导', desc: 'AI 自动播题、录音转写、多维评分，支持同步/异步面试，自动生成评估报告' },
            { step: '02', role: 'HR 面试助手', icon: Mic, href: '/hr', who: 'AI 辅助 · HR 决策', desc: '实时转写、情绪感知、关键词抽取与追问建议，HR 专注判断与决策' },
            { step: '03', role: '候选人复盘', icon: BarChart3, href: '/candidate', who: 'AI 辅助 · 候选人成长', desc: '面试回放、竞争力雷达、AI 改进建议与针对性练习反馈' },
          ].map(({ step, role, icon: Icon, href, who, desc }) => (
            <motion.div
              key={step}
              variants={{ ...fadeUp, show: { ...fadeUp.show, transition: itemTransition } }}
            >
              <Link
                href={href}
                className="group relative block rounded-xl border border-border/40 p-6 hover:border-primary/40 hover:bg-primary/[0.03] hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-mono text-muted-foreground/40">{step}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-primary/30 text-primary/70">
                    {who}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="size-5 text-primary/70 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                  <h3 className="text-base font-semibold text-foreground">{role}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                  <span>进入工作台</span>
                  <ArrowRight className="size-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <div className="border-t border-border/30" />

      {/* ══════════════════════════════════════════
          第二屏 · 功能模块
      ══════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* 区块标题 */}
        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="px-16 pt-20 pb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50">
            核心能力
          </p>
        </motion.div>

        {/* 4 列 stagger */}
        <motion.div
          className="grid grid-cols-4 divide-x divide-border/30 border-t border-b border-border/30"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {features.map(({ icon: Icon, title, tagline, desc, href }) => (
            <motion.div
              key={href}
              variants={{ ...fadeUp, show: { ...fadeUp.show, transition: itemTransition } }}
            >
              <Link
                href={href}
                className="group block px-12 py-14 hover:bg-white/[0.02] transition-colors h-full"
              >
                <div className="mb-8">
                  <Icon
                    className="size-7 text-primary/70 group-hover:text-primary transition-colors"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-primary/70 mb-4">{tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="mt-6 flex items-center gap-1 text-xs text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                  <span>查看功能</span>
                  <ArrowRight className="size-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <div className="border-t border-border/30" />

      {/* ══════════════════════════════════════════
          第三屏 · 数据指标
      ══════════════════════════════════════════ */}
      <motion.section
        className="px-16 py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="grid grid-cols-2 gap-20 items-center">

          {/* 左：大数字 stagger */}
          <div>
            <motion.p
              variants={fadeUp}
              transition={sectionTransition}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-14"
            >
              核心指标
            </motion.p>

            <motion.div
              className="space-y-12"
              variants={stagger(0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
            >
              {stats.map(({ value, label, sub }, i) => (
                <motion.div
                  key={label}
                  variants={{ ...fadeUp, show: { ...fadeUp.show, transition: { ...itemTransition, delay: i * 0.15 } } }}
                  className="flex items-start gap-8"
                >
                  <span className="text-muted-foreground/20 text-sm font-mono tabular-nums mt-1 w-4 shrink-0">
                    0{i + 1}
                  </span>
                  <div className="border-l border-primary/30 pl-8 space-y-1.5">
                    <div
                      className="font-bold leading-none text-primary"
                      style={{
                        fontSize: 'clamp(40px, 3.5vw, 56px)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      <CountingNumber value={value} duration={2000} />
                    </div>
                    <div className="text-base font-medium text-foreground">{label}</div>
                    <div className="text-sm text-muted-foreground">{sub}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 右：波形面板 */}
          <motion.div
            variants={fadeUp}
            transition={{ ...sectionTransition, delay: 0.2 }}
            className="rounded-lg border border-border/40 p-8 space-y-6"
            style={{ background: 'oklch(0.145 0.042 255)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground">实时转写中</span>
              </div>
              <span className="text-xs text-muted-foreground/40 font-mono">14:23:08</span>
            </div>

            {/* 波形 */}
            <div className="flex items-center gap-[3px] h-14">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full min-w-[2px]"
                  style={{
                    height: `${Math.round((h / 15) * 100)}%`,
                    background:
                      i >= PLAYED
                        ? 'oklch(0.79 0.14 200 / 20%)'
                        : i >= PLAYED - 4
                        ? 'oklch(0.79 0.14 200 / 55%)'
                        : 'linear-gradient(to top, oklch(0.79 0.14 200), oklch(0.62 0.19 258 / 80%))',
                  }}
                />
              ))}
            </div>

            {/* 转录文字 */}
            <div className="space-y-3 font-mono text-xs leading-relaxed">
              <div className="flex gap-3">
                <span className="text-muted-foreground/40 shrink-0 w-10 text-right">HR</span>
                <span className="text-muted-foreground">
                  请介绍一下您在上一家公司负责的核心项目
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary/60 shrink-0 w-10 text-right">候选人</span>
                <span className="text-foreground/80">
                  我主要负责用户增长中台建设，将 MAU 从 120 万提升到 340 万…
                  <span className="inline-block w-1.5 h-3 ml-0.5 bg-primary/60 align-middle animate-pulse" />
                </span>
              </div>
              <div className="flex gap-3 pt-1">
                <span className="text-primary/50 shrink-0 w-10 text-right">AI</span>
                <span className="text-primary/70">
                  建议追问：具体使用了哪些增长策略？AB 测试结果如何？
                </span>
              </div>
            </div>

            {/* 维度标签 */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/25">
              {['技术能力 ★★★★', '逻辑清晰 ★★★★★', '表达流畅 ★★★★'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded text-xs border border-border/40 text-muted-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="border-t border-border/30" />

      {/* ══════════════════════════════════════════
          第四屏 · CTA
      ══════════════════════════════════════════ */}
      <motion.section
        className="px-16 py-24 text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="space-y-4 mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground">立即体验各功能模块</h2>
          <p className="text-muted-foreground text-sm">
            选择一个入口开始探索，覆盖招聘全流程的智能能力
          </p>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-3 flex-wrap"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {ctaModules.map(({ label, href }) => (
            <motion.div
              key={href}
              variants={{ ...fadeUp, show: { ...fadeUp.show, transition: itemTransition } }}
            >
              <Link
                href={href}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border/50 text-sm font-medium text-foreground/80 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
              >
                {label}
                <ArrowRight className="size-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

    </div>
  )
}
