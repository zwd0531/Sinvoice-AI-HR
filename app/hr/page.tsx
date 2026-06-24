'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Brain, Check, ChevronRight, Clock, FileText, Mic, MicOff, User, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DemoBackdrop, DemoPanel, MetricTile, StatusPill } from '@/components/DemoBackdrop'
import {
  mockFollowUpSuggestions,
  mockInterviewDialogs,
  mockInterviewReport,
  mockRadarData,
} from '@/lib/mock-data'

// ── Constants ──────────────────────────────────────────────────────────────

const OUTLINE = [
  { label: '自我介绍', range: [0, 1] },
  { label: '性能优化经历', range: [2, 3] },
  { label: '低代码平台项目', range: [4, 7] },
  { label: '团队协作与冲突', range: [8, 9] },
  { label: '离职动机与规划', range: [10, 13] },
  { label: '个人优缺点', range: [14, 15] },
  { label: '薪资与入职期望', range: [16, 19] },
]

const ALL_KEYWORDS = [
  { word: 'LCP优化', weight: 'high', at: 4 },
  { word: 'Code Splitting', weight: 'medium', at: 4 },
  { word: '低代码平台', weight: 'high', at: 6 },
  { word: 'DSL解释器', weight: 'medium', at: 8 },
  { word: '函数式编程', weight: 'low', at: 8 },
  { word: 'TypeScript迁移', weight: 'medium', at: 10 },
  { word: '语音AI融合', weight: 'high', at: 14 },
  { word: 'WebSocket', weight: 'low', at: 14 },
  { word: 'ASR实时转写', weight: 'medium', at: 14 },
  { word: '薪资期望 5.5万+', weight: 'high', at: 20 },
]

// 面试阶段（分工可视化）
const PHASES = ['面试准备', '实时分析', '生成报告', '归档完成'] as const
const PHASE_HINTS = [
  '等待 HR 开始面试',
  'AI 正在转写、感知情绪、抽取关键词',
  'AI 已生成结构化评估报告',
  '报告已归档至候选人档案',
] as const

const CONTEXT_METRICS = [
  { label: 'JD 匹配', value: '92%', sub: '高级前端工程师', tone: 'cyan' as const },
  { label: 'ASR 置信', value: '98.5%', sub: '6 麦克风阵列', tone: 'emerald' as const },
  { label: '追问命中', value: '7/9', sub: '关键问题覆盖', tone: 'violet' as const },
  { label: '风险提示', value: '2', sub: '协作与薪资待核', tone: 'amber' as const },
]

const INTERVIEW_CHECKLIST = [
  { label: '项目深度', value: 82, status: '已覆盖' },
  { label: '工程落地', value: 76, status: '追问中' },
  { label: '团队协作', value: 58, status: '待补充' },
  { label: '求职动机', value: 64, status: '待验证' },
]

const LIVE_SIGNALS = [
  { label: '语速', value: '168 字/分', tone: 'cyan' as const },
  { label: '停顿', value: '4 次', tone: 'amber' as const },
  { label: '情绪', value: '稳定', tone: 'emerald' as const },
  { label: '关键词', value: '10 个', tone: 'violet' as const },
]

// ── Component ──────────────────────────────────────────────────────────────

