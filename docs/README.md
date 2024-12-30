# 项目名称

## 概述
本项目是一个基于新的流程引擎的聊天机器人系统，允许用户定义、执行和管理复杂的工作流。该系统支持多种状态类型、条件转换以及异步执行，旨在提供灵活且可扩展的工作流解决方案。

## 特性
- 定义和管理复杂的工作流
- 支持多种状态类型（如触发器、文本转语音、用户输入收集等）
- 异步执行和状态转换
- RESTful API 接口

## 快速开始

### 安装
首先，确保您已安装 [Node.js](https://nodejs.org/) 和 [npm](https://www.npmjs.com/)。然后，克隆此项目并安装依赖项：

```bash
git clone https://github.com/your-repo/project-name.git
cd project-name
npm install
```

### 使用
启动服务器：

```bash
npm start
```

服务器启动后，您可以通过访问 `http://localhost:3000` 来使用 API。

## API 参考

### 创建流程
- **POST** `/flows/:flowId`
- **请求体**:
  ```json
  {
    "definition": {
      "flags": {
        "allow_concurrent_calls": true
      },
      "description": "流程描述",
      "states": [
        {
          "name": "Trigger",
          "type": "trigger",
          "properties": {},
          "transitions": [
            { "event": "incomingMessage", "next": "greet" }
          ]
        },
        {
          "name": "greet",
          "type": "say-play",
          "properties": {
            "say": "欢迎使用聊天机器人！"
          },
          "transitions": [
            { "event": "audioComplete", "next": "collect_name" }
          ]
        }
      ],
      "initial_state": "Trigger"
    },
    "commitMessage": "创建流程",
    "status": "draft"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": { /* 创建的流程 */ }
  }
  ```

### 更新流程
- **PUT** `/flows/:flowId`
- **请求体**:
  ```json
  {
    "definition": { /* 更新后的流程定义 */ },
    "commitMessage": "更新流程",
    "status": "draft"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": { /* 更新后的流程 */ }
  }
  ```

### 获取流程
- **GET** `/flows/:flowId`
- **响应**:
  ```json
  {
    "success": true,
    "data": { /* 流程定义 */ }
  }
  ```

### 删除流程
- **DELETE** `/flows/:flowId`
- **响应**:
  ```json
  {
    "success": true
  }
  ```

### 列出所有流程
- **GET** `/flows`
- **响应**:
  ```json
  {
    "success": true,
    "data": [ /* 流程列表 */ ]
  }
  ```

### 执行流程
- **POST** `/flows/:flowId/execute`
- **请求体**:
  ```json
  {
    "variables": { /* 初始变量 */ },
    "triggerEvent": "incomingMessage"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "executionId": "flowId",
      "status": "started"
    }
  }
  ```

### 获取执行状态
- **GET** `/flows/:flowId/status`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "executionId": "flowId",
      "status": "running", // 或 "completed"
      "context": { /* 执行上下文 */ }
    }
  }
  ```

## 文档
确保所有开发人员都能理解新的逻辑和实现，详细描述每个模块的功能和使用方法。

## 贡献
欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证
本项目采用 MIT 许可证，详细信息请参见 LICENSE 文件。