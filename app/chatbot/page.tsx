'use client'

import { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Plus, Send, Trash2 } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: number
  role: 'user' | 'ai'
  content: string
  isTyping: boolean
}

interface Conv {
  id: number
  title: string
  time: string
}

// ── Answers ────────────────────────────────────────────────────────────────

const ANSWERS: Record<string, string> = {
  onboarding: `## 入职流程说明

入职共分为以下步骤：

1. **资料提交**：入职前3天提交身份证、学历证明、离职证明原件
2. **背景调查**：HR将在入职后5个工作日内完成
3. **系统开通**：IT部门在入职当天开通企业邮箱和内部系统
4. **新人培训**：入职第1周参加统一入职培训（每月15日开班）
5. **试用期**：默认3个月，表现优秀可申请提前转正`,

  leave: `## 年假政策

| 工龄 | 年假天数 |
|------|----------|
| 1年以下 | 5天 |
| 1-5年 | 10天 |
| 5-10年 | 15天 |
| 10年以上 | 20天 |

**申请方式**：在 HR 系统中提前3天提交申请，直属领导审批后生效。

**注意**：当年未休年假可结转至次年3月底，逾期作废。`,

  interview: `## 招聘面试流程

1. **简历筛选**：AI初筛 + HR复核，3个工作日内反馈
2. **笔试/测评**：部分岗位需完成在线技术测评（1小时）
3. **一面**：直属部门技术/业务面试（45-60分钟）
4. **二面**：部门负责人面试（30分钟）
5. **HR面**：薪资期望、背景核实、文化匹配（30分钟）
6. **Offer**：通过后3个工作日内发送书面Offer`,

  salary: `每月**15日**发放上月工资。如遇节假日，提前至最近工作日发放。

薪资构成：基本工资 + 绩效奖金（季度发放）+ 年终奖（次年3月发放）。`,

  fallback: `您的问题已记录，HR 将在 **1个工作日** 内与您联系。也可以直接拨打 HR 热线：**400-XXX-XXXX**`,
}

function getAnswer(text: string): string {
  if (text.includes('入职')) return ANSWERS.onboarding
  if (text.includes('年假')) return ANSWERS.leave
  if (text.includes('面试')) return ANSWERS.interview
  if (text.includes('薪资') || text.includes('工资')) return ANSWERS.salary
  return ANSWERS.fallback
}

const QUICK_QUESTIONS = [
  '入职需要准备哪些资料？',
  '年假有多少天？',
  '面试流程是什么？',
  '工资什么时候发？',
]

const WELCOME: Message = {
  id: 0,
  role: 'ai',
  content:
    '您好！我是 **HR 小智**，您的专属人事政策助手。\n\n我可以帮您解答入职流程、年假政策、面试安排、薪资发放等常见问题。请问有什么可以帮助您？',
  isTyping: false,
}

const INIT_CONVS: Conv[] = [
  { id: 1, title: '入职流程咨询', time: '2小时前' },
  { id: 2, title: '年假政策查询', time: '昨天' },
  { id: 3, title: '面试安排问题', time: '3天前' },
]

// ── Markdown overrides ─────────────────────────────────────────────────────

