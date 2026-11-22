// Public media must follow Vite's base when hosted as a GitHub Pages project site.
export const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}assets/${filename}`;
