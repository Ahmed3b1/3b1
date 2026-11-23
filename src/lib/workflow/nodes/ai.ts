export async function executeAiNode(config: any) {
    const { prompt, model = "llama3.1" } = config;

    try {
        const res = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                prompt,
                stream: false,
            }),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }

        const data = await res.json();

        return {
            success: true,
            output: data.response,
        };
    } catch (error: any) {
        throw new Error(`AI Generation failed: ${error.message}`);
    }
}