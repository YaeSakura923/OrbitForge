/* Copyright (C) 2025 OrbitForge contributors */

import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
const path = require("path");
const fs = require("fs");

const orbitforgePath = path.resolve(__dirname, '../@orbitforge/orbitforge-gl/dist');
const examplesPath = path.resolve(__dirname, '../@orbitforge/orbitforge-examples/resources/');
const examplesSrcPath = path.resolve(__dirname, '../@orbitforge/orbitforge-examples/src/real-world-ecological-farming');
const examplesSrcPath3dtilesAnimation = path.resolve(__dirname, '../@orbitforge/orbitforge-examples/src/3dtiles-animation');

const config: Config = {
    title: "OrbitForge",
    url: "https://github.com/YaeSakura923/OrbitForge",
    baseUrl: "/OrbitForge/",
    trailingSlash: false,

    favicon: "img/favicon.ico",
    tagline: "3D Satellite Tracking & Map Rendering Engine",

    future: {
        v4: true
    },

    organizationName: "YaeSakura923",
    projectName: "OrbitForge",

    onBrokenLinks: "warn",
    onBrokenAnchors: "warn", 
    i18n: {
        defaultLocale: "en",
        locales: ["en", "zh"],
        localeConfigs: {
            en: {
                label: "English",
                direction: "ltr"
            },
            zh: {
                label: "中文",
                direction: "ltr"
            }
        }
    },

    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    breadcrumbs: false,
                    sidebarPath: "./sidebars.ts",
                    editUrl: "https://github.com/YaeSakura923/OrbitForge/tree/main/docs/"
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ["rss", "atom"],
                        xslt: true
                    },
                    editUrl: "https://github.com/YaeSakura923/OrbitForge/tree/main/docs/",
                    onInlineTags: "warn",
                    onInlineAuthors: "warn",
                    onUntruncatedBlogPosts: "warn",
                    authorsMapPath: "blog/authors.yml"
                },
                theme: {
                    customCss: "./src/css/custom.css"
                }
            } satisfies Preset.Options
        ]
    ],
    // Update staticDirectories configuration
    staticDirectories: [
        "./static",  // Ensure static directory is included
        orbitforgePath, 
        examplesPath,
        // Keep root directory mapping (if needed)
        examplesSrcPath, 
        examplesSrcPath3dtilesAnimation
    ],
    markdown: {
        format: 'mdx',
        mermaid: true,
        // Handle broken Markdown images
        mdx1Compat: {
          admonitions: true,
          comments: true,
          headingIds: true,
        },
        // Ignore broken Markdown images
        hooks: {
          onBrokenMarkdownImages: 'warn', // or 'ignore' 
        },
    },
    themeConfig: {
        image: "img/docusaurus-social-card.jpg",
        colorMode: {
            defaultMode: 'light',
            disableSwitch: false,
            respectPrefersColorScheme: false
        },
        sidebar: {
            hideable: true,
            autoCollapseCategories: true
        },
        navbar: {
            title: "OrbitForge",
            logo: {
                alt: "OrbitForge Logo",
                src: "img/logo.svg"
            },
            items: [
                {
                    type: "docSidebar",
                    sidebarId: "tutorialSidebar",
                    position: "left",
                    label: "Documentation"
                },
                { to: "/examples", label: "Examples", position: "left" },
                { to: "/blog", label: "Blog", position: "left" },
                {
                    href: "https://github.com/YaeSakura923/OrbitForge",
                    label: "GitHub",
                    position: "right"
                },
                {
                    type: 'localeDropdown',
                    position: 'right',
                },
            ]
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "文档",
                    items: [
                        {
                            label: "入门指南",
                            to: "/docs"
                        },
                        {
                            label: "API 参考",
                            to: "/docs/api" // Update to correct API path
                        }
                    ]
                },
                {
                    title: "示例",
                    items: [
                        {
                            label: "基础示例",
                            to: "/examples"
                        }
                    ]
                },
                {
                    title: "社区",
                    items: [
                        {
                            label: "GitHub",
                            href: "https://github.com/YaeSakura923/OrbitForge"
                        }
                    ]
                },
                {
                    title: "更多",
                    items: [
                        {
                            label: "博客",
                            to: "/blog"
                        }
                    ]
                }
            ],
            copyright: `Copyright © ${new Date().getFullYear()} OrbitForge. Built with Docusaurus.`
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ["batch", "json5", "powershell"]
        }
    } satisfies Preset.ThemeConfig
};

export default config;