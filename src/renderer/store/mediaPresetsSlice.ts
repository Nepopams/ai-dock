import { StateCreator } from "zustand";
import type { MediaPreset } from "../../shared/types/mediaPresets";

export interface MediaPresetsSlice {
  mediaPresets: MediaPreset[];
  mediaPresetsLoading: boolean;
  mediaPresetsError: string | null;
}

export interface MediaPresetsActions {
  fetchMediaPresets: () => Promise<void>;
  saveMediaPresets: (presets: MediaPreset[]) => Promise<boolean>;
  upsertMediaPreset: (preset: MediaPreset) => Promise<boolean>;
  removeMediaPreset: (id: string) => Promise<boolean>;
  exportMediaPresets: (filePath?: string) => Promise<{ count: number; filePath?: string } | null>;
  importMediaPresets: (options?: { filePath?: string; mergeById?: boolean }) => Promise<{
    added: number;
    replaced: number;
    total: number;
  } | null>;
}

const getMediaPresetsApi = () => window.mediaPresets;

const sortPresets = (items: MediaPreset[]): MediaPreset[] =>
  [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

export const createMediaPresetsSlice = <
  T extends MediaPresetsSlice & { actions: MediaPresetsActions }
>(
  set: StateCreator<T>["setState"],
  get: () => T
) => {
  const setState = (partial: Partial<MediaPresetsSlice>) => {
    set(partial as Partial<T>);
  };

  const getState = (): MediaPresetsSlice & { actions: MediaPresetsActions } => {
    return get() as unknown as MediaPresetsSlice & { actions: MediaPresetsActions };
  };

  const fetchMediaPresets = async () => {
    const api = getMediaPresetsApi();
    if (!api?.list) {
      setState({
        mediaPresetsLoading: false,
        mediaPresetsError: "Media presets API unavailable"
      });
      return;
    }
    setState({ mediaPresetsLoading: true, mediaPresetsError: null });
    try {
      const response = await api.list();
      if (!response || response.ok === false) {
        setState({
          mediaPresetsLoading: false,
          mediaPresetsError: response?.error || "Failed to load media presets"
        });
        return;
      }
      const sorted = sortPresets(response.presets || []);
      set((state) => ({
        mediaPresets: sorted,
        mediaPresetsLoading: false,
        mediaPresetsError: null
      }) as Partial<T>);
    } catch (error) {
      setState({
        mediaPresetsLoading: false,
        mediaPresetsError: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const persistPresets = async (presets: MediaPreset[]): Promise<boolean> => {
    const api = getMediaPresetsApi();
    if (!api?.save) {
      setState({ mediaPresetsError: "Media presets API unavailable" });
      return false;
    }
    try {
      const response = await api.save(presets);
      if (!response || response.ok === false) {
        setState({ mediaPresetsError: response?.error || "Failed to save media presets" });
        return false;
      }
      const sorted = sortPresets(response.presets || presets);
      set({
        mediaPresets: sorted,
        mediaPresetsError: null
      } as Partial<T>);
      return true;
    } catch (error) {
      setState({ mediaPresetsError: error instanceof Error ? error.message : String(error) });
      return false;
    }
  };

  const saveMediaPresets = async (presets: MediaPreset[]): Promise<boolean> => {
    return persistPresets(presets);
  };

  const upsertMediaPreset = async (preset: MediaPreset): Promise<boolean> => {
    const current = getState().mediaPresets;
    const next = [...current];
    const index = next.findIndex((item) => item.id === preset.id);
    if (index >= 0) {
      next[index] = preset;
    } else {
      next.push(preset);
    }
    return persistPresets(next);
  };

  const removeMediaPreset = async (id: string): Promise<boolean> => {
    const current = getState().mediaPresets;
    const filtered = current.filter((preset) => preset.id !== id);
    return persistPresets(filtered);
  };

  const exportMediaPresets = async (
    filePath?: string
  ): Promise<{ count: number; filePath?: string } | null> => {
    const api = getMediaPresetsApi();
    if (!api?.export) {
      setState({ mediaPresetsError: "Media presets API unavailable" });
      return null;
    }
    try {
      const response = await api.export(filePath);
      if (!response || response.ok === false) {
        setState({ mediaPresetsError: response?.error || "Failed to export media presets" });
        return null;
      }
      return { count: response.count ?? 0, filePath: response.filePath };
    } catch (error) {
      setState({ mediaPresetsError: error instanceof Error ? error.message : String(error) });
      return null;
    }
  };

  const importMediaPresets = async (options?: {
    filePath?: string;
    mergeById?: boolean;
  }): Promise<{ added: number; replaced: number; total: number } | null> => {
    const api = getMediaPresetsApi();
    if (!api?.import) {
      setState({ mediaPresetsError: "Media presets API unavailable" });
      return null;
    }
    try {
      const response = await api.import(options);
      if (!response || response.ok === false) {
        setState({ mediaPresetsError: response?.error || "Failed to import media presets" });
        return null;
      }
      await fetchMediaPresets();
      return {
        added: response.added ?? 0,
        replaced: response.replaced ?? 0,
        total: response.total ?? 0
      };
    } catch (error) {
      setState({ mediaPresetsError: error instanceof Error ? error.message : String(error) });
      return null;
    }
  };

  return {
    state: {
      mediaPresets: [],
      mediaPresetsLoading: false,
      mediaPresetsError: null
    } as MediaPresetsSlice,
    actions: {
      fetchMediaPresets,
      saveMediaPresets,
      upsertMediaPreset,
      removeMediaPreset,
      exportMediaPresets,
      importMediaPresets
    } as MediaPresetsActions
  };
};
