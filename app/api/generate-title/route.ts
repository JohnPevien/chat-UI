import { OpenAIStreamPayload, ChatGPTMessage } from '@/utils/OpenAIStream';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
}

export const config = {
    runtime: 'edge',
};

export async function POST(req: Request): Promise<Response> {
    const body = await req.json();

    if (!body || !body.messages || body.messages.length === 0) {
        return new Response('No messages in the request', { status: 400 });
    }

    // Get the first user message to generate a title from
    const firstUserMessage = body.messages.find((msg: ChatGPTMessage) => msg.role === 'user');
    
    if (!firstUserMessage) {
        return new Response('No user message found', { status: 400 });
    }

    const titlePrompt: ChatGPTMessage[] = [
        {
            role: 'system',
            content: 'Generate a concise, descriptive title (maximum 5 words) for this conversation based on the user\'s first message. Return only the title, no quotes or any additional text.'
        },
        {
            role: 'user',
            content: firstUserMessage.content
        }
    ];

    const payload: OpenAIStreamPayload = {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: titlePrompt,
        temperature: 0.3,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 20,
        stream: false,
        n: 1,
    };

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
            },
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`OpenAI API error: ${res.statusText}`);
        }

        const data = await res.json();
        const title = data.choices[0]?.message?.content?.trim() || 'New Chat';

        return new Response(JSON.stringify({ title }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error generating title:', error);
        return new Response(JSON.stringify({ title: 'New Chat' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }
}