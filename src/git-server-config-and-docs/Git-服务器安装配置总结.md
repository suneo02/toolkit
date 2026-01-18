# Git 服务器安装配置指南

本文档总结了在 macOS 上搭建 Git 服务器的两种方法。所有相关的配置文件模板都存放在本项目的 `config_templates` 目录下。

---

### **方法一：使用 `git daemon` (Git 协议)**

这种方法最简单，使用 `git://` 协议，适合在受信任的内部网络中快速共享代码。

- **安装 Git**: `brew install git`
- **创建仓库目录**: `mkdir -p ~/git-repos`
- **创建裸仓库**: `cd ~/git-repos && git init --bare your-repo-name.git`
- **启动服务**: `git daemon --reuseaddr --base-path=~/git-repos --export-all --enable=receive-pack --verbose`
- **客户端操作**: `git clone git://<你的IP地址>/your-repo-name.git`

---

### **方法二：通过 Nginx 提供 HTTP 服务**

这种方法更强大、现代且稳定。它利用 Nginx 作为反向代理，通过 FastCGI 调用 Git 的 HTTP 后端。

#### **第 1 步：安装依赖**

需要 Nginx 和 `fcgiwrap`。

```bash
brew install nginx fcgiwrap
```

#### **第 2 步：配置 Nginx**

1.  **创建 Nginx 配置**:
    复制 `config_templates/nginx_git_server.conf.template` 文件，重命名为 `nginx_git_server.conf`，然后根据你的环境修改文件中的占位符：
    -   `root /path/to/your/git-repos;`
    -   `fastcgi_param SCRIPT_FILENAME /path/to/your/git-http-backend;`
    -   `fastcgi_param GIT_PROJECT_ROOT /path/to/your/git-repos;`
    -   `fastcgi_param GIT_CONFIG_VALUE_0 /path/to/your/git-repos;`

    > **注意**: `SCRIPT_FILENAME` 的路径包含 Git 版本号。如果升级 Git，**必须手动更新此路径**。您可以通过 `find /opt/homebrew -name git-http-backend` 命令找到它。

2.  **链接配置文件到 Nginx**:
    让 Nginx 加载你的 Git 配置。

    ```bash
    # 创建 Nginx 的 servers 目录 (如果不存在)
    mkdir -p /opt/homebrew/etc/nginx/servers

    # 复制配置文件 (使用 cp 而不是 ln -s，确保配置独立于代码仓库)
    cp nginx_git_server.conf /opt/homebrew/etc/nginx/servers/git.conf
    ```

#### **第 3 步：允许 `git push`**

运行以下命令全局开启 HTTP 推送功能。

```bash
git config --global http.receivepack true
```

#### **第 4 步：配置服务自启动**

为了实现 `fcgiwrap` 服务的开机自启和稳定运行，我们将其配置为 macOS 的系统服务 (`launchd`)。

1.  **创建 `fcgiwrap` 服务文件**:
    复制 `config_templates/homebrew.mxcl.fcgiwrap.plist.template` 文件，重命名为 `homebrew.mxcl.fcgiwrap.plist`，并修改其中的日志路径占位符：
    -   `<string>/Users/hidetoshidekisugi/Library/Logs/fcgiwrap/fcgiwrap.out.log</string>`
    -   `<string>/Users/hidetoshidekisugi/Library/Logs/fcgiwrap/fcgiwrap.err.log</string>`
    
    完成后，将此文件移动到 `~/Library/LaunchAgents/` 目录下。

2.  **加载并启动服务**:
    ```bash
    launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.fcgiwrap.plist
    ```

3.  **启动 Nginx 服务**:
    ```bash
    brew services start nginx
    ```

#### **第 5 步：日常维护**

- **检查服务状态**:
  ```bash
  brew services list
  launchctl list | grep fcgiwrap
  ```

- **停止所有服务**:
  ```bash
  launchctl unload -w ~/Library/LaunchAgents/homebrew.mxcl.fcgiwrap.plist
  brew services stop nginx
  ```

- **重新启动所有服务**:
  ```bash
  launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.fcgiwrap.plist
  brew services start nginx
  ```

#### **第 6 步：客户端操作**

现在，可以通过 `8888` 端口来访问你的 Git 服务了。

```bash
git clone http://<你的IP地址>:8888/git/your-repo-name.git/
```

---

### **关键配置说明**

-   **`fcgiwrap` 服务稳定性**: `launchd` 服务配置中的 `rm -f ...` 命令是确保服务稳定运行的关键。它解决了 `fcgiwrap` 异常退出后，遗留的 `.sock` 文件导致服务无法重启的问题。

-   **Nginx 配置中的 Git 路径**: Nginx 配置文件中的 `SCRIPT_FILENAME` 路径与你安装的 Git 版本绑定。如果你通过 `brew upgrade git` 升级了 Git，**必须手动更新这个路径**，然后重启 Nginx (`brew services restart nginx`)。

-   **Dubious Ownership 错误**: Git 的一项安全特性。当执行 Git 的用户和仓库文件的所有者不同时触发。Nginx 配置通过 `fastcgi_param` 注入 `safe.directory` 环境变量解决了此问题，无需修改全局 Git 配置。

---

### **常见问题与排查**

- **502 / 连接失败 (开了全局代理)**: 若环境设置了 `http_proxy` / `https_proxy` 指向本地代理（例如 `127.0.0.1:7897`），访问 `http://localhost:8888/git/...` 会被代理拦截导致 502。解决：对本地地址关闭代理，如 `NO_PROXY=localhost,127.0.0.1 git fetch/push`，或在 shell 环境中永久导出 `NO_PROXY=localhost,127.0.0.1`。
- **fcgiwrap 未启动**: 若日志提示无法连接 `fastcgi://unix:/opt/homebrew/var/run/fcgiwrap.sock`，手动启动一次可快速恢复：
  ```bash
  nohup /bin/sh -c 'rm -f /opt/homebrew/var/run/fcgiwrap.sock && /opt/homebrew/sbin/fcgiwrap -s unix:/opt/homebrew/var/run/fcgiwrap.sock' >/path/to/fcgiwrap.out.log 2>/path/to/fcgiwrap.err.log &
  ```
  然后重启或启动 Nginx：`nginx -c /opt/homebrew/etc/nginx/nginx.conf`
