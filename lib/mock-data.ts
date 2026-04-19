// 思必驰智慧招聘系统 — 全局模拟数据

// ─────────────────────────────────────
// 类型定义
// ─────────────────────────────────────

export type EducationLevel = '大专' | '本科' | '硕士' | '博士'

export type JobPosition =
  | '前端工程师'
  | '后端工程师'
  | '算法工程师'
  | '产品经理'
  | '数据分析师'
  | 'HR 业务伙伴'
  | '测试工程师'
  | '运营经理'

export type CandidateStatus = '待面试' | '已面试' | '已录用' | '已淘汰'

export interface Candidate {
  id: string
  name: string
  age: number
  education: EducationLevel
  school: string
  major: string
  yearsOfExperience: number
  currentCompany: string
  currentTitle: string
  targetPosition: JobPosition
  matchScore: number
  skills: string[]
  status: CandidateStatus
}

export type DialogRole = 'hr' | 'candidate'

export interface InterviewDialog {
  id: string
  role: DialogRole
  content: string
  timestamp: string
}

export interface FollowUpSuggestion {
  id: string
  context: string
  suggestion: string
  purpose: string
}

export interface DimensionScore {
  dimension: string
  score: number
  comment: string
}

export type Recommendation = '强烈推荐' | '推荐' | '待定' | '不推荐'

export interface InterviewReport {
  candidateId: string
  overallScore: number
  recommendation: Recommendation
  summary: string
  dimensions: DimensionScore[]
  strengths: string[]
  concerns: string[]
  interviewDuration: string
}

export interface RadarDimension {
  subject: string
  candidate: number
  benchmark: number
  fullMark: 100
}

export type PolicyCategory =
  | '入职流程'
  | '年假政策'
  | '薪资结构'
  | '面试流程'
  | '转正考核'
  | '离职流程'

export interface PolicyQA {
  id: string
  category: PolicyCategory
  question: string
  answer: string
}

// ─────────────────────────────────────
// 1. 候选人数据（10条）
// ─────────────────────────────────────

export const mockCandidates: Candidate[] = [
  {
    id: 'c001',
    name: '张伟',
    age: 28,
    education: '本科',
    school: '浙江大学',
    major: '计算机科学与技术',
    yearsOfExperience: 5,
    currentCompany: '阿里巴巴',
    currentTitle: '高级前端工程师',
    targetPosition: '前端工程师',
    matchScore: 92,
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind CSS'],
    status: '已面试',
  },
  {
    id: 'c002',
    name: '李娜',
    age: 26,
    education: '硕士',
    school: '清华大学',
    major: '人工智能',
    yearsOfExperience: 3,
    currentCompany: '百度',
    currentTitle: '算法工程师',
    targetPosition: '算法工程师',
    matchScore: 96,
    skills: ['Python', 'PyTorch', 'NLP', 'LLM', 'BERT', 'RAG'],
    status: '已录用',
  },
  {
    id: 'c003',
    name: '王磊',
    age: 32,
    education: '本科',
    school: '上海交通大学',
    major: '软件工程',
    yearsOfExperience: 8,
    currentCompany: '腾讯',
    currentTitle: '技术总监',
    targetPosition: '后端工程师',
    matchScore: 88,
    skills: ['Java', 'Spring Boot', 'Kafka', 'MySQL', 'Redis', 'K8s'],
    status: '待面试',
  },
  {
    id: 'c004',
    name: '刘芳',
    age: 29,
    education: '硕士',
    school: '复旦大学',
    major: '工商管理',
    yearsOfExperience: 5,
    currentCompany: '字节跳动',
    currentTitle: '高级产品经理',
    targetPosition: '产品经理',
    matchScore: 91,
    skills: ['用户研究', '数据分析', 'PRD写作', 'A/B测试', 'SQL'],
    status: '已面试',
  },
  {
    id: 'c005',
    name: '陈强',
    age: 24,
    education: '本科',
    school: '武汉大学',
    major: '统计学',
    yearsOfExperience: 2,
    currentCompany: '美团',
    currentTitle: '数据分析师',
    targetPosition: '数据分析师',
    matchScore: 75,
    skills: ['Python', 'SQL', 'Tableau', 'Excel', 'Power BI'],
    status: '待面试',
  },
  {
    id: 'c006',
    name: '赵敏',
    age: 31,
    education: '硕士',
    school: '北京大学',
    major: '人力资源管理',
    yearsOfExperience: 7,
    currentCompany: '华为',
    currentTitle: 'HR Business Partner',
    targetPosition: 'HR 业务伙伴',
    matchScore: 94,
    skills: ['招聘管理', 'OKR体系', '员工关系', '薪酬设计', '培训发展'],
    status: '已录用',
  },
  {
    id: 'c007',
    name: '孙建国',
    age: 27,
    education: '本科',
    school: '南京大学',
    major: '计算机科学',
    yearsOfExperience: 4,
    currentCompany: '网易',
    currentTitle: '测试工程师',
    targetPosition: '测试工程师',
    matchScore: 82,
    skills: ['Selenium', 'JMeter', 'Python', '接口测试', '自动化框架'],
    status: '已面试',
  },
  {
    id: 'c008',
    name: '周晓燕',
    age: 33,
    education: '本科',
    school: '同济大学',
    major: '市场营销',
    yearsOfExperience: 9,
    currentCompany: '京东',
    currentTitle: '运营总监',
    targetPosition: '运营经理',
    matchScore: 87,
    skills: ['用户增长', '内容运营', '数据驱动', '渠道管理', 'GMV增长'],
    status: '待面试',
  },
  {
    id: 'c009',
    name: '吴志远',
    age: 25,
    education: '大专',
    school: '深圳职业技术学院',
    major: '软件技术',
    yearsOfExperience: 2,
    currentCompany: '某创业公司',
    currentTitle: '初级前端工程师',
    targetPosition: '前端工程师',
    matchScore: 63,
    skills: ['Vue', 'JavaScript', 'HTML/CSS', 'Element UI'],
    status: '已淘汰',
  },
  {
    id: 'c010',
    name: '郑雨欣',
    age: 30,
    education: '博士',
    school: '中科院计算所',
    major: '计算机视觉',
    yearsOfExperience: 5,
    currentCompany: '旷视科技',
    currentTitle: '研究员',
    targetPosition: '算法工程师',
    matchScore: 99,
    skills: ['PyTorch', 'OpenCV', '目标检测', '语音识别', 'TensorRT', 'CUDA'],
    status: '待面试',
  },
]

