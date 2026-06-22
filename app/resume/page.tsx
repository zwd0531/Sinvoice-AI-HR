'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { ChevronDown, X } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type Column = 'pending' | 'passed' | 'talent' | 'rejected'

interface Dim {
  label: string
  value: number
}

interface Candidate {
  id: number
  name: string
  edu: string
  years: number
  score: number
  target: string
  column: Column
  dims: Dim[]
  reason: string
}

// ── Data ───────────────────────────────────────────────────────────────────

const RAW: Omit<Candidate, 'column'>[] = [
  {
    id: 1, name: '张伟', edu: '硕士', years: 5, score: 92, target: '高级算法工程师',
    dims: [
      { label: '技术匹配', value: 94 }, { label: '项目经验', value: 90 },
      { label: '教育背景', value: 92 }, { label: '综合素质', value: 88 },
    ],
    reason: '候选人在向量检索与深度学习领域积累扎实，主导过多个生产级算法项目，量化指标清晰（检索延迟降低89%）。技术栈与岗位要求高度吻合，建议优先安排技术面试。',
  },
  {
    id: 2, name: '李娜', edu: '本科', years: 3, score: 78, target: '算法工程师',
    dims: [
      { label: '技术匹配', value: 80 }, { label: '项目经验', value: 75 },
      { label: '教育背景', value: 72 }, { label: '综合素质', value: 82 },
    ],
    reason: '候选人基础扎实，有完整机器学习项目落地经验，综合素质评分较高。学历为本科，大型系统经验略显不足。建议笔试重点考察算法深度，表现良好可继续推进。',
  },
  {
    id: 3, name: '王磊', edu: '博士', years: 7, score: 95, target: '高级算法工程师',
    dims: [
      { label: '技术匹配', value: 97 }, { label: '项目经验', value: 95 },
      { label: '教育背景', value: 99 }, { label: '综合素质', value: 88 },
    ],
    reason: '博士学历，7年行业经验，顶会发表3篇论文，理论功底极强。参与过亿级用户推荐系统核心算法研发，工业落地经验丰富。综合匹配极高，强烈建议快速推进面试。',
  },
  {
    id: 4, name: '刘洋', edu: '本科', years: 2, score: 61, target: '算法工程师',
    dims: [
      { label: '技术匹配', value: 63 }, { label: '项目经验', value: 58 },
      { label: '教育背景', value: 65 }, { label: '综合素质', value: 60 },
    ],
    reason: '候选人工作年限短，项目经历以课程作业为主，缺乏完整工业级实战经验。技术深度与岗位要求存在一定差距。可作为储备候选人保留，短期内不建议推进面试。',
  },
  {
    id: 5, name: '陈静', edu: '硕士', years: 4, score: 88, target: '高级算法工程师',
    dims: [
      { label: '技术匹配', value: 90 }, { label: '项目经验', value: 85 },
      { label: '教育背景', value: 92 }, { label: '综合素质', value: 84 },
    ],
    reason: '候选人专注NLP方向，有多个完整的模型训练与部署经验，对大模型微调理解深入。简历书写规范，综合实力均衡，岗位匹配度高，建议进入技术面试环节。',
  },
  {
    id: 6, name: '赵强', edu: '本科', years: 6, score: 73, target: '算法工程师',
    dims: [
      { label: '技术匹配', value: 75 }, { label: '项目经验', value: 72 },
      { label: '教育背景', value: 68 }, { label: '综合素质', value: 76 },
    ],
    reason: '候选人有6年工程经验，擅长工程落地，但算法理论相对薄弱。学历为本科，岗位要求硕士及以上，存在学历差距。综合实力中等偏上，可视人才储备需求酌情保留。',
  },
  {
    id: 7, name: '周敏', edu: '硕士', years: 3, score: 86, target: '高级算法工程师',
    dims: [
      { label: '技术匹配', value: 88 }, { label: '项目经验', value: 82 },
      { label: '教育背景', value: 90 }, { label: '综合素质', value: 82 },
    ],
    reason: '候选人在CV与多模态领域有较强积累，硕士学历，项目经历完整。综合评分接近优秀线，技术匹配度良好。建议安排技术面试，重点考察大规模系统落地能力。',
  },
  {
    id: 8, name: '吴浩', edu: '本科', years: 1, score: 55, target: '初级算法工程师',
    dims: [
      { label: '技术匹配', value: 58 }, { label: '项目经验', value: 50 },
      { label: '教育背景', value: 60 }, { label: '综合素质', value: 55 },
    ],
    reason: '候选人刚参加工作，技术广度和深度均有较大提升空间，期望岗位与实际能力存在差距。若有初级岗位招聘计划可再行评估，当前阶段建议暂时搁置。',
  },
  {
    id: 9, name: '徐芳', edu: '硕士', years: 5, score: 91, target: '高级算法工程师',
    dims: [
      { label: '技术匹配', value: 93 }, { label: '项目经验', value: 88 },
      { label: '教育背景', value: 95 }, { label: '综合素质', value: 86 },
    ],
    reason: '候选人在推荐算法与用户行为建模领域深耕5年，主导过DAU千万级平台的召回与精排优化。硕士学历，技术深度与广度兼备，是本批次核心候选人之一，建议快速推进。',
  },
  {
    id: 10, name: '孙超', edu: '本科', years: 4, score: 69, target: '算法工程师',
    dims: [
      { label: '技术匹配', value: 70 }, { label: '项目经验', value: 68 },
      { label: '教育背景', value: 65 }, { label: '综合素质', value: 72 },
    ],
    reason: '候选人有4年工程经验，熟悉常见机器学习框架，项目落地能力尚可。学历为本科，算法理论基础偏弱，缺乏前沿研究经历。综合评分中等，可列为备选候选人。',
  },
  {
    id: 11, name: '马丽', edu: '博士', years: 8, score: 97, target: '高级算法工程师',
    dims: [
      { label: '技术匹配', value: 98 }, { label: '项目经验', value: 96 },
      { label: '教育背景', value: 100 }, { label: '综合素质', value: 94 },
    ],
    reason: '本批次综合实力最强候选人。博士学历，8年顶尖工业界经验，曾任某头部大厂算法负责人，多项专利持有者，技术影响力极强。岗位匹配度近满分，建议立即启动面试流程。',
  },
  {
    id: 12, name: '黄波', edu: '本科', years: 2, score: 58, target: '初级算法工程师',
    dims: [
      { label: '技术匹配', value: 60 }, { label: '项目经验', value: 55 },
      { label: '教育背景', value: 58 }, { label: '综合素质', value: 58 },
    ],
    reason: '候选人整体能力处于初级水平，项目经历以实习为主，技术储备有限。期望薪资与当前能力匹配度不高。短期内不建议推进，可纳入校招观察池待后续跟进。',
  },
  {
    id: 13, name: '林欣', edu: '硕士', years: 6, score: 84, target: '高级算法工程师',
    dims: [
      { label: '技术匹配', value: 86 }, { label: '项目经验', value: 82 },
      { label: '教育背景', value: 88 }, { label: '综合素质', value: 80 },
    ],
    reason: '候选人从事语音识别方向6年，硕士学历，在ASR系统优化方面积累丰富，WER有显著改善记录。技术实力接近初筛线，建议综合考量后决定是否安排面试。',
  },
  {
    id: 14, name: '杨帆', edu: '本科', years: 3, score: 76, target: '算法工程师',
    dims: [
      { label: '技术匹配', value: 78 }, { label: '项目经验', value: 74 },
      { label: '教育背景', value: 70 }, { label: '综合素质', value: 80 },
    ],
    reason: '候选人有较好的数据处理与特征工程经验，综合素质评分不错。技术匹配度一般，学历为本科，算法创新能力有限。可作为补充候选人，视面试名额情况决定是否推进。',
  },
  {
    id: 15, name: '朱婷', edu: '硕士', years: 4, score: 89, target: '高级算法工程师',
    dims: [
      { label: '技术匹配', value: 91 }, { label: '项目经验', value: 88 },
      { label: '教育背景', value: 90 }, { label: '综合素质', value: 85 },
    ],
    reason: '候选人在知识图谱与图神经网络方向积累深厚，硕士学历，参与过国家级AI课题研究。工程与研究能力兼备，表达逻辑清晰，岗位契合度高，建议安排技术面试。',
  },
]

