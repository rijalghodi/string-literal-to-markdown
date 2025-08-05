"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Download, Eye, Code, Check } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BRAND_CONSTANTS } from "@/lib/brand";

// Constants for escaped characters
const ESCAPED_CHARACTERS = [
  { label: "\\n → newline", value: "\\n" },
  { label: "\\t → tab", value: "\\t" },
  { label: "\\r → carriage return", value: "\\r" },
  { label: "\\\\ → backslash", value: "\\\\" },
  { label: "\\&quot; → quote", value: "\\&quot;" },
];

// Constants for view modes
const VIEW_MODES = [
  { id: "rendered", label: "Rendered", icon: Eye },
  { id: "raw", label: "Raw", icon: Code },
] as const;

// Constants for examples
const EXAMPLES = [
  {
    title: "Basic Headers",
    example: "# Header 1\\n## Header 2\\n### Header 3\\n\\nRegular text",
  },
  {
    title: "Formatting",
    example:
      "**Bold text** and *italic text*\\n\\n`Code snippet`\\n\\n> Blockquote",
  },
  {
    title: "Lists & Escapes",
    example:
      "- Item 1\\n- Item 2\\n  - Nested item\\n\\n\\tTab indented text\\n\\nLine 1\\nLine 2",
  },
];

// Constants for UI text
const UI_TEXT = {
  title: BRAND_CONSTANTS.APP_NAME,
  subtitle: BRAND_CONSTANTS.APP_TAGLINE,
  inputLabel: "String Literal Input",
  previewLabel: "Preview",
  examplesLabel: "Quick Examples",
  placeholder: `Enter your string literal here...
Example: # Header\\n\\n**Bold** and *italic* text\\n\\tWith tab indentation`,
  copyButton: "Copy",
  copiedButton: "Copied!",
  downloadButton: "Download",
  renderedDescription:
    "Showing rendered Markdown with escaped characters converted",
  rawDescription: "Showing raw text with escaped characters converted",
} as const;

export default function StringLiteralViewer() {
  const [inputString, setInputString] = useState(EXAMPLES[0].example);
  const [viewMode, setViewMode] = useState<"raw" | "rendered">("rendered");
  const [copied, setCopied] = useState(false);

  // Function to convert string literal to actual string
  const convertStringLiteral = useCallback((str: string): string => {
    return str
      .replace(/\\n/g, "\n\n")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .replace(/\\\\/g, "\\")
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\b/g, "\b")
      .replace(/\\f/g, "\f")
      .replace(/\\v/g, "\v");
  }, []);

  const convertedString = convertStringLiteral(inputString);

  const handleCopy = async () => {
    const textToCopy = viewMode === "raw" ? inputString : convertedString;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDownload = () => {
    const textToDownload = viewMode === "raw" ? inputString : convertedString;
    const blob = new Blob([textToDownload], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-content.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExampleClick = (example: string) => {
    setInputString(example);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="absolute top-0 right-0">
              <ThemeToggle />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {UI_TEXT.title}
            </h1>
            <p className="text-muted-foreground">{UI_TEXT.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  {UI_TEXT.inputLabel}
                </h2>
                <div className="text-sm text-muted-foreground">
                  {inputString.length} characters
                </div>
              </div>

              <div className="relative">
                <Textarea
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value)}
                  placeholder={UI_TEXT.placeholder}
                  className="h-96 p-4 resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {ESCAPED_CHARACTERS.map((char, index) => (
                  <span key={index} className="bg-muted px-2 py-1 rounded">
                    {char.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  {UI_TEXT.previewLabel}
                </h2>
                <div className="flex items-center gap-0 rounded-md overflow-hidden">
                  {VIEW_MODES.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <Button
                        key={mode.id}
                        onClick={() =>
                          setViewMode(mode.id as "raw" | "rendered")
                        }
                        variant={viewMode === mode.id ? "default" : "secondary"}
                        size="sm"
                        className="rounded-none"
                      >
                        <Icon className="w-4 h-4" />
                        {mode.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-2 right-2 flex gap-0 z-10">
                  <Button onClick={handleCopy} variant="ghost" size="sm">
                    {copied ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copied ? UI_TEXT.copiedButton : UI_TEXT.copyButton}
                  </Button>
                  <Button onClick={handleDownload} variant="ghost" size="sm">
                    <Download className="w-3 h-3" />
                    {UI_TEXT.downloadButton}
                  </Button>
                </div>

                <div className="w-full h-96 p-4 border border-border rounded-lg bg-card text-card-foreground overflow-auto">
                  {viewMode === "rendered" ? (
                    <div className="text-base space-y-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-foreground [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-foreground [&>h3]:text-lg [&>h3]:font-medium [&>h3]:text-foreground [&>p]:text-foreground [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>li]:text-foreground [&>blockquote]:border-l-4 [&>blockquote]:border-muted [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>pre]:bg-muted [&>pre]:p-3 [&>pre]:rounded [&>pre]:overflow-x-auto [&>strong]:font-semibold [&>em]:italic">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {convertedString}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <pre className="text-sm text-foreground font-mono whitespace-pre-wrap break-words">
                      {convertedString}
                    </pre>
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                {viewMode === "rendered"
                  ? UI_TEXT.renderedDescription
                  : UI_TEXT.rawDescription}
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {UI_TEXT.examplesLabel}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXAMPLES.map((example, index) => (
                <Button
                  key={index}
                  onClick={() => handleExampleClick(example.example)}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start"
                >
                  <div>
                    <h4 className="font-medium text-base text-card-foreground mb-2">
                      {example.title}
                    </h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {example.example.substring(0, 50)}...
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
