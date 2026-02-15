# tell-box

一个端到端加密的匿名信箱应用，基于 Cloudflare Workers 构建。

An end-to-end encrypted anonymous messaging application built on Cloudflare Workers.

## 功能特性 Features

- 🔐 端到端加密 - 只有收信人能解密消息
- 🎭 完全匿名 - 发信人身份不会被追踪
- 💾 自动备份 - 支持导出和恢复信箱数据
- ⏰ 自动清理 - 消息 7 天后自动过期
- 🌓 深色模式 - 支持明暗主题切换

## 数据管理说明 Data Management

### 关于 KV 存储数据清理

**常见问题：我需要清除原先 KV 存储库里的数据吗？**

**答案：不需要！** 

本应用的数据管理机制如下：

1. **自动覆盖更新**
   - 当您恢复备份或更新资料时，系统会自动覆盖相同 ID 的旧数据
   - 无需手动清理，数据会被安全地替换

2. **消息自动过期**
   - 所有消息在 7 天后会自动从 KV 存储中删除
   - 无需担心消息数据累积

3. **旧数据不会冲突**
   - 如果您创建了新的身份（新的 ID），旧 ID 的数据会保留在 KV 中
   - 旧数据不会影响新身份的使用，只是占用少量存储空间
   - 如需彻底清理，可以在 Cloudflare Dashboard 中手动删除特定的 key

### FAQ: Do I need to clear data in the KV storage?

**Answer: No!**

The data management mechanism of this application:

1. **Automatic Overwrite Updates**
   - When you restore a backup or update your profile, the system automatically overwrites old data with the same ID
   - No manual cleanup needed, data is safely replaced

2. **Messages Auto-Expire**
   - All messages are automatically deleted from KV storage after 7 days
   - No need to worry about message data accumulation

3. **Old Data Won't Conflict**
   - If you create a new identity (new ID), data from the old ID remains in KV
   - Old data doesn't affect the use of the new identity, only uses a small amount of storage space
   - For thorough cleanup, you can manually delete specific keys in the Cloudflare Dashboard

## 备份与恢复 Backup & Restore

- **备份**: 点击"备份信箱数据"下载包含您完整身份信息的 JSON 文件
- **恢复**: 点击"恢复信箱数据"并选择之前导出的备份文件

**重要**: 备份文件包含您的私钥，请妥善保管，不要分享给他人！

**Backup**: Click "Backup mailbox data" to download a JSON file containing your complete identity information  
**Restore**: Click "Restore mailbox data" and select the previously exported backup file

**Important**: The backup file contains your private key, please keep it safe and do not share it with others!