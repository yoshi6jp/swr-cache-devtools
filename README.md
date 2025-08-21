# SWR Cache DevTools

[![npm version](https://badge.fury.io/js/swr-cache-devtools.svg)](https://badge.fury.io/js/swr-cache-devtools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Developer tools for SWR cache visualization and debugging in React applications.

## Features

- 🔍 **Cache Visualization**: View and explore your SWR cache data in real-time
- 🎨 **JSON Editor**: Edit cache values directly in the DevTools interface
- 🌗 **Theme Support**: Light, dark, and auto themes
- 📱 **Flexible Positioning**: Position the DevTools panel anywhere on your screen
- ⚡ **Zero Configuration**: Works out of the box with any SWR setup

## Installation

```bash
npm install swr-cache-devtools
# or
yarn add swr-cache-devtools
# or
pnpm add swr-cache-devtools
```

## Usage

Simply import and add the `SwrCacheDevTools` component to your React application:

```jsx
import { SwrCacheDevTools } from "swr-cache-devtools";

function App() {
  return (
    <div>
      {/* Your app content */}
      <SwrCacheDevTools />
    </div>
  );
}
```

### With Custom Configuration

```jsx
import { SwrCacheDevTools } from "swr-cache-devtools";

function App() {
  return (
    <div>
      {/* Your app content */}
      <SwrCacheDevTools
        position="bottom-right"
        theme="dark"
        defaultOpen={false}
        maxHeight={400}
        maxWidth={600}
      />
    </div>
  );
}
```

## Props

| Prop          | Type                                                           | Default          | Description                         |
| ------------- | -------------------------------------------------------------- | ---------------- | ----------------------------------- |
| `position`    | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right"` | `"bottom-right"` | Position of the DevTools panel      |
| `theme`       | `"light" \| "dark" \| "auto"`                                  | `"auto"`         | Color theme                         |
| `defaultOpen` | `boolean`                                                      | `false`          | Whether the panel starts open       |
| `maxHeight`   | `number`                                                       | `400`            | Maximum height of the panel         |
| `maxWidth`    | `number`                                                       | `600`            | Maximum width of the panel          |
| `className`   | `string`                                                       | -                | Custom CSS class for the container  |
| `buttonStyle` | `React.CSSProperties`                                          | -                | Custom styles for the toggle button |
| `panelStyle`  | `React.CSSProperties`                                          | -                | Custom styles for the panel         |

## Development Mode Only

It's recommended to only include the DevTools in development mode:

```jsx
import { SwrCacheDevTools } from "swr-cache-devtools";

function App() {
  return (
    <div>
      {/* Your app content */}
      {process.env.NODE_ENV === "development" && <SwrCacheDevTools />}
    </div>
  );
}
```

## Demo

You can try the DevTools in our interactive demo application:

- [Live Demo](https://swr-cache-devtools-web.vercel.app/)
- Local development: `pnpm dev --filter=web`

## Project Structure

This repository uses Turborepo for monorepo management:

- `packages/swr-cache-devtools`: Main library package
- `apps/web`: Demo application showcasing the DevTools
- `apps/docs`: Documentation website

## Requirements

- React >= 17.0.0
- SWR >= 2.0.0

## Development

To develop all apps and packages:

```bash
# Install dependencies
pnpm install

# Start development mode
pnpm dev
```

To develop specific packages:

```bash
# Develop the DevTools package
pnpm dev --filter=swr-cache-devtools

# Develop the demo app
pnpm dev --filter=web
```

## Build

To build all packages:

```bash
pnpm build
```

To build specific packages:

```bash
# Build the DevTools package
pnpm build --filter=swr-cache-devtools

# Build the demo app
pnpm build --filter=web
```

## Publishing

The main package is automatically published to npm when changes are made to the `packages/swr-cache-devtools` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Yoshiharu Kamata

## Links

- [GitHub Repository](https://github.com/yoshi6jp/swr-cache-devtools)
- [npm Package](https://www.npmjs.com/package/swr-cache-devtools)
- [Live Demo](https://swr-cache-devtools-web.vercel.app/)
