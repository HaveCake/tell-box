-- D1 数据库表结构 / D1 Database Schema
-- 用于 tell-box 项目从 Cloudflare KV 迁移到 D1

-- 用户表：存储用户公钥和资料
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  pubkey TEXT NOT NULL,
  profile TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- 消息表：存储加密消息
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  recipient_addr TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_messages_recipient ON messages(recipient_addr, timestamp DESC);
CREATE INDEX idx_messages_expires ON messages(expires_at);
