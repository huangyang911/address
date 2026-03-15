import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // 提供 public 目錄下的靜態檔案

app.get('/api/translate', async (req, res) => {
    const { address } = req.query;
    console.log(`[${new Date().toISOString()}] Request: /api/translate?address=${address}`);

    if (!address) {
        return res.status(400).json({ success: false, error: '請提供地址' });
    }

    try {
        const response = await fetch('https://zipgo.tw/api/normalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
        });
        const result = await response.json();

        if (result.en) {
            res.json({
                success: true,
                data: { english: result.en }
            });
        } else {
            throw new Error('API 回傳資料格式錯誤');
        }

    } catch (error) {
        console.error(`[ERROR] Translation failed:`, error.message);
        res.status(500).json({ success: false, error: '伺服器翻譯失敗，請見日誌' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy Server Ready | Port: ${PORT}`);
});

export default app;