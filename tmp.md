按类型整理的Node节点列表：
语音/IVR 类：
Copy✓ BaseNode - SayPlayNode (语音播放)
✓ BaseNode - RecordNode (录音)
✓ BaseNode - EnqueueCallNode (排队)
✓ BaseNode - ConnectCallNode (转接)
✘ 需改造 - GatherInputNode (DTMF收集)
✘ 需改造 - OutgoingCallNode (外呼)
消息/Bot 类：
Copy✓ BaseNode - SendMessageNode (消息发送)
✓ BaseNode - TriggerNode (触发器) 
✘ 需改造 - NLPIntentNode (意图识别)
✘ 需改造 - SetVariablesNode (变量设置)
✘ 需改造 - HttpRequestNode (HTTP请求)
控制流类：
Copy✓ BaseNode - SplitNode (条件分支)
✘ 需改造 - WaitForReplyNode (等待回复)
✘ 需改造 - SendAndReplyNode (发送等待)
✘ 需改造 - SendAndWaitNode (发送等待)
建议合并重复功能节点:

SendAndReplyNode 和 SendAndWaitNode 合并为 SendMessageNode
WaitForReplyNode 功能合并到 GatherInputNode

需要我提供具体节点的BaseNode改造示例吗？