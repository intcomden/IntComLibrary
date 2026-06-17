import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 * Customized for the Internationalist Communist Library (ICP-style theme)
 * Matches the main archive colors and typography for a seamless transition.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Communist Library Wiki",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "intcomden.github.io/IntComLibrary/wiki",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Cinzel",
        body: "Lora",
        code: "Space Mono",
      },
      colors: {
        lightMode: {
          light: "#fcfcfc",
          lightgray: "#e0e0e0",
          gray: "#888888",
          darkgray: "#2c2c2c",
          dark: "#0c0d10",
          mediumgray: "#b8b8b8",
          blue: "#d63031", // Theme Red as link
          highlight: "rgba(214, 48, 49, 0.08)",
          textHighlight: "#e5c15888",
        },
        darkMode: {
          light: "#0c0d10",         // --bg-primary
          lightgray: "#191c26",     // --bg-tertiary / borders
          gray: "#64748b",          // --text-dim
          darkgray: "#f1f5f9",      // --text-main
          dark: "#ffffff",          // Headings
          mediumgray: "#94a3b8",    // --text-muted
          blue: "#d63031",          // --accent-red (links)
          highlight: "rgba(214, 48, 49, 0.15)", // Translucent red highlights
          textHighlight: "#e5c15844",           // Subtle gold highlights
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