// ─────────────────────────────────────
// 2. 面试对话（20条，HR与候选人交替）
// 场景：张伟面试高级前端工程师岗位
// ─────────────────────────────────────

export const mockInterviewDialogs: InterviewDialog[] = [
  {
    id: 'd001',
    role: 'hr',
    content:
      '张伟你好，我是今天的面试官陈思，感谢你抽时间参加面试。先做个简单自我介绍吧，重点说说你在阿里这5年主要做了哪些工作。',
    timestamp: '14:00:05',
  },
  {
    id: 'd002',
    role: 'candidate',
    content:
      '陈老师好，我是张伟，本科毕业于浙江大学计算机系，2019年加入阿里巴巴，目前在淘宝事业部担任高级前端工程师。这5年主要经历了三个阶段：前两年做基础业务，负责淘宝详情页的性能优化，把LCP从4.2秒降到1.8秒；中间两年转向中台，主导搭建了一套低代码平台，服务了内部40多个业务团队；最近一年开始接触AI方向，在前端集成了大模型能力，做了智能客服和商品描述生成等功能。',
    timestamp: '14:00:52',
  },
  {
    id: 'd003',
    role: 'hr',
    content:
      '听起来经历很丰富。你提到把LCP从4.2秒降到1.8秒，能详细说说当时的优化思路和具体手段吗？遇到了哪些技术挑战？',
    timestamp: '14:02:10',
  },
  {
    id: 'd004',
    role: 'candidate',
    content:
      '当时分析了性能瀑布图，发现主要瓶颈在三个地方：一是首屏资源加载，详情页会加载大量商品图片，引入了懒加载和WebP格式，图片体积平均减少了45%；二是JavaScript执行时间过长，通过Code Splitting和动态import，把首屏JS从1.2MB降到380KB；三是关键渲染路径的CSS阻塞问题，提取了Critical CSS内联在HTML头部，把非关键样式异步加载。最难的是在不改动旧业务逻辑的前提下做这些改造，需要大量的灰度验证，大概花了3个月才完整上线。',
    timestamp: '14:03:45',
  },
  {
    id: 'd005',
    role: 'hr',
    content:
      '非常扎实。你说在中台做了低代码平台，这个方向现在很多公司都在做，你们的平台和市面上的产品相比有什么差异化？当时最核心的技术难点是什么？',
    timestamp: '14:05:20',
  },
  {
    id: 'd006',
    role: 'candidate',
    content:
      '差异化主要体现在两点。第一是深度集成了阿里的设计系统，业务同学不需要懂技术，拖拽就能生成符合设计规范的页面。第二是做了一个"逃逸机制"，当低代码满足不了需求时，允许业务方在特定区块嵌入自定义代码，解决了灵活性问题。最核心的技术难点是Schema的设计——如何让Schema既够简洁让产品能理解，又足够表达力满足复杂场景。我们迭代了5个大版本，最终采用了类似JSON Schema的树形结构，加了一层DSL解释器来处理动态逻辑。',
    timestamp: '14:07:15',
  },
  {
    id: 'd007',
    role: 'hr',
    content:
      '你提到DSL解释器，这个在前端领域相对少见，能说说你是怎么实现的吗？有没有用到函数式编程的思想？',
    timestamp: '14:08:40',
  },
  {
    id: 'd008',
    role: 'candidate',
    content:
      '对，这块确实用到了不少函数式的思想。DSL解释器的核心是一个递归的表达式求值引擎，类似Lisp的eval-apply模型。我们定义了一套表达式语法，解释器会把它解析成AST，然后在运行时求值。函数式方面，大量使用了柯里化来处理上下文绑定，用组合函数来处理管道式的数据转换。不过这套东西在团队内部推广的时候有不小的阻力，因为大家函数式的背景参差不齐，所以后来提供了更命令式的API作为备选，两种风格并存。',
    timestamp: '14:10:35',
  },
  {
    id: 'd009',
    role: 'hr',
    content:
      '你提到团队推广有阻力，遇到技术方案分歧时，你通常是怎么处理的？能举一个具体的例子吗？',
    timestamp: '14:12:00',
  },
  {
    id: 'd010',
    role: 'candidate',
    content:
      '我通常的处理方式是先听，再用数据说话。举个例子：我们在评估是否引入TypeScript全面改造项目时，团队里有明显的反对声音，主要是觉得迁移成本太高。我当时没有直接争论，而是挑了一个中等规模的模块做试点，用了两周迁移完，然后统计了3个月内这个模块的bug率——从每月平均7个降到1个。拿着这份数据去说服，比讲道理有效多了。最终团队同意分批次迁移，历时8个月完成了全项目TypeScript改造。',
    timestamp: '14:14:20',
  },
  {
    id: 'd011',
    role: 'hr',
    content:
      '很好，数据驱动决策是很成熟的思路。我们聊聊职业规划，你为什么在阿里做得不错的情况下考虑换到思必驰？',
    timestamp: '14:15:45',
  },
  {
    id: 'd012',
    role: 'candidate',
    content:
      '主要有两个原因。第一个是技术方向，阿里前端现在已经很成熟，再往上走更多是管理路线，但我目前还是想专注技术，尤其是想深入AI与前端融合这个方向。思必驰在语音AI领域有很深的积累，我认为语音交互会是下一代人机界面的核心，这块对我来说吸引力很大。第二个原因是公司规模，我希望能看到自己的工作对产品的直接影响。当然，薪酬也是考虑因素之一，但不是主要驱动。',
    timestamp: '14:17:30',
  },
  {
    id: 'd013',
    role: 'hr',
    content:
      '理解。你提到语音AI和前端融合，如果让你在前端产品里深度集成实时语音能力，你会怎么设计技术方案？',
    timestamp: '14:19:00',
  },
  {
    id: 'd014',
    role: 'candidate',
    content:
      '我在阿里做过一个智能客服原型，用了WebSpeech API做语音输入，接了大模型做NLU。不过WebSpeech在工业级场景下延迟和准确率都不够好。如果从头设计深度集成实时语音的方案：前端用WebSocket建立持久连接，把音频流分片传输到服务端；服务端用思必驰的ASR引擎做实时转写，结合VAD做端点检测；转写结果通过事件流推回前端渲染，保证低延迟反馈。另外需要考虑网络抖动下的状态管理，以及多端适配——移动端和桌面端的音频采集方式差别很大，需要做分层封装。',
    timestamp: '14:21:45',
  },
  {
    id: 'd015',
    role: 'hr',
    content:
      '思路很清晰。你在团队协作时，你认为自己有哪些明显的优点和缺点？',
    timestamp: '14:23:10',
  },
  {
    id: 'd016',
    role: 'candidate',
    content:
      '优点方面，我比较善于把复杂的技术问题拆解清楚，然后用非技术语言跟产品和运营解释，跨职能协作比较顺畅。另外执行力比较强，定了的事情会追到底。缺点的话，有时候会对代码质量要求过高，容易在review时提太多细节性的意见，曾经有同事反馈说感觉被nitpick。意识到这个问题之后，开始区分"必须改"和"建议改"，用不同的标签分类评论，效果好了一些。另外宏观架构思维还需要锻炼，目前更多是从模块级思考，团队级和产品级的视野还在培养中。',
    timestamp: '14:25:00',
  },
  {
    id: 'd017',
    role: 'hr',
    content: '很诚实。你平时怎么保持技术学习？有没有持续关注的社区或者固定的学习方式？',
    timestamp: '14:26:30',
  },
  {
    id: 'd018',
    role: 'candidate',
    content:
      '我有几个固定的输入渠道：每天早上刷一遍GitHub trending和Hacker News；每周精读1-2篇深度文章，主要来自InfoQ或者TC39的提案；每个月选一个感兴趣的开源项目读源码，最近在读Zustand和TanStack Query的实现。输出方面，在公司内部有技术分享，这倒逼我把学的东西真正消化。另外在GitHub上维护了一些小工具，有个处理CSS-in-JS主题切换的库大概有800 star，更多是学习成果的记录。',
    timestamp: '14:28:15',
  },
  {
    id: 'd019',
    role: 'hr',
    content: '很好。最后问一下，你对薪资和入职时间有什么期望？',
    timestamp: '14:29:40',
  },
  {
    id: 'd020',
    role: 'candidate',
    content:
      '薪资方面，我目前的到手月薪在5.5万左右，期望在这个基础上有20%-30%的提升，了解到思必驰在AI领域的行业地位，相信这个区间是合理的，具体可以在看到offer之后再沟通。入职时间的话，需要走完离职流程，正常来说需要提前一个月，如果贵司有急迫需求，我可以跟现在公司协商，大概可以压缩到3周左右。',
    timestamp: '14:31:05',
  },
]

