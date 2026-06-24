export type ResumeColumn = 'pending' | 'passed' | 'talent' | 'rejected'

export interface ResumeDim {
  label: string
  value: number
}

export interface ResumeCandidate {
  id: number
  name: string
  edu: string
  years: number
  score: number
  target: string
  column: ResumeColumn
  source: string
  location: string
  expectedSalary: string
  skills: string[]
  tags: string[]
  riskFlags: string[]
  highlights: string[]
  lastUpdated: string
  owner: string
  stageHistory: string[]
  dims: ResumeDim[]
  reason: string
}

type SeedCandidate = Omit<ResumeCandidate, 'id' | 'dims' | 'stageHistory'> & {
  stageHistory?: string[]
}

function clamp(value: number) {
  return Math.max(42, Math.min(99, value))
}

function buildDims(score: number, years: number, edu: string, skills: string[]): ResumeDim[] {
  const eduBoost = edu === '博士' ? 6 : edu === '硕士' ? 3 : edu === '本科' ? 0 : -6
  return [
    { label: '技术匹配', value: clamp(score + (skills.length > 5 ? 3 : 0)) },
    { label: '项目经验', value: clamp(score + Math.min(years, 8) - 4) },
    { label: '教育背景', value: clamp(score + eduBoost) },
    { label: '综合素质', value: clamp(score - 2 + (years >= 5 ? 2 : 0)) },
  ]
}

function defaultHistory(column: ResumeColumn) {
  if (column === 'passed') return ['简历解析完成', 'JD 匹配评分', 'HR 复核通过']
  if (column === 'talent') return ['简历解析完成', '进入储备池', '等待岗位匹配']
  if (column === 'rejected') return ['简历解析完成', 'AI 标记风险', 'HR 确认暂缓']
  return ['简历解析完成', '等待 HR 复核']
}

