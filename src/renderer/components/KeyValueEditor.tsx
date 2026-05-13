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

  const rootClassName = ["key-value-editor", readOnly ? "key-value-editor--readonly" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <div className="key-value-editor-header">
        <span>Name</span>
        <span>Value</span>
        <span className="key-value-editor-actions">
          {!readOnly && (
            <button
              type="button"
              onClick={handleAdd}
              className="key-value-editor-add"
            >
              {addLabel}
            </button>
          )}
        </span>
      </div>
      <div className="key-value-editor-rows">
        {items.map((item) => {
          const keyEmpty = !allowEmptyKey && item.key.trim().length === 0;
          return (
            <div
              key={item.id}
              className="key-value-editor-row"
            >
              <input
                type="text"
                value={item.key}
                disabled={readOnly}
                onChange={(event) => handleUpdate(item.id, "key", event.target.value)}
                className={`key-value-editor-input${
                  keyEmpty ? " key-value-editor-input--warning" : ""
                }`}
                placeholder={keyPlaceholder}
              />
              <input
                type="text"
                value={item.value}
                disabled={readOnly}
                onChange={(event) => handleUpdate(item.id, "value", event.target.value)}
                className="key-value-editor-input"
                placeholder={valuePlaceholder}
              />
              <div className="key-value-editor-actions">
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="key-value-editor-remove"
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
            className="key-value-editor-empty-add"
          >
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default KeyValueEditor;
