import React, { useState } from 'react';
import { 
    CodeRounded, 
    VpnKeyRounded, 
    TerminalRounded, 
    ArrowForwardRounded,
    ContentCopyRounded,
    CheckCircleRounded,
    DescriptionRounded,
    IntegrationInstructionsRounded
} from '@mui/icons-material';

const CodeBlock = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl my-6 border border-slate-800">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/20 shadow-[0_0_8px_rgba(248,113,113,0.3)] border border-red-400/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20 shadow-[0_0_8px_rgba(251,191,36,0.3)] border border-amber-400/30"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/20 shadow-[0_0_8px_rgba(52,211,153,0.3)] border border-emerald-400/30"></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{language}</span>
                </div>
                <button 
                    onClick={copy}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
                >
                    {copied ? <CheckCircleRounded sx={{ fontSize: 16, color: '#10b981' }} /> : <ContentCopyRounded sx={{ fontSize: 16 }} />}
                </button>
            </div>
            <pre className="p-6 text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const DeveloperGuide = () => {
    const curlCode = `curl -X POST https://your-domain.com/api/leads/external \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "X-API-Secret: YOUR_API_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "message": "Interested in your SaaS solution."
  }'`;

    const nodeCode = `const fetch = require('node-fetch');

const submitLead = async () => {
    const response = await fetch('https://your-domain.com/api/leads/external', {
        method: 'POST',
        headers: {
            'X-API-Key': 'YOUR_API_KEY',
            'X-API-Secret': 'YOUR_API_SECRET',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            company: 'Acme Corp',
            message: 'Interested in your SaaS solution.'
        })
    });

    const data = await response.json();
    console.log(data);
};`;

    const pythonCode = `import requests

url = "https://your-domain.com/api/leads/external"
headers = {
    "X-API-Key": "YOUR_API_KEY",
    "X-API-Secret": "YOUR_API_SECRET",
    "Content-Type": "application/json"
}
data = {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "message": "Interested in your SaaS solution."
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header section with glassmorphism */}
            <header className="relative py-24 overflow-hidden bg-[#0f172a]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7b68ee]/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest mb-8">
                        <IntegrationInstructionsRounded sx={{ fontSize: 14 }} className="text-[#7b68ee]" />
                        Official Documentation
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
                        Scale your <span className="text-[#a78bfa]">Pipeline</span> effortlessly.
                    </h1>
                    <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Connect your landing pages, CRM, or custom backends to our lead intelligence engine in minutes.
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
                        <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 text-white backdrop-blur-xl">
                            <VpnKeyRounded className="text-amber-400" />
                            <div className="text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Method</p>
                                <p className="text-sm font-bold">API Key + Secret</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 text-white backdrop-blur-xl">
                            <CodeRounded className="text-emerald-400" />
                            <div className="text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</p>
                                <p className="text-sm font-bold">REST via JSON</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-white/5 border border-white/10 text-white backdrop-blur-xl">
                            <TerminalRounded className="text-sky-400" />
                            <div className="text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Format</p>
                                <p className="text-sm font-bold">Standard POST</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-20">
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200 border border-slate-100 flex items-center justify-center">
                            <DescriptionRounded className="text-[#7b68ee]" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lead Submission API</h2>
                            <p className="text-slate-500 font-medium">Capture structured data from any external source.</p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#7b68ee] text-white flex items-center justify-center text-[10px] font-black">1</span>
                            Authentication
                        </h3>
                        <p className="text-slate-600 leading-relaxed mt-4">
                            All requests to the Lead Intelligence API must be authenticated using the following custom headers. 
                            You can generate these credentials in your <a href="/developer-settings" className="text-[#7b68ee] font-bold hover:underline">Developer Settings</a>.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mb-12">
                            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                <code className="text-[#7b68ee] font-black text-sm uppercase tracking-wider block mb-2">X-API-Key</code>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Your unique public identifier. This remains constant for each key pair you generate.
                                </p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                <code className="text-[#7b68ee] font-black text-sm uppercase tracking-wider block mb-2">X-API-Secret</code>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Your private signing material. Never share this in client-side code (browsers/mobile).
                                </p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#7b68ee] text-white flex items-center justify-center text-[10px] font-black">2</span>
                            Endpoint Details
                        </h3>
                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                            <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 border-b border-slate-100">
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">POST</span>
                                <code className="text-sm font-bold text-slate-700 tracking-tight">/api/leads/external</code>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-500 font-medium mb-4">The payload should be a JSON object containing the following fields:</p>
                                <ul className="space-y-4 m-0 p-0 list-none">
                                    {[
                                        { field: "firstName", type: "String", required: true, desc: "Lead's given name." },
                                        { field: "lastName", type: "String", required: false, desc: "Lead's family name." },
                                        { field: "email", type: "String", required: true, desc: "Primary contact email address." },
                                        { field: "phone", type: "String", required: false, desc: "Optional contact phone number." },
                                        { field: "company", type: "String", required: false, desc: "Company or organization name." },
                                        { field: "message", type: "String", required: false, desc: "Inquiry or source message." },
                                    ].map((p) => (
                                        <li key={p.field} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                            <code className="text-slate-900 font-bold text-xs bg-slate-100 px-2 py-1 rounded min-w-[100px] text-center">{p.field}</code>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.type}</span>
                                                    {p.required && <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Required</span>}
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">{p.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold flex items-center gap-2 mt-20">
                            <span className="w-6 h-6 rounded-lg bg-[#7b68ee] text-white flex items-center justify-center text-[10px] font-black">3</span>
                            Implementations
                        </h3>
                        
                        <div className="mt-8 space-y-12">
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                                    <TerminalRounded sx={{ fontSize: 16 }} />
                                    cURL Example
                                </h4>
                                <CodeBlock language="bash" code={curlCode} />
                            </div>
                            
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                                    <CodeRounded sx={{ fontSize: 16 }} />
                                    Node.js (Fetch API)
                                </h4>
                                <CodeBlock language="javascript" code={nodeCode} />
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                                    <CodeRounded sx={{ fontSize: 16 }} />
                                    Python (Requests)
                                </h4>
                                <CodeBlock language="python" code={pythonCode} />
                            </div>
                        </div>
                    </div>
                </section>
                
                <footer className="pt-20 border-t border-slate-200">
                    <div className="bg-gradient-to-br from-[#7b68ee] to-violet-700 rounded-[40px] p-12 text-center text-white shadow-2xl shadow-violet-500/20">
                        <h3 className="text-3xl font-black tracking-tight mb-4">Ready to start capturing?</h3>
                        <p className="text-violet-100 font-medium mb-10 max-w-md mx-auto">
                            Head over to your dashboard and generate your first API key pair. 
                            Our team is here to help with your complex integrations.
                        </p>
                        <button 
                            onClick={() => window.location.href = '/dashboard'}
                            className="bg-white text-[#7b68ee] px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto shadow-xl"
                        >
                            Go to Console
                            <ArrowForwardRounded sx={{ fontSize: 16 }} />
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default DeveloperGuide;
