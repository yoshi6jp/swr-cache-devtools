"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, Badge, Loading, Select } from "rsc-daisyui";
import { FaList, FaFilter, FaPlay, FaMagnifyingGlass } from "react-icons/fa6";
import { fetcher } from "../../utils/fetcher";
import {
  ProductsResponse,
  AnalyticsResponse,
  Product,
} from "../../utils/types";

export function ArrayKeysDemo() {
  const [category, setCategory] = useState("electronics");
  const [sortBy, setSortBy] = useState("name");
  const [limit, setLimit] = useState(10);

  const {
    data: products,
    error: productsError,
    isLoading: productsLoading,
  } = useSWR<ProductsResponse>(
    ["/api/products", { category, sortBy, limit }],
    ([url, params]: [string, Record<string, string | number>]) =>
      fetcher<ProductsResponse>(url, params)
  );

  const {
    data: analytics,
    error: analyticsError,
    isLoading: analyticsLoading,
  } = useSWR<AnalyticsResponse>(
    `/api/analytics/products/${category}`,
    (url: string) => fetcher<AnalyticsResponse>(url)
  );

  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "books", label: "Books" },
    { value: "home", label: "Home & Garden" },
  ];

  const sortOptions = [
    { value: "name", label: "By Name" },
    { value: "price", label: "By Price" },
    { value: "rating", label: "By Rating" },
    { value: "created", label: "By Date" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Array Keys Demo</h3>
        <p className="text-base-content/70">
          Experience SWR patterns using array-form keys and cache independence
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-base-200/50">
        <div className="card-body">
          <h4 className="card-title flex items-center gap-2 text-lg">
            <FaFilter className="w-5 h-5 text-warning" />
            Filter Settings
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Sort</span>
              </label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Items to Display</span>
              </label>
              <Select
                value={limit.toString()}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full"
              >
                <option value="5">5 items</option>
                <option value="10">10 items</option>
                <option value="20">20 items</option>
                <option value="50">50 items</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge color="info" size="sm">
              SWR Key: [&apos;/api/products&apos;,{" "}
              {`{category: "${category}", sortBy: "${sortBy}", limit: ${limit}}`}
              ]
            </Badge>
            <Badge color="success" size="sm">
              SWR Key: &apos;/api/analytics/products/{category}&apos;
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products List */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              <FaList className="w-5 h-5 text-info" />
              Product List
            </h4>

            {productsError && (
              <div className="alert alert-error">
                <span>Error: {productsError.message}</span>
              </div>
            )}

            {productsLoading && (
              <div className="flex justify-center py-8">
                <Loading variant="dots" size="lg" />
              </div>
            )}

            {products &&
              products.products &&
              Array.isArray(products.products) && (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {products.products.map((product: Product) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-lg border border-base-300 bg-base-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-base-content/70">
                            ${product.price.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="badge badge-warning gap-1">
                            ★ {product.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </Card>

        {/* Analytics */}
        <Card className="bg-base-100 border border-base-300">
          <div className="card-body">
            <h4 className="card-title flex items-center gap-2 text-lg">
              <FaMagnifyingGlass className="w-5 h-5 text-success" />
              Category Analytics
            </h4>

            {analyticsError && (
              <div className="alert alert-error">
                <span>Error: {analyticsError.message}</span>
              </div>
            )}

            {analyticsLoading && (
              <div className="flex justify-center py-8">
                <Loading variant="dots" size="lg" />
              </div>
            )}

            {analytics && analytics.analytics && (
              <div className="space-y-4">
                <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                  <div className="stat">
                    <div className="stat-title">Total Products</div>
                    <div className="stat-value text-primary">
                      {analytics.analytics.totalProducts}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Average Price</div>
                    <div className="stat-value text-secondary">
                      ${analytics.analytics.averagePrice}
                    </div>
                  </div>
                </div>

                <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                  <div className="stat">
                    <div className="stat-title">Average Rating</div>
                    <div className="stat-value text-accent">
                      {analytics.analytics.averageRating}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">In Stock</div>
                    <div className="stat-value text-success">
                      {analytics.analytics.inStock}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Demo Info */}
      <Card className="bg-base-200/50">
        <div className="card-body">
          <h5 className="font-semibold mb-2 flex items-center gap-2">
            <FaPlay className="w-4 h-4 text-primary" />
            How to Use This Demo
          </h5>
          <ul className="text-sm space-y-1 text-base-content/80">
            <li>
              • Changing filter settings creates independent cache with new
              array keys
            </li>
            <li>• Same parameter combinations share the same cache</li>
            <li>• Check array key format and cache independence in DevTools</li>
            <li>• Use &quot;Clear All Cache&quot; to delete all caches</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
