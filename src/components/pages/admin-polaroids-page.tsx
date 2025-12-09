import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { LanguageProvider } from "@/contexts/language-context";
import { useAdminPolaroidsQuery, type AdminPolaroidsFilters } from "@/hooks/use-admin-polaroids-query";
import { Search, Download, ChevronLeft, ChevronRight, Trash2, Eye } from "lucide-react";
import { clsx } from "clsx";
import type { PolaroidRecord } from "@/lib/polaroids";
import { useDeletePolaroid } from "@/hooks/use-polaroids-query";
import { useQueryClient } from "@tanstack/react-query";

function AdminPolaroidsContent() {
  const [filters, setFilters] = useState<AdminPolaroidsFilters>({
    page: 1,
    pageSize: 20,
    search: "",
    provider: undefined,
    sortBy: "created_at",
    sortOrder: "desc",
    dateRange: "all",
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [detailPolaroid, setDetailPolaroid] = useState<PolaroidRecord | null>(null);

  const { data, isLoading, error } = useAdminPolaroidsQuery(filters);
  const deletePolaroid = useDeletePolaroid();
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleFilterChange = useCallback((key: keyof AdminPolaroidsFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (!data?.data) return;
    if (selectedIds.size === data.data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.data.map((p) => p.id)));
    }
  }, [data, selectedIds]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this polaroid?")) return;
    try {
      await deletePolaroid.mutateAsync(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["admin-polaroids"] });
    } catch (error) {
      console.error("Failed to delete polaroid:", error);
      alert("Failed to delete polaroid");
    }
  }, [deletePolaroid, queryClient]);

  const downloadImage = useCallback(async (polaroid: PolaroidRecord) => {
    // Use portrait image_url, not landscape og_image_url
    const imageUrl = polaroid.image_url;
    if (!imageUrl) {
      alert("No image available for download");
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `polaroid-${polaroid.slug || polaroid.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Failed to download image");
    }
  }, []);

  const downloadSelected = useCallback(async () => {
    if (!data?.data || selectedIds.size === 0) return;

    const selectedPolaroids = data.data.filter((p) => selectedIds.has(p.id));
    for (const polaroid of selectedPolaroids) {
      await downloadImage(polaroid);
      // Small delay between downloads to avoid browser blocking
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }, [data, selectedIds, downloadImage]);

  const downloadAll = useCallback(async () => {
    if (!data?.data) return;
    for (const polaroid of data.data) {
      await downloadImage(polaroid);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }, [data, downloadImage]);

  const pagination = data?.pagination;
  const polaroids = data?.data || [];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-fg">Admin Panel</h1>
          <div className="text-sm text-fg-muted">
            {pagination?.totalCount || 0} total polaroids
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-panel p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
              <input
                type="text"
                placeholder="Search by username, title, or slug..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <select
              value={filters.provider || ""}
              onChange={(e) => handleFilterChange("provider", e.target.value || undefined)}
              className="px-4 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="">All Providers</option>
              <option value="github">GitHub</option>
              <option value="twitter">Twitter/X</option>
            </select>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <select
              value={`${filters.sortBy}_${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("_");
                handleFilterChange("sortBy", sortBy);
                handleFilterChange("sortOrder", sortOrder as "asc" | "desc");
              }}
              className="px-4 py-2 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="created_at_desc">Newest First</option>
              <option value="created_at_asc">Oldest First</option>
              <option value="like_count_desc">Most Likes</option>
              <option value="like_count_asc">Least Likes</option>
            </select>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-sm text-fg-muted hover:text-fg"
              >
                {selectedIds.size === polaroids.length ? "Deselect All" : "Select All"}
              </button>
              {selectedIds.size > 0 && (
                <span className="text-sm text-fg-muted">
                  {selectedIds.size} selected
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedIds.size > 0 && (
                <button
                  type="button"
                  onClick={downloadSelected}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-sm text-sm hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  Download Selected
                </button>
              )}
              <button
                type="button"
                onClick={downloadAll}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-sm text-sm hover:bg-card-01 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="card-panel p-8 text-center text-fg-muted">
            Loading...
          </div>
        )}

        {error && (
          <div className="card-panel p-8 text-center text-accent">
            Error: {error instanceof Error ? error.message : "Failed to load polaroids"}
          </div>
        )}

        {!isLoading && !error && polaroids.length === 0 && (
          <div className="card-panel p-8 text-center text-fg-muted">
            No polaroids found
          </div>
        )}

        {!isLoading && !error && polaroids.length > 0 && (
          <div className="card-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card-01 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-fg-muted uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === polaroids.length && polaroids.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-border"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-fg-muted uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-fg-muted uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-fg-muted uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-fg-muted uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-fg-muted uppercase tracking-wider">
                      Likes
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-fg-muted uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-fg-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {polaroids.map((polaroid) => {
                    const username = polaroid.profile?.handles?.[0]?.handle || "N/A";
                    // Use portrait image_url, not landscape og_image_url
                    const imageUrl = polaroid.image_url;
                    return (
                      <tr key={polaroid.id} className="hover:bg-card-01 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(polaroid.id)}
                            onChange={() => toggleSelect(polaroid.id)}
                            className="rounded border-border"
                          />
                        </td>
                        <td className="px-4 py-3">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={polaroid.title || "Polaroid"}
                              className="w-16 h-16 object-cover rounded-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-card-02 rounded-sm flex items-center justify-center text-xs text-fg-muted">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-fg">{username}</td>
                        <td className="px-4 py-3 text-sm text-fg">
                          {polaroid.title || <span className="text-fg-muted">Untitled</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-fg-muted">
                          {polaroid.provider || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-fg-muted">
                          {polaroid.like_count || 0}
                        </td>
                        <td className="px-4 py-3 text-sm text-fg-muted">
                          {new Date(polaroid.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setDetailPolaroid(polaroid)}
                              className="p-1.5 hover:bg-card-02 rounded-sm transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-fg-muted" />
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadImage(polaroid)}
                              className="p-1.5 hover:bg-card-02 rounded-sm transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4 text-fg-muted" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(polaroid.id)}
                              className="p-1.5 hover:bg-card-02 rounded-sm transition-colors text-accent"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between card-panel p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-fg-muted">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <select
                value={filters.pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-2 py-1 bg-card border border-border rounded-sm text-sm focus:outline-none focus:border-accent"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={clsx(
                  "flex items-center gap-1 px-3 py-1.5 rounded-sm text-sm transition-colors",
                  pagination.page === 1
                    ? "text-fg-muted cursor-not-allowed"
                    : "text-fg hover:bg-card-01"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className={clsx(
                  "flex items-center gap-1 px-3 py-1.5 rounded-sm text-sm transition-colors",
                  pagination.page >= pagination.totalPages
                    ? "text-fg-muted cursor-not-allowed"
                    : "text-fg hover:bg-card-01"
                )}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {detailPolaroid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-fg">Polaroid Details</h2>
                <button
                  type="button"
                  onClick={() => setDetailPolaroid(null)}
                  className="text-fg-muted hover:text-fg"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-4">
                {detailPolaroid.image_url ? (
                  <img
                    src={detailPolaroid.image_url}
                    alt={detailPolaroid.title || "Polaroid"}
                    className="w-full rounded-sm"
                  />
                ) : null}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-fg-muted">ID</div>
                    <div className="text-fg font-mono">{detailPolaroid.id}</div>
                  </div>
                  <div>
                    <div className="text-fg-muted">Slug</div>
                    <div className="text-fg">{detailPolaroid.slug || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-fg-muted">Title</div>
                    <div className="text-fg">{detailPolaroid.title || "Untitled"}</div>
                  </div>
                  <div>
                    <div className="text-fg-muted">Provider</div>
                    <div className="text-fg">{detailPolaroid.provider || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-fg-muted">Likes</div>
                    <div className="text-fg">{detailPolaroid.like_count || 0}</div>
                  </div>
                  <div>
                    <div className="text-fg-muted">Created</div>
                    <div className="text-fg">
                      {new Date(detailPolaroid.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-fg-muted text-sm mb-2">Profile (JSON)</div>
                  <pre className="bg-card-01 p-4 rounded-sm text-xs overflow-x-auto font-mono">
                    {JSON.stringify(detailPolaroid.profile, null, 2)}
                  </pre>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => downloadImage(detailPolaroid)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-sm text-sm hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    Download Image
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(detailPolaroid.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-sm text-sm hover:bg-card-01 transition-colors text-accent"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export function AdminPolaroidsPage() {
  return (
    <LanguageProvider>
      <AdminPolaroidsContent />
    </LanguageProvider>
  );
}

