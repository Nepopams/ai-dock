export class PromptsDrawer {
  constructor(options) {
    this.drawerEl = options.drawerEl;
    this.listEl = options.listEl;
    this.formEl = options.formEl;
    this.titleInput = options.titleInput;
    this.bodyInput = options.bodyInput;
    this.onPromptUsed = options.onPromptUsed;
    this.prompts = [];
  }

  async init() {
    this.#bindEvents();
    await this.refresh();
  }

  async refresh() {
    this.prompts = await window.api.prompts.list();
    this.#renderList();
  }

  #bindEvents() {
    this.formEl.addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = this.titleInput.value.trim();
      const body = this.bodyInput.value.trim();
      if (!title || !body) {
        return;
      }
      await window.api.prompts.add({ title, body });
      this.titleInput.value = "";
      this.bodyInput.value = "";
      await this.refresh();
    });
  }

  #renderList() {
    this.listEl.innerHTML = "";
    if (!this.prompts.length) {
      const empty = document.createElement("li");
      empty.className = "prompt-empty";
      empty.textContent = "No prompts yet";
      this.listEl.appendChild(empty);
      return;
    }

    this.prompts.forEach((prompt) => {
      const item = document.createElement("li");
      item.className = "prompt-item";

      const info = document.createElement("div");
      info.className = "prompt-info";

      const title = document.createElement("strong");
      title.textContent = prompt.title;
      info.appendChild(title);

      const updated = document.createElement("span");
      const date = new Date(prompt.updatedAt || prompt.createdAt || Date.now());
      updated.className = "prompt-updated";
      updated.textContent = date.toLocaleString();
      info.appendChild(updated);

      item.appendChild(info);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "\u00d7";
      deleteBtn.title = "Remove prompt";

      deleteBtn.addEventListener("click", async (event) => {
        event.stopPropagation();
        await window.api.prompts.remove(prompt.id);
        await this.refresh();
      });

      item.addEventListener("click", async () => {
        await window.api.clipboard.copy(prompt.body);
        this.onPromptUsed?.(prompt.title);
      });

      item.appendChild(deleteBtn);
      this.listEl.appendChild(item);
    });
  }
}
