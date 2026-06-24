'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { ChevronDown, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DemoBackdrop, DemoPanel, MetricTile, StatusPill } from '@/components/DemoBackdrop'

// ── Constants ──────────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { label: '简历投递', done: true,  current: false },
  { label: '初筛通过', done: true,  current: false },
  { label: '技术面试', done: false, current: true  },
  { label: 'HR面试',   done: false, current: false },
  { label: 'Offer',   done: false, current: false },
]

const MARKERS = [
  { time: 95,  label: '自我介绍' },
  { time: 310, label: '项目经历' },
  { time: 620, label: '技术难点' },
  { time: 890, label: '职业规划' },
]

const SUBTITLES = [
  { start: 0,   end: 90,  text: '大家好，我是李小明，硕士毕业于北京大学，研究方向计算机视觉与深度学习。' },
  { start: 90,  end: 220, text: '在上一家公司百图生科，我主要负责蛋白质结构预测模型的算法研发。' },
  { start: 220, end: 380, text: '其中最有挑战性的项目是用FAISS实现大规模向量检索，把召回延迟从800ms降到90ms。' },
  { start: 380, end: 530, text: '这个优化涉及到IVF索引的分区策略和量化精度之间的权衡，是整个项目最核心的决策。' },
  { start: 530, end: 680, text: '团队协作方面，我承担了方案评审和代码review，推动了统一的向量化规范落地。' },
  { start: 680, end: 810, text: '关于职业规划，我希望在算法工程方向继续深耕，同时补强大规模系统工程落地能力。' },
  { start: 810, end: 940, text: '选择思必驰，是因为语音AI与大模型的融合方向和我的技术兴趣高度契合。' },
  { start: 940, end: 1060, text: '薪资期望方面，我目前到手约2.2万，希望有合理增长空间，具体可以在offer后沟通。' },
  { start: 1060, end: 1180, text: '最后，我在GitHub上维护了一个向量检索库，目前已有500+ star，欢迎参考。' },
  { start: 1180, end: 1320, text: '以上就是我的简单介绍，期待能有机会和团队深度交流，谢谢。' },
]

// 字幕时间轴总跨度，用于按实际上传视频时长等比缩放
const SUBTITLE_SPAN = SUBTITLES[SUBTITLES.length - 1].end

const RADAR_DATA = [
  { subject: '技术深度', candidate: 83, benchmark: 72, fullMark: 100 },
  { subject: '表达清晰', candidate: 76, benchmark: 68, fullMark: 100 },
  { subject: '案例丰富', candidate: 62, benchmark: 70, fullMark: 100 },
  { subject: '应变能力', candidate: 79, benchmark: 65, fullMark: 100 },
  { subject: '逻辑思维', candidate: 81, benchmark: 71, fullMark: 100 },
]

const DIMENSION_COMMENTS = [
  { subject: '技术深度', comment: 'FAISS调优细节讲述清晰，但缺少对比实验佐证' },
  { subject: '表达清晰', comment: '整体流畅，压力追问阶段有轻微逻辑跳跃' },
  { subject: '案例丰富', comment: '仅举1个主要案例，建议准备2-3个不同领域案例' },
  { subject: '应变能力', comment: '压力追问下保持冷静，快速调整思路' },
  { subject: '逻辑思维', comment: '问题拆解有层次感，偶有跳步需注意' },
]

const SUGGESTIONS = [
  { type: 'strength', text: '技术深度扎实，能清晰阐述FAISS检索优化的实现细节' },
  { type: 'strength', text: '压力追问下保持冷静，应变能力突出' },
  { type: 'improve',  text: '团队案例描述不够清晰，建议用STAR结构重新组织' },
  { type: 'improve',  text: '量化意识偏弱，每个项目准备3个核心数据指标' },
]