// ─────────────────────────────────────
// 3. 追问建议模板（5条）
// ─────────────────────────────────────

export const mockFollowUpSuggestions: FollowUpSuggestion[] = [
  {
    id: 'f001',
    context: '候选人描述了技术成果，但只说了结果没有说过程',
    suggestion:
      '你刚才提到了最终的成果，我想更深入了解一下——在实现这个目标的过程中，你遇到过最棘手的一个技术决策是什么？当时是怎么做权衡的？',
    purpose: '考察候选人的技术深度和决策思维，而不仅仅是结果导向',
  },
  {
    id: 'f002',
    context: '候选人回答中提到了团队合作，但表述较为模糊',
    suggestion:
      '你在这个项目里扮演了什么角色？有没有一个具体的时刻，让你觉得自己的贡献对团队产生了明显影响？',
    purpose: '区分候选人在团队中的实际贡献和"我们团队"式的模糊归因',
  },
  {
    id: 'f003',
    context: '候选人对某个技术方案描述不够具体，可能存在"纸面了解"',
    suggestion:
      '你提到了这个技术方案，如果现在让你在白板上画出它的核心架构图，你会从哪里开始？最关键的几个模块是什么？',
    purpose: '通过要求即时结构化表达，验证候选人是否真正理解而非背答案',
  },
  {
    id: 'f004',
    context: '候选人提到了失败经历，但一笔带过',
    suggestion:
      '你刚才提到那个项目最终没有达到预期，如果让你现在重新来做，你会在哪个节点做不同的决定？是什么让你当时没有选择那个方向？',
    purpose: '考察候选人的复盘能力和自我认知，以及学习型心态',
  },
  {
    id: 'f005',
    context: '候选人表达了对新工作的期望，但内容比较笼统',
    suggestion:
      '你说希望在新公司能"更快成长"，我想具体一点——你觉得在过去半年里，你成长最慢的一个维度是什么？你希望在这里得到什么样的机会去突破它？',
    purpose: '验证候选人的求职动机是否清晰，是否有明确的自我发展意识',
  },
]

