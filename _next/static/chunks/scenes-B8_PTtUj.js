//#region app/data/scenes.ts
var groups = [
	{
		id: "baby",
		label: "宝宝",
		subtitle: "成长守护",
		accent: "#7fb5e6"
	},
	{
		id: "grandma",
		label: "奶奶",
		subtitle: "安心日常",
		accent: "#e0be80"
	},
	{
		id: "parents",
		label: "爸妈",
		subtitle: "省心生活",
		accent: "#cf8f6a"
	},
	{
		id: "family",
		label: "全家",
		subtitle: "安心后盾",
		accent: "#8fc4a8"
	}
];
var groupLabel = Object.fromEntries(groups.map((g) => [g.id, g.label]));
var scenes = [
	{
		no: 1,
		group: "baby",
		name: "AI夜间守护",
		claim: "终于能睡个好觉了",
		problem: {
			title: "白天上班，夜里带娃",
			detail: "父母一时睡熟，没发现被子已经盖住宝宝口鼻"
		},
		answer: {
			title: "蒙面立即报警",
			detail: "识别口鼻被遮挡，立即报警提醒父母"
		},
		note: "支持蒙面、呛奶、靠近床沿、翻越护栏等危险行为识别",
		media: "scene-night"
	},
	{
		no: 2,
		group: "baby",
		name: "AI磕碰预警",
		claim: "提前一步护住",
		problem: {
			title: "宝宝直接磕到桌角",
			detail: "额头撞上才哭，等看见时已经来不及"
		},
		answer: {
			title: "预测运动路线，提前提醒",
			detail: "判断即将磕碰，马上语音提醒家长"
		},
		media: "scene-climbguard"
	},
	{
		no: 3,
		group: "baby",
		name: "AI保姆看护",
		claim: "异常互动及时提醒",
		problem: {
			title: "宝宝交给保姆不放心",
			detail: "有没有耐心回应、是否出现粗暴动作，父母上班看不到"
		},
		answer: {
			title: "AI持续看护互动过程",
			detail: "哭闹无人回应、剧烈拉拽推搡等异常，立即通知父母"
		},
		media: "scene-nanny"
	},
	{
		no: 4,
		group: "baby",
		name: "AI成长记录",
		claim: "上班也不错过",
		problem: {
			title: "父母上班错过精彩瞬间",
			detail: "第一次撑爬、开心大笑、认真吃饭，都没能亲眼看到"
		},
		answer: {
			title: "AI主动记录成长日常",
			detail: "哭闹、欢笑、撑爬、吃饭，自动整理并同步微信"
		},
		media: "scene-growth"
	},
	{
		no: 5,
		group: "grandma",
		name: "AI吃药守护",
		claim: "忘了就提醒",
		problem: {
			title: "老人经常忘记吃药",
			detail: "家人不在身边，错过时间也不知道"
		},
		answer: {
			title: "到点主动确认",
			detail: "先提醒老人，未确认再通知家人"
		},
		media: "scene-medicine"
	},
	{
		no: 6,
		group: "grandma",
		name: "AI用药助手",
		claim: "拿起药就能问",
		problem: {
			title: "药盒小字看不清",
			detail: "「这个药一次吃几片？」自己翻说明书费劲"
		},
		answer: {
			title: "对着药盒问，马上说明白",
			detail: "「药盒标注：一次 1 片；请按医嘱服用」"
		},
		media: "scene-medhelp"
	},
	{
		no: 7,
		group: "grandma",
		name: "AI京剧陪练",
		claim: "在家学唱京剧",
		problem: {
			title: "一个人学，唱腔动作没把握",
			detail: "调门准不准、手势对不对，没人及时提醒"
		},
		answer: {
			title: "边唱边练，随时出声指导",
			detail: "「这一句尾音再收稳，兰花指再抬高一点」"
		},
		note: "京剧只是其中一例，书法、太极同样可以陪练",
		media: "scene-opera"
	},
	{
		no: 8,
		group: "grandma",
		name: "AI日常关照",
		claim: "不对劲，早一步知道",
		problem: {
			title: "问一句「都挺好」，子女无从判断",
			detail: "今天起没起床、吃没吃饭、喝没喝水，电话里问不出真实情况"
		},
		answer: {
			title: "看懂日常规律，不对劲主动说",
			detail: "「奶奶今天到 10 点还没起身，比平时晚了 3 个多小时」"
		},
		note: "只上报偏离日常的异常，不做逐条记录，画面也不出家门",
		media: "scene-routine"
	},
	{
		no: 9,
		group: "grandma",
		name: "AI老人守护",
		claim: "摔倒马上叫人",
		problem: {
			title: "老人独自在家摔倒",
			detail: "手机不在身边，家人很久以后才知道"
		},
		answer: {
			title: "发现倒地立即询问",
			detail: "持续无人回应，马上联系预设家人"
		},
		media: "scene-elder"
	},
	{
		no: 10,
		group: "parents",
		name: "AI饮食照应",
		claim: "家里谁不能多吃，它记着",
		problem: {
			title: "忌口这事，落到锅里就忘了",
			detail: "爸的血压药天天吃，炒菜的盐和油却没跟着变"
		},
		answer: {
			title: "手抬起来的时候就提一句",
			detail: "「爸的血压这周偏高，这盘先少放一勺盐」"
		},
		note: "只在有忌口的家人在家吃饭时开口，一顿饭最多一次，话只说给做饭的人",
		media: "scene-diet"
	},
	{
		no: 11,
		group: "parents",
		name: "AI做菜辅助",
		claim: "新菜也敢放手做",
		problem: {
			title: "第一次做新菜，调味没底",
			detail: "番茄浓汤牛腩该放多少糖？边做边查，手忙脚乱"
		},
		answer: {
			title: "开口一问，直接告诉你",
			detail: "「这锅先放 1 茶匙糖，尝味后再调整」"
		},
		media: "scene-cookassist"
	},
	{
		no: 12,
		group: "parents",
		name: "AI离家巡检",
		claim: "出门不再折返",
		problem: {
			title: "进了电梯还在担心",
			detail: "门没锁、空调没关，只能回家检查"
		},
		answer: {
			title: "全屋状态一次确认",
			detail: "门锁、门窗、家电，出门自动检查"
		},
		media: "scene-away"
	},
	{
		no: 13,
		group: "parents",
		name: "AI视觉找物",
		claim: "一句话找到手机 / 钥匙",
		problem: {
			title: "手机遥控器又不见了",
			detail: "沙发、茶几、卧室，满屋反复翻找"
		},
		answer: {
			title: "问一句就能找到",
			detail: "「遥控器最后放在沙发右边了」"
		},
		media: "scene-find"
	},
	{
		no: 14,
		group: "parents",
		name: "AI出门提醒",
		claim: "忘带东西会叫你",
		problem: {
			title: "出门总是丢三落四",
			detail: "到了楼下才发现钥匙、工牌没带"
		},
		answer: {
			title: "走到门口主动提醒",
			detail: "「你的工牌还放在茶几上」"
		},
		media: "scene-leaving"
	},
	{
		no: 15,
		group: "family",
		name: "AI宠物看护",
		claim: "拆家及时制止",
		problem: {
			title: "宠物独自在家，就怕拆家",
			detail: "翻垃圾、咬家具、上餐桌，回家才发现一片狼藉"
		},
		answer: {
			title: "拆家刚有苗头，马上叫停",
			detail: "AI 现场语音制止，同时通知主人"
		},
		media: "scene-pet"
	},
	{
		no: 16,
		group: "family",
		name: "AI宠物互动",
		claim: "听懂它想干嘛",
		problem: {
			title: "它一直叫，到底想干嘛",
			detail: "饿了、无聊、想出去，家人只能靠猜"
		},
		answer: {
			title: "叫声 + 行为，越看越懂它",
			detail: "「在阳台门口短叫又扒门，是想出去晒太阳」"
		},
		media: "scene-pettalk"
	},
	{
		no: 17,
		group: "family",
		name: "AI晾晒提醒",
		claim: "变天前叫你收",
		problem: {
			title: "衣服被子还晾在阳台",
			detail: "乌云来了没人留意，一场雨就白晒"
		},
		answer: {
			title: "天气 + 阳台画面综合判断",
			detail: "确认将下雨且衣被未收，立即提醒家人"
		},
		media: "scene-laundry"
	},
	{
		no: 18,
		group: "family",
		name: "AI异常巡查",
		claim: "夜里的动静早上说清楚",
		problem: {
			title: "夜里门外有人，家里毫不知情",
			detail: "陌生人在入户门外徘徊、反复试探门把手，一家人睡得正熟"
		},
		answer: {
			title: "第二天主动提醒，时间地点都说清",
			detail: "「凌晨 2:14，陌生人在入户门外停留 3 分钟，两次触碰门把手」"
		},
		note: "门外徘徊只是其中一例，家中其他异常动静同样会记录并在事后说清楚",
		media: "scene-intrusion"
	},
	{
		no: 19,
		group: "family",
		name: "AI家庭巡防",
		claim: "有危险立即报警",
		problem: {
			title: "家里没人，风险无人发现",
			detail: "出现火苗、门窗异常，往往出事后才知道"
		},
		answer: {
			title: "摄像头持续看护",
			detail: "发现火苗或门窗异常，立即报警并通知家人"
		},
		note: "水、电、燃气同样在监控范围内，异常用量与疑似泄漏一并预警",
		media: "scene-patrol"
	}
];
//#endregion
export { groups as n, scenes as r, groupLabel as t };
