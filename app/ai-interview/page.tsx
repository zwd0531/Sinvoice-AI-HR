'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Mic, RotateCcw } from 'lucide-react'

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

// Pre-computed bar heights so they're stable across renders
const AI_BARS   = Array.from({ length: 20 }, (_, i) => 8  + Math.abs(Math.sin(i * 0.7 + 0.3)) * 22)
const CAND_BARS = Array.from({ length: 28 }, (_, i) => 6  + Math.abs(Math.sin(i * 1.4 + 0.6)) * 14 + Math.abs(Math.cos(i * 2.3)) * 7)

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
    setHrCompleted(0); setHrAvg(0); setHrPass(0); setBarAnimated(false)
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

  function nextQuestion() {
    if (questionIndex >= 4) return
    setQuestionIndex(qi => qi + 1)
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

  const q = QUESTIONS[questionIndex]

  return (
    <div
      className="fixed top-14 left-0 right-0 bottom-0 flex flex-col"
      style={{ background: '#0a0f1e' }}
    >
      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      <div className="h-10 flex items-center border-b border-white/[0.06] shrink-0 px-2">
        {(['candidate', 'hr'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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
        <div className="flex-1 flex flex-col overflow-hidden">

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
                  onClick={nextQuestion}
                  disabled={aiPhase !== 'recording' || questionIndex >= 4}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: 'rgba(34,211,238,0.14)', color: '#22d3ee' }}
                >
                  {questionIndex >= 4 ? '面试结束' : '完成作答，下一题'}
                  {questionIndex < 4 && <ChevronRight className="w-4 h-4" />}
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
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          HR DASHBOARD VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'hr' && (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-8">

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
