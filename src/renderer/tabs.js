export function renderTabs(tabs, { container, onSelect, onClose }) {
  container.innerHTML = "";
  if (!tabs.length) {
    const empty = document.createElement("span");
    empty.className = "tab-empty";
    empty.textContent = "No tabs yet";
    container.appendChild(empty);
    return;
  }

  tabs.forEach((tab) => {
    const node = document.createElement("div");
    node.className = `tab${tab.isActive ? " active" : ""}`;
    node.dataset.id = tab.id;

    const label = document.createElement("span");
    label.textContent = tab.title;
    node.appendChild(label);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.textContent = "\u00d7";
    closeBtn.addEventListener("click", async (event) => {
      event.stopPropagation();
      if (onClose) {
        await onClose(tab.id);
      }
    });
    node.appendChild(closeBtn);

    node.addEventListener("click", async () => {
      if (onSelect) {
        await onSelect(tab.id);
      }
    });
    container.appendChild(node);
  });
}