const EXERCISES = [
  {
    title: 'STAR结构团队案例训练',
    prompt: '请用STAR结构（情境→任务→行动→结果）描述一次你在团队中解决重要问题的经历。',
    feedback: '你的回答具备了基本的事件描述，但「行动」环节缺少个人主导的具体步骤，「结果」部分建议加入可量化的数据。例如：「最终在2周内完成部署，系统准确率提升至94%，节省人工审核成本40%」。整体逻辑框架清晰，继续强化数据意识。',
  },
  {
    title: '数据驱动表达训练',
    prompt: '选择你最有代表性的一个项目，用3个具体数字来描述它的成果。',
    feedback: '很好！你给出了具体指标，但建议检查数据的完整性：不仅要有绝对值（准确率95%），还要有对比基线（较之前提升了多少）和业务影响（为公司节省了什么）。三层结构会让你的表达更有说服力。',
  },
  {
    title: '压力追问模拟',
    prompt: '面试官问：「你说准确率提升了20%，但竞品方案也能做到，你们的差异化是什么？」请回答这个追问。',
    feedback: '你展示了较好的应变能力，没有慌乱。建议下次遇到差异化追问时，从三个维度展开：技术路径差异、工程落地成本、团队专有数据优势。当前回答偏重技术本身，加入成本和数据两个维度后论点会更完整。',
  },
]

const REVIEW_METRICS = [
  { label: '综合表现', value: '82', sub: '高于同岗均值 11 分', tone: 'cyan' as const },
  { label: '同批排名', value: 'Top 22%', sub: '86 位候选人匿名对比', tone: 'emerald' as const },
  { label: '关键片段', value: '4', sub: '可直接跳转复看', tone: 'violet' as const },
  { label: '训练任务', value: '3', sub: '基于薄弱项生成', tone: 'amber' as const },
]

const PEER_BENCHMARK = [
  { label: '技术深度', candidate: 83, peer: 72 },
  { label: '表达清晰', candidate: 76, peer: 68 },
  { label: '案例丰富', candidate: 62, peer: 70 },
  { label: '应变能力', candidate: 79, peer: 65 },
]

// ── framer-motion variants ─────────────────────────────────────────────────

const timelineContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25, delayChildren: 0.1 } },
}
const stepVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}
const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.3, ease: 'easeOut' } },
}

// ── Component ──────────────────────────────────────────────────────────────

