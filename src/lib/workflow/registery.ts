import { NodeDefinition } from "./types";
import { Webhook, Globe, Mail, Bot } from "lucide-react";

export const NODE_REGISTRY: Record<string, NodeDefinition> = {
    webhook: {
        type: "webhook",
        label: "Webhook",
        category: "trigger",
        description: "Starts the workflow when a webhook is called.",
        icon: Webhook,
        configSchema: [],
    },
    http_request: {
        type: "http_request",
        label: "HTTP Request",
        category: "action",
        description: "Make an HTTP request to an external API.",
        icon: Globe,
        configSchema: [
            {
                name: "method",
                label: "Method",
                type: "select",
                options: [
                    { label: "GET", value: "GET" },
                    { label: "POST", value: "POST" },
                    { label: "PUT", value: "PUT" },
                    { label: "DELETE", value: "DELETE" },
                ],
                defaultValue: "GET",
                required: true,
            },
            {
                name: "url",
                label: "URL",
                type: "text",
                placeholder: "https://api.example.com",
                required: true,
            },
            {
                name: "headers",
                label: "Headers (JSON)",
                type: "json",
                placeholder: "{\"Content-Type\": \"application/json\"}",
            },
            {
                name: "body",
                label: "Body (JSON)",
                type: "json",
                placeholder: "{\"key\": \"value\"}",
            },
        ],
    },
    send_email: {
        type: "send_email",
        label: "Send Email",
        category: "action",
        description: "Send an email using SMTP or Resend.",
        icon: Mail,
        configSchema: [
            {
                name: "to",
                label: "To",
                type: "text",
                placeholder: "user@example.com",
                required: true,
            },
            {
                name: "subject",
                label: "Subject",
                type: "text",
                placeholder: "Hello there",
                required: true,
            },
            {
                name: "body",
                label: "Body",
                type: "textarea",
                placeholder: "Email content...",
                required: true,
            },
        ],
    },
    ai_generate_text: {
        type: "ai_generate_text",
        label: "AI Generate Text",
        category: "action",
        description: "Generate text using AI (OpenAI/Gemini).",
        icon: Bot,
        configSchema: [
            {
                name: "prompt",
                label: "Prompt",
                type: "textarea",
                placeholder: "Write a story about...",
                required: true,
            },
            {
                name: "model",
                label: "Model",
                type: "select",
                options: [
                    { label: "GPT-4o", value: "gpt-4o" },
                    { label: "Gemini Pro", value: "gemini-pro" },
                ],
                defaultValue: "gpt-4o",
            },
        ],
    },
};

export const NODE_TYPES_LIST = Object.values(NODE_REGISTRY);