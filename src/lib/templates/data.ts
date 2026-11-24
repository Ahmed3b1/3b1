import { Template } from "./types";
import { WorkflowNode, WorkflowEdge } from "@/lib/workflow/types";

// ==========================================
// Template 1: Smart Email Auto Responder
// ==========================================
const T1_NODES: WorkflowNode[] = [
    {
        id: "node-1",
        type: "webhook",
        position: { x: 100, y: 100 },
        data: {
            label: "Incoming Email Webhook",
            config: {
                method: "POST",
                schema: {
                    subject: "string",
                    body: "string",
                    sender: "string"
                }
            }
        },
    },
    {
        id: "node-2",
        type: "ai_generate_text",
        position: { x: 100, y: 300 },
        data: {
            label: "Analyze & Draft Reply",
            config: {
                model: "gpt-4o",
                systemPrompt: "You are a helpful customer support agent. Analyze the incoming email and draft a polite, professional response.",
                userPrompt: "Subject: {{node-1.body.subject}}\n\nBody: {{node-1.body.body}}\n\nSender: {{node-1.body.sender}}",
                temperature: 0.7
            }
        },
    },
    {
        id: "node-3",
        type: "send_email",
        position: { x: 100, y: 550 },
        data: {
            label: "Send Response",
            config: {
                to: "{{node-1.body.sender}}",
                subject: "Re: {{node-1.body.subject}}",
                body: "{{node-2.output}}",
                provider: "smtp"
            }
        },
    },
];

const T1_EDGES: WorkflowEdge[] = [
    { id: "e1-2", source: "node-1", target: "node-2", sourceHandle: "output", targetHandle: "input" },
    { id: "e2-3", source: "node-2", target: "node-3", sourceHandle: "output", targetHandle: "input" },
];

// ==========================================
// Template 2: Lead Qualification Bot
// ==========================================
const T2_NODES: WorkflowNode[] = [
    {
        id: "node-1",
        type: "webhook",
        position: { x: 100, y: 100 },
        data: {
            label: "New Lead Form",
            config: {
                method: "POST",
                schema: {
                    name: "string",
                    email: "string",
                    companySize: "number",
                    budget: "string",
                    message: "string"
                }
            }
        },
    },
    {
        id: "node-2",
        type: "ai_generate_text",
        position: { x: 100, y: 300 },
        data: {
            label: "Score Lead",
            config: {
                model: "gpt-4o",
                systemPrompt: "You are a sales expert. Score this lead from 0-100 based on their budget and company size. Return ONLY a JSON object with score and reason.",
                userPrompt: "Company Size: {{node-1.body.companySize}}\nBudget: {{node-1.body.budget}}\nMessage: {{node-1.body.message}}",
                jsonMode: true
            }
        },
    },
    {
        id: "node-3",
        type: "http_request",
        position: { x: 100, y: 550 },
        data: {
            label: "Sync to CRM",
            config: {
                url: "https://api.crm.com/v1/leads",
                method: "POST",
                headers: {
                    "Authorization": "Bearer YOUR_API_KEY",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "{{node-1.body.name}}",
                    email: "{{node-1.body.email}}",
                    score: "{{node-2.output.score}}",
                    notes: "{{node-2.output.reason}}"
                })
            }
        },
    },
];

const T2_EDGES: WorkflowEdge[] = [
    { id: "e1-2", source: "node-1", target: "node-2", sourceHandle: "output", targetHandle: "input" },
    { id: "e2-3", source: "node-2", target: "node-3", sourceHandle: "output", targetHandle: "input" },
];

export const REAL_TEMPLATES: Template[] = [
    {
        id: "template-email-responder",
        name: "Smart Email Auto Responder",
        description: "Automatically analyze incoming emails using AI and send a personalized response based on sentiment.",
        category: "Customer Support",
        tags: ["AI", "Email", "Automation"],
        difficulty: "Intermediate",
        triggerNode: "webhook",
        version: 1,
        nodes: T1_NODES,
        edges: T1_EDGES,
        viewport: { x: 0, y: 0, zoom: 1 },
        isPopular: true,
    },
    {
        id: "template-lead-scoring",
        name: "Lead Qualification Bot",
        description: "Process new leads from a webhook, score them with AI, and notify your sales team via HTTP request.",
        category: "Sales",
        tags: ["Sales", "Lead Gen", "Webhook"],
        difficulty: "Beginner",
        triggerNode: "webhook",
        version: 1,
        nodes: T2_NODES,
        edges: T2_EDGES,
        viewport: { x: 0, y: 0, zoom: 1 },
        isNew: true,
    },
];