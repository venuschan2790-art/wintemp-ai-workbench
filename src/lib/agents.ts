export type AgentSlug =
  | "social-data-analysis"
  | "content-strategy"
  | "installation-steps"
  | "product-marketing-scene";

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "radio"
  | "file"
  | "image"
  | "month"
  | "number";

export type AgentField = {
  name: string;
  label: string;
  type: FieldType;
  placeholder: string;
  required?: boolean;
  options?: string[];
};

export type AgentConfig = {
  slug: AgentSlug;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  badge: string;
  outputTitle: string;
  fields: AgentField[];
  defaults: Record<string, string>;
  buildPrompt: (values: Record<string, string>) => string;
};

export const CURRENT_VERSION_NOTE =
  "当前版本支持两种用法：Generate Prompt 只生成结构化 Prompt；Call AI 会调用已配置的 OpenAI API 并直接返回 AI 结果。";

const value = (
  values: Record<string, string>,
  key: string,
  fallback = "未填写"
) => values[key]?.trim() || fallback;

const section = (title: string, content: string | string[]) => {
  const body = Array.isArray(content)
    ? content.map((item) => `- ${item}`).join("\n")
    : content;

  return `## ${title}\n${body}`;
};

const inputSection = (items: Array<[string, string]>) =>
  section(
    "本次输入信息",
    items.map(([label, text]) => `${label}：${text || "未填写"}`)
  );