// ─────────────────────────────────────
// 4. 面试报告模板（针对候选人 c001 张伟）
// ─────────────────────────────────────

export const mockInterviewReport: InterviewReport = {
  candidateId: 'c001',
  overallScore: 89,
  recommendation: '推荐',
  summary:
    '张伟具备扎实的前端工程基础，在性能优化、工程化建设方面有丰富的实战经验，表达清晰有条理，技术深度与广度均衡。特别是数据驱动决策思维和良好的跨团队沟通能力，非常符合我司对高级前端工程师的要求。对语音AI与前端融合方向有前瞻性认知，与思必驰的技术战略方向契合。主要顾虑是架构级别的宏观视野尚在培养中，需要入职后重点关注系统设计能力的提升。',
  dimensions: [
    {
      dimension: '技术能力',
      score: 92,
      comment:
        '性能优化、工程化、低代码平台均有深度实战，TypeScript、React生态掌握扎实，能清晰描述技术决策的权衡过程。',
    },
    {
      dimension: '沟通表达',
      score: 88,
      comment:
        '语言组织清晰，善于用结构化方式表达复杂问题，能把技术概念转化为非技术语言，偶有过度技术化倾向。',
    },
    {
      dimension: '逻辑思维',
      score: 90,
      comment:
        '问题拆解能力强，回答有层次感，能区分主次矛盾，举例具体可验证，没有明显的逻辑跳跃。',
    },
    {
      dimension: '职业动机',
      score: 85,
      comment:
        '求职动机明确，对语音AI方向有真实兴趣，薪资期望合理。对思必驰的了解有一定深度，但仍偏概念层面，对具体业务了解不足。',
    },
    {
      dimension: '团队协作',
      score: 86,
      comment:
        '有主动推动团队技术升级的经历，处理分歧的方式成熟，但自述在代码review中曾引起团队反感，协作细节仍有优化空间。',
    },
  ],
  strengths: [
    '性能优化和工程化领域有扎实的实战成果，数据可量化',
    '数据驱动决策，善于用实验和度量说服团队',
    '表达结构清晰，能有效跨职能沟通',
    '技术视野前瞻，对语音AI+前端融合方向有思考',
    '学习习惯良好，有开源贡献',
  ],
  concerns: [
    '系统架构级设计能力（团队级/产品级）尚需培养',
    '对思必驰具体业务场景了解不深，需要较长适应期',
    '代码质量要求过高可能影响小团队迭代节奏',
  ],
  interviewDuration: '42分钟',
}