type C = { children?: React.ReactNode }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const md: any = {
  h1: ({ children }: C) => (
    <h1 className="text-base font-semibold text-foreground mt-1 mb-2">{children}</h1>
  ),
  h2: ({ children }: C) => (
    <h2 className="text-sm font-semibold text-foreground mt-3 mb-2 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: C) => (
    <h3 className="text-sm font-medium text-foreground mt-2 mb-1">{children}</h3>
  ),
  p: ({ children }: C) => (
    <p className="text-sm text-foreground/85 leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  ul: ({ children }: C) => (
    <ul className="text-sm space-y-1.5 mb-2 pl-4 list-disc text-foreground/85">{children}</ul>
  ),
  ol: ({ children }: C) => (
    <ol className="text-sm space-y-1.5 mb-2 pl-4 list-decimal text-foreground/85">{children}</ol>
  ),
  li: ({ children }: C) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }: C) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  table: ({ children }: C) => (
    <div className="overflow-x-auto my-3">
      <table
        className="w-full text-xs border-collapse"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: C) => (
    <thead style={{ background: 'rgba(255,255,255,0.06)' }}>{children}</thead>
  ),
  th: ({ children }: C) => (
    <th
      className="text-left px-3 py-2 text-muted-foreground font-medium"
      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {children}
    </th>
  ),
  td: ({ children }: C) => (
    <td
      className="px-3 py-2 text-foreground/80"
      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {children}
    </td>
  ),
  code: ({ children }: C) => (
    <code className="text-xs bg-white/[0.08] px-1.5 py-0.5 rounded font-mono text-primary/90">
      {children}
    </code>
  ),
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [conversations, setConversations] = useState<Conv[]>(INIT_CONVS)
  const [input, setInput] = useState('')
  const [isMicActive, setIsMicActive] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const micTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
      if (micTimerRef.current) clearTimeout(micTimerRef.current)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [input])

  const hasUserMessages = messages.some(m => m.role === 'user')
  const isProcessing = messages.some(m => m.isTyping)
  const currentTitle = messages.find(m => m.role === 'user')?.content.slice(0, 16) || '政策咨询'

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isProcessing) return

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)

    const userMsg: Message = { id: Date.now(), role: 'user', content: trimmed, isTyping: false }
    const aiId = Date.now() + 1
    const fullText = getAnswer(trimmed)
    const aiMsg: Message = { id: aiId, role: 'ai', content: '', isTyping: true }

    setMessages(prev => [...prev, userMsg, aiMsg])
    setInput('')

    typingTimeoutRef.current = setTimeout(() => {
      let i = 0
      typingIntervalRef.current = setInterval(() => {
        i++
        setMessages(prev =>
          prev.map(m => (m.id === aiId ? { ...m, content: fullText.slice(0, i) } : m))
        )
        if (i >= fullText.length) {
          clearInterval(typingIntervalRef.current!)
          setMessages(prev =>
            prev.map(m => (m.id === aiId ? { ...m, isTyping: false } : m))
          )
        }
      }, 20)
    }, 1200)
  }

  function handleMic() {
    if (isMicActive) {
      setIsMicActive(false)
      if (micTimerRef.current) clearTimeout(micTimerRef.current)
      return
    }
    setIsMicActive(true)
    micTimerRef.current = setTimeout(() => {
      setInput('我想了解年假申请流程')
      setIsMicActive(false)
    }, 3000)
  }

  function newConv() {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    // 将当前对话存入历史
    const firstUser = messages.find(m => m.role === 'user')
    if (firstUser) {
      setConversations(prev => [
        { id: Date.now(), title: firstUser.content.slice(0, 16), time: '刚刚' },
        ...prev,
      ])
    }
    setMessages([{ ...WELCOME, id: Date.now() }])
    setInput('')
  }

  return (
    <div
      className="fixed top-14 left-0 right-0 bottom-0 flex"
      style={{ background: '#0a0f1e' }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <div className="w-[260px] shrink-0 flex flex-col border-r border-white/[0.06]">
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-white/[0.06]">
          <span className="text-sm font-semibold text-foreground">HR 小智</span>
          <button
            onClick={newConv}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto py-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40 px-4 mb-1">
            历史对话
          </p>
          <AnimatePresence initial={false}>
            {conversations.map(conv => (
              <motion.div
                key={conv.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.18 }}
                className="group flex items-center justify-between px-3 py-2.5 mx-2 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm text-foreground/80 truncate">{conv.title}</p>
                  <p className="text-[10px] text-muted-foreground/40 mt-0.5">{conv.time}</p>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setConversations(prev => prev.filter(c => c.id !== conv.id))
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2 text-muted-foreground/50 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="h-14 flex items-center gap-3 px-4 border-t border-white/[0.06]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee' }}
          >
            HR
          </div>
          <span className="text-sm text-foreground/80">HR招聘官</span>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Title bar */}
        <div className="h-12 flex items-center justify-center shrink-0 border-b border-white/[0.06]">
          <span className="text-sm font-medium text-foreground/70">{currentTitle}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {messages.map(msg => (
              <div key={msg.id}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div
                      className="max-w-[65%] px-4 py-2.5 rounded-2xl text-sm text-foreground/90 leading-relaxed"
                      style={{
                        background: 'rgba(34,211,238,0.1)',
                        border: '1px solid rgba(34,211,238,0.15)',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5"
                      style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee' }}
                    >
                      AI
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[10px] font-medium mb-2.5"
                        style={{ color: 'rgba(34,211,238,0.65)' }}
                      >
                        HR 小智
                      </p>
                      <div
                        className="border-l-2 pl-4"
                        style={{ borderColor: 'rgba(34,211,238,0.35)' }}
                      >
                        {msg.isTyping && msg.content === '' ? (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                            className="text-base"
                            style={{ color: '#22d3ee' }}
                          >
                            ▋
                          </motion.span>
                        ) : (
                          <>
                            <Markdown remarkPlugins={[remarkGfm]} components={md}>
                              {msg.content}
                            </Markdown>
                            {msg.isTyping && (
                              <span className="text-sm" style={{ color: '#22d3ee' }}>
                                ▋
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-white/[0.06] px-6 py-5">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence>
              {!hasUserMessages && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-2 mb-3"
                >
                  {QUICK_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-3 py-1.5 text-xs text-muted-foreground rounded-lg border border-white/[0.08] hover:border-primary/40 hover:text-primary transition-colors"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="flex items-end gap-3 rounded-2xl px-4 py-3"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(input)
                  }
                }}
                placeholder="输入您的问题，Enter 发送…"
                rows={1}
                className="flex-1 bg-transparent text-sm text-foreground resize-none focus:outline-none placeholder:text-muted-foreground/35 leading-relaxed"
                style={{ maxHeight: 120 }}
              />

              {/* Mic */}
              <button
                onClick={handleMic}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg transition-colors"
                style={{
                  background: isMicActive ? 'rgba(239,68,68,0.12)' : 'transparent',
                  color: isMicActive ? '#f87171' : '#64748b',
                }}
              >
                {isMicActive ? (
                  <div className="flex items-center gap-px">
                    {[0.4, 0.8, 1, 0.65, 0.5, 0.85, 0.4].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-[2px] rounded-full bg-red-400"
                        animate={{ scaleY: [h, 1, h * 0.5, 1, h] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.65 + i * 0.06,
                          ease: 'easeInOut',
                        }}
                        style={{ height: 12 }}
                      />
                    ))}
                  </div>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Send */}
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isProcessing}
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee' }}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
