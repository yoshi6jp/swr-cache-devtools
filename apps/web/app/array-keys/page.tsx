import { Navigation } from "../../components/navigation";
import { ArrayKeysDemo } from "../../components/demos/array-keys-demo";

export default function ArrayKeysPage() {
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
          </div>
        </header>

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="mt-8">
          <ArrayKeysDemo />
        </main>
      </div>
    </div>
  );
}