// ─────────────────────────────────────
// 5. 竞争力分析雷达图数据（适配 recharts RadarChart）
// ─────────────────────────────────────

export const mockRadarData: RadarDimension[] = [
  { subject: '技术能力', candidate: 92, benchmark: 75, fullMark: 100 },
  { subject: '沟通表达', candidate: 88, benchmark: 70, fullMark: 100 },
  { subject: '逻辑思维', candidate: 90, benchmark: 72, fullMark: 100 },
  { subject: '职业动机', candidate: 85, benchmark: 68, fullMark: 100 },
  { subject: '团队协作', candidate: 86, benchmark: 73, fullMark: 100 },
]

// ─────────────────────────────────────
// 6. HR 政策问答（Markdown 格式回答）
// ─────────────────────────────────────

export const mockPolicyQAs: PolicyQA[] = [
  {
    id: 'q001',
    category: '入职流程',
    question: '新员工入职需要准备哪些材料？入职第一天需要做什么？',
    answer: `## 入职所需材料

**必须提供（原件+复印件）：**

1. 身份证
2. 毕业证书及学位证书（应届生提供录取通知书）
3. 前单位离职证明（上家公司盖章）
4. 近期一寸免冠照片 × 4张
5. 银行卡（工资卡，建议使用工商银行）
6. 体检报告（入职前30天内，公司指定医院）

---

## 入职第一天流程

| 时间 | 事项 |
|------|------|
| 09:00 | 到前台办理来访登记，由HR接待 |
| 09:15 | 签署劳动合同、保密协议等文件 |
| 10:00 | IT设备领取（电脑、门禁卡、工牌）|
| 10:30 | 开通OA账号、邮箱、代码仓库权限 |
| 14:00 | 部门负责人带领参观，介绍团队成员 |
| 15:00 | 入职培训课程（New Hire Orientation）|

> **提醒**：请在入职前一天与HR确认报到地点，部分团队在不同园区办公。`,
  },
  {
    id: 'q002',
    category: '年假政策',
    question: '公司年假是怎么计算的？当年入职还能享受年假吗？',
    answer: `## 年假政策详解

### 年假天数标准

| 工龄（社会工龄） | 年假天数 |
|----------------|---------|
| 入职当年 | 按入职月份折算 |
| 1–9 年 | 5 天 |
| 10–19 年 | 10 天 |
| 20 年及以上 | 15 天 |

> 注：工龄以**社会工龄**（含上家公司）计算，非本公司工龄。

---

### 当年入职年假计算

**公式**：当年年假 = 法定天数 × (剩余月份数 ÷ 12)，向上取整

**示例**：7月1日入职，剩余6个月，可享受：5 × 6/12 = **3天**

---

### 使用规则

- 年假原则上**当年使用完毕**，不可跨年结转
- 确因工作原因未使用，可申请**折算为现金**（按当月日薪计）
- 年假需提前3个工作日在OA系统申请
- 连续5天以上需提前 **10个工作日**申请`,
  },
  {
    id: 'q003',
    category: '薪资结构',
    question: '公司的薪资结构是怎样的？绩效奖金是如何发放的？',
    answer: `## 薪资结构说明

### 整体构成

\`\`\`
总薪酬 = 月固定薪资 × 12 + 年度绩效奖金 + 项目奖金（视情况）
\`\`\`

---

### 月固定薪资

| 组成 | 比例 | 说明 |
|------|------|------|
| 基本工资 | 80% | 固定发放，计入社保基数 |
| 岗位津贴 | 20% | 与出勤挂钩，全勤足额发放 |

- 发薪日：**每月10日**（遇节假日提前）

---

### 年度绩效奖金

- **发放时间**：次年3月，与年度考核挂钩

| 绩效等级 | 系数 | 比例上限 |
|---------|------|---------|
| S（超出预期） | 1.5× | 前10% |
| A（达到预期） | 1.0× | ~60% |
| B（基本达到） | 0.7× | ~25% |
| C（需改进） | 0× | 末5% |

---

### 五险一金

缴纳基数：上一年度月平均工资（首次入职按基本工资）`,
  },
  {
    id: 'q004',
    category: '面试流程',
    question: '公司的面试流程是怎样的？一般几轮面试？多久可以收到结果？',
    answer: `## 面试流程说明

### 标准流程

\`\`\`
简历筛选 → 电话/视频初筛 → 技术面（1-2轮）→ 综合面 → HR终面 → Offer
\`\`\`

---

### 各轮次说明

**第1轮：初筛（30分钟）**
- HR进行，核实简历、薪资期望、离职原因
- 初步评估沟通能力和求职动机

**第2轮：技术面（45-60分钟，共1-2轮）**
- 用人团队Lead进行
- 涵盖专业能力、项目经验、技术深度
- 部分岗位有在线编程环节

**第3轮：综合面（45分钟）**
- 部门负责人进行
- 侧重团队协作、文化契合、职业规划

**第4轮：HR终面（30分钟）**
- 确认薪资、入职时间、背景调查授权

---

### 时效承诺

| 阶段 | 承诺时效 |
|------|---------|
| 简历反馈 | 3个工作日内 |
| 面试安排 | 通过后1-2个工作日 |
| 面试结果反馈 | 面试后3个工作日内 |
| Offer发放 | 终面通过后5个工作日 |`,
  },
  {
    id: 'q005',
    category: '转正考核',
    question: '试用期多久？转正考核标准是什么？',
    answer: `## 试用期与转正考核

### 试用期时长

思必驰标准劳动合同期限为3年，试用期通常为 **3个月**。

---

### 转正考核流程

提前2周：HR系统自动提醒员工和主管发起转正流程

**员工需提交：**
1. 试用期工作总结（含关键成果、数据支撑）
2. 个人能力自评（对照岗位胜任力模型）
3. 下阶段工作计划

---

### 考核维度

| 维度 | 权重 |
|------|------|
| 工作绩效（KPI/OKR完成度）| 40% |
| 专业能力 | 30% |
| 团队协作与文化契合 | 20% |
| 学习成长速度 | 10% |

---

### 结果判定

| 分数 | 结果 |
|------|------|
| 80分以上 | 正常转正 |
| 60–79分 | 延长试用期1-2个月 |
| 60分以下 | 试用期不合格，解除合同 |

> 大多数岗位转正后薪资不做调整（入职时已按转正薪资谈定）。`,
  },
]