export default function CandidateReviewPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const timelineStarted = true
  const [activeExercise, setActiveExercise] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [feedbackText, setFeedbackText] = useState<Record<number, string>>({})
  const [feedbackDone, setFeedbackDone] = useState<Record<number, boolean>>({})
  const subtitleRefs = useRef<(HTMLDivElement | null)[]>([])
  const [reviewVisible, setReviewVisible] = useState(false)
  const [analysisVisible, setAnalysisVisible] = useState(true)
  const [videoDuration, setVideoDuration] = useState(0)
  const feedbackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => {
    if (feedbackIntervalRef.current) clearInterval(feedbackIntervalRef.current)
  }, [])

  // 字幕/标记按视频时长等比缩放，保证与任意上传视频对齐
  const scaleTime = (t: number) =>
    videoDuration > 0 ? (t / SUBTITLE_SPAN) * videoDuration : t
  const fmtTime = (t: number) =>
    `${Math.floor(t / 60)}:${String(Math.round(t % 60)).padStart(2, '0')}`

  const activeSubtitle = SUBTITLES.findIndex(
    (s) => currentTime >= scaleTime(s.start) && currentTime < scaleTime(s.end)
  )

  useEffect(() => {
    if (activeSubtitle >= 0) {
      subtitleRefs.current[activeSubtitle]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [activeSubtitle])

  function startFeedback(exerciseIdx: number, fullText: string) {
    if (feedbackIntervalRef.current) clearInterval(feedbackIntervalRef.current)
    setFeedbackText((prev) => ({ ...prev, [exerciseIdx]: '' }))
    setFeedbackDone((prev) => ({ ...prev, [exerciseIdx]: false }))
    let i = 0
    const iv = setInterval(() => {
      i++
      setFeedbackText((prev) => ({ ...prev, [exerciseIdx]: fullText.slice(0, i) }))
      if (i >= fullText.length) {
        clearInterval(iv)
        feedbackIntervalRef.current = null
        setFeedbackDone((prev) => ({ ...prev, [exerciseIdx]: true }))
      }
    }, 20)
    feedbackIntervalRef.current = iv
  }

  function jumpTo(time: number) {
    if (videoRef.current) videoRef.current.currentTime = time
  }

  return (
    <div className="relative -mx-6 -my-6 min-h-[calc(100vh-3.5rem)] overflow-hidden px-6 py-6 pb-16">
      <DemoBackdrop density="normal" />
      {/* ── Sticky Top Bar ──────────────────────────────────────────────── */}
      <div className="sticky top-14 z-20 -mx-6 px-6 py-3 bg-background/90 backdrop-blur-md border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="font-semibold text-foreground">李小明</span>
          <span className="text-border/60">·</span>
          <span className="text-muted-foreground">算法工程师</span>
          <span className="text-border/60">·</span>
          <span className="text-muted-foreground">2026-04-17</span>
        </div>

        <motion.div
          className="flex items-center"
          variants={timelineContainer}
          initial="hidden"
          animate={timelineStarted ? 'visible' : 'hidden'}
        >
          {TIMELINE_STEPS.map((step, i) => (
            <Fragment key={i}>
              <motion.div variants={stepVariants} className="flex flex-col items-center gap-1">
                <div className="relative flex items-center justify-center w-5 h-5">
                  {step.current && (
                    <span className="absolute w-4 h-4 rounded-full bg-primary opacity-60 animate-ping" />
                  )}
                  <div
                    className={`w-3 h-3 rounded-full border-2 z-10 ${
                      step.done
                        ? 'bg-primary border-primary'
                        : step.current
                          ? 'bg-primary border-primary'
                          : 'bg-transparent border-border'
                    }`}
                    style={step.current ? { boxShadow: '0 0 10px rgba(34,211,238,0.7)' } : undefined}
                  />
                </div>
                <span
                  className={`text-[10px] whitespace-nowrap ${
                    step.current
                      ? 'text-primary font-medium'
                      : step.done
                        ? 'text-foreground/70'
                        : 'text-muted-foreground/50'
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>

              {i < TIMELINE_STEPS.length - 1 && (
                <motion.div
                  variants={lineVariants}
                  className={`w-10 h-px mb-3 ${step.done ? 'bg-primary/60' : 'bg-border/50'}`}
                  style={{ transformOrigin: 'left center' }}
                />
              )}
            </Fragment>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 mt-6 grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        <DemoPanel className="p-4" tone="cyan">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                Candidate Replay Command Center
              </p>
              <h1 className="mt-1 text-lg font-semibold text-white">李小明 · 算法工程师面试复盘</h1>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/50">
                默认演示态已载入：AI 根据面试录像、字幕转写和同批候选人基准，生成竞争力报告与针对性训练路径。
              </p>
            </div>
            <StatusPill label="复盘状态" value={videoSrc ? '已接入上传视频' : '演示样本'} tone={videoSrc ? 'emerald' : 'blue'} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-4">
            {REVIEW_METRICS.map((metric) => (
              <MetricTile key={metric.label} {...metric} />
            ))}
          </div>
        </DemoPanel>

        <DemoPanel className="p-4" tone="violet">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">Peer Benchmark</p>
            <span className="text-[10px] text-white/35">同岗位匿名样本 n=86</span>
          </div>
          <div className="mt-3 space-y-2">
            {PEER_BENCHMARK.map((item) => (
              <div key={item.label} className="grid grid-cols-[64px_1fr_36px] items-center gap-2 text-xs">
                <span className="text-white/55">{item.label}</span>
                <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-violet-400/35" style={{ width: `${item.peer}%` }} />
                  <div className="absolute inset-y-0 left-0 rounded-full bg-cyan-300/80" style={{ width: `${item.candidate}%` }} />
                </div>
                <span className="text-right font-mono text-cyan-100">{item.candidate}</span>
              </div>
            ))}
          </div>
        </DemoPanel>
      </div>

      {/* ── Main Two Columns ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex gap-8 mt-8 items-start">
        {/* Left 55% */}
        <div className="w-[55%] shrink-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            面试回放
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              if (videoSrc) URL.revokeObjectURL(videoSrc)
              setVideoSrc(URL.createObjectURL(file))
              setCurrentTime(0)
            }}
          />
          {videoSrc ? (
            <div className="relative group">
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                className="w-full rounded-xl bg-black"
                style={{ accentColor: '#22d3ee', aspectRatio: '16/9' }}
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
                onLoadedMetadata={() => setVideoDuration(videoRef.current?.duration ?? 0)}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 text-xs text-white/80 hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
              >
                更换视频
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/40 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3"
              style={{ aspectRatio: '16/9' }}
            >
              <div className="grid size-16 place-items-center rounded-full border border-primary/35 bg-primary/10">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm text-foreground/80 font-medium">演示复盘样本已载入 · 点击可替换真实录像</p>
                <p className="text-xs text-muted-foreground mt-1">当前展示模拟字幕、关键片段与 AI 竞争力分析</p>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {['ASR 已完成', '4 个关键节点', '报告可导出'].map((item) => (
                  <span key={item} className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10px] text-white/45">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Time markers + Subtitles — only after video upload */}
          {(videoSrc || analysisVisible) && (
            <>
              <div className="flex flex-wrap gap-2 mt-3">
                {MARKERS.map((m) => (
                  <button
                    key={m.time}
                    onClick={() => jumpTo(scaleTime(m.time))}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/50 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors bg-card/40"
                  >
                    <span className="font-mono text-[10px] text-primary/70">
                      {fmtTime(scaleTime(m.time))}
                    </span>
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 h-[200px] overflow-y-auto rounded-xl border border-border/50 bg-card/30">
                {SUBTITLES.map((s, i) => (
                  <div
                    key={i}
                    ref={(el) => { subtitleRefs.current[i] = el }}
                    onClick={() => jumpTo(scaleTime(s.start))}
                    className={`flex gap-3 px-3 py-2.5 cursor-pointer transition-colors border-b border-border/30 last:border-0 ${
                      i === activeSubtitle ? 'bg-primary/10' : 'hover:bg-card/60'
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] shrink-0 mt-0.5 ${
                        i === activeSubtitle ? 'text-primary' : 'text-muted-foreground/40'
                      }`}
                    >
                      {fmtTime(scaleTime(s.start))}
                    </span>
                    <span
                      className={`text-xs leading-relaxed ${
                        i === activeSubtitle ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {s.text}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Video summary button */}
          <button
            disabled={false}
            onClick={() => setAnalysisVisible(true)}
            className="mt-4 w-full py-2.5 rounded-xl border border-primary/40 bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ① 生成 AI 竞争力分析
          </button>
          {analysisVisible && (
            <button
              onClick={() => setReviewVisible(true)}
              className="mt-2 w-full py-2.5 rounded-xl border border-border/40 bg-card/40 text-muted-foreground text-sm font-medium hover:text-foreground hover:border-border/70 transition-colors"
            >
              ② 查看完整复盘报告
            </button>
          )}
        </div>

        {/* Right 45% */}
        <AnimatePresence>
          {analysisVisible && (
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            竞争力分析
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <ResponsiveContainer width="100%" height={224}>
              <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={82}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Radar
                  name="李小明"
                  dataKey="candidate"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.2}
                  isAnimationActive
                  animationBegin={300}
                  animationDuration={1200}
                />
                <Radar
                  name="基准线"
                  dataKey="benchmark"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.08}
                  isAnimationActive
                  animationBegin={500}
                  animationDuration={1200}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Dimension comments */}
          <div className="space-y-2 border-t border-border/40 pt-4">
            {DIMENSION_COMMENTS.map((d) => (
              <div key={d.subject} className="flex gap-3 text-xs">
                <span className="text-primary/80 shrink-0 font-medium w-14">{d.subject}</span>
                <span className="text-muted-foreground leading-relaxed">{d.comment}</span>
              </div>
            ))}
          </div>

          {/* AI suggestions */}
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              AI 改进建议
            </p>
            {SUGGESTIONS.map((s, i) => (
              <div key={i} className="flex gap-3 py-3 border-b border-border/40 last:border-0 items-start">
                <span
                  className={`text-[10px] font-semibold shrink-0 mt-0.5 px-1.5 py-0.5 rounded ${
                    s.type === 'strength'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-orange-500/15 text-orange-400'
                  }`}
                >
                  {s.type === 'strength' ? '优势' : '待提升'}
                </span>
                <span className="text-sm text-foreground/80 leading-relaxed">{s.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Review Output ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {reviewVisible && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4 }}
            className="mt-8 rounded-2xl border border-border/60 bg-card/40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/60">
              <div>
                <p className="text-sm font-semibold text-foreground">复盘报告 · 李小明</p>
                <p className="text-xs text-muted-foreground mt-0.5">算法工程师 · 2026-04-17 · 技术面试</p>
              </div>
              <button
                onClick={() => setReviewVisible(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                收起
              </button>
            </div>

            <div className="grid grid-cols-3 divide-x divide-border/40">
              {/* Col 1: Radar scores */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-4">维度评分</p>
                <div className="space-y-3">
                  {RADAR_DATA.map((d) => (
                    <div key={d.subject}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground/80">{d.subject}</span>
                        <span className="font-semibold text-primary">{d.candidate}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.candidate}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                          className="h-full rounded-full bg-primary/70"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        {DIMENSION_COMMENTS.find((c) => c.subject === d.subject)?.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 2: Suggestions */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-4">AI 改进建议</p>
                <div className="space-y-3">
                  {SUGGESTIONS.map((s, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <span className={`text-[10px] font-semibold shrink-0 mt-0.5 px-1.5 py-0.5 rounded ${
                        s.type === 'strength'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-orange-500/15 text-orange-400'
                      }`}>
                        {s.type === 'strength' ? '优势' : '待提升'}
                      </span>
                      <span className="text-xs text-foreground/80 leading-relaxed">{s.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-3">关键节点</p>
                  <div className="space-y-1.5">
                    {MARKERS.map((m) => (
                      <div key={m.time} className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-primary/70 shrink-0">
                          {fmtTime(scaleTime(m.time))}
                        </span>
                        <span className="text-muted-foreground">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 3: Transcript */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-4">
                  完整字幕记录 · {SUBTITLES.length} 段
                </p>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {SUBTITLES.map((s, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span className="font-mono text-muted-foreground/50 shrink-0 mt-0.5">
                        {fmtTime(scaleTime(s.start))}
                      </span>
                      <span className="text-foreground/70 leading-relaxed">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Practice Exercises ───────────────────────────────────────────── */}
      <AnimatePresence>
        {analysisVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
          >
      <div className="mt-12 pt-8 border-t border-border/40">
        <p className="text-base font-semibold text-foreground mb-6">推荐练习题</p>
        <div className="grid grid-cols-3 gap-4">
          {EXERCISES.map((ex, i) => (
            <div key={i} className="border border-border/50 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-card/60 transition-colors"
                onClick={() => setActiveExercise(activeExercise === i ? null : i)}
              >
                <span className="text-sm font-medium text-foreground pr-2">{ex.title}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    activeExercise === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {activeExercise === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-border/40">
                      <p className="text-xs text-muted-foreground pt-3 leading-relaxed">{ex.prompt}</p>
                      <textarea
                        className="w-full h-24 bg-background border border-border/50 rounded-lg p-2.5 text-sm text-foreground resize-none focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/40"
                        placeholder="在此输入你的回答…"
                        value={answers[i] ?? ''}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [i]: e.target.value }))
                        }
                      />
                      <Button size="sm" onClick={() => startFeedback(i, ex.feedback)}>
                        提交回答
                      </Button>

                      {feedbackText[i] !== undefined && (
                        <div className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-3">
                          <span className="text-primary text-[10px] font-medium block mb-1">
                            AI 点评
                          </span>
                          {feedbackText[i]}
                          {!feedbackDone[i] && (
                            <span className="animate-pulse text-primary ml-0.5">▌</span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
