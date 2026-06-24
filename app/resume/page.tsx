'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { ChevronDown, Search, X } from 'lucide-react'
import { DemoBackdrop, DemoPanel, MetricTile, StatusPill } from '@/components/DemoBackdrop'
import {
  resumeCandidates,
  resumeJobOptions,
  resumeSources,
  type ResumeCandidate,
  type ResumeColumn,
} from '@/lib/resume-data'

const COL_LABELS: Record<ResumeColumn, string> = {
  pending: '待处理',
  passed: '初筛通过',
  talent: '人才库',
  rejected: '已淘汰',
}

const COLUMNS: ResumeColumn[] = ['pending', 'passed', 'talent', 'rejected']
const EDU_OPTIONS = ['全部学历', '硕士+', '博士', '本科', '大专']
const SCORE_OPTIONS = ['全部分数', '85分以上', '70-84分', '70分以下']

function scoreColor(score: number): string {
  if (score >= 86) return '#22d3ee'
  if (score >= 75) return '#34d399'
  if (score >= 60) return '#eab308'
  return '#ef4444'
}

function scoreBg(score: number): string {
  if (score >= 86) return 'rgba(34,211,238,0.12)'
  if (score >= 75) return 'rgba(52,211,153,0.12)'
  if (score >= 60) return 'rgba(234,179,8,0.12)'
  return 'rgba(239,68,68,0.12)'
}

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((next) => !next)}
        className="flex h-8 min-w-[118px] items-center justify-between gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 text-xs text-foreground transition-colors hover:border-cyan-400/35"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-40 mt-1 max-h-64 min-w-full overflow-y-auto rounded-lg border border-white/10 bg-[#0d1424] py-1 shadow-2xl">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
                className={`block w-full whitespace-nowrap px-3 py-1.5 text-left text-xs transition-colors hover:bg-white/[0.06] ${
                  value === option ? 'text-primary' : 'text-foreground/75'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function ResumePage() {
  const [candidates, setCandidates] = useState<ResumeCandidate[]>(resumeCandidates)
  const [selected, setSelected] = useState<number | null>(null)
  const [received, setReceived] = useState(0)
  const [processed, setProcessed] = useState(0)
  const [jobFilter, setJobFilter] = useState('全部岗位')
  const [sourceFilter, setSourceFilter] = useState('全部来源')
  const [eduFilter, setEduFilter] = useState('全部学历')
  const [scoreFilter, setScoreFilter] = useState('全部分数')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let r = 0
    let p = 0
    const iv = setInterval(() => {
      let done = true
      if (r < resumeCandidates.length) {
        r += 1
        setReceived(r)
        done = false
      }
      if (p < 24) {
        p += 1
        setProcessed(p)
        done = false
      }
      if (done) clearInterval(iv)
    }, 45)
    return () => clearInterval(iv)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return candidates.filter((candidate) => {
      if (jobFilter !== '全部岗位' && candidate.target !== jobFilter) return false
      if (sourceFilter !== '全部来源' && candidate.source !== sourceFilter) return false
      if (eduFilter === '硕士+' && !['硕士', '博士'].includes(candidate.edu)) return false
      if (eduFilter !== '全部学历' && eduFilter !== '硕士+' && candidate.edu !== eduFilter) return false
      if (scoreFilter === '85分以上' && candidate.score < 85) return false
      if (scoreFilter === '70-84分' && (candidate.score < 70 || candidate.score > 84)) return false
      if (scoreFilter === '70分以下' && candidate.score >= 70) return false
      if (!q) return true
      return [
        candidate.name,
        candidate.target,
        candidate.location,
        candidate.owner,
        candidate.source,
        ...candidate.skills,
        ...candidate.tags,
      ].some((item) => item.toLowerCase().includes(q))
    })
  }, [candidates, eduFilter, jobFilter, query, scoreFilter, sourceFilter])

  const selectedCandidate = candidates.find((candidate) => candidate.id === selected) ?? null

  const stats = useMemo(() => {
    const excellent = candidates.filter((candidate) => candidate.score >= 86).length
    const risks = candidates.filter((candidate) => candidate.riskFlags.length > 0).length
    const avg = Math.round(candidates.reduce((sum, candidate) => sum + candidate.score, 0) / candidates.length)
    return { excellent, risks, avg }
  }, [candidates])

  const distribution = useMemo(() => ([
    { label: '90+', value: candidates.filter((candidate) => candidate.score >= 90).length },
    { label: '80-89', value: candidates.filter((candidate) => candidate.score >= 80 && candidate.score < 90).length },
    { label: '70-79', value: candidates.filter((candidate) => candidate.score >= 70 && candidate.score < 80).length },
    { label: '<70', value: candidates.filter((candidate) => candidate.score < 70).length },
  ]), [candidates])

  function moveCandidate(id: number, column: ResumeColumn) {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? {
              ...candidate,
              column,
              stageHistory: [
                ...candidate.stageHistory,
                column === 'passed'
                  ? 'HR 推进至初筛通过'
                  : column === 'talent'
                    ? 'HR 放入人才库'
                    : column === 'rejected'
                      ? 'HR 标记淘汰'
                      : '移回待处理',
              ],
            }
          : candidate
      )
    )
    setSelected(null)
  }

  function advance(candidate: ResumeCandidate) {
    if (candidate.column === 'pending') moveCandidate(candidate.id, 'passed')
    else if (candidate.column === 'passed') moveCandidate(candidate.id, 'talent')
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-14 flex flex-col overflow-hidden bg-[#0a0f1e]">
      <DemoBackdrop density="dense" />

      <div className="relative z-10 flex shrink-0 flex-col gap-3 border-b border-white/[0.06] bg-[#0a0f1e]/70 px-4 py-3 backdrop-blur-md lg:px-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/60">Resume Intelligence Center</p>
            <h1 className="mt-1 text-lg font-semibold text-white">简历智能筛选 · 完整人才池</h1>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:ml-auto xl:w-[560px]">
            <MetricTile label="今日收到" value={`${received}`} sub="30 份入池" />
            <MetricTile label="已处理" value={`${processed}`} sub="AI 初筛完成" tone="emerald" />
            <MetricTile label="高匹配" value={`${stats.excellent}`} sub=">= 86 分" tone="violet" />
            <MetricTile label="风险提示" value={`${stats.risks}`} sub={`均分 ${stats.avg}`} tone="amber" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:max-w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索姓名、技能、城市、负责人..."
              className="h-8 w-full rounded-lg border border-white/[0.08] bg-white/[0.035] pl-9 pr-3 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/45 focus:border-cyan-400/45"
            />
          </div>
          <Dropdown value={jobFilter} options={resumeJobOptions} onChange={setJobFilter} />
          <Dropdown value={sourceFilter} options={resumeSources} onChange={setSourceFilter} />
          <Dropdown value={eduFilter} options={EDU_OPTIONS} onChange={setEduFilter} />
          <Dropdown value={scoreFilter} options={SCORE_OPTIONS} onChange={setScoreFilter} />
          <button
            onClick={() => {
              setQuery('')
              setJobFilter('全部岗位')
              setSourceFilter('全部来源')
              setEduFilter('全部学历')
              setScoreFilter('全部分数')
            }}
            className="h-8 rounded-lg border border-white/[0.08] px-3 text-xs text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground"
          >
            重置
          </button>
          <StatusPill label="当前视图" value={`${filtered.length} / ${candidates.length}`} tone="blue" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-[250px] shrink-0 flex-col gap-3 border-r border-white/[0.06] p-3 xl:flex">
          <DemoPanel className="p-3" tone="cyan">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Score Distribution</p>
            <div className="mt-2 h-40">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={distribution} margin={{ left: -22, right: 6, top: 10, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <Bar dataKey="value" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DemoPanel>

          <DemoPanel className="p-3" tone="emerald">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Pipeline Signals</p>
            <div className="mt-3 space-y-2">
              {[
                ['解析成功率', '99.2%'],
                ['平均解析耗时', '21s'],
                ['HR 复核节省', '4.8h'],
                ['待约面候选', `${candidates.filter((candidate) => candidate.column === 'passed').length} 人`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2">
                  <span className="text-xs text-white/50">{label}</span>
                  <span className="text-xs font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </DemoPanel>

          <DemoPanel className="p-3" tone="amber">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Hot Tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['语音算法', '推荐系统', '多模态', '端侧部署', 'MLOps', '负责人画像', 'NLP', '知识图谱'].map((tag) => (
                <span key={tag} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-white/65">
                  {tag}
                </span>
              ))}
            </div>
          </DemoPanel>
        </aside>

        <div className="min-w-0 flex-1 overflow-x-auto">
          <div className="grid h-full min-w-[1040px] grid-cols-4">
            {COLUMNS.map((column, index) => {
              const items = filtered.filter((candidate) => candidate.column === column)
              return (
                <section
                  key={column}
                  className={`flex min-w-0 flex-col overflow-hidden ${index < COLUMNS.length - 1 ? 'border-r border-white/[0.06]' : ''}`}
                >
                  <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/[0.04] bg-white/[0.02] px-4">
                    <span className={`text-xs font-semibold ${column === 'rejected' ? 'text-red-300' : 'text-white/70'}`}>
                      {COL_LABELS[column]}
                    </span>
                    <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[10px] text-white/45">{items.length}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3">
                    <AnimatePresence initial={false}>
                      {items.map((candidate) => (
                        <motion.button
                          key={candidate.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 16 }}
                          transition={{ duration: 0.18 }}
                          onClick={() => setSelected(candidate.id)}
                          className="mb-2 block w-full rounded-xl border border-white/[0.07] bg-white/[0.035] p-3 text-left transition-colors hover:border-cyan-400/35 hover:bg-cyan-400/[0.045]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold text-white">{candidate.name}</p>
                                <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/50">
                                  {candidate.edu}
                                </span>
                              </div>
                              <p className="mt-1 truncate text-xs text-white/45">
                                {candidate.target} · {candidate.location} · {candidate.years} 年
                              </p>
                            </div>
                            <span
                              className="rounded-md px-2 py-1 text-xs font-mono font-semibold"
                              style={{ background: scoreBg(candidate.score), color: scoreColor(candidate.score) }}
                            >
                              {candidate.score}
                            </span>
                          </div>

                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${candidate.score}%`, background: scoreColor(candidate.score) }}
                            />
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {candidate.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="rounded border border-white/[0.08] px-1.5 py-0.5 text-[10px] text-white/45">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-x-0 bottom-0 top-14 z-40 bg-black/55"
              onClick={() => setSelected(null)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed bottom-0 right-0 top-14 z-50 flex w-full max-w-[560px] flex-col overflow-hidden border-l border-white/[0.08] bg-[#0d1424]"
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="truncate text-base font-semibold text-white">{selectedCandidate.name}</h2>
                    <span
                      className="rounded-md px-2 py-1 text-xs font-mono font-semibold"
                      style={{ background: scoreBg(selectedCandidate.score), color: scoreColor(selectedCandidate.score) }}
                    >
                      {selectedCandidate.score} 分
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-white/45">
                    {selectedCandidate.target} · {selectedCandidate.source} · {selectedCandidate.owner} 跟进
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground transition-colors hover:text-white">
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['学历', selectedCandidate.edu],
                    ['经验', `${selectedCandidate.years} 年`],
                    ['期望', selectedCandidate.expectedSalary],
                    ['城市', selectedCandidate.location],
                    ['来源', selectedCandidate.source],
                    ['更新', selectedCandidate.lastUpdated],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.035] px-3 py-2.5">
                      <p className="text-[10px] text-white/35">{label}</p>
                      <p className="mt-1 truncate text-xs font-medium text-white/80">{value}</p>
                    </div>
                  ))}
                </div>

                <section className="mt-6">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/40">维度匹配分析</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart
                      layout="vertical"
                      data={selectedCandidate.dims.map((dim) => ({ ...dim, fill: scoreColor(dim.value) }))}
                      margin={{ left: 4, right: 36, top: 0, bottom: 0 }}
                    >
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={58} />
                      <Bar dataKey="value" radius={3} barSize={9} label={{ position: 'right', fontSize: 10, fill: '#64748b' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </section>

                <section className="mt-6">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/40">核心技能</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill) => (
                      <span key={skill} className="rounded-md border border-cyan-400/20 bg-cyan-400/[0.06] px-2 py-1 text-xs text-cyan-100/85">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="mt-6">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/40">AI 筛选理由</p>
                  <p className="border-l-2 border-cyan-400/40 pl-3 text-sm leading-relaxed text-white/68">
                    {selectedCandidate.reason}
                  </p>
                </section>

                <section className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/40">亮点证据</p>
                    <div className="space-y-2">
                      {selectedCandidate.highlights.map((item) => (
                        <div key={item} className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.045] px-3 py-2 text-xs text-emerald-50/80">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/40">风险提示</p>
                    {selectedCandidate.riskFlags.length > 0 ? (
                      <div className="space-y-2">
                        {selectedCandidate.riskFlags.map((item) => (
                          <div key={item} className="rounded-lg border border-amber-400/15 bg-amber-400/[0.045] px-3 py-2 text-xs text-amber-50/80">
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.035] px-3 py-2 text-xs text-white/45">
                        暂无明显风险，建议进入下一轮验证。
                      </div>
                    )}
                  </div>
                </section>

                <section className="mt-6">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/40">流转历史</p>
                  <div className="space-y-2">
                    {selectedCandidate.stageHistory.map((stage, index) => (
                      <div key={`${stage}-${index}`} className="flex items-center gap-3 text-xs">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 font-mono text-[10px] text-cyan-100">
                          {index + 1}
                        </span>
                        <span className="text-white/65">{stage}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="flex shrink-0 gap-2 border-t border-white/[0.08] px-5 py-4">
                <button
                  onClick={() => advance(selectedCandidate)}
                  disabled={selectedCandidate.column === 'talent' || selectedCandidate.column === 'rejected'}
                  className="flex-1 rounded-lg bg-cyan-400/12 py-2 text-xs font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {selectedCandidate.column === 'pending' ? '进入初筛通过' : selectedCandidate.column === 'passed' ? '推进至人才库' : '已完成流转'}
                </button>
                <button
                  onClick={() => moveCandidate(selectedCandidate.id, 'talent')}
                  className="flex-1 rounded-lg bg-white/[0.05] py-2 text-xs font-medium text-white/65 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  放入人才库
                </button>
                {selectedCandidate.column !== 'rejected' && (
                  <button
                    onClick={() => moveCandidate(selectedCandidate.id, 'rejected')}
                    className="flex-1 rounded-lg bg-red-400/10 py-2 text-xs font-medium text-red-200 transition-colors hover:bg-red-400/18"
                  >
                    标记淘汰
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