function initCandidates(): Candidate[] {
  return RAW.map(c => ({ ...c, column: (c.score > 85 ? 'passed' : 'pending') as Column }))
}

// ── Constants ──────────────────────────────────────────────────────────────

const COL_LABELS: Record<Column, string> = {
  pending: '待处理',
  passed: '初筛通过',
  talent: '人才库',
  rejected: '已淘汰',
}

const COLUMNS: Column[] = ['pending', 'passed', 'talent', 'rejected']

const JD_OPTIONS = ['全部岗位', '高级算法工程师', '算法工程师', '初级算法工程师']

// 筛选标签键 → 断言
type FilterKey = 'master' | 'years5' | 'score85'
const FILTER_LABELS: { key: FilterKey; label: string }[] = [
  { key: 'master', label: '硕士+' },
  { key: 'years5', label: '5年+' },
  { key: 'score85', label: '匹配>85' },
]

function scoreColor(s: number): string {
  return s > 85 ? '#22d3ee' : s >= 60 ? '#eab308' : '#ef4444'
}

function scoreBg(s: number): string {
  return s > 85
    ? 'rgba(34,211,238,0.1)'
    : s >= 60
      ? 'rgba(234,179,8,0.1)'
      : 'rgba(239,68,68,0.1)'
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ResumePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(initCandidates)
  const [selected, setSelected] = useState<number | null>(null)
  const [received, setReceived] = useState(0)
  const [processed, setProcessed] = useState(0)
  const [jdFilter, setJdFilter] = useState<string>('全部岗位')
  const [jdOpen, setJdOpen] = useState(false)
  const [filters, setFilters] = useState<Set<FilterKey>>(new Set())

  function toggleFilter(key: FilterKey) {
    setFilters(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const filtered = candidates.filter(c => {
    if (jdFilter !== '全部岗位' && c.target !== jdFilter) return false
    if (filters.has('master') && !['硕士', '博士'].includes(c.edu)) return false
    if (filters.has('years5') && c.years < 5) return false
    if (filters.has('score85') && c.score <= 85) return false
    return true
  })

  useEffect(() => {
    let r = 0
    let p = 0
    const iv = setInterval(() => {
      let done = true
      if (r < 15) { r++; setReceived(r); done = false }
      if (p < 10) { p++; setProcessed(p); done = false }
      if (done) clearInterval(iv)
    }, 80)
    return () => clearInterval(iv)
  }, [])

  const sel = candidates.find(c => c.id === selected) ?? null

  function advance(id: number) {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id !== id || c.column === 'talent' || c.column === 'rejected') return c
        const next: Column = c.column === 'pending' ? 'passed' : 'talent'
        return { ...c, column: next }
      })
    )
    setSelected(null)
  }

  function archive(id: number) {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, column: 'talent' as Column } : c))
    setSelected(null)
  }

  function reject(id: number) {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, column: 'rejected' as Column } : c))
    setSelected(null)
  }

  return (
    <div
      className="fixed top-14 left-0 right-0 bottom-0 flex flex-col"
      style={{ background: '#0a0f1e' }}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="h-12 flex items-center px-6 gap-5 shrink-0 border-b border-white/[0.06]">
        {/* JD selector */}
        <div className="relative">
          <button
            onClick={() => setJdOpen(o => !o)}
            className="flex items-center gap-1 text-sm font-medium text-foreground cursor-pointer select-none"
          >
            <span>{jdFilter}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground mt-px transition-transform ${jdOpen ? 'rotate-180' : ''}`} />
          </button>
          {jdOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setJdOpen(false)} />
              <div
                className="absolute top-full left-0 mt-1 z-40 rounded-lg border border-white/10 py-1 min-w-[160px]"
                style={{ background: '#0d1424' }}
              >
                {JD_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setJdFilter(opt); setJdOpen(false) }}
                    className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-white/[0.06] transition-colors ${jdFilter === opt ? 'text-primary' : 'text-foreground/80'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-px h-4 bg-white/10 shrink-0" />

        {/* Filter chips */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilters(new Set())}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              filters.size === 0
                ? 'text-primary border-primary/40 bg-primary/10'
                : 'text-muted-foreground border-white/[0.08] hover:border-white/20'
            }`}
          >
            全部
          </button>
          {FILTER_LABELS.map(({ key, label }) => {
            const active = filters.has(key)
            return (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                  active
                    ? 'text-primary border-primary/40 bg-primary/10'
                    : 'text-muted-foreground border-white/[0.08] hover:border-white/20'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Stats */}
        <div className="ml-auto flex items-center gap-5 text-xs text-muted-foreground">
          <span>
            今日收到{' '}
            <span className="font-semibold tabular-nums text-foreground">{received}</span>
            {' '}份
          </span>
          <span>
            已处理{' '}
            <span className="font-semibold tabular-nums text-foreground">{processed}</span>
            {' '}份
          </span>
        </div>
      </div>

      {/* ── Kanban columns ──────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {COLUMNS.map((col, ci) => {
          const items = filtered.filter(c => c.column === col)
          return (
            <div
              key={col}
              className={`flex-1 flex flex-col overflow-hidden ${ci < 2 ? 'border-r border-white/[0.06]' : ''}`}
            >
              {/* Column header */}
              <div className="h-9 flex items-center px-4 gap-2 shrink-0 border-b border-white/[0.04]">
                <span
                  className={`text-xs font-medium uppercase tracking-wider ${
                    col === 'rejected' ? 'text-red-400/70' : 'text-muted-foreground'
                  }`}
                >
                  {COL_LABELS[col]}
                </span>
                <span
                  className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] flex items-center justify-center tabular-nums"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}
                >
                  {items.length}
                </span>
              </div>

              {/* Row list */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence initial={false}>
                  {items.map(c => (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.18 }}
                      onClick={() => setSelected(c.id)}
                      className="flex items-center gap-3 px-4 border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.025] transition-colors"
                      style={{ height: 40 }}
                    >
                      {/* Name */}
                      <span className="w-12 text-sm font-medium text-foreground shrink-0">
                        {c.name}
                      </span>
                      {/* Edu */}
                      <span className="w-9 text-xs text-muted-foreground shrink-0">
                        {c.edu}
                      </span>
                      {/* Years */}
                      <span className="w-10 text-xs text-muted-foreground shrink-0">
                        {c.years}年
                      </span>
                      {/* Score bar */}
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.06]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${c.score}%`, background: scoreColor(c.score) }}
                          />
                        </div>
                        <span
                          className="text-[11px] font-mono w-7 text-right shrink-0"
                          style={{ color: scoreColor(c.score) }}
                        >
                          {c.score}
                        </span>
                      </div>
                      {/* View link */}
                      <button
                        className="text-xs text-primary/40 hover:text-primary shrink-0 transition-colors"
                        onClick={e => { e.stopPropagation(); setSelected(c.id) }}
                      >
                        查看
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Drawer ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected !== null && sel && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-14 left-0 right-0 bottom-0 z-40"
              style={{ background: 'rgba(0,0,0,0.45)' }}
              onClick={() => setSelected(null)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-14 right-0 bottom-0 z-50 flex flex-col overflow-hidden"
              style={{
                width: '35%',
                background: '#0d1424',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Header */}
              <div className="h-12 flex items-center justify-between px-5 shrink-0 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">{sel.name}</span>
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{ background: scoreBg(sel.score), color: scoreColor(sel.score) }}
                  >
                    {sel.score} 分
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                {/* Basic info */}
                <section>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
                    基本信息
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: '学历', value: sel.edu },
                      { label: '工作年限', value: `${sel.years} 年` },
                      { label: '期望岗位', value: sel.target },
                    ].map(item => (
                      <div
                        key={item.label}
                        className="rounded px-3 py-2.5 bg-white/[0.03]"
                      >
                        <p className="text-[10px] text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-sm text-foreground font-medium truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Dimension bar chart */}
                <section>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
                    维度匹配分析
                  </p>
                  <ResponsiveContainer width="100%" height={148}>
                    <BarChart
                      layout="vertical"
                      data={sel.dims.map(d => ({ ...d, fill: scoreColor(d.value) }))}
                      margin={{ left: 4, right: 36, top: 0, bottom: 0 }}
                    >
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: '#475569' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="label"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        tickLine={false}
                        axisLine={false}
                        width={56}
                      />
                      <Bar
                        dataKey="value"
                        radius={2}
                        barSize={8}
                        isAnimationActive
                        animationBegin={80}
                        animationDuration={700}
                        label={{ position: 'right', fontSize: 10, fill: '#64748b' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </section>

                {/* AI reason */}
                <section>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-3">
                    AI 筛选理由
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {sel.reason}
                  </p>
                </section>
              </div>

              {/* Action buttons */}
              <div className="shrink-0 px-5 py-4 border-t border-white/[0.06] flex gap-2">
                <button
                  onClick={() => advance(sel.id)}
                  disabled={sel.column === 'talent' || sel.column === 'rejected'}
                  className="flex-1 py-2 text-xs font-medium rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sel.column === 'talent' ? '已在人才库' : sel.column === 'rejected' ? '已淘汰' : '进入下一阶段'}
                </button>
                <button
                  onClick={() => archive(sel.id)}
                  className="flex-1 py-2 text-xs font-medium rounded bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-colors"
                >
                  {sel.column === 'rejected' ? '移回人才库' : '放入人才库'}
                </button>
                {sel.column !== 'rejected' && (
                  <button
                    onClick={() => reject(sel.id)}
                    className="flex-1 py-2 text-xs font-medium rounded bg-red-500/[0.08] text-red-400/80 hover:bg-red-500/15 transition-colors"
                  >
                    不合适
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
