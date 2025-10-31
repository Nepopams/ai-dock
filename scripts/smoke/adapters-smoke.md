# Adapters Smoke Test

## Preconditions
- Dev mode running (`npm run dev`)
- BrowserView tabs opened for ChatGPT, Claude, DeepSeek

## Steps

### 1. Health-check base selectors
1. Open **Connections > Adapter Overrides**.
2. Pick each service and click **Health-check**.
   - ? Expect "Adapter ready" when corresponding tab is open.
   - ?? If no tab exists, UI shows a hint to open it first.

### 2. Override selectors
1. For ChatGPT, add a bogus selector (`#missing-input`) to **Input selectors** and Save.
2. Click **Insert + Send** in Prompt Router > ChatGPT tab should fail and status badge reports error.
3. Remove the bogus selector (Clear Overrides > Save) and Insert again > status returns *Ready*.

### 3. Batch insert sanity
1. In Prompt Router pick two tabs (Claude + DeepSeek).
2. Use **Insert** > prompt text appears in both inputs, no send occurs.
3. Use **Insert + Send** > messages are sent and last answer is readable.

### 4. Registry persistence
1. Modify selectors for any service and Save.
2. Restart app (`npm run dev` again) > overrides still visible and health-check passes.

### 5. Error surfacing
1. Temporarily close Claude tab and run Health-check > UI reports "Open a tab for this service" and status card shows error.

Document any deviations before proceeding.
