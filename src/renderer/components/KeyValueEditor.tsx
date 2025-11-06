import { useCallback } from "react";

export interface KeyValueItem {
  id: string;
  key: string;
  value: string;
}

export interface KeyValueEditorProps {
  items: KeyValueItem[];
  onChange: (items: KeyValueItem[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
  allowEmptyKey?: boolean;
  readOnly?: boolean;
  className?: string;
}

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `kv-${Math.random().toString(16).slice(2)}`;
};

const KeyValueEditor = ({
  items,
  onChange,
  keyPlaceholder = "name",
  valuePlaceholder = "value",
  addLabel = "Add",
  allowEmptyKey = false,
  readOnly = false,
  className = ""
}: KeyValueEditorProps) => {
  const handleAdd = useCallback(() => {
    if (readOnly) {
      return;
    }
    onChange([
      ...items,
      {
        id: createId(),
        key: "",
        value: ""
      }
    ]);
  }, [items, onChange, readOnly]);

  const handleUpdate = useCallback(
    (id: string, field: "key" | "value", value: string) => {
      if (readOnly) {
        return;
      }
      onChange(
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                [field]: value
              }
            : item
        )
      );
    },
    [items, onChange, readOnly]
  );

  const handleRemove = useCallback(
    (id: string) => {
      if (readOnly) {
        return;
      }
      onChange(items.filter((item) => item.id !== id));
    },
    [items, onChange, readOnly]
  );

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
        <span>Name</span>
        <span>Value</span>
        <span className="text-right">
          {!readOnly && (
            <button
              type="button"
              onClick={handleAdd}
              className="rounded bg-slate-700 px-2 py-1 text-xs font-medium text-slate-100 hover:bg-slate-600"
            >
              {addLabel}
            </button>
          )}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const keyEmpty = !allowEmptyKey && item.key.trim().length === 0;
          return (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_1fr_auto] items-center gap-2"
            >
              <input
                type="text"
                value={item.key}
                disabled={readOnly}
                onChange={(event) => handleUpdate(item.id, "key", event.target.value)}
                className={`rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none ${
                  keyEmpty ? "border-amber-500" : ""
                }`}
                placeholder={keyPlaceholder}
              />
              <input
                type="text"
                value={item.value}
                disabled={readOnly}
                onChange={(event) => handleUpdate(item.id, "value", event.target.value)}
                className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                placeholder={valuePlaceholder}
              />
              <div className="text-right">
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:border-rose-500 hover:text-rose-400"
                    title="Remove row"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {!items.length && !readOnly && (
          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded border border-dashed border-slate-600 px-3 py-2 text-sm text-slate-300 hover:border-slate-400"
          >
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default KeyValueEditor;
