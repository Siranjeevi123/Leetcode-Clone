export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
  timestamp: number;
}

interface ChatCacheEntry {
  messages: ChatMessage[];
  timestamp: number;
}

const CACHE_PREFIX = "ai-chat-";
const MAX_MESSAGES = 50;
const EXPIRY_MS = 15 * 60 * 1000;

function cacheKey(problemId: string) {
  return `${CACHE_PREFIX}${problemId}`;
}

function loadEntry(problemId: string): ChatCacheEntry | null {
  try {
    const raw = localStorage.getItem(cacheKey(problemId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ChatCacheEntry;
    if (!parsed.messages?.length) return null;
    if (Date.now() - parsed.timestamp > EXPIRY_MS) {
      localStorage.removeItem(cacheKey(problemId));
      return null;
    }

    const messages = parsed.messages.filter((m) => Date.now() - m.timestamp <= EXPIRY_MS);
    if (!messages.length) {
      localStorage.removeItem(cacheKey(problemId));
      return null;
    }

    return { messages, timestamp: parsed.timestamp };
  } catch {
    return null;
  }
}

function saveEntry(problemId: string, entry: ChatCacheEntry) {
  localStorage.setItem(cacheKey(problemId), JSON.stringify(entry));
}

function trimMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.slice(-MAX_MESSAGES);
}

export function getChatMessages(problemId: string): ChatMessage[] {
  return loadEntry(problemId)?.messages ?? [];
}

export function appendChatMessage(problemId: string, message: ChatMessage) {
  const existing = loadEntry(problemId)?.messages ?? [];
  const messages = trimMessages([...existing, message]);
  saveEntry(problemId, { messages, timestamp: Date.now() });
}

export function setChatMessages(problemId: string, messages: ChatMessage[]) {
  saveEntry(problemId, {
    messages: trimMessages(messages),
    timestamp: Date.now(),
  });
}

export function clearChat(problemId: string) {
  localStorage.removeItem(cacheKey(problemId));
}

export function clearAllAiChats() {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export function createMessage(role: ChatMessage["role"], message: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    message,
    timestamp: Date.now(),
  };
}
