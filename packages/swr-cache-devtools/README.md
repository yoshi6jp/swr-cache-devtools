# SWR Cache DevTools

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
| `style`       | `React.CSSProperties`                                          | -                | Custom styles for the container     |
| `buttonStyle` | `React.CSSProperties`                                          | -                | Custom styles for the toggle button |
| `panelStyle`  | `React.CSSProperties`                                          | -                | Custom styles for the panel         |

## Requirements

- React >= 17.0.0
- SWR >= 2.0.0

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

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
