'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ChevronRight, FileText, Mic, RotateCcw } from 'lucide-react'
import { DemoBackdrop, DemoPanel, StatusPill } from '@/components/DemoBackdrop'

// ── Data ───────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    text: '请描述一次您在推荐系统项目中遇到的技术挑战，您是如何分析问题、制定方案并最终解决的？请结合具体数据说明效果。',
    type: '行为面试题 · STAR结构',
  },
  {
    text: '请介绍一个您主导设计的算法系统，包括核心技术选型理由、架构权衡，以及最终的落地效果与业务收益。',
    type: '技术深度题',
  },
  {
    text: '当您与团队在技术方案上存在重大分歧时，您通常如何推动达成共识？请举一个具体案例说明。',
    type: '团队协作题',
  },
  {
    text: '您如何看待算法模型的公平性与业务效果之间的权衡取舍？请结合您的实际项目经验进行分析。',
    type: '价值观题',
  },
  {
    text: '请描述您未来3-5年的职业规划，以及您认为加入思必驰对实现这些目标有哪些帮助？',
    type: '开放性题目',
  },
]

const SCORE_DIST = [
  { range: '90–100 分', count: 18,  max: 205, label: '强烈推荐',   color: '#22d3ee' },
  { range: '80–89 分',  count: 47,  max: 205, label: '推荐进入线下', color: '#34d399' },
  { range: '70–79 分',  count: 89,  max: 205, label: '待定',       color: '#eab308' },
  { range: '60–69 分',  count: 128, max: 205, label: '备用池',     color: '#f97316' },
  { range: '< 60 分',   count: 205, max: 205, label: '淘汰',       color: '#ef4444' },
]

const TOP_CANDIDATES = [
  { rank: 1,  name: '马丽', total: 97, skill: 98, express: 95, status: '强烈推荐'   },
  { rank: 2,  name: '王磊', total: 95, skill: 96, express: 93, status: '强烈推荐'   },
  { rank: 3,  name: '张伟', total: 92, skill: 93, express: 90, status: '强烈推荐'   },
  { rank: 4,  name: '徐芳', total: 91, skill: 90, express: 92, status: '强烈推荐'   },
  { rank: 5,  name: '朱婷', total: 89, skill: 91, express: 86, status: '推荐进入线下' },
  { rank: 6,  name: '陈静', total: 88, skill: 87, express: 89, status: '推荐进入线下' },
  { rank: 7,  name: '周敏', total: 86, skill: 85, express: 88, status: '推荐进入线下' },
  { rank: 8,  name: '林欣', total: 84, skill: 83, express: 86, status: '推荐进入线下' },
  { rank: 9,  name: '陈超', total: 83, skill: 84, express: 81, status: '推荐进入线下' },
  { rank: 10, name: '杨帆', total: 81, skill: 80, express: 82, status: '推荐进入线下' },
]

const QUESTION_ROUTE = [
  { label: 'STAR 行为题', state: '当前', tone: 'cyan' as const },
  { label: '技术深度题', state: '待播报', tone: 'blue' as const },
  { label: '协作冲突题', state: '待播报', tone: 'violet' as const },
  { label: '价值观题', state: '待播报', tone: 'emerald' as const },
  { label: '职业规划题', state: '待播报', tone: 'amber' as const },
]

const ENV_CHECKS = [
  { label: '麦克风', value: '正常', tone: 'emerald' as const },
  { label: '环境噪声', value: '32dB', tone: 'cyan' as const },
  { label: '网络延迟', value: '42ms', tone: 'blue' as const },
  { label: '身份核验', value: '通过', tone: 'emerald' as const },
]

const HR_FUNNEL = [
  { label: '邀约', value: 500, pct: 100, tone: '#22d3ee' },
  { label: '已完成', value: 487, pct: 97, tone: '#34d399' },
  { label: '推荐复试', value: 165, pct: 34, tone: '#8b5cf6' },
  { label: '强烈推荐', value: 18, pct: 4, tone: '#f59e0b' },
]

const ANOMALIES = [
  { name: '候选人 074', issue: '答题时长异常短', level: '需复核' },
  { name: '候选人 138', issue: '环境噪声过高', level: '建议重试' },
  { name: '候选人 266', issue: '答案重复度偏高', level: '人工确认' },
]