export default function HRAssistantPage() {
  // Auto-play state
  const [isStarted, setIsStarted] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(0)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Timer
  const [seconds, setSeconds] = useState(0)

  // Wave canvas
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const isSpeakingRef = useRef(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Emotion chart
  const [emotionData, setEmotionData] = useState<{ t: string; v: number }[]>([
    { t: '0s', v: 72 },
  ])

  // Report dialog + toast
  const [reportOpen, setReportOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [archived, setArchived] = useState(false)

  // Scroll anchor
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── Timer ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isStarted || isPaused) return
    const iv = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(iv)
  }, [isStarted, isPaused])

  // ── Auto-play (typing animation) ────────────────────────────────────────

  useEffect(() => {
    if (!isStarted || isPaused || isTyping || displayedCount >= mockInterviewDialogs.length) return
    const delay = displayedCount === 0 ? 1500 : 2500
    let cancelled = false

    const outerTimer = setTimeout(() => {
      if (cancelled) return
      const content = mockInterviewDialogs[displayedCount].content
      setIsTyping(true)
      isSpeakingRef.current = true
      setIsSpeaking(true)
      let i = 0
      const iv = setInterval(() => {
        if (cancelled) {
          clearInterval(iv)
          return
        }
        i++
        setTypingText(content.slice(0, i))
        if (i >= content.length) {
          clearInterval(iv)
          isSpeakingRef.current = false
          setIsSpeaking(false)
          setIsTyping(false)
          setTypingText('')
          setDisplayedCount((c) => c + 1)
        }
      }, 25)
    }, delay)

    return () => {
      cancelled = true
      clearTimeout(outerTimer)
    }
  }, [isStarted, displayedCount, isPaused, isTyping])

  // ── Scroll to bottom ────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayedCount, typingText])

  // ── Emotion data ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isStarted || isPaused) return
    const iv = setInterval(() => {
      setEmotionData((prev) => {
        const last = prev[prev.length - 1].v
        const next = Math.min(98, Math.max(50, last + (Math.random() - 0.45) * 16))
        const t = `${prev.length * 3}s`
        return [...prev, { t, v: Math.round(next) }].slice(-12)
      })
    }, 3000)
    return () => clearInterval(iv)
  }, [isStarted, isPaused])

  // ── Toast auto-dismiss ──────────────────────────────────────────────────

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(''), 3000)
    return () => clearTimeout(t)
  }, [toastMsg])

  // ── Wave canvas ─────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = waveCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let phase = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)
      const amplitude = isSpeakingRef.current ? H * 0.38 : H * 0.06
      const freq = isSpeakingRef.current ? 0.035 : 0.02
      const speed = isSpeakingRef.current ? 0.12 : 0.04
      phase += speed

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(34,211,238,0.75)'
      ctx.lineWidth = 1.5
      for (let x = 0; x <= W; x++) {
        const y =
          H / 2 +
          Math.sin(x * freq + phase) * amplitude +
          Math.sin(x * freq * 1.7 + phase * 0.8) * amplitude * 0.4
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.lineTo(W, H)
      ctx.lineTo(0, H)
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, 'rgba(34,211,238,0.15)')
      grad.addColorStop(1, 'rgba(34,211,238,0)')
      ctx.fillStyle = grad
      ctx.fill()

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  // ── Derived values ──────────────────────────────────────────────────────

  const currentSection = OUTLINE.findIndex(
    (o) => displayedCount <= o.range[1] + 1
  )

  const suggestionCycle = Math.floor(displayedCount / 4)
  const visibleSuggestions = [
    mockFollowUpSuggestions[suggestionCycle % 5],
    mockFollowUpSuggestions[(suggestionCycle + 1) % 5],
    mockFollowUpSuggestions[(suggestionCycle + 2) % 5],
  ]

  const visibleKeywords = ALL_KEYWORDS.filter((k) => k.at <= displayedCount)

  // 当前阶段：准备 → 实时分析 → 生成报告 → 归档完成
  const phaseIndex = !isStarted ? 0 : archived ? 3 : reportOpen ? 2 : 1

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="fixed top-14 left-0 right-0 bottom-0 flex flex-col overflow-hidden bg-[#0a0f1e]">
      <DemoBackdrop density="dense" />
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 h-14 shrink-0 flex items-center justify-between px-6 border-b border-border/50 bg-card/60 backdrop-blur-md">
        {/* Candidate info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-sm text-foreground">张伟</span>
            <span className="ml-2 text-xs text-muted-foreground">高级前端工程师 · 阿里巴巴</span>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs ml-1">
            匹配度 92%
          </Badge>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 text-primary font-mono text-lg font-semibold">
          <Clock className="w-4 h-4" />
          {formatTime(seconds)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isStarted ? (
            <Button
              size="sm"
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={() => setIsStarted(true)}
            >
              <Mic className="w-4 h-4 mr-1" />
              开始面试
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsPaused((p) => !p)}>
                {isPaused ? (
                  <Mic className="w-4 h-4 mr-1" />
                ) : (
                  <MicOff className="w-4 h-4 mr-1" />
                )}
                {isPaused ? '继续' : '暂停'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsStarted(false)
                  setIsPaused(false)
                  setSeconds(0)
                  setDisplayedCount(0)
                  setTypingText('')
                  setIsTyping(false)
                  isSpeakingRef.current = false
                  setIsSpeaking(false)
                  setEmotionData([{ t: '0s', v: 72 }])
                  setArchived(false)
                  setReportOpen(false)
                }}
              >
                重新开始
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => { setReportOpen(true); setIsPaused(true) }}
              >
                <FileText className="w-4 h-4 mr-1" />
                生成报告
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── Phase Strip · 分工可视化 ──────────────────────────────────────── */}
      <div className="relative z-10 h-9 shrink-0 flex items-center px-6 gap-2.5 border-b border-border/50 bg-card/30">
        {PHASES.map((p, i) => {
          const done = phaseIndex > i
          const current = phaseIndex === i
          return (
            <Fragment key={p}>
              <div
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  current
                    ? 'text-primary font-medium'
                    : done
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/40'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
                    current
                      ? 'bg-primary text-primary-foreground'
                      : done
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'border border-border/50'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </span>
                {p}
              </div>
              {i < PHASES.length - 1 && (
                <span className="text-muted-foreground/20 text-[10px]">→</span>
              )}
            </Fragment>
          )
        })}
        <span className="ml-auto text-[10px] text-muted-foreground/50">
          {PHASE_HINTS[phaseIndex]}
        </span>
      </div>

      {/* ── Command Context ─────────────────────────────────────────────── */}
      <div className="relative z-10 shrink-0 border-b border-white/[0.06] bg-[#0a0f1e]/55 px-6 py-3 backdrop-blur-md">
        <div className="grid gap-3 lg:grid-cols-[1.1fr_1.35fr_1fr]">
          <DemoPanel className="p-3" tone="cyan">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Candidate Brief</p>
                <p className="mt-1 text-sm font-semibold text-white">张伟 · 高级前端工程师</p>
                <p className="mt-1 text-xs leading-relaxed text-white/55">
                  阿里巴巴 5 年 · 低代码平台与性能优化经验 · 期望薪资 5.5 万
                </p>
              </div>
              <StatusPill label="状态" value={isStarted ? '面试中' : '待开始'} tone={isStarted ? 'emerald' : 'blue'} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {CONTEXT_METRICS.slice(0, 2).map((item) => (
                <MetricTile key={item.label} {...item} />
              ))}
            </div>
          </DemoPanel>

          <DemoPanel className="p-3" tone="violet">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Interview Coverage</p>
              <span className="text-[10px] text-white/35">{displayedCount} / {mockInterviewDialogs.length} 轮对话</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {INTERVIEW_CHECKLIST.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/[0.06] bg-white/[0.035] p-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[10px] text-white/50">{item.label}</span>
                    <span className="text-[10px] text-cyan-200">{item.value}%</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                    <div className="h-full rounded-full bg-cyan-300/75" style={{ width: `${item.value}%` }} />
                  </div>
                  <p className="mt-1.5 truncate text-[10px] text-white/35">{item.status}</p>
                </div>
              ))}
            </div>
          </DemoPanel>

          <DemoPanel className="p-3" tone="amber">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Live Signals</p>
              <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {LIVE_SIGNALS.map((signal) => (
                <StatusPill key={signal.label} {...signal} />
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-white/40">
              AI 将在候选人回答结束后自动生成追问建议，并持续同步关键词、情绪和风险点。
            </p>
          </DemoPanel>
        </div>
      </div>

      {/* ── Three Columns ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Left — Interview outline */}
        <div className="w-1/4 border-r border-border/50 overflow-y-auto p-4 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">
            面试大纲
          </p>
          {OUTLINE.map((item, i) => {
            const isDone = displayedCount > item.range[1] + 1
            const isCurrent = i === currentSection
            return (
              <div
                key={i}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isCurrent
                    ? 'bg-primary/10 text-primary'
                    : isDone
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                    isDone
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : isCurrent
                        ? 'border-primary text-primary'
                        : 'border-border/50'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3 h-3" />
                  ) : isCurrent ? (
                    <ChevronRight className="w-3 h-3" />
                  ) : (
                    <span className="text-[10px] font-mono">{i + 1}</span>
                  )}
                </div>
                <span className={isCurrent ? 'font-medium' : ''}>{item.label}</span>
              </div>
            )
          })}

          {/* Progress summary */}
          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>进度</span>
              <span>{displayedCount} / {mockInterviewDialogs.length}</span>
            </div>
            <Progress
              value={(displayedCount / mockInterviewDialogs.length) * 100}
              className="h-1.5"
            />
          </div>
        </div>

        {/* Center — Transcript + waveform */}
        <div className="flex flex-col overflow-hidden" style={{ width: '45%' }}>
          {/* Dialog bubbles */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockInterviewDialogs.slice(0, displayedCount).map((dialog) => {
              const isHr = dialog.role === 'hr'
              return (
                <motion.div
                  key={dialog.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${isHr ? '' : 'flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5 ${
                      isHr
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {isHr ? 'HR' : '张'}
                  </div>
                  {/* Bubble */}
                  <div className={`max-w-[80%] ${isHr ? '' : 'items-end'} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{dialog.timestamp}</span>
                      <span className="text-xs text-muted-foreground">
                        {isHr ? '面试官' : '候选人'}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        isHr
                          ? 'bg-card border border-border/50 text-foreground'
                          : 'bg-secondary/40 text-foreground'
                      }`}
                    >
                      {dialog.content}
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Typing bubble */}
            {isTyping && typingText && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${
                  mockInterviewDialogs[displayedCount]?.role === 'hr' ? '' : 'flex-row-reverse'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5 ${
                    mockInterviewDialogs[displayedCount]?.role === 'hr'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {mockInterviewDialogs[displayedCount]?.role === 'hr' ? 'HR' : '张'}
                </div>
                <div className="max-w-[80%] flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    {mockInterviewDialogs[displayedCount]?.timestamp}
                  </span>
                  <div
                    className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      mockInterviewDialogs[displayedCount]?.role === 'hr'
                        ? 'bg-card border border-border/50 text-foreground'
                        : 'bg-secondary/40 text-foreground'
                    }`}
                  >
                    {typingText}
                    <span className="animate-pulse text-primary ml-0.5">▌</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Waveform canvas */}
          <div className="h-12 shrink-0 border-t border-border/50 relative">
            <canvas
              ref={waveCanvasRef}
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isSpeaking ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
                }`}
              />
              <span className="text-[10px] text-muted-foreground">
                {isPaused ? '已暂停' : 'AI 实时转写'}
              </span>
            </div>
          </div>
        </div>

        {/* Right — Tabs */}
        <div className="border-l border-border/50 flex flex-col overflow-hidden" style={{ width: '30%' }}>
          <Tabs defaultValue="suggestions" className="flex flex-col h-full overflow-hidden">
            <TabsList className="shrink-0 mx-3 mt-3">
              <TabsTrigger value="suggestions" className="flex-1 text-xs gap-1">
                <Zap className="w-3 h-3" />
                AI 追问建议
              </TabsTrigger>
              <TabsTrigger value="emotion" className="flex-1 text-xs gap-1">
                <Brain className="w-3 h-3" />
                AI 情绪感知
              </TabsTrigger>
              <TabsTrigger value="keywords" className="flex-1 text-xs gap-1">
                AI 关键词
              </TabsTrigger>
            </TabsList>

            {/* Follow-up suggestions */}
            <TabsContent value="suggestions" className="flex-1 overflow-y-auto p-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={suggestionCycle}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2.5"
                >
                  {visibleSuggestions.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-lg border border-border/50 bg-card/60 space-y-1.5 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      <p className="text-[10px] text-muted-foreground">{s.context}</p>
                      <p className="text-xs text-foreground font-medium leading-relaxed">
                        {s.suggestion}
                      </p>
                      <p className="text-[10px] text-primary/70">{s.purpose}</p>
                    </div>
                  ))}
                  <p className="text-center text-[10px] text-muted-foreground/50 pt-1">
                    每 4 条对话自动刷新
                  </p>
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            {/* Emotion chart */}
            <TabsContent value="emotion" className="flex-1 overflow-hidden p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">情绪置信度趋势</span>
                <span className="text-xs font-semibold text-primary">
                  {emotionData[emotionData.length - 1].v}%
                </span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={emotionData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                    <XAxis
                      dataKey="t"
                      tick={{ fontSize: 9, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[40, 100]}
                      tick={{ fontSize: 9, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-card)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3, fill: '#22d3ee' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: '自信', value: '强' },
                  { label: '积极性', value: '高' },
                  { label: '紧张度', value: '低' },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-card/60 border border-border/50 py-2">
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                    <p className="text-xs font-semibold text-primary mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Keywords */}
            <TabsContent value="keywords" className="flex-1 overflow-y-auto p-3">
              <p className="text-[10px] text-muted-foreground mb-2.5 uppercase tracking-wider">
                提取关键词 · {visibleKeywords.length} 个
              </p>
              {visibleKeywords.length === 0 ? (
                <p className="text-xs text-muted-foreground/50 text-center pt-8">
                  对话开始后自动提取…
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {visibleKeywords.map((kw) => (
                      <motion.span
                        key={kw.word}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${
                          kw.weight === 'high'
                            ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
                            : kw.weight === 'medium'
                              ? 'text-blue-400 bg-blue-400/10 border-blue-400/30'
                              : 'text-muted-foreground bg-muted/40 border-border/50'
                        }`}
                      >
                        {kw.word}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ── Report Dialog ──────────────────────────────────────────────────── */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">面试评估报告 — 张伟</DialogTitle>
            <div className="flex items-center gap-3 pt-1">
              <div className="text-3xl font-bold text-primary">{mockInterviewReport.overallScore}</div>
              <div>
                <p className="text-xs text-muted-foreground">综合评分</p>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs mt-0.5">
                  {mockInterviewReport.recommendation}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-3">
            {mockInterviewReport.summary}
          </p>

          {/* Dimension scores */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
              维度评分
            </p>
            {mockInterviewReport.dimensions.map((d) => (
              <div key={d.dimension} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground font-medium">{d.dimension}</span>
                  <span className="text-primary font-semibold">{d.score}</span>
                </div>
                <Progress value={d.score} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">{d.comment}</p>
              </div>
            ))}
          </div>

          {/* Radar chart */}
          <div>
            <p className="text-xs font-medium text-foreground/70 uppercase tracking-wider mb-2">
              能力雷达图
            </p>
            <ResponsiveContainer width="100%" height={192}>
              <RadarChart data={mockRadarData} cx="50%" cy="50%" outerRadius={72}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <Radar
                  name="候选人"
                  dataKey="candidate"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.25}
                />
                <Radar
                  name="基准线"
                  dataKey="benchmark"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.1}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Strengths & concerns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-emerald-400 mb-2 uppercase tracking-wider">
                优势亮点
              </p>
              <ul className="space-y-1.5">
                {mockInterviewReport.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="text-emerald-400 shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-amber-400 mb-2 uppercase tracking-wider">
                关注点
              </p>
              <ul className="space-y-1.5">
                {mockInterviewReport.concerns.map((c, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="text-amber-400 shrink-0">△</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReportOpen(false)
                setArchived(true)
                setToastMsg('面试评估报告已生成并归档至候选人档案')
              }}
            >
              确认归档
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 right-6 z-50 bg-card border border-border/80 shadow-lg rounded-xl px-4 py-3 text-sm text-foreground max-w-xs"
          >
            <span className="text-emerald-400 mr-2">✓</span>
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
