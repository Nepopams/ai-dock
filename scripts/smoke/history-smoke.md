# Cross-History Smoke Test

## Preconditions
- Electron app builds and starts in development mode.
- At least one web client tab (e.g., ChatGPT) is configured and reachable.

## Steps
1. **Ingest Last Message**
   - Open a supported client tab (ChatGPT/Claude/DeepSeek) and generate a reply.
   - Switch to **History** tab in VR AI Dock.
   - In the Import panel, pick the active tab and press **Import latest**.
   - Verify new thread appears with the imported assistant reply.

2. **Import Into Existing Thread**
   - Select the thread created in step 1.
   - Trigger **Import latest** again after producing another reply in the same client.
   - Confirm the new message is appended to the selected thread.

3. **Open In Source**
   - For any history message, press **Open in source**.
   - Ensure the corresponding browser tab becomes focused (or fallback link opens).

4. **Continue In Chat**
   - For an imported message press **Continue in chat**.
   - Verify the chat view is focused and the input contains a quoted copy of the message.

5. **Search & Filters**
   - Use search fields (text, agent, role) to locate the imported messages.
   - Confirm search results update without errors.

6. **Error Handling**
   - Close all compatible tabs and attempt **Import latest**.
   - Observe toast notification indicating no compatible tab is available.

7. **Persistence**
   - Restart the Electron app.
   - Open History tab and ensure previously imported threads and messages remain.

## Cleanup
- Remove temporary test threads in History view if necessary.***
