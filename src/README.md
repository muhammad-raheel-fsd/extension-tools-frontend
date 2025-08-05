# LLM Chrome Extension - Source Code Structure

This document explains the organized folder structure and available script types in your Plasmo Chrome Extension.

## 📁 Folder Structure

```
src/
├── background/                 # Background Service Worker (Main Extension Logic)
│   ├── index.ts               # Main background script entry point
│   ├── services/              # Organized service modules
│   │   ├── sidepanel.ts      # Sidepanel management
│   │   ├── messaging.ts      # Message handling
│   │   └── storage.ts        # Storage operations
│   ├── utils/                 # Utility functions
│   │   └── logger.ts         # Centralized logging
│   └── messages/              # Plasmo message handlers
│       └── ping.ts           # Example message handler
│
├── sidepanel/                 # Side Panel UI
│   └── index.tsx             # Main sidepanel component
│
├── options/                   # Options/Settings Page
│   └── index.tsx             # Extension settings UI
│
├── contents/                  # Content Scripts
│   └── example-content.ts    # Example content script
│
├── components/                # Shared React Components
│   └── ui/                   # UI component library
│       ├── button.tsx
│       └── input.tsx
│
├── lib/                      # Shared utilities
│   └── utils/
│       └── index.ts
│
└── styles/                   # Global styles
    └── index.css            # Tailwind CSS + custom styles
```

## 🚀 Available Script Types in Plasmo

### 1. **Extension Pages** (Chrome Extension UI)

-   **Sidepanel** (`sidepanel/index.tsx`) - Persistent side panel UI
-   **Popup** (`popup/index.tsx`) - Popup when clicking extension icon
-   **Options** (`options/index.tsx`) - Extension settings page
-   **New Tab** (`newtab/index.tsx`) - Override browser new tab
-   **DevTools** (`devtools/index.tsx`) - Browser developer tools integration

### 2. **Background Scripts** (Service Worker)

-   **Main Background** (`background/index.ts`) - Core extension logic
-   **Message Handlers** (`background/messages/*.ts`) - API-like message handling
-   **Port Handlers** (`background/ports/*.ts`) - Long-lived connections

### 3. **Content Scripts** (Inject into Web Pages)

-   **Single Content Script** (`content.ts`) - Runs on all/specific websites
-   **Multiple Content Scripts** (`contents/*.ts`) - Different scripts for different sites
-   **Content Scripts UI** (`contents/*.tsx`) - Inject React components into pages

### 4. **Tab Pages** (Extension-hosted Pages)

-   **Custom Tab Pages** (`tabs/*.tsx`) - Full-page extension content

### 5. **Sandbox Pages** (Isolated Environments)

-   **Sandbox Scripts** (`sandbox/*.tsx`) - Isolated execution environments

## 💡 Key Benefits of This Organization

### **🎯 Separation of Concerns**

-   **Services**: Each service handles specific functionality (sidepanel, storage, messaging)
-   **Utils**: Reusable utilities like logging
-   **Components**: Shared UI components across pages

### **🔧 Easy Maintenance**

-   Find code quickly with logical folder structure
-   Add new features without cluttering root directory
-   Clear separation between background logic and UI

### **🚀 Scalability**

-   Add new message handlers in `background/messages/`
-   Create new content scripts in `contents/`
-   Build new extension pages as needed

## 🛠️ How to Add New Scripts

### **New Background Message Handler**

```typescript
// src/background/messages/your-handler.ts
import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
	// Your logic here
	res.send({ success: true });
};

export default handler;
```

### **New Content Script**

```typescript
// src/contents/your-script.ts
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
	matches: ['https://example.com/*'],
	run_at: 'document_end',
};

// Your content script logic
console.log('Content script loaded!');
export {};
```

### **New Extension Page**

```tsx
// src/your-page/index.tsx
import React from 'react';

function YourPage() {
	return <div>Your Extension Page</div>;
}

export default YourPage;
```

## 🔗 Communication Between Components

### **Message Flow Examples**

1. **Sidepanel → Background**

```typescript
import { sendToBackground } from '@plasmohq/messaging';

const response = await sendToBackground({
	name: 'ping',
	body: { message: 'Hello from sidepanel!' },
});
```

2. **Content Script → Background**

```typescript
chrome.runtime.sendMessage({
	type: 'FROM_CONTENT_SCRIPT',
	data: { selectedText: 'user selection' },
});
```

3. **Background → Content Script**

```typescript
chrome.tabs.sendMessage(tabId, {
	type: 'CONTENT_SCRIPT_PING',
	data: { action: 'highlight' },
});
```

## 📦 Required Permissions

Current manifest permissions:

-   `sidePanel` - For side panel functionality
-   `storage` - For extension storage operations
-   `tabs` - For tab management and communication
-   `activeTab` - For active tab access
-   `host_permissions` - For website access

## 🎨 Styling

-   **Tailwind CSS** is configured and working
-   **Global styles** in `src/styles/index.css`
-   **Component-level styling** with Tailwind classes
-   **ShadCN/UI components** available in `src/components/ui/`

## 🐛 Debugging

Each service includes comprehensive logging:

```typescript
import { logInfo, logError } from '../utils/logger';

logInfo('Operation completed', { data });
logError('Operation failed', error);
```

Check the browser's extension console:

1. Go to `chrome://extensions/`
2. Click "service worker" for your extension
3. View logs in the DevTools console

## 🚀 Next Steps

1. **Add your AI/LLM integration** in background services
2. **Create content scripts** for specific websites
3. **Build UI components** for your use case
4. **Set up API integrations** using background scripts (no CORS!)
5. **Add storage** for user data and settings

This structure provides a solid foundation for building complex, maintainable Chrome extensions with Plasmo!