const seedCandidates: SeedCandidate[] = [
  {
    name: '张伟', edu: '硕士', years: 5, score: 92, target: '高级算法工程师', column: 'passed',
    source: '内推', location: '上海', expectedSalary: '45-55K', owner: '陈思', lastUpdated: '10分钟前',
    skills: ['向量检索', 'PyTorch', '推荐系统', 'FAISS', 'LLM', 'Python'],
    tags: ['核心候选', '可快速约面', '大厂经验'], riskFlags: [],
    highlights: ['主导向量检索延迟降低 89%', '有生产级推荐召回经验', '表达中量化指标清晰'],
    reason: '候选人在向量检索与深度学习领域积累扎实，技术栈与岗位要求高度吻合，建议优先安排技术面试。',
  },
  {
    name: '李娜', edu: '本科', years: 3, score: 78, target: '算法工程师', column: 'pending',
    source: 'Boss 直聘', location: '北京', expectedSalary: '28-35K', owner: '王珂', lastUpdated: '18分钟前',
    skills: ['机器学习', 'Python', 'XGBoost', 'SQL', '特征工程'],
    tags: ['基础扎实', '需笔试'], riskFlags: ['大型系统经验不足'],
    highlights: ['有完整机器学习项目落地经验', '业务理解较好'],
    reason: '基础扎实但大规模系统经验略显不足，建议笔试重点考察算法深度。',
  },
  {
    name: '王磊', edu: '博士', years: 7, score: 95, target: '高级算法工程师', column: 'passed',
    source: '猎头', location: '杭州', expectedSalary: '60-75K', owner: '陈思', lastUpdated: '24分钟前',
    skills: ['推荐系统', '强化学习', 'GNN', 'TensorFlow', 'AB 实验', '特征平台'],
    tags: ['强烈推荐', '专家型', '论文产出'], riskFlags: [],
    highlights: ['顶会论文 3 篇', '参与亿级用户推荐系统', '具备算法负责人潜力'],
    reason: '博士学历和工业经验兼备，综合匹配极高，建议快速推进面试。',
  },
  {
    name: '刘洋', edu: '本科', years: 2, score: 61, target: '算法工程师', column: 'talent',
    source: '校友推荐', location: '南京', expectedSalary: '20-26K', owner: '赵敏', lastUpdated: '32分钟前',
    skills: ['Python', 'CV', 'OpenCV', '模型训练'],
    tags: ['储备候选', '成长型'], riskFlags: ['工业项目偏少'],
    highlights: ['课程项目完成度高', '学习速度较快'],
    reason: '技术深度与岗位要求存在差距，可作为储备候选人保留。',
  },
  {
    name: '陈静', edu: '硕士', years: 4, score: 88, target: 'NLP 算法工程师', column: 'passed',
    source: '官网投递', location: '苏州', expectedSalary: '36-45K', owner: '陈思', lastUpdated: '45分钟前',
    skills: ['NLP', 'LLM 微调', 'RAG', 'BERT', 'Prompt', 'PyTorch'],
    tags: ['NLP 匹配', '报告规范'], riskFlags: [],
    highlights: ['多个模型训练与部署经验', '对大模型微调理解深入'],
    reason: 'NLP 方向项目完整，综合实力均衡，建议进入技术面试环节。',
  },
  {
    name: '赵强', edu: '本科', years: 6, score: 73, target: '算法工程师', column: 'pending',
    source: '猎聘', location: '深圳', expectedSalary: '32-40K', owner: '王珂', lastUpdated: '1小时前',
    skills: ['Java', 'Python', '模型服务', 'Spark', '工程化'],
    tags: ['工程落地', '备选'], riskFlags: ['算法理论偏弱', '学历不完全匹配'],
    highlights: ['模型上线经验较多', '可补充工程化能力'],
    reason: '工程经验较强但算法理论相对薄弱，可视面试名额情况推进。',
  },
  {
    name: '周敏', edu: '硕士', years: 3, score: 86, target: '多模态算法工程师', column: 'passed',
    source: '脉脉', location: '上海', expectedSalary: '34-42K', owner: '赵敏', lastUpdated: '1小时前',
    skills: ['CV', '多模态', 'CLIP', 'PyTorch', '数据增强'],
    tags: ['多模态', '可约面'], riskFlags: [],
    highlights: ['CV 与多模态积累较强', '项目经历完整'],
    reason: '综合评分接近优秀线，建议安排技术面试并考察大规模落地能力。',
  },
  {
    name: '吴浩', edu: '本科', years: 1, score: 55, target: '初级算法工程师', column: 'rejected',
    source: '官网投递', location: '武汉', expectedSalary: '18-23K', owner: '王珂', lastUpdated: '2小时前',
    skills: ['Python', 'Pandas', '基础机器学习'],
    tags: ['初级', '校招观察'], riskFlags: ['技术深度不足', '期望岗位偏高'],
    highlights: ['学习意愿明确'],
    reason: '技术广度和深度均需提升，当前阶段建议暂缓。',
  },
  {
    name: '徐芳', edu: '硕士', years: 5, score: 91, target: '推荐算法工程师', column: 'passed',
    source: '内推', location: '北京', expectedSalary: '46-58K', owner: '陈思', lastUpdated: '2小时前',
    skills: ['推荐算法', '用户画像', '召回', '精排', 'Spark', 'Flink'],
    tags: ['核心候选', '推荐系统'], riskFlags: [],
    highlights: ['DAU 千万级平台经验', '召回与精排均有落地'],
    reason: '推荐算法与用户行为建模经验突出，是本批次核心候选人之一。',
  },
  {
    name: '孙超', edu: '本科', years: 4, score: 69, target: '算法工程师', column: 'pending',
    source: 'Boss 直聘', location: '成都', expectedSalary: '26-32K', owner: '赵敏', lastUpdated: '3小时前',
    skills: ['机器学习', 'TensorFlow', '数据挖掘', 'SQL'],
    tags: ['备选', '需复核'], riskFlags: ['缺少前沿研究经历'],
    highlights: ['项目落地能力尚可'],
    reason: '综合评分中等，可列为备选候选人。',
  },
  {
    name: '马丽', edu: '博士', years: 8, score: 97, target: '算法负责人', column: 'passed',
    source: '猎头', location: '北京', expectedSalary: '80-100K', owner: '陈思', lastUpdated: '3小时前',
    skills: ['语音识别', '大模型', '团队管理', '模型压缩', '专利', '系统架构'],
    tags: ['顶级候选', '负责人画像', '需高优先级'], riskFlags: [],
    highlights: ['曾任头部大厂算法负责人', '多项专利持有者', '技术影响力强'],
    reason: '本批次综合实力最强候选人，建议立即启动面试流程。',
  },
  {
    name: '黄波', edu: '本科', years: 2, score: 58, target: '初级算法工程师', column: 'rejected',
    source: '校招池', location: '西安', expectedSalary: '18-22K', owner: '王珂', lastUpdated: '4小时前',
    skills: ['Python', 'Sklearn', '数据清洗'],
    tags: ['校招观察'], riskFlags: ['项目经历以实习为主', '薪资期望偏高'],
    highlights: ['基础课程完整'],
    reason: '整体能力处于初级水平，短期内不建议推进。',
  },
  {
    name: '林欣', edu: '硕士', years: 6, score: 84, target: '语音算法工程师', column: 'pending',
    source: '内推', location: '合肥', expectedSalary: '40-50K', owner: '赵敏', lastUpdated: '4小时前',
    skills: ['ASR', '声学模型', 'Kaldi', '端侧优化', 'WER 优化'],
    tags: ['语音方向', '接近通过线'], riskFlags: ['近期稳定性待确认'],
    highlights: ['ASR 系统优化经验丰富', 'WER 改善记录清晰'],
    reason: '技术实力接近初筛线，建议综合考量后决定是否安排面试。',
  },
  {
    name: '杨帆', edu: '本科', years: 3, score: 76, target: '数据算法工程师', column: 'pending',
    source: '官网投递', location: '广州', expectedSalary: '27-34K', owner: '王珂', lastUpdated: '5小时前',
    skills: ['特征工程', 'SQL', 'Python', '数据建模', 'BI'],
    tags: ['补充候选'], riskFlags: ['算法创新能力有限'],
    highlights: ['数据处理与特征工程经验较好'],
    reason: '技术匹配度一般，可作为补充候选人。',
  },
  {
    name: '朱婷', edu: '硕士', years: 4, score: 89, target: '知识图谱算法工程师', column: 'passed',
    source: '猎聘', location: '南京', expectedSalary: '38-46K', owner: '陈思', lastUpdated: '5小时前',
    skills: ['知识图谱', 'GNN', 'NLP', '实体识别', '图数据库'],
    tags: ['知识图谱', '可约面'], riskFlags: [],
    highlights: ['参与国家级 AI 课题', '工程与研究能力兼备'],
    reason: '知识图谱与图神经网络方向积累深厚，岗位契合度高。',
  },
  {
    name: '何晨', edu: '硕士', years: 5, score: 90, target: '语音算法工程师', column: 'passed',
    source: '内推', location: '上海', expectedSalary: '42-52K', owner: '陈思', lastUpdated: '今天',
    skills: ['TTS', '韵律建模', '声码器', '模型蒸馏', '端侧部署'],
    tags: ['语音合成', '端侧经验'], riskFlags: [],
    highlights: ['主导 TTS 端侧模型压缩', '推理耗时下降 47%'],
    reason: '语音合成经验与思必驰场景贴合，建议进入技术面。',
  },
  {
    name: '郑凯', edu: '本科', years: 7, score: 82, target: '后端工程师', column: 'pending',
    source: 'Boss 直聘', location: '杭州', expectedSalary: '35-42K', owner: '赵敏', lastUpdated: '今天',
    skills: ['Java', 'Go', 'Kafka', 'MySQL', 'K8s', '高并发'],
    tags: ['后端转岗', '工程强'], riskFlags: ['目标岗位与算法线不完全一致'],
    highlights: ['服务稳定性治理经验丰富', '可支撑算法平台工程'],
    reason: '工程能力强，适合作为算法平台或后端方向备选。',
  },
  {
    name: '唐雨', edu: '硕士', years: 2, score: 80, target: 'NLP 算法工程师', column: 'pending',
    source: '校招池', location: '北京', expectedSalary: '30-36K', owner: '王珂', lastUpdated: '今天',
    skills: ['NLP', 'RAG', '向量数据库', 'LangChain', 'Python'],
    tags: ['潜力型', '大模型应用'], riskFlags: ['工业经验偏少'],
    highlights: ['RAG 项目完整', '学习曲线较快'],
    reason: '潜力较好，建议增加工程实现追问。',
  },
  {
    name: '罗成', edu: '博士', years: 4, score: 93, target: '多模态算法工程师', column: 'passed',
    source: '学术合作', location: '上海', expectedSalary: '55-68K', owner: '陈思', lastUpdated: '昨天',
    skills: ['多模态', '视频理解', 'Transformer', '论文复现', 'PyTorch'],
    tags: ['科研强', '多模态重点'], riskFlags: [],
    highlights: ['视频理解方向论文 4 篇', '可承担前沿探索'],
    reason: '科研能力突出，适合多模态与大模型融合方向。',
  },
  {
    name: '钱露', edu: '本科', years: 5, score: 72, target: '产品经理', column: 'talent',
    source: '官网投递', location: '苏州', expectedSalary: '28-35K', owner: '赵敏', lastUpdated: '昨天',
    skills: ['B 端产品', 'PRD', '用户访谈', '数据分析'],
    tags: ['跨岗位', '人才库'], riskFlags: ['当前批次岗位不匹配'],
    highlights: ['B 端业务理解较好', '可匹配后续产品岗'],
    reason: '与当前算法岗位不匹配，建议放入人才库等待产品岗位。',
  },
  {
    name: '宋佳', edu: '硕士', years: 6, score: 87, target: '算法工程师', column: 'passed',
    source: '脉脉', location: '深圳', expectedSalary: '42-50K', owner: '陈思', lastUpdated: '昨天',
    skills: ['风控模型', '图算法', 'Spark', '特征平台', '模型监控'],
    tags: ['风控算法', '可约面'], riskFlags: [],
    highlights: ['风控召回率提升 18%', '有模型监控经验'],
    reason: '风控和图算法经验可迁移，建议安排一面。',
  },
  {
    name: '沈越', edu: '本科', years: 9, score: 79, target: '算法平台工程师', column: 'pending',
    source: '猎头', location: '上海', expectedSalary: '45-55K', owner: '赵敏', lastUpdated: '昨天',
    skills: ['MLOps', 'K8s', '模型发布', 'CI/CD', '监控告警'],
    tags: ['平台工程', '经验丰富'], riskFlags: ['算法研究深度一般'],
    highlights: ['模型发布平台从 0 到 1', '稳定性治理成熟'],
    reason: '适合算法平台方向，需要确认岗位口径。',
  },
  {
    name: '许彤', edu: '硕士', years: 1, score: 67, target: '初级算法工程师', column: 'talent',
    source: '校招池', location: '南京', expectedSalary: '20-25K', owner: '王珂', lastUpdated: '2天前',
    skills: ['PyTorch', 'NLP', '论文复现', 'Python'],
    tags: ['校招潜力', '人才库'], riskFlags: ['实践案例偏少'],
    highlights: ['论文复现质量高', '基础较扎实'],
    reason: '适合纳入校招观察池，等待初级岗位名额。',
  },
  {
    name: '邱泽', edu: '硕士', years: 5, score: 85, target: '算法工程师', column: 'pending',
    source: '内推', location: '广州', expectedSalary: '38-45K', owner: '陈思', lastUpdated: '2天前',
    skills: ['搜索排序', 'Learning to Rank', 'ES', '特征工程', 'AB 实验'],
    tags: ['搜索排序', '边界候选'], riskFlags: ['管理协作案例不足'],
    highlights: ['搜索排序 NDCG 提升 12%', '实验设计清晰'],
    reason: '技术匹配较高，建议 HR 复核后进入技术面。',
  },
  {
    name: '袁敏', edu: '博士', years: 2, score: 88, target: '研究算法工程师', column: 'passed',
    source: '学术合作', location: '北京', expectedSalary: '50-62K', owner: '陈思', lastUpdated: '2天前',
    skills: ['语音增强', '降噪', '深度学习', '论文写作', 'Matlab'],
    tags: ['语音增强', '研究型'], riskFlags: [],
    highlights: ['语音增强论文产出稳定', '适合前沿模型研究'],
    reason: '研究能力强，与语音增强方向匹配。',
  },
  {
    name: '杜明', edu: '本科', years: 6, score: 63, target: '测试工程师', column: 'talent',
    source: '官网投递', location: '无锡', expectedSalary: '24-30K', owner: '王珂', lastUpdated: '3天前',
    skills: ['自动化测试', 'Python', 'JMeter', '接口测试'],
    tags: ['非算法岗', '人才库'], riskFlags: ['岗位不匹配'],
    highlights: ['自动化覆盖率提升经验'],
    reason: '当前算法岗位不匹配，可放入测试岗位人才库。',
  },
  {
    name: '方怡', edu: '硕士', years: 4, score: 83, target: '数据分析师', column: 'pending',
    source: 'Boss 直聘', location: '成都', expectedSalary: '30-38K', owner: '赵敏', lastUpdated: '3天前',
    skills: ['SQL', 'Python', '指标体系', 'Tableau', '因果分析'],
    tags: ['数据分析', '可转算法运营'], riskFlags: ['算法建模深度待确认'],
    highlights: ['指标体系搭建经验完整', '业务表达清晰'],
    reason: '数据分析能力较好，需确认是否匹配算法岗位。',
  },
  {
    name: '蒋晨', edu: '硕士', years: 7, score: 94, target: '算法平台负责人', column: 'passed',
    source: '猎头', location: '上海', expectedSalary: '70-85K', owner: '陈思', lastUpdated: '3天前',
    skills: ['算法平台', 'MLOps', '团队管理', '模型服务', 'K8s', '成本优化'],
    tags: ['负责人画像', '高优先级'], riskFlags: [],
    highlights: ['管理 12 人算法平台团队', '推理成本下降 35%'],
    reason: '平台与管理能力突出，建议直接进入高阶面试。',
  },
  {
    name: '谢然', edu: '本科', years: 3, score: 74, target: '前端工程师', column: 'talent',
    source: '脉脉', location: '杭州', expectedSalary: '25-32K', owner: '王珂', lastUpdated: '4天前',
    skills: ['React', 'TypeScript', '可视化', 'WebRTC'],
    tags: ['非算法岗', '可视化'], riskFlags: ['当前岗位不匹配'],
    highlights: ['有音视频前端经验', '可匹配招聘系统前端岗'],
    reason: '不匹配算法岗位，但适合前端与可视化岗位储备。',
  },
  {
    name: '邵宁', edu: '硕士', years: 5, score: 81, target: '语音算法工程师', column: 'pending',
    source: '内推', location: '厦门', expectedSalary: '36-44K', owner: '赵敏', lastUpdated: '4天前',
    skills: ['唤醒词', '端侧 DSP', 'C++', '降噪', '模型压缩'],
    tags: ['端侧语音', '需复核'], riskFlags: ['云端模型经验较少'],
    highlights: ['端侧唤醒经验稀缺', 'C++ 工程能力强'],
    reason: '端侧语音方向有价值，建议复核后推进。',
  },
  {
    name: '熊安', edu: '大专', years: 4, score: 52, target: '算法工程师', column: 'rejected',
    source: '官网投递', location: '重庆', expectedSalary: '24-30K', owner: '王珂', lastUpdated: '5天前',
    skills: ['Python', '数据标注', '基础模型训练'],
    tags: ['暂缓'], riskFlags: ['学历差距明显', '算法项目不足'],
    highlights: ['数据处理经验较多'],
    reason: '岗位要求差距明显，建议暂缓推进。',
  },
  {
    name: '汪琪', edu: '博士', years: 6, score: 96, target: '语音大模型专家', column: 'passed',
    source: '学术合作', location: '北京', expectedSalary: '85-110K', owner: '陈思', lastUpdated: '5天前',
    skills: ['语音大模型', 'ASR', '多模态', '预训练', '团队指导', '论文'],
    tags: ['专家型', '战略岗位', '强烈推荐'], riskFlags: [],
    highlights: ['语音大模型预训练经验', '可指导模型路线规划'],
    reason: '战略方向高度匹配，建议进入专家面试链路。',
  },
]

export const resumeCandidates: ResumeCandidate[] = seedCandidates.map((candidate, index) => ({
  ...candidate,
  id: index + 1,
  dims: buildDims(candidate.score, candidate.years, candidate.edu, candidate.skills),
  stageHistory: candidate.stageHistory ?? defaultHistory(candidate.column),
}))

export const resumeJobOptions = [
  '全部岗位',
  ...Array.from(new Set(resumeCandidates.map((candidate) => candidate.target))),
]

export const resumeSources = [
  '全部来源',
  ...Array.from(new Set(resumeCandidates.map((candidate) => candidate.source))),
]