export const agents: AgentConfig[] = [
  {
    slug: "product-marketing-scene",
    title: "产品营销场景图生成 Agent",
    shortTitle: "营销场景图",
    description:
      "用于根据 WINTEMP 产品实拍图、目标市场、营销场景和使用渠道，生成适合 AI 生图工具或设计师执行的产品营销场景图提示词，并强调保持产品外观、比例、结构和品牌识别一致。",
    category: "Marketing Visual",
    badge: "IMAGE",
    outputTitle: "产品营销场景图 Prompt",
    fields: [
      {
        name: "productName",
        label: "产品名称",
        type: "text",
        placeholder: "例如 WINTEMP Tankless Electric Water Heater",
        required: true
      },
      {
        name: "productType",
        label: "产品类型",
        type: "select",
        placeholder: "选择产品类型",
        required: true,
        options: ["热水器", "开水器", "冰水机", "气泡冰水机", "户外燃气热水器", "配件"]
      },
      {
        name: "productImage",
        label: "上传产品图",
        type: "image",
        placeholder: "支持 png / jpg / webp",
        required: true
      },
      {
        name: "targetMarket",
        label: "目标市场",
        type: "select",
        placeholder: "选择目标市场",
        required: true,
        options: ["北美 C 端", "拉美 B 端", "中东 B 端", "全球品牌"]
      },
      {
        name: "channels",
        label: "使用渠道",
        type: "multiselect",
        placeholder: "选择使用渠道",
        required: true,
        options: [
          "Facebook",
          "Instagram",
          "Pinterest",
          "Blog",
          "Amazon",
          "独立站",
          "LinkedIn",
          "YouTube",
          "TikTok"
        ]
      },
      {
        name: "imageUse",
        label: "图片用途",
        type: "select",
        placeholder: "选择图片用途",
        required: true,
        options: ["社媒图", "Blog 配图", "产品场景图", "招商海报", "Amazon 主图", "详情页图", "视频首帧"]
      },
      {
        name: "sceneDescription",
        label: "场景描述",
        type: "textarea",
        placeholder: "例如美国现代厨房、中东高端酒店吧台、户外露营淋浴场景",
        required: true
      },
      {
        name: "aspectRatio",
        label: "图片比例",
        type: "select",
        placeholder: "选择图片比例",
        required: true,
        options: ["1:1", "4:3", "16:9", "9:16", "4:5", "21:9"]
      },
      {
        name: "visualStyle",
        label: "视觉风格",
        type: "multiselect",
        placeholder: "选择视觉风格",
        required: true,
        options: ["真实摄影", "8K 高清", "C4D 渲染", "简约海报", "商务风", "高端家居", "Amazon 风格"]
      },
      {
        name: "placement",
        label: "产品摆放要求",
        type: "text",
        placeholder: "例如产品居中、产品靠右、产品占画面 30%、不改变角度"
      },
      {
        name: "mustShow",
        label: "必须展示内容",
        type: "textarea",
        placeholder: "例如产品、龙头、水槽、杯子、浴室、经销商场景"
      },
      {
        name: "mustAvoid",
        label: "必须避免内容",
        type: "textarea",
        placeholder: "例如不要改 logo、不要改变产品形状、不要多余文字、不要错误管线"
      },
      {
        name: "textMode",
        label: "是否添加文字",
        type: "radio",
        placeholder: "选择文字方式",
        required: true,
        options: ["不添加", "添加标题", "添加标题和副标题"]
      },
      {
        name: "headline",
        label: "标题文字",
        type: "text",
        placeholder: "需要添加文字时填写"
      },
      {
        name: "brandStyle",
        label: "品牌风格要求",
        type: "textarea",
        placeholder: "例如符合 WINTEMP 橙色视觉、简洁、高端、专业"
      },
      {
        name: "outputLanguage",
        label: "输出语言",
        type: "select",
        placeholder: "选择输出语言",
        required: true,
        options: ["中文提示词", "英文 Prompt", "中英双语"]
      },
      {
        name: "notes",
        label: "补充说明",
        type: "textarea",
        placeholder: "其他要求"
      }
    ],
    defaults: {
      productType: "热水器",
      targetMarket: "北美 C 端",
      channels: "Instagram, Amazon",
      imageUse: "产品场景图",
      aspectRatio: "4:5",
      visualStyle: "真实摄影, 8K 高清, 高端家居",
      textMode: "不添加",
      outputLanguage: "中英双语",
      brandStyle: "符合 WINTEMP 橙色视觉，简洁、高端、专业，画面干净可信。"
    },
    buildPrompt: (values) =>
      [
        "你是 WINTEMP 品牌运营部的产品营销场景图生成 Agent。请根据产品图、目标市场、营销场景和使用渠道，生成适合 AI 生图工具或设计师执行的产品营销场景图提示词。",
        inputSection([
          ["产品名称", value(values, "productName")],
          ["产品类型", value(values, "productType")],
          ["上传产品图", value(values, "productImage", "已预留上传入口，当前未选择文件")],
          ["目标市场", value(values, "targetMarket")],
          ["使用渠道", value(values, "channels")],
          ["图片用途", value(values, "imageUse")],
          ["场景描述", value(values, "sceneDescription")],
          ["图片比例", value(values, "aspectRatio")],
          ["视觉风格", value(values, "visualStyle")],
          ["产品摆放要求", value(values, "placement")],
          ["必须展示内容", value(values, "mustShow")],
          ["必须避免内容", value(values, "mustAvoid")],
          ["是否添加文字", value(values, "textMode")],
          ["标题文字", value(values, "headline")],
          ["品牌风格要求", value(values, "brandStyle")],
          ["输出语言", value(values, "outputLanguage")],
          ["补充说明", value(values, "notes")]
        ]),
        section(
          "产品保持要求",
          "请严格参考上传的产品图：\n- 不改变产品外观\n- 不改变产品比例\n- 不改变产品结构\n- 不改变产品颜色\n- 不改变 logo\n- 不添加不存在的按钮、接口或配件\n- 产品与场景比例保持真实"
        ),
        section(
          "中文 AI 作图提示词",
          `生成一张适用于【${value(values, "channels")}】的 WINTEMP 产品营销场景图。\n产品为【${value(values, "productType")} / ${value(values, "productName")}】，请严格参考上传产品图，保持产品外观、比例、结构、颜色和 logo 不变。\n\n画面场景：\n${value(values, "sceneDescription")}\n\n目标市场：\n${value(values, "targetMarket")}\n\n视觉风格：\n${value(values, "visualStyle")}\n\n构图要求：\n${value(values, "placement")}\n\n必须展示：\n${value(values, "mustShow")}\n\n图片比例：\n${value(values, "aspectRatio")}\n\n整体要求：\n画面真实、专业、符合目标市场审美，产品与场景融合自然，光影真实，清晰度高，适合 WINTEMP 品牌推广使用。`
        ),
        section(
          "English Prompt",
          `Create a professional WINTEMP product marketing scene image for 【${value(values, "channels")}】.\nUse the uploaded product image as the strict product reference. Keep the product shape, proportion, color, logo, panel details, buttons, connectors, and structure unchanged.\n\nScene:\n${value(values, "sceneDescription")}\n\nTarget market:\n${value(values, "targetMarket")}\n\nVisual style:\n${value(values, "visualStyle")}\n\nComposition:\n${value(values, "placement")}\n\nMust include:\n${value(values, "mustShow")}\n\nAspect ratio:\n${value(values, "aspectRatio")}\n\nThe image should look realistic, clean, professional, and suitable for WINTEMP marketing use. The product must blend naturally with the environment while keeping its original appearance.`
        ),
        section(
          "Negative Prompt",
          `不要改变产品外观，不要改变产品形状，不要改变产品比例，不要改变 logo，不要添加错误接口，不要添加不存在的零部件，不要出现错误管线，不要出现变形产品，不要让产品过大或过小，不要出现模糊画面，不要出现错误文字，不要出现杂乱背景，不要出现不符合目标市场的场景。\n补充避免内容：${value(values, "mustAvoid")}`
        ),
        section("设计师审核清单", [
          "产品外观是否与原图一致",
          "logo 是否正确",
          "产品比例是否真实",
          "场景是否符合目标市场",
          "是否出现错误接口或错误安装方式",
          "光影是否自然",
          "是否适合对应平台比例",
          "是否需要后期修图"
        ]),
        section(
          "可选画面文字",
          `主标题：${value(values, "headline")}\n副标题：\nCTA：\n是否建议添加文字：${value(values, "textMode")}\n文字位置建议：`
        )
      ].join("\n\n")
  },
  {
    slug: "content-strategy",
    title: "社媒内容策略与创意规划 Agent",
    shortTitle: "内容策略规划",
    description:
      "用于帮助品牌运营人员梳理不同市场和平台的账号定位，根据 WINTEMP 产品、市场目标、社媒规划表和参考账号，生成月度内容策略、周度选题、单条内容创意和平台适配建议。",
    category: "Content Planning",
    badge: "IDEA",
    outputTitle: "内容策略规划 Prompt",
    fields: [
      {
        name: "targetMarket",
        label: "目标市场",
        type: "select",
        placeholder: "选择目标市场",
        required: true,
        options: ["北美", "拉美", "中东", "全球品牌账号"]
      },
      {
        name: "accountType",
        label: "账号类型",
        type: "select",
        placeholder: "选择账号类型",
        required: true,
        options: ["C 端账号", "B 端账号", "品牌账号"]
      },
      {
        name: "platforms",
        label: "平台",
        type: "multiselect",
        placeholder: "选择平台",
        required: true,
        options: ["Facebook", "Instagram", "Pinterest", "YouTube", "TikTok", "LinkedIn"]
      },
      {
        name: "products",
        label: "目标产品",
        type: "multiselect",
        placeholder: "选择目标产品",
        required: true,
        options: ["热水器", "开水器", "冰水机", "气泡冰水机", "户外燃气热水器", "全产品线"]
      },
      {
        name: "contentMonth",
        label: "内容月份",
        type: "month",
        placeholder: "例如 2026 年 7 月",
        required: true
      },
      {
        name: "planningThemes",
        label: "参考规划表主题",
        type: "textarea",
        placeholder: "可粘贴 2026 年社媒内容规划表中的主题"
      },
      {
        name: "operationGoals",
        label: "当前运营目标",
        type: "multiselect",
        placeholder: "选择运营目标",
        required: true,
        options: ["提升曝光", "增加粉丝", "提升互动", "获取询盘", "推广新品", "招商合作"]
      },
      {
        name: "audience",
        label: "目标受众",
        type: "text",
        placeholder: "例如：美国消费者、中东经销商、拉美渠道客户、餐饮/酒店客户",
        required: true
      },
      {
        name: "needReference",
        label: "是否需要参考账号",
        type: "radio",
        placeholder: "选择是否需要",
        required: true,
        options: ["需要", "不需要"]
      },
      {
        name: "referenceAccounts",
        label: "已有参考账号",
        type: "textarea",
        placeholder: "可填写想模仿或分析的账号链接/名称"
      },
      {
        name: "stylePreference",
        label: "内容风格偏好",
        type: "multiselect",
        placeholder: "选择风格偏好",
        options: ["专业 B2B", "家庭生活方式", "高端简约", "真实摄影", "教育科普", "招商合作"]
      },
      {
        name: "contentCount",
        label: "需要输出的内容数量",
        type: "number",
        placeholder: "例如 10",
        required: true
      },
      {
        name: "linkInquiry",
        label: "是否联动询盘反馈",
        type: "radio",
        placeholder: "选择是否联动",
        options: ["是", "否"]
      },
      {
        name: "customerQuestions",
        label: "客户常问问题",
        type: "textarea",
        placeholder: "来自销售或社媒询盘的客户问题"
      },
      {
        name: "outputLanguage",
        label: "输出语言",
        type: "select",
        placeholder: "选择输出语言",
        required: true,
        options: ["中文", "英文", "西语", "阿语方向", "中英双语"]
      },
      {
        name: "notes",
        label: "补充说明",
        type: "textarea",
        placeholder: "其他要求"
      }
    ],
    defaults: {
      targetMarket: "北美",
      accountType: "C 端账号",
      platforms: "Facebook, Instagram, Pinterest",
      products: "热水器, 全产品线",
      operationGoals: "提升曝光, 提升互动",
      needReference: "需要",
      stylePreference: "家庭生活方式, 真实摄影, 教育科普",
      contentCount: "10",
      linkInquiry: "否",
      outputLanguage: "中文"
    },
    buildPrompt: (values) =>
      [
        "你是 WINTEMP 品牌运营部的社媒内容策略与创意规划 Agent。请根据市场、平台、产品、运营目标、参考账号和客户问题，生成可执行的月度内容策略、周度选题、单条内容创意和平台适配建议。",
        inputSection([
          ["目标市场", value(values, "targetMarket")],
          ["账号类型", value(values, "accountType")],
          ["平台", value(values, "platforms")],
          ["目标产品", value(values, "products")],
          ["内容月份", value(values, "contentMonth")],
          ["参考规划表主题", value(values, "planningThemes")],
          ["当前运营目标", value(values, "operationGoals")],
          ["目标受众", value(values, "audience")],
          ["是否需要参考账号", value(values, "needReference")],
          ["已有参考账号", value(values, "referenceAccounts")],
          ["内容风格偏好", value(values, "stylePreference")],
          ["需要输出的内容数量", value(values, "contentCount")],
          ["是否联动询盘反馈", value(values, "linkInquiry")],
          ["客户常问问题", value(values, "customerQuestions")],
          ["输出语言", value(values, "outputLanguage")],
          ["补充说明", value(values, "notes")]
        ]),
        section(
          "账号定位建议",
          `目标市场：${value(values, "targetMarket")}\n账号类型：${value(values, "accountType")}\n目标受众：${value(values, "audience")}\n核心内容方向：\n不适合发布的内容：\n平台角色说明：${value(values, "platforms")}`
        ),
        section(
          "参考账号分析 Prompt",
          "请根据 WINTEMP 的品牌、产品和目标市场，推荐适合参考的海外企业或社媒账号类型。\n\n请从以下角度分析：\n1. 哪类品牌或账号值得参考\n2. 这些账号适合参考什么内容形式\n3. 可以借鉴的选题角度\n4. 可以借鉴的画面风格\n5. 可以借鉴的视频结构\n6. 不应直接复制的部分\n7. WINTEMP 可以如何转化为自己的内容"
        ),
        section(
          "月度内容主题建议",
          `主题 1：\n适合平台：${value(values, "platforms")}\n适合产品：${value(values, "products")}\n目标受众：${value(values, "audience")}\n内容目标：${value(values, "operationGoals")}\n推荐形式：\n\n主题 2：\n适合平台：${value(values, "platforms")}\n适合产品：${value(values, "products")}\n目标受众：${value(values, "audience")}\n内容目标：${value(values, "operationGoals")}\n推荐形式：`
        ),
        section(
          "周度内容规划",
          "第 1 周：\n- 内容主题\n- 推荐平台\n- 内容形式\n- 产品重点\n- 目标\n\n第 2 周：\n- 内容主题\n- 推荐平台\n- 内容形式\n- 产品重点\n- 目标\n\n第 3 周：\n- 内容主题\n- 推荐平台\n- 内容形式\n- 产品重点\n- 目标\n\n第 4 周：\n- 内容主题\n- 推荐平台\n- 内容形式\n- 产品重点\n- 目标"
        ),
        section(
          "单条内容创意",
          `请输出 ${value(values, "contentCount")} 条内容创意。每条按以下格式：\n\n内容标题：\n适合平台：\n目标市场：${value(values, "targetMarket")}\n目标受众：${value(values, "audience")}\n产品：${value(values, "products")}\n内容形式：\n核心卖点：\n画面建议：\n文案方向：\nCTA：\n是否适合做短视频：\n是否适合做图片帖：\n是否适合改成 Blog / LinkedIn：`
        ),
        section(
          "可联动 Agent",
          "1. 可联动社媒数据分析 Agent：\n根据上月数据判断哪些内容方向应增加或减少。\n\n2. 可联动产品营销场景图生成 Agent：\n将内容创意转化为 AI 场景图提示词。\n\n3. 可联动询盘分析 Agent：\n将客户常问问题转化为后续社媒选题。"
        )
      ].join("\n\n")
  },
  {
    slug: "social-data-analysis",
    title: "社媒运营数据分析 Agent",
    shortTitle: "运营数据分析",
    description:
      "用于帮助品牌运营人员完成 WINTEMP 社媒账号的月度数据整理、统计、计算和分析。第一版不直接连接各平台后台，而是通过上传 Excel、粘贴数据或手动填写核心数据，生成结构化分析 Prompt 和月度社媒运营分析结果。",
    category: "Social Analytics",
    badge: "DATA",
    outputTitle: "月度社媒运营分析 Prompt",
    fields: [
      {
        name: "analysisMonth",
        label: "分析月份",
        type: "month",
        placeholder: "例如 2026 年 6 月",
        required: true
      },
      {
        name: "dataSource",
        label: "数据来源",
        type: "select",
        placeholder: "选择数据来源",
        required: true,
        options: ["Excel 上传", "手动录入", "粘贴数据"]
      },
      {
        name: "socialDataFile",
        label: "上传社媒数据表",
        type: "file",
        placeholder: "支持 xlsx / csv，第一版只做上传入口"
      },
      {
        name: "accountScope",
        label: "账号范围",
        type: "multiselect",
        placeholder: "选择账号范围",
        required: true,
        options: ["全部账号", "北美", "拉美", "中东", "YouTube", "TikTok"]
      },
      {
        name: "platformScope",
        label: "平台范围",
        type: "multiselect",
        placeholder: "选择平台范围",
        required: true,
        options: ["Facebook", "Instagram", "Pinterest", "YouTube", "TikTok"]
      },
      {
        name: "marketPositioning",
        label: "市场定位",
        type: "multiselect",
        placeholder: "选择市场定位",
        required: true,
        options: ["北美 C 端", "拉美 B 端", "中东 B 端", "品牌账号"]
      },
      {
        name: "metrics",
        label: "重点关注指标",
        type: "multiselect",
        placeholder: "选择重点关注指标",
        required: true,
        options: ["粉丝数", "粉丝增长", "发布数", "浏览量", "播放量", "点赞", "评论", "分享", "互动数", "互动率"]
      },
      {
        name: "monthlyFocus",
        label: "本月运营重点",
        type: "text",
        placeholder: "例如：提升中东 B 端询盘、测试短视频、提升 Pinterest 图文流量"
      },
      {
        name: "monthlyAbnormal",
        label: "本月异常情况",
        type: "text",
        placeholder: "例如：某账号广告暂停、某平台流量异常、Pinterest 数据未登记"
      },
      {
        name: "analysisQuestions",
        label: "希望重点分析的问题",
        type: "multiselect",
        placeholder: "选择希望重点分析的问题",
        options: ["账号增长", "平台差异", "内容表现", "互动表现", "发布频率", "视频表现", "图文表现"]
      },
      {
        name: "outputLanguage",
        label: "输出语言",
        type: "select",
        placeholder: "选择输出语言",
        required: true,
        options: ["中文", "英文", "中英双语"]
      },
      {
        name: "notes",
        label: "补充说明",
        type: "textarea",
        placeholder: "其他需要 AI 注意的情况"
      }
    ],
    defaults: {
      dataSource: "Excel 上传",
      accountScope: "全部账号",
      platformScope: "Facebook, Instagram, Pinterest, YouTube, TikTok",
      marketPositioning: "北美 C 端, 拉美 B 端, 中东 B 端, 品牌账号",
      metrics: "粉丝数, 粉丝增长, 发布数, 浏览量, 播放量, 互动数, 互动率",
      analysisQuestions: "账号增长, 平台差异, 内容表现, 互动表现",
      outputLanguage: "中文"
    },
    buildPrompt: (values) =>
      [
        "你是 WINTEMP 品牌运营部内部使用的社媒运营数据分析助手。该分析主要服务品牌运营人员，不面向老板或跨部门管理看板。请帮助运营人员在月度数据整理完成后，判断各账号、各平台、各市场的运营现状，并给出后续内容调整和运营优化建议。",
        inputSection([
          ["分析月份", value(values, "analysisMonth")],
          ["数据来源", value(values, "dataSource")],
          ["上传社媒数据表", value(values, "socialDataFile", "已预留上传入口，当前未选择文件")],
          ["账号范围", value(values, "accountScope")],
          ["平台范围", value(values, "platformScope")],
          ["市场定位", value(values, "marketPositioning")],
          ["重点关注指标", value(values, "metrics")],
          ["本月运营重点", value(values, "monthlyFocus")],
          ["本月异常情况", value(values, "monthlyAbnormal")],
          ["希望重点分析的问题", value(values, "analysisQuestions")],
          ["输出语言", value(values, "outputLanguage")],
          ["补充说明", value(values, "notes")]
        ]),
        section(
          "数据检查提示",
          "请检查以下社媒数据是否存在缺失、异常或统计口径不一致的问题：\n\n1. 是否有平台数据缺失；\n2. 是否有账号数据未填写；\n3. 是否有明显异常增长或下降；\n4. 是否有互动率、增长率等计算指标缺失；\n5. 是否有不同平台指标口径不一致的问题；\n6. 是否有需要补充说明的数据异常。"
        ),
        section(
          "月度社媒数据分析 Prompt",
          "你是 WINTEMP 品牌运营部的社媒运营数据分析助手。请根据我提供的社媒月度数据，从账号、平台、市场和内容表现四个维度进行分析。\n\n请重点分析：\n\n1. 本月整体社媒运营表现；\n2. 各平台表现差异；\n3. 北美 C 端、拉美 B 端、中东 B 端的市场表现；\n4. YouTube 和 TikTok 品牌账号表现；\n5. 粉丝增长、浏览量、播放量、互动率和内容发布效率；\n6. 表现较好的账号和表现较弱的账号；\n7. 数据变化背后可能的原因；\n8. 当前内容方向是否适合对应市场和平台；\n9. 下月社媒运营建议；\n10. 是否需要联动社媒内容策略与创意规划 Agent，调整后续内容选题。"
        ),
        section(
          "WINTEMP 社媒月度数据分析",
          "### 1. 本月整体数据概览\n- 本月总发布数量：\n- 总粉丝数：\n- 粉丝增长情况：\n- 总浏览量 / 播放量：\n- 总互动数：\n- 整体互动率：\n- 本月主要变化：\n\n### 2. 各市场账号表现分析\n- 北美 C 端账号表现：\n- 拉美 B 端账号表现：\n- 中东 B 端账号表现：\n- YouTube / TikTok 品牌账号表现：\n\n### 3. 各平台表现分析\n- Facebook：\n- Instagram：\n- Pinterest：\n- YouTube：\n- TikTok：\n\n### 4. 内容表现分析\n- 表现较好的内容类型：\n- 表现较弱的内容类型：\n- 视频内容表现：\n- 图片 / 海报内容表现：\n- 是否有值得继续放大的内容方向：\n\n### 5. 问题与原因判断\n- 数据明显下降的平台或账号：\n- 可能原因：\n- 当前内容与账号定位是否匹配：\n- 是否存在发布频率、内容形式或平台选择问题：\n\n### 6. 下月运营建议\n- 重点优化平台：\n- 重点优化账号：\n- 推荐增加的内容类型：\n- 推荐减少的内容类型：\n- 发布频率建议：\n- 是否需要调整市场内容方向："
        ),
        section(
          "账号与平台优化建议",
          "1. 表现较好的账号：\n- 原因判断：\n- 是否建议继续放大：\n\n2. 表现较弱的账号：\n- 可能问题：\n- 调整建议：\n\n3. 表现较好的平台：\n- 可继续使用的内容形式：\n- 可复用经验：\n\n4. 表现较弱的平台：\n- 需要优化的方向：\n- 是否需要降低发布频率或调整内容形式："
        ),
        section("下月内容与运营调整建议", [
          "内容方向建议：",
          "平台重点建议：",
          "账号调整建议：",
          "发布频率建议：",
          "视频 / 图片内容比例建议：",
          "B 端内容是否需要加强招商信息：",
          "C 端内容是否需要加强使用场景：",
          "品牌账号是否需要增加系列化内容：",
          "是否建议联动社媒内容策略与创意规划 Agent："
        ]),
        section(
          "可联动 Agent",
          "1. 社媒内容策略与创意规划 Agent\n根据本月数据表现，调整下月内容主题、账号定位和平台内容形式。\n\n2. 产品营销场景图生成 Agent\n将表现较好的内容方向转化为产品场景图或社媒视觉图提示词。\n\n3. 后续询盘分析 Agent\n如果某些社媒内容带来询盘，可结合聊天记录分析客户关注点，并反哺内容选题。"
        )
      ].join("\n\n")
  },
  {
    slug: "installation-steps",
    title: "安装步骤图生成 Agent",
    shortTitle: "安装步骤图",
    description:
      "用于将产品工程师提供的安装步骤文档，转化为说明书中可使用的安装示意图绘制需求、步骤图说明、设计师绘图要求和 AI 绘图提示词。第一版不直接生成图片，先生成结构化绘图需求和提示词。",
    category: "Manual Illustration",
    badge: "GUIDE",
    outputTitle: "安装步骤图绘制 Prompt",
    fields: [
      {
        name: "productName",
        label: "产品名称",
        type: "text",
        placeholder: "例如 WINTEMP Instant Hot Water Dispenser",
        required: true
      },
      {
        name: "productType",
        label: "产品类型",
        type: "select",
        placeholder: "选择产品类型",
        required: true,
        options: ["开水器", "即热式电热水器", "气泡冰水机", "冰水机", "户外燃气热水器", "其他"]
      },
      {
        name: "productModel",
        label: "产品型号",
        type: "text",
        placeholder: "例如 WN08、WN13、KFU135 等"
      },
      {
        name: "sourceType",
        label: "安装步骤来源",
        type: "select",
        placeholder: "选择来源",
        required: true,
        options: ["上传文档", "粘贴文字", "手动填写"]
      },
      {
        name: "installationDocument",
        label: "上传安装步骤文档",
        type: "file",
        placeholder: "支持 docx / pdf / txt，第一版只做上传入口"
      },
      {
        name: "installationText",
        label: "粘贴安装步骤内容",
        type: "textarea",
        placeholder: "用于粘贴工程师提供的步骤"
      },
      {
        name: "stepRange",
        label: "需要生成的步骤范围",
        type: "text",
        placeholder: "例如 Step 1-Step 8，默认全部"
      },
      {
        name: "manualType",
        label: "目标说明书类型",
        type: "select",
        placeholder: "选择说明书类型",
        required: true,
        options: ["用户说明书", "安装说明书", "快速安装指南", "售后维修指导"]
      },
      {
        name: "visualStyle",
        label: "图示风格",
        type: "select",
        placeholder: "选择图示风格",
        required: true,
        options: ["黑白线稿", "简洁矢量图", "灰度说明书图", "真实安装示意图"]
      },
      {
        name: "englishLabels",
        label: "是否需要英文标签",
        type: "radio",
        placeholder: "选择是否需要",
        required: true,
        options: ["是", "否"]
      },
      {
        name: "targetMarket",
        label: "目标市场",
        type: "select",
        placeholder: "选择目标市场",
        required: true,
        options: ["美国", "欧洲", "中东", "拉美", "通用"]
      },
      {
        name: "mustShowParts",
        label: "必须展示的零部件",
        type: "textarea",
        placeholder: "例如阀门、进水管、透明泄压管、龙头、螺母等"
      },
      {
        name: "mustAvoidErrors",
        label: "必须避免的错误",
        type: "textarea",
        placeholder: "例如不要画错接口方向、不要改变产品结构"
      },
      {
        name: "outputLanguage",
        label: "输出语言",
        type: "select",
        placeholder: "选择输出语言",
        required: true,
        options: ["中文", "英文", "中英双语"]
      },
      {
        name: "notes",
        label: "补充说明",
        type: "textarea",
        placeholder: "其他要求"
      }
    ],
    defaults: {
      productType: "开水器",
      sourceType: "粘贴文字",
      manualType: "安装说明书",
      visualStyle: "黑白线稿",
      englishLabels: "是",
      targetMarket: "通用",
      outputLanguage: "中英双语"
    },
    buildPrompt: (values) =>
      [
        "你是 WINTEMP 品牌运营部的安装步骤图生成 Agent。请将产品工程师提供的安装步骤文档，转化为说明书中可使用的安装示意图绘制需求、步骤图说明、设计师绘图要求和 AI 绘图提示词。第一版不直接生成图片，只生成结构化绘图需求和提示词。",
        inputSection([
          ["产品名称", value(values, "productName")],
          ["产品类型", value(values, "productType")],
          ["产品型号", value(values, "productModel")],
          ["安装步骤来源", value(values, "sourceType")],
          ["上传安装步骤文档", value(values, "installationDocument", "已预留上传入口，当前未选择文件")],
          ["粘贴安装步骤内容", value(values, "installationText")],
          ["需要生成的步骤范围", value(values, "stepRange", "全部")],
          ["目标说明书类型", value(values, "manualType")],
          ["图示风格", value(values, "visualStyle")],
          ["是否需要英文标签", value(values, "englishLabels")],
          ["目标市场", value(values, "targetMarket")],
          ["必须展示的零部件", value(values, "mustShowParts")],
          ["必须避免的错误", value(values, "mustAvoidErrors")],
          ["输出语言", value(values, "outputLanguage")],
          ["补充说明", value(values, "notes")]
        ]),
        section(
          "安装步骤拆解",
          "Step 1：\n- 操作动作：\n- 涉及零部件：\n- 需要展示的角度：\n- 图中需要标注的内容：\n- 注意事项：\n\nStep 2：\n- 操作动作：\n- 涉及零部件：\n- 需要展示的角度：\n- 图中需要标注的内容：\n- 注意事项："
        ),
        section(
          "设计师绘图需求",
          `产品：${value(values, "productName")} / ${value(values, "productModel")}\n目标说明书：${value(values, "manualType")}\n图示风格：${value(values, "visualStyle")}\n整体要求：\n每张图需要表达的安装动作：\n需要保持一致的产品结构：\n需要避免的错误：${value(values, "mustAvoidErrors")}\n是否需要英文标签：${value(values, "englishLabels")}`
        ),
        section(
          "AI 绘图提示词",
          `请根据以下安装步骤生成说明书风格的安装示意图：\n- 图示风格：${value(values, "visualStyle")}\n- 产品类型：${value(values, "productType")}\n- 安装动作：\n- 涉及零部件：${value(values, "mustShowParts")}\n- 构图要求：\n- 线条要求：\n- 标注要求：\n- 背景要求：\n- 清晰度要求：`
        ),
        section("Negative Prompt", [
          "错误产品结构",
          "错误接口方向",
          "多余零部件",
          "不真实的管线连接",
          "复杂背景",
          "装饰性元素",
          "模糊线条",
          "错误文字",
          "非说明书风格画面"
        ]),
        section(
          "说明书图示文字建议",
          "中文标签：\n英文标签：\n短句说明：\n是否适合放在图下：\n是否需要安全提醒："
        ),
        section("安装图审核清单", [
          "产品型号是否正确",
          "零部件是否完整",
          "操作顺序是否正确",
          "管线连接是否正确",
          "图示是否过于复杂",
          "标签是否简短",
          "是否符合说明书排版"
        ])
      ].join("\n\n")
  }
];

export const agentMap = new Map(agents.map((agent) => [agent.slug, agent]));

export const getAgent = (slug: string) => agentMap.get(slug as AgentSlug);
