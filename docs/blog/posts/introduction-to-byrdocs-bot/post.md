---
date: 2026-8-6 16:00
title: 新项目：byrdocs 机器人
category: 公告
author: Shxiao101

---

我们把 BYR Docs 主站和 BUPT 生存指南接入了 QQ 群的 bot。现在你可以在群里询问学校生活、查找教材资料，也可以更方便地给生存指南提交修改。

---

<PostDetail>

## 起因

“新生宿舍是几人间？”

“有没有 XX 课的往年题？”

每逢新生入学或考试临近，类似的问题总会在群聊里反复出现。热心的同学当然会来解答，可是一段聊天记录很快就会被新消息淹没，等到下一位同学遇到相同的问题时也许就无法得到及时的回答。

其实，这些问题中的许多都已经有了答案。[BUPT 生存指南](https://guide.byrdocs.org)整理了住宿、餐饮、交通和校园办事等信息；[BYR Docs](https://byrdocs.org)则收集了电子书、试题和其它学习资料。遗憾的是，并非所有人都知道应该去哪里查找；即便知道，也未必有意愿主动从网站中找到自己需要的内容。

既然大家更习惯在群聊里提出问题，于是，我们做了一个 byrdocs 问答机器人，并将它投入北邮新生群和工具人群等 QQ 群中使用。

## byrdocs 机器人

### 询问校园生活

如果你有任何疑惑，可以直接 `@` 机器人提问。无论是沙河、海淀校区的学习生活，还是住宿、餐饮、校园网、就医、军训和转专业等问题，它都会先查找生存指南中的相关内容，再根据你的问题组织回答。如果手册尚未覆盖有关信息，它会尽量查找学校官网；仍然没有找到时，则会直接说明。

<ChatMessage sender="同学甲">
@byrdocs 沙河是几人间？
</ChatMessage>
<ChatMessage sender="byrdocs" isBot avatar="/byrdocs-avatar.svg" replyingTo="@byrdocs 沙河是几人间？">
沙河校区宿舍一般是四人间（上床下桌、独卫、层浴），仅2025级学生存在部分六人间。
</ChatMessage>
<ChatMessage sender="同学乙">
@byrdocs 怎么转专业？
</ChatMessage>
<ChatMessage sender="byrdocs" isBot avatar="/byrdocs-avatar.svg" replyingTo="@byrdocs 怎么转专业？">
本科生可在第二学期初、第三学期初申请转专业，第一次未成功可再申请；学校一般在假期（而非开学后）发布通知，要多留意信息门户。北邮不设转出限制，能否成功取决于转入学院是否接收：人工智能学院、计算机学院有机试加面试，其他学院一般只有面试。中外合作办学（国际学院、海南学院）及艺术类转业不允许转。
</ChatMessage>

当然，有些同学并不知道群里有这样一个机器人，也就不会特意 `@` 它。因此，我们接入了 LLM 让机器人判断群聊中的普通消息是否在询问生存指南能够回答的问题。当它认为该消息属于提问时，便会主动回答。

<ChatMessage sender="同学丙">
请问什么时候军训？
</ChatMessage>

<ChatMessage sender="byrdocs" isBot avatar="/byrdocs-avatar.svg" replyingTo="请问什么时候军训？">
军训一般两周（14天），时间每年不同，以学校通知为准。近年参考：24级为2024年8月24日-9月6日，25级为2026年5月6日-5月19日。详细见 <a>https://go.byrdocs.org/7CyiMPi</a>。
</ChatMessage>

### 查找教材和资料

除了问题咨询之外，你也可以让机器人帮忙检索 BYR Docs 主站上的教材、试卷和其他资料。

<ChatMessage sender="同学丁">
@byrdocs 有没有《数学分析（上）》的往年题？
</ChatMessage>

<ChatMessage sender="byrdocs" isBot avatar="/byrdocs-avatar.svg" replyingTo="有没有《数学分析（上）》的往年题？">
找到11份相关试卷，按时间从新到旧展示前3份：<br/>
一、2025-2026第一学期 数学分析（上）期末试卷：<a>https://go.byrdocs.org/4qqN30V</a><br/>
二、2025-2026第一学期 数学分析（上）期中试卷：<a>https://go.byrdocs.org/8bKbgPF</a><br/>
三、2024-2025第一学期 数学分析（上）期末试卷：<a>https://go.byrdocs.org/ztXW1Pk</a><br/>
如需更多可在 <a>byrdocs.org</a> 搜索“数学分析”。
</ChatMessage>

### 更新生存指南

校园生活信息也会随着设施、规定和办事流程的变化而逐渐过时，但以文档形式呈现的生存指南很难捕获这些信息并及时更新。

而 bot 的存在为我们创造了新的可能：任何人只需通过和 bot 进行几轮对话，就可以修正生存指南中的错误，或补充为人所忽视的信息。

bot 会根据你的描述整理修改内容，并向生存指南的 GitHub 仓库提交一份 Pull Request。

<ChatMessage sender="同学戊">
@byrdocs 毕业之后还能刷校园卡进校门吗？
</ChatMessage>

<ChatMessage sender="byrdocs" isBot avatar="/byrdocs-avatar.svg" replyingTo="@byrdocs 毕业之后还能刷校园卡进校门吗？">
毕业后校园卡会被统一注销（作为纪念品留存），不能再刷校园卡进门；校园网账号也会同步注销。返校如需入校，可按校外人员通过网上服务大厅预约进校。
</ChatMessage>

<ChatMessage sender="同学己">
@byrdocs 可以申请校友卡
</ChatMessage>

<ChatMessage sender="byrdocs" isBot avatar="/byrdocs-avatar.svg" replyingTo="@byrdocs 可以申请校友卡">
谢谢补充！校友卡应该是毕业生返校的重要途径，方便告诉我更多细节吗：校友卡如何申请、在哪里办理、主要用途（能否刷卡进校）？确认后我可以整理成文档修改建议供你核对。
</ChatMessage>

<ChatMessage sender="同学己">
@byrdocs 在“北邮人”小程序申请，给保安看就行
</ChatMessage>

<ChatMessage sender="byrdocs" isBot avatar="/byrdocs-avatar.svg" replyingTo="@byrdocs 在“北邮人”小程序申请，给保安看就行">
明白了。我整理一下修改说明供你核对：<br/>
拟在生存指南中补充“毕业后校园卡注销，但可申请校友卡”：毕业生可在“北邮人”小程序申请校友卡，返校进校门时向保安出示即可。<br/>
拟放入“未尽事宜”章节（毕业后相关事项）。<br/>
请确认这个描述是否准确、可以提交修改请求？
</ChatMessage>

<ChatMessage sender="同学己">
@byrdocs 确认
</ChatMessage>

<ChatMessage sender="byrdocs" isBot avatar="/byrdocs-avatar.svg" replyingTo="@byrdocs 确认">
已收到文档修改请求，任务已进入修改流程。<br/>
任务ID：6dc8b37d-2508-452b-bbde-6179843f6adc<br/>
之后可以在当前群询问文档修改任务状态。
</ChatMessage>

维护者仍会人工核实修改内容，确认准确无误之后，这份 Pull Request 才会被合并到生存指南中。更新后的内容不仅会帮助网站上的读者，也会成为机器人今后回答问题的依据。

---

如果你所在的群聊已经接入 byrdocs 机器人，欢迎向它提问，让它帮你查找教材和资料。

如果你发现生存指南中有任何错漏，也欢迎直接告诉它。

当然，你仍然可以直接访问 [BYR Docs 主站](https://byrdocs.org)查找资料，或前往 [BUPT 生存指南](https://guide.byrdocs.org)阅读和贡献内容。

</PostDetail>
