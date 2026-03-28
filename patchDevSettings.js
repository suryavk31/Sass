const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/DeveloperSettings.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add states
content = content.replace(
    "const [keys, setKeys] = useState([]);",
    "const [keys, setKeys] = useState([]);\n    const [webhookLogs, setWebhookLogs] = useState([]);\n    const [logsLoading, setLogsLoading] = useState(false);"
);

// 2. Add fetch keys effect update
content = content.replace(
    "fetchKeys(selectedWorkspace);",
    "fetchKeys(selectedWorkspace);\n            fetchWebhookLogs(selectedWorkspace);"
);
content = content.replace(
    "fetchKeys(workspaces[0]._id);",
    "fetchKeys(workspaces[0]._id);\n            fetchWebhookLogs(workspaces[0]._id);"
);

// 3. Add fetch functions
const fetchFunctions = `
    const fetchWebhookLogs = async (workspaceId) => {
        setLogsLoading(true);
        try {
            const { data } = await axios.get(\`/api/webhooks/logs?workspaceId=\${workspaceId}\`, authConfig);
            setWebhookLogs(data || []);
        } catch (error) {
            console.error("Failed to fetch webhook logs");
        }
        setLogsLoading(false);
    };

    const handleRetryWebhook = async (id) => {
        try {
            const { data } = await axios.post(\`/api/webhooks/logs/\${id}/retry\`, {}, authConfig);
            toast.success("Webhook retried successfully");
            fetchWebhookLogs(selectedWorkspace);
        } catch (error) {
            toast.error("Webhook retry failed");
            fetchWebhookLogs(selectedWorkspace);
        }
    };
`;
content = content.replace(
    "const fetchKeys = async",
    fetchFunctions + "\n    const fetchKeys = async"
);

// 4. Add UI Table
const uiTable = \`
                {/* Webhook Logs */}
                <div className="mt-8 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Recent Webhook Deliveries</h3>
                    </div>
                    {logsLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading logs...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 table-compact">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">Event</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">URL</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">Date</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-500 uppercase tracking-wider text-xs">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100 text-sm">
                                    {webhookLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="px-4 py-3 font-medium text-gray-900">{log.event}</td>
                                            <td className="px-4 py-3 text-gray-500 font-mono tracking-tighter truncate max-w-xs">{log.url}</td>
                                            <td className="px-4 py-3">
                                                <span className={\`px-2 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded-sm uppercase tracking-wide \${log.status === 'Success' ? 'bg-green-100 text-green-800' : log.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}\`}>
                                                    {log.status} {log.statusCode ? \`(\${log.statusCode})\` : ''}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {log.status !== 'Success' && (
                                                    <button 
                                                        onClick={() => handleRetryWebhook(log.id)}
                                                        className="text-violet-600 hover:text-violet-900 text-xs font-semibold bg-violet-50 hover:bg-violet-100 px-2.5 py-1 rounded"
                                                    >
                                                        Retry
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {webhookLogs.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-gray-400 font-medium">No webhook deliveries recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
\`;

content = content.replace("</div>\n        </div>\n    );\n};\n\nexport default DeveloperSettings;", uiTable + "\n            </div>\n        </div>\n    );\n};\n\nexport default DeveloperSettings;");

fs.writeFileSync(filePath, content, 'utf8');
console.log("DeveloperSettings injected with Webhook logs UI");
