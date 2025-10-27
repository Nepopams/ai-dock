import { FormEvent, useState } from "react";
import { useDockStore } from "../store/useDockStore";

function PromptDrawer() {
  const drawerOpen = useDockStore((state) => state.drawerOpen);
  const prompts = useDockStore((state) => state.prompts);
  const toggleDrawer = useDockStore((state) => state.actions.toggleDrawer);
  const addPrompt = useDockStore((state) => state.actions.addPrompt);
  const copyPrompt = useDockStore((state) => state.actions.copyPrompt);
  const removePrompt = useDockStore((state) => state.actions.removePrompt);
  const showToast = useDockStore((state) => state.actions.showToast);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      showToast("Введите название и текст промта");
      return;
    }
    await addPrompt({ title: title.trim(), body: body.trim() });
    setTitle("");
    setBody("");
  };

  const renderList = () => {
    if (!prompts.length) {
      return <li className="prompt-empty">Нет сохранённых промтов</li>;
    }
    return prompts.map((prompt) => (
      <li
        key={prompt.id}
        className="prompt-item"
        onClick={async () => {
          await copyPrompt(prompt.body, prompt.title);
        }}
      >
        <div className="prompt-info">
          <strong>{prompt.title}</strong>
          <span className="prompt-updated">
            {prompt.updatedAt ? new Date(prompt.updatedAt).toLocaleString() : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={async (event) => {
            event.stopPropagation();
            await removePrompt(prompt.id);
          }}
          >
            ×
          </button>
      </li>
    ));
  };

  return (
    <section
      id="promptsDrawer"
      className={`drawer${drawerOpen ? " visible" : ""}`}
      aria-hidden={!drawerOpen}
    >
      <div className="drawer-header">
        <h2>Prompts</h2>
        <button
          id="promptsClose"
          aria-label="Close prompts drawer"
          onClick={() => {
            void toggleDrawer(false);
          }}
        >
          &times;
        </button>
      </div>
      <div className="drawer-body">
        <ul id="promptList">{renderList()}</ul>
        <form id="promptForm" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              id="promptTitle"
              type="text"
              placeholder="Quick name"
              maxLength={120}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>
          <label>
            Prompt
            <textarea
              id="promptBody"
              placeholder="Write your prompt..."
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="pill-btn">
              Save Prompt
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default PromptDrawer;
