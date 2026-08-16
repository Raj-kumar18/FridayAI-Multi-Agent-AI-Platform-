// test-openrouter.js

import "dotenv/config";

const key = process.env.OPENROUTER_API_KEY;

console.log({
    exists: !!key,
    length: key?.length,
    prefix: key?.slice(0, 12),
});

const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
        method: "POST",

        headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            model: "deepseek/deepseek-chat",
            messages: [
                {
                    role: "user",
                    content: "Say hello",
                },
            ],
        }),
    }
);

console.log("STATUS:", response.status);
console.log("BODY:", await response.text());