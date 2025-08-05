# String Literal to Markdown Viewer

A web application that converts string literals with escaped characters into beautifully rendered Markdown with live preview.

## What it does

- **Input**: String literals with escaped characters (e.g., `\\n`, `\\t`, `\\"`)
- **Output**: Live preview of converted Markdown or raw text
- **Features**: Toggle between rendered and raw views, copy to clipboard, download as .md file
- **Examples**: Pre-built examples to demonstrate functionality

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Markdown
- next-themes (dark/light mode)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. Enter a string literal with escaped characters in the input field
2. See live preview of the converted Markdown
3. Toggle between "Rendered" and "Raw" views
4. Copy or download the result
5. Try the quick examples to see how it works