// Pre-computed bar heights so they're stable across renders
const AI_BARS   = Array.from({ length: 20 }, (_, i) => 8  + Math.abs(Math.sin(i * 0.7 + 0.3)) * 22)
const CAND_BARS = Array.from({ length: 28 }, (_, i) => 6  + Math.abs(Math.sin(i * 1.4 + 0.6)) * 14 + Math.abs(Math.cos(i * 2.3)) * 7)

// 模拟作答转写（演示用，对应每道题）
const MOCK_ANSWERS = [
  '我主导的推荐系统召回优化项目，核心挑战是冷启动场景下的多路召回融合。我们采用双塔模型结合在线学习，通过 AB 测试验证，CTR 提升 23%，召回延迟控制在 50ms 以内。',
  '我设计的算法系统中台，选型上对比了 TensorFlow Serving 与自研推理引擎，最终选择自研以支持动态 batching。架构上做了模型与算子解耦，落地后 QPS 提升 4 倍，年节省机器成本约 300 万。',
  '遇到技术分歧时我倾向于用数据说话。有一次关于是否引入图神经网络的争论，我组织了离线评估与线上灰度实验，用指标对比推动团队达成共识，最终方案上线后留存提升 1.8%。',
  '我认为公平性与效果并非完全对立。通过引入反事实评估与约束优化，我们能在保证业务指标的前提下将群体偏差降低 15%，关键是把公平性纳入建模目标而非事后修补。',
  '我希望未来 3-5 年在语音 AI 与大模型融合方向深入，先夯实算法工程能力，再逐步承担技术规划角色。思必驰在语音领域的积累与 AI 办公本的落地场景与我的方向高度契合。',
]

// 面试结束后 AI 生成的评估摘要（演示用）
const MOCK_REPORT = {
  overall: 86,
  recommendation: '推荐进入线下复试',
  summary: '候选人技术功底扎实，对推荐系统优化有完整方法论与量化成果；表达逻辑清晰，能结合 STAR 结构组织案例。建议线下复试重点考察大规模系统落地与跨团队协作细节。',
  dimensions: [
    { name: '技术深度', score: 88 },
    { name: '表达能力', score: 84 },
    { name: '逻辑思维', score: 90 },
    { name: '职业动机', score: 82 },
    { name: '团队协作', score: 85 },
  ],
}

type AiPhase = 'speaking' | 'waiting' | 'recording'

