"use client";

import { useState } from "react";
import {
  ArrowUp,
  ImagePlus,
  LayoutDashboard,
  Key as KeyIcon,
  Home,
  User,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Download,
  Eye,
  Code,
} from "lucide-react";

interface CodeResult {
  id: string;
  code: string;
  provider: string;
}

export default function HeroGeneratorSection() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CodeResult[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<{ [key: string]: "preview" | "code" }>({});

  const handleTemplateClick = (template: string) => {
    const templates: { [key: string]: string } = {
      Dashboard: "A modern analytics dashboard with charts, metrics cards, and data tables",
      "SignUp Form": "A clean sign up form with email, password fields and social login options",
      Hero: "A hero section with bold headline, subheading, CTA button and background image",
      "User Profile Card": "A user profile card with avatar, name, bio, and social media links",
    };
    setPrompt(templates[template] || template);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      // Call both AI providers in parallel
      const [geminiResponse, groqResponse] = await Promise.allSettled([
        fetch("/api/generate/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }),
        fetch("/api/generate/groq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }),
      ]);

      const newResults: CodeResult[] = [];

      // Process Gemini result
      if (geminiResponse.status === "fulfilled") {
        const geminiData = await geminiResponse.value.json();
        if (geminiData.success) {
          newResults.push({
            id: `gemini-${Date.now()}`,
            code: geminiData.code,
            provider: "gemini",
          });
        }
      }

      // Process Groq result
      if (groqResponse.status === "fulfilled") {
        const groqData = await groqResponse.value.json();
        if (groqData.success) {
          newResults.push({
            id: `groq-${Date.now()}`,
            code: groqData.code,
            provider: "groq",
          });
        }
      }

      setResults(newResults);
    } catch (error: any) {
      console.error("Generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleDownloadCode = (code: string, index: number) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `component-v${index + 1}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const createPreviewHTML = (code: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f9fafb;
    }
    .preview-container {
      background: white;
      border-radius: 8px;
      padding: 20px;
      min-height: 400px;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div id="root"></div>
  </div>
  <script type="module">
    import React from 'https://esm.sh/react@18.3.1';
    import ReactDOM from 'https://esm.sh/react-dom@18.3.1/client';
    
    ${code.replace("export default function", "function")}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    const componentName = ${code.match(/function\s+(\w+)/)?.[1] || "Component"};
    root.render(React.createElement(eval(componentName)));
  </script>
</body>
</html>`;
  };

  return (
    <section className="flex flex-col items-center justify-center bg-white py-24 px-4 text-black">
      <h1 className="text-4xl sm:text-6xl font-black tracking-[-0.02em] text-center max-w-[976px]">
        What should we Design?
      </h1>
      <p className="mt-2 text-lg sm:text-xl text-gray-500 text-center">
        Generate, Edit and Explore desig with AI, Export code as well
      </p>

      <div className="w-full max-w-2xl mt-8 p-5 border border-border rounded-2xl bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 transition-all duration-200">
        <textarea
          placeholder="Describe your page design"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="w-full h-24 bg-transparent border-none resize-none focus:outline-none focus:ring-0 p-0 text-base placeholder:text-gray-500 disabled:opacity-50"
        />
        <div className="flex justify-between items-center">
          <button
            disabled={loading}
            className="inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium hover:bg-accent text-gray-800 transition-colors disabled:opacity-50"
          >
            <ImagePlus className="h-5 w-5" />
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium bg-gray-400 hover:bg-gray-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => handleTemplateClick("Dashboard")}
          disabled={loading}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-border bg-background hover:bg-accent h-9 px-4 py-2 disabled:opacity-50"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </button>
        <button
          onClick={() => handleTemplateClick("SignUp Form")}
          disabled={loading}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-border bg-background hover:bg-accent h-9 px-4 py-2 disabled:opacity-50"
        >
          <KeyIcon className="mr-2 h-4 w-4" />
          SignUp Form
        </button>
        <button
          onClick={() => handleTemplateClick("Hero")}
          disabled={loading}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-border bg-background hover:bg-accent h-9 px-4 py-2 disabled:opacity-50"
        >
          <Home className="mr-2 h-4 w-4" />
          Hero
        </button>
        <button
          onClick={() => handleTemplateClick("User Profile Card")}
          disabled={loading}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-border bg-background hover:bg-accent h-9 px-4 py-2 disabled:opacity-50"
        >
          <User className="mr-2 h-4 w-4" />
          User Profile Card
        </button>
      </div>

      {/* Code & Preview Cards Display */}
      {results.length > 0 && (
        <div className="w-full max-w-6xl mt-16 space-y-6">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="h-5 w-5 text-black" />
            <h2 className="text-2xl font-bold text-center">Generated Components</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map((result, index) => {
              const tabKey = result.id;
              const currentTab = activeTab[tabKey] || "preview";
              
              return (
                <div
                  key={result.id}
                  className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-black to-gray-800 px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm">
                            Component v{index + 1}
                          </h3>
                          <p className="text-white/60 text-xs">
                            AI-generated & ready to use
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tab Switcher */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab({ ...activeTab, [tabKey]: "preview" })}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          currentTab === "preview"
                            ? "bg-white text-black"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </button>
                      <button
                        onClick={() => setActiveTab({ ...activeTab, [tabKey]: "code" })}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          currentTab === "code"
                            ? "bg-white text-black"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <Code className="h-3.5 w-3.5" />
                        Code
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="relative">
                    {currentTab === "preview" ? (
                      <div className="p-6 bg-gray-50 min-h-[400px]">
                        <iframe
                          srcDoc={createPreviewHTML(result.code)}
                          className="w-full h-[500px] border-0 bg-white rounded-lg shadow-inner"
                          title={`Preview ${index + 1}`}
                          sandbox="allow-scripts"
                        />
                      </div>
                    ) : (
                      <div className="p-6 max-h-[500px] overflow-auto bg-gray-900">
                        <pre className="text-xs font-mono leading-relaxed text-green-400 whitespace-pre-wrap break-words">
                          <code>{result.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(result.code, result.id)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 text-xs font-medium"
                      >
                        {copiedId === result.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadCode(result.code, index)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-black hover:bg-gray-800 rounded-lg transition-colors text-white text-xs font-medium"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live Preview
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="w-full max-w-6xl mt-16">
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-black" />
            </div>
            <p className="text-lg font-medium text-gray-700">
              Generating your code...
            </p>
            <p className="text-sm text-gray-500">
              AI is crafting production-ready React components
            </p>
          </div>
        </div>
      )}
    </section>
  );
}