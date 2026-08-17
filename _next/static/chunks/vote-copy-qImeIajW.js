//#region app/vote-config.ts
/**
* /vote 滑卡投票页的全部可配置项。
*
* 这个站是纯静态托管（GitHub Pages），没有后端，所以「配置」只能是编译进包里的
* 常量——不能读运行时环境变量。改完要重新 build + 重新导出才会生效。
*/
/**
* 飞书多维表格自动化「当收到 webhook 时」给出的地址。
*
* ⬇⬇⬇ 就填这一行 ⬇⬇⬇
*/
var FEISHU_WEBHOOK_URL = "https://modelbest.feishu.cn/base/automation/webhook/event/G8q0aDuQnwpmWrhwdIIcw6IQn4b";
/**
* 飞书企业自建应用的 App ID（cli_ 开头）。App ID 可以公开，App Secret 绝不能
* 写在前端；Secret 只填进飞书多维表格自动化的 HTTP 请求动作。
*
* 留空时身份功能完全关闭，提交格式保持旧版不变，方便在飞书应用配置完成之前继续
* 使用现有投票链路。
*/
var FEISHU_APP_ID = "cli_aafc67977cb89bd4";
/** 必须与飞书开放平台「安全设置 → 重定向 URL」逐字一致。 */
var FEISHU_OAUTH_REDIRECT_URI = "https://itse003.github.io/vote";
var isFeishuIdentityEnabled = () => /^cli_[A-Za-z0-9]+$/.test(FEISHU_APP_ID);
/**
* 留空时进入「本地模式」：不发任何请求，结果只存在浏览器里。调试数据不直接
* 暴露在普通结果页；真实网络发送失败时才提供复制 payload 的兜底按钮。
*/
var isLocalMode = () => FEISHU_WEBHOOK_URL.trim() === "";
/**
* 角色只用来事后按岗位分组看分歧，所以仍放在结果页，避免在开场设门槛；为了让
* 每份结果都能参与分组统计，提交前必须选择一项。
*/
var ROLES = [
	{
		id: "sales",
		label: "销售/市场"
	},
	{
		id: "rd",
		label: "研发/算法"
	},
	{
		id: "pm",
		label: "产品/项目"
	},
	{
		id: "qa",
		label: "评测/测试"
	},
	{
		id: "data",
		label: "数据"
	},
	{
		id: "function",
		label: "职能"
	},
	{
		id: "other",
		label: "其他"
	}
];
/** localStorage 的键。结构变了就升版本号，旧记录会被当作没有进度。 */
var STORAGE_KEY = "a100.vote.v1";
/** 提交成功后单独留一份，页面清了进度也还能翻出来重发。 */
var RECEIPT_KEY = "a100.vote.receipt.v1";
//#endregion
//#region app/components/vote-copy.ts
/**
* 投票页会打散原页面的宝宝/奶奶/爸妈/全家分组，因此只在这里补足脱离分组后
* 不明确的主语或宾语。全局场景文案仍与完整版海报保持一致。
*/
var VOTE_COPY_OVERRIDES = {
	1: { claim: "爸妈终于能睡个好觉了" },
	4: {
		claim: "爸妈上班也不错过",
		problemDetail: "宝宝第一次撑爬、开心大笑、认真吃饭，爸妈都没能亲眼看到",
		answerDetail: "宝宝哭闹、欢笑、撑爬、吃饭的瞬间，自动整理并同步微信"
	},
	5: { claim: "老人忘了吃药就提醒" },
	8: { claim: "长辈不对劲，家人早知道" },
	9: { claim: "老人摔倒马上叫人" },
	15: { claim: "宠物拆家及时制止" },
	16: {
		claim: "听懂宠物想干嘛",
		problemTitle: "宠物一直叫，到底想干嘛",
		answerTitle: "结合叫声和行为，越看越懂宠物"
	},
	17: { claim: "变天前提醒家人收衣被" },
	19: { claim: "家里有危险立即报警" }
};
function getVoteCopy(scene) {
	const override = VOTE_COPY_OVERRIDES[scene.no];
	return {
		claim: override?.claim ?? scene.claim,
		problemTitle: override?.problemTitle ?? scene.problem.title,
		problemDetail: override?.problemDetail ?? scene.problem.detail,
		answerTitle: override?.answerTitle ?? scene.answer.title,
		answerDetail: override?.answerDetail ?? scene.answer.detail
	};
}
//#endregion
export { RECEIPT_KEY as a, isFeishuIdentityEnabled as c, FEISHU_WEBHOOK_URL as i, isLocalMode as l, FEISHU_APP_ID as n, ROLES as o, FEISHU_OAUTH_REDIRECT_URI as r, STORAGE_KEY as s, getVoteCopy as t };