function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function statusColor(s: string) {
  if (s === '强烈推荐')   return '#22d3ee'
  if (s === '推荐进入线下') return '#34d399'
  if (s === '待定')       return '#eab308'
  if (s === '备用池')     return '#f97316'
  return '#ef4444'
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AIInterviewPage() {
  // Tab
  const [activeTab, setActiveTab] = useState<'candidate' | 'hr'>('candidate')

  // Candidate view
  const [questionIndex, setQuestionIndex] = useState(0)
  const [aiPhase, setAiPhase]             = useState<AiPhase>('speaking')
  const [speakKey, setSpeakKey]           = useState(0)
  const [seconds, setSeconds]             = useState(0)
  const [answers, setAnswers] = useState<Record<number, { duration: number; transcript: string }>>({})
  const [finished, setFinished] = useState(false)

  // HR view
  const [hrCompleted, setHrCompleted] = useState(0)
  const [hrAvg,       setHrAvg]       = useState(0)
  const [hrPass,      setHrPass]      = useState(0)
  const [barAnimated, setBarAnimated] = useState(false)

  // Toast
  const [toast, setToast] = useState<string | null>(null)

  const speakRef    = useRef<ReturnType<typeof setTimeout>  | null>(null)
  const recordRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const toastRef    = useRef<ReturnType<typeof setTimeout>  | null>(null)
  const hrCountRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cleanup on unmount
  useEffect(() => () => {
    if (speakRef.current)   clearTimeout(speakRef.current)
    if (recordRef.current)  clearInterval(recordRef.current)
    if (toastRef.current)   clearTimeout(toastRef.current)
    if (hrCountRef.current) clearInterval(hrCountRef.current)
  }, [])

  // AI speaking → waiting after 5 s
  useEffect(() => {
    if (aiPhase !== 'speaking') return
    speakRef.current = setTimeout(() => setAiPhase('waiting'), 5000)
    return () => { if (speakRef.current) clearTimeout(speakRef.current) }
  }, [aiPhase, speakKey])

  // Recording timer
  useEffect(() => {
    if (aiPhase !== 'recording') {
      if (recordRef.current) clearInterval(recordRef.current)
      return
    }
    recordRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => { if (recordRef.current) clearInterval(recordRef.current) }
  }, [aiPhase])

  // HR counting animation
  useEffect(() => {
    if (activeTab !== 'hr') return
    let frame = 0
    const iv = setInterval(() => {
      frame++
      const p = Math.min(frame / 60, 1)
      setHrCompleted(Math.round(487 * p))
      setHrAvg(Math.round(712 * p) / 10)
      setHrPass(Math.round(34 * p))
      if (frame >= 60) clearInterval(iv)
    }, 25)
    hrCountRef.current = iv
    const bt = setTimeout(() => setBarAnimated(true), 250)
    return () => { clearInterval(iv); clearTimeout(bt) }
  }, [activeTab])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function recordAnswer() {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: { duration: seconds, transcript: MOCK_ANSWERS[questionIndex] },
    }))
  }

  function nextQuestion() {
    if (questionIndex >= 4) return
    recordAnswer()
    setQuestionIndex(qi => qi + 1)
    setAiPhase('speaking')
    setSeconds(0)
    setSpeakKey(k => k + 1)
  }

  function finishInterview() {
    if (aiPhase !== 'recording') return
    recordAnswer()
    setFinished(true)
  }

  function restartInterview() {
    setFinished(false)
    setAnswers({})
    setQuestionIndex(0)
    setAiPhase('speaking')
    setSeconds(0)
    setSpeakKey(k => k + 1)
  }

  function redoAnswer() {
    setAiPhase('speaking')
    setSeconds(0)
    setSpeakKey(k => k + 1)
  }

  function showToast(msg: string) {
    setToast(msg)
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(null), 2500)
  }

  function switchTab(tab: 'candidate' | 'hr') {
    setActiveTab(tab)
    if (tab === 'hr') {
      setHrCompleted(0)
      setHrAvg(0)
      setHrPass(0)
      setBarAnimated(false)
    }
  }

  const q = QUESTIONS[questionIndex]

  return (
    <div
      className="fixed top-14 left-0 right-0 bottom-0 flex flex-col overflow-hidden"
      style={{ background: '#0a0f1e' }}
    >
      <DemoBackdrop density="dense" />
      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 h-10 flex items-center border-b border-white/[0.06] shrink-0 px-2 bg-[#0a0f1e]/55 backdrop-blur-md">
        {(['candidate', 'hr'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className="relative h-full px-5 text-sm font-medium transition-colors"
            style={{ color: activeTab === tab ? '#22d3ee' : '#64748b' }}
          >
            {tab === 'candidate' ? '候选人视角' : 'HR 大盘视角'}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-line"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          CANDIDATE VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'candidate' && (
        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
          {!finished ? (<>

          {/* Progress bar */}
          <div
            className="px-10 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <span className="text-xs text-muted-foreground shrink-0 w-24">
                第 {questionIndex + 1} 题 / 共 5 题
              </span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/[0.08]">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${((questionIndex + 1) / 5) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-xs text-primary/70 tabular-nums w-8 text-right shrink-0">
                {Math.round(((questionIndex + 1) / 5) * 100)}%
              </span>
            </div>
            {Object.keys(answers).length > 0 && (
              <div className="max-w-2xl mx-auto flex flex-wrap gap-2 mt-3">
                {Object.entries(answers).map(([k, v]) => (
                  <span
                    key={k}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground/60 px-2 py-0.5 rounded-full border border-white/[0.06]"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    第{Number(k) + 1}题 · {formatTime(v.duration)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute left-6 top-24 bottom-5 hidden w-64 flex-col gap-3 xl:flex">
            <DemoPanel className="pointer-events-auto p-3" tone="cyan">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Question Route</p>
              <div className="mt-3 space-y-2">
                {QUESTION_ROUTE.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-2 rounded-lg bg-white/[0.035] px-3 py-2">
                    <span className={`flex size-5 items-center justify-center rounded-full text-[10px] ${i <= questionIndex ? 'bg-cyan-400/20 text-cyan-100' : 'bg-white/[0.05] text-white/35'}`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-white/70">{item.label}</p>
                      <p className="text-[10px] text-white/35">{i < questionIndex ? '已完成' : i === questionIndex ? item.state : '待播报'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DemoPanel>

            <DemoPanel className="pointer-events-auto p-3" tone="emerald">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Environment Check</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {ENV_CHECKS.map((item) => (
                  <StatusPill key={item.label} {...item} />
                ))}
              </div>
            </DemoPanel>
          </div>

          <div className="pointer-events-none absolute right-6 top-24 bottom-5 hidden w-72 flex-col gap-3 xl:flex">
            <DemoPanel className="pointer-events-auto p-3" tone="violet">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Scoring Dimensions</p>
              <div className="mt-3 space-y-2">
                {MOCK_REPORT.dimensions.map((item) => (
                  <div key={item.name}>
                    <div className="mb-1 flex justify-between text-[10px]">
                      <span className="text-white/50">{item.name}</span>
                      <span className="font-mono text-cyan-100">{item.score}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                      <div className="h-full rounded-full bg-cyan-300/70" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </DemoPanel>

            <DemoPanel className="pointer-events-auto p-3" tone="amber">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Candidate Guidance</p>
              <div className="mt-3 space-y-2 text-xs leading-relaxed text-white/55">
                <p>请用 STAR 结构回答，优先说明量化结果和个人贡献。</p>
                <p>录音阶段 AI 会进行实时转写，结束后自动生成评估报告。</p>
              </div>
            </DemoPanel>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col items-center justify-center px-10 gap-5">

            {/* AI avatar */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(34,211,238,0.08)',
                  border: '2px solid rgba(34,211,238,0.5)',
                }}
                animate={{
                  boxShadow: aiPhase === 'speaking'
                    ? [
                        '0 0 20px rgba(34,211,238,0.25)',
                        '0 0 45px rgba(34,211,238,0.55)',
                        '0 0 20px rgba(34,211,238,0.25)',
                      ]
                    : '0 0 12px rgba(34,211,238,0.12)',
                }}
                transition={{ repeat: aiPhase === 'speaking' ? Infinity : 0, duration: 2 }}
              >
                <span className="text-xl font-bold" style={{ color: '#22d3ee' }}>AI</span>
              </motion.div>
              <span className="text-xs text-muted-foreground">AI 面试官</span>
            </div>

            {/* AI waveform */}
            <div className="flex items-center gap-px" style={{ height: 40 }}>
              {AI_BARS.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ background: 'rgba(34,211,238,0.55)', height: h }}
                  animate={{
                    scaleY: aiPhase === 'speaking'
                      ? [0.15, 1, 0.4, 0.85, 0.25, 1, 0.15]
                      : 0.06,
                  }}
                  transition={{
                    repeat: aiPhase === 'speaking' ? Infinity : 0,
                    duration: 0.7 + i * 0.04,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={questionIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-xl"
              >
                <p className="text-lg leading-relaxed text-foreground/90 font-medium">
                  {q.text}
                </p>
                <span
                  className="inline-block mt-3 text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(34,211,238,0.07)',
                    color: 'rgba(34,211,238,0.7)',
                    border: '1px solid rgba(34,211,238,0.15)',
                  }}
                >
                  {q.type}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Answer area */}
            <div className="w-full max-w-xl">
              {aiPhase === 'speaking' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-muted-foreground/60"
                >
                  AI 面试官正在播报题目，请耐心等待…
                </motion.p>
              )}

              {aiPhase === 'waiting' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <p className="text-sm text-muted-foreground">题目播报完毕，请点击开始作答</p>
                  <button
                    onClick={() => setAiPhase('recording')}
                    className="flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-colors"
                    style={{
                      border: '1px solid rgba(34,211,238,0.4)',
                      color: '#22d3ee',
                      background: 'rgba(34,211,238,0.06)',
                    }}
                  >
                    <Mic className="w-4 h-4" />
                    开始录音
                  </button>
                </motion.div>
              )}

              {aiPhase === 'recording' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  {/* Recording indicator */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-red-500 shrink-0"
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.7 }}
                    />
                    正在录制您的回答… 已录制{' '}
                    <span className="font-mono text-foreground">{formatTime(seconds)}</span>
                  </div>

                  {/* Candidate waveform */}
                  <div className="flex items-center gap-px" style={{ height: 32 }}>
                    {CAND_BARS.map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-[2px] rounded-full bg-red-400"
                        style={{ height: h }}
                        animate={{ scaleY: [0.3, 1, 0.5, 0.8, 0.2, 1, 0.4] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.5 + i * 0.025,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={redoAnswer}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-white/[0.12] text-muted-foreground hover:text-foreground hover:border-white/25 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  重新作答
                </button>
                <button
                  onClick={questionIndex >= 4 ? finishInterview : nextQuestion}
                  disabled={aiPhase !== 'recording'}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: 'rgba(34,211,238,0.14)', color: '#22d3ee' }}
                >
                  {questionIndex >= 4 ? '完成作答，结束面试' : '完成作答，下一题'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pb-4 shrink-0">
            <p className="text-[10px] text-muted-foreground/30">
              本次面试共 5 题，预计 25 分钟 · 请在安静环境中作答
            </p>
          </div>
          </>) : (
          <div className="flex-1 overflow-y-auto px-10 py-8">
            {/* ════ 完成页：作答记录 + AI评估 + 工作流引导 ════ */}
            <div className="max-w-2xl mx-auto space-y-6">

              {/* 头部 */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-3"
              >
                <div
                  className="inline-flex w-14 h-14 rounded-full items-center justify-center"
                  style={{ background: 'rgba(34,211,238,0.1)', border: '2px solid rgba(34,211,238,0.4)' }}
                >
                  <CheckCircle2 className="w-7 h-7" style={{ color: '#22d3ee' }} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">面试已完成</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    候选人 · 张伟 · 高级算法工程师 · AI 已生成评估报告
                  </p>
                </div>
              </motion.div>

              {/* 作答记录 */}
              <div
                className="rounded-xl p-5 space-y-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  作答记录 · AI 实时转写
                </p>
                {QUESTIONS.map((qq, i) => {
                  const a = answers[i]
                  return (
                    <div key={i} className="flex gap-3">
                      <span className="text-xs font-mono text-primary/70 shrink-0 w-6 mt-0.5">Q{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(34,211,238,0.08)', color: 'rgba(34,211,238,0.7)' }}
                          >
                            {qq.type}
                          </span>
                          <span className="text-[10px] text-muted-foreground/50">
                            作答时长 {a ? formatTime(a.duration) : '--'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/55 leading-relaxed line-clamp-2">
                          {a ? a.transcript : '未作答'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* AI 评估摘要 */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl p-5 space-y-4"
                style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.15)' }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    AI 评估摘要
                  </p>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee' }}
                  >
                    {MOCK_REPORT.recommendation}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold shrink-0" style={{ color: '#22d3ee' }}>
                    {MOCK_REPORT.overall}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                    {MOCK_REPORT.summary}
                  </p>
                </div>
                <div className="space-y-2 pt-1">
                  {MOCK_REPORT.dimensions.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">{d.name}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: '#22d3ee' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${d.score}%` }}
                          transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                        />
                      </div>
                      <span className="text-xs font-mono w-7 text-right" style={{ color: '#22d3ee' }}>
                        {d.score}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 工作流引导 · 分工 */}
              <div
                className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                  下一步 · 工作流分工
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/hr"
                    className="group flex items-center gap-3 p-3 rounded-lg border border-white/[0.08] hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-primary/70 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground font-medium">转交 HR 复核</p>
                      <p className="text-[10px] text-muted-foreground/60">HR 面试助手实时分析</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary ml-auto transition-colors" />
                  </Link>
                  <Link
                    href="/candidate"
                    className="group flex items-center gap-3 p-3 rounded-lg border border-white/[0.08] hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-primary/70 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground font-medium">候选人复盘</p>
                      <p className="text-[10px] text-muted-foreground/60">回放与改进建议</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary ml-auto transition-colors" />
                  </Link>
                </div>
                <button
                  onClick={restartInterview}
                  className="mt-3 w-full py-2 text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  重新面试
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          HR DASHBOARD VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'hr' && (
        <div className="relative z-10 flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-6xl mx-auto space-y-8">

            <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
              <DemoPanel className="p-4" tone="cyan">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">Batch Interview Funnel</p>
                    <h2 className="mt-1 text-lg font-semibold text-white">校招算法岗 · 500 人异步面试</h2>
                  </div>
                  <StatusPill label="批次状态" value="自动评分中" tone="emerald" />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {HR_FUNNEL.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/[0.06] bg-white/[0.035] p-3">
                      <p className="text-[10px] text-white/40">{item.label}</p>
                      <p className="mt-1 text-xl font-semibold text-white tabular-nums">{item.value}</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                        <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.tone }} />
                      </div>
                    </div>
                  ))}
                </div>
              </DemoPanel>

              <DemoPanel className="p-4" tone="amber">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">Exception Queue</p>
                <div className="mt-3 space-y-2">
                  {ANOMALIES.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white/80">{item.name}</p>
                        <p className="truncate text-[10px] text-white/40">{item.issue}</p>
                      </div>
                      <span className="shrink-0 rounded border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-[10px] text-amber-100">
                        {item.level}
                      </span>
                    </div>
                  ))}
                </div>
              </DemoPanel>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '已完成', value: `${hrCompleted} / 500`, unit: '人' },
                { label: '平均分',  value: hrAvg.toFixed(1),       unit: '分' },
                { label: '通过率',  value: `${hrPass}%`,           unit: ''   },
                { label: '用时',    value: '< 3小时',              unit: ''   },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl px-5 py-4"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p className="text-xs text-muted-foreground mb-1.5">{s.label}</p>
                  <p className="text-2xl font-semibold text-foreground tabular-nums">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Score distribution */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                分数分布
              </p>
              <div className="space-y-3">
                {SCORE_DIST.map((row, i) => (
                  <div key={row.range} className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground shrink-0 w-20">{row.range}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/[0.05]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: row.color }}
                        initial={{ width: 0 }}
                        animate={{ width: barAnimated ? `${(row.count / row.max) * 100}%` : '0%' }}
                        transition={{ duration: 0.65, ease: 'easeOut', delay: i * 0.09 }}
                      />
                    </div>
                    <span className="text-xs text-foreground/60 w-10 text-right shrink-0 tabular-nums">
                      {row.count} 人
                    </span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded shrink-0 w-24 text-center"
                      style={{ background: `${row.color}15`, color: row.color }}
                    >
                      {row.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 10 table */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                前 10 名候选人
              </p>
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Header */}
                <div
                  className="grid grid-cols-6 px-5 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span>排名</span>
                  <span>姓名</span>
                  <span>综合分</span>
                  <span>专业能力</span>
                  <span>表达能力</span>
                  <span>状态</span>
                </div>

                {/* Rows */}
                {TOP_CANDIDATES.map((c, i) => (
                  <motion.div
                    key={c.rank}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: i * 0.045 }}
                    className="grid grid-cols-6 px-5 py-3 text-sm items-center"
                    style={{
                      borderBottom: i < TOP_CANDIDATES.length - 1
                        ? '1px solid rgba(255,255,255,0.04)'
                        : 'none',
                      background: i === 0 ? 'rgba(34,211,238,0.04)' : 'transparent',
                    }}
                  >
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: i === 0 ? '#22d3ee' : '#475569' }}
                    >
                      #{c.rank}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: i === 0 ? '#22d3ee' : 'rgba(226,232,240,0.8)' }}
                    >
                      {c.name}
                    </span>
                    <span
                      className="font-semibold tabular-nums"
                      style={{ color: i === 0 ? '#22d3ee' : '#e2e8f0' }}
                    >
                      {c.total}
                    </span>
                    <span className="text-foreground/60 tabular-nums">{c.skill}</span>
                    <span className="text-foreground/60 tabular-nums">{c.express}</span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded w-fit"
                      style={{
                        background: `${statusColor(c.status)}12`,
                        color: statusColor(c.status),
                      }}
                    >
                      {c.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pb-2">
              {['查看完整候选人列表', '导出评分报告', '一键发送面试邀约'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => showToast('当前为 Demo 模式，该功能暂不可用')}
                  className="px-4 py-2 text-sm rounded-lg border transition-colors"
                  style={
                    i === 2
                      ? {
                          background: 'rgba(34,211,238,0.1)',
                          borderColor: 'rgba(34,211,238,0.3)',
                          color: '#22d3ee',
                        }
                      : {
                          background: 'transparent',
                          borderColor: 'rgba(255,255,255,0.1)',
                          color: '#94a3b8',
                        }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg text-sm text-foreground/90 whitespace-nowrap"
            style={{
              background: 'rgba(15,23,42,0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
