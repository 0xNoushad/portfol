export interface SetupItem {
  name: string;
  description?: string;
  link?: string;
  icon?: string; // Optional icon for visual enhancement
}

export interface SetupCategory {
  title: string;
  items: SetupItem[];
}

export const setup: SetupCategory[] = [
  {
    title: "hardware",
    items: [
      {
        name: 'macbook pro 16" m3 pro',
        description: "main dev machine",
      },
    ],
  },
  {
    title: "development",
    items: [
      {
        name: "cursor",
        description: "ai-powered code editor",
        link: "https://cursor.com",
      },
      {
        name: "opencode",
        description: "code editor",
        link: "https://code.visualstudio.com",
      },
      {
        name: "terminal",
        description: "default macos terminal",
        link: "https://en.wikipedia.org/wiki/Computer_terminal",
      },
    ],
  },
  {
    title: "design & productivity",
    items: [
      {
        name: "figma",
        description: "ui/ux design",
        link: "https://figma.com",
      },
      {
        name: "obsidian",
        description: "knowledge base & second brain",
        link: "https://obsidian.md",
      },
      {
        name: "raycast",
        description: "launcher & productivity tool",
        link: "https://raycast.com",
      },
    ],
  },
];
