const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
    const { address } = req.query;

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
            res.status(200).json({
                success: true,
                data: { english: result.en }
            });
        } else {
            throw new Error('API 回傳資料格式錯誤');
        }
    } catch (error) {
        res.status(500).json({ success: false, error: '翻譯伺服器異常' });
    }
}
