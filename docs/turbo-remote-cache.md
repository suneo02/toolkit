# Turbo Remote Cache 内网部署指南

在内网环境部署 Turbo Remote Cache 可以极大地加速团队的构建速度。本指南推荐使用社区主流的 `ducktors/turborepo-remote-cache` 方案，支持本地文件系统存储，无需依赖云服务。

---

## 一、 服务器端部署

根据服务器环境（是否支持 Docker），选择以下任一方式部署。

### 方案 A：使用 Docker Compose (推荐)

适用于已安装 Docker 的环境，部署最简便，环境隔离性好。

1. **创建工作目录**：

   ```bash
   mkdir turbo-cache && cd turbo-cache
   ```

2. **创建 `docker-compose.yml`**：

   ```yaml
   version: '3.8'
   services:
     turbo-remote-cache:
       image: ducktors/turborepo-remote-cache:latest
       container_name: turbo-cache
       restart: always
       ports:
         - '3000:3000'
       environment:
         - TURBO_TOKEN=my-secure-intranet-token # 自定义你的 Token
         - STORAGE_PROVIDER=local
         - STORAGE_PATH=/app/cache
         # 限制缓存上限为 50GB (单位 MB)，超过后自动删除旧缓存 (LRU)
         - TURBO_CACHE_LIMIT=51200
       volumes:
         - ./data:/app/cache
   ```

3. **启动服务**：
   ```bash
   docker-compose up -d
   ```

---

### 方案 B：使用 Node.js 直接部署

适用于未安装 Docker 但有 Node.js 环境的服务器。

**注意**：此方案需要服务器能够访问 NPM 仓库（公网或内网私服），以便在线编译依赖。

1. **拉取代码**：
   建议将服务部署在 `/opt` 目录下（Linux 标准第三方软件目录）：

   ```bash
   git clone https://github.com/ducktors/turborepo-remote-cache.git
   cd turborepo-remote-cache
   ```

2. **安装依赖与构建**：
   由于服务器可访问 NPM，直接执行安装即可自动处理二进制依赖的编译，无需从其他机器拷贝 `node_modules`。

   ```bash
   npm install
   npm run build
   ```

3. **配置环境变量**：
   在根目录创建 `.env` 文件：

   ```env
   PORT=3000
   TURBO_TOKEN=my-secure-intranet-token
   STORAGE_PROVIDER=local
   STORAGE_PATH=./cache-data
   # 限制缓存上限为 50GB (单位 MB)
   TURBO_CACHE_LIMIT=51200
   ```

4. **启动服务**：
   推荐使用 `pm2` 进行进程守护和开机自启：

   ```bash
   # 全局安装 pm2
   npm install -g pm2

   # 启动服务
   pm2 start dist/index.js --name "turbo-cache"

   # 保存当前列表并生成开机自启命令
   pm2 save
   pm2 startup
   ```

---

## 二、 客户端配置

配置开发机或 CI Runner 使用私有缓存服务。

### 1. 环境变量配置 (推荐用于 CI/CD)

在流水线脚本或 `.bashrc`/`.zshrc` 中设置：

```bash
export TURBO_API="http://<服务器内网IP>:3000"
export TURBO_TOKEN="my-secure-intranet-token"
export TURBO_TEAM="my-team" # 自建服务中可填任意字符串
export TURBO_TELEMETRY_DISABLED=1 # 内网建议禁用遥测以防超时
```

### 2. 命令行参数 (临时测试)

```bash
npx turbo run build --api="http://<IP>:3000" --token="my-secure-intranet-token" --team="my-team"
```

### 3. 全局配置文件 (适合开发机)

手动编辑或创建 `~/.turbo/config.json`：

```json
{
  "apiurl": "http://<服务器内网IP>:3000",
  "token": "my-secure-intranet-token",
  "teamid": "my-team"
}
```

---

## 三、 验证与运维

### 1. 验证流程

1. **首次构建**：运行 `npx turbo run build`，观察到 `Remote cache miss`，产物开始上传。
2. **清理本地**：删除项目下的 `node_modules/.cache` 和 `dist`。
3. **二次构建**：再次运行构建，出现 `>>> FULL TURBO` 且显示 `Remote cache hit` 即为成功。

### 2. 关键注意事项

- **磁盘容量限制 (重要)**：
  - 如果不配置限制，缓存文件会**无限增长**直到占满服务器磁盘。
  - **配置方法**：请务必设置 `TURBO_CACHE_LIMIT` 环境变量（单位 MB）。
  - **清理策略**：服务采用 **LRU (Least Recently Used)** 策略。当缓存体积达到上限时，会自动删除**最久未被访问**的缓存文件，确保热点数据保留且不撑爆磁盘。
- **防火墙**：确保服务器开放了 `3000` 端口。
- **离线安装说明** (针对完全断网环境)：
  - **Docker 镜像**：在外网环境执行 `docker save` 导出 tar 包，拷贝到内网执行 `docker load`。
  - **Node 依赖**：如果服务器**无法**访问 NPM，切勿直接从 Mac/Windows 拷贝 `node_modules`。必须在另一台系统架构相同（如同为 Linux x64）的机器上执行 `npm install` 后再打包拷贝。
  - **Turbo 二进制**：`turbo` 在安装时会尝试从公网下载各平台的二进制文件。若内网受限，请确保内网私有 NPM 仓库（如 Verdaccio）已缓存相关包。

---

## 四、 纯离线环境 (Air-gapped) 补充说明

| 阶段              | 操作             | 解决方案                                                                      |
| :---------------- | :--------------- | :---------------------------------------------------------------------------- |
| **部署服务器**    | 获取 Docker 镜像 | 外网 `docker save` -> 拷贝 -> 内网 `docker load`                              |
| **Node.js 部署**  | 安装依赖         | **必须在同架构系统预编译** -> 拷贝 `node_modules` (仅当服务器无法 `npm i` 时) |
| **日常构建/缓存** | 交互流量         | **纯局域网 HTTP 流量，无公网依赖**                                            |
