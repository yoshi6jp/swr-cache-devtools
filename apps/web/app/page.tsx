import { Navigation } from "../components/navigation";
import { BasicOperationsDemo } from "../components/demos/basic-operations-demo";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-base-content mb-2">
              SWR Cache DevTools Demo
            </h1>
            <p className="text-base-content/70 text-lg">
              Explore various SWR usage patterns and cache behaviors in this
              interactive demo application
            </p>
            <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
              <p className="text-sm">
                💡 <strong>Tip:</strong> Use the DevTools Settings above to
                customize the DevTools panel position, theme, and size. Then
                click the floating button to open the cache inspector.
              </p>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="mt-8">
          <BasicOperationsDemo />
        </main>
      </div>
    </div>
  );
}
