import { useCallback, useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

// Tables are synced generically, so queries go through an untyped view of the client.
/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as unknown as {
  from: (table: string) => any;
};
import type { Automation, Connector, Skill, Thread } from "./kernel-store";

/**
 * Cloud sync: when someone is signed in, their threads, connectors, skills and
 * automations are mirrored to the Kernel backend so the same workspace shows up
 * in the browser and in the desktop app. Signed out, everything stays local.
 */

export type Account = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
};

export function useAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    const map = (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null) =>
      user
        ? {
            id: user.id,
            email: user.email ?? null,
            name: (user.user_metadata?.["full_name"] as string) ?? null,
            avatar: (user.user_metadata?.["avatar_url"] as string) ?? null,
          }
        : null;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setAccount(map(data.session?.user ?? null));
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccount(map(session?.user ?? null));
      setReady(true);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { account, ready, signOut };
}

type Row = Record<string, unknown>;

const MAPPERS = {
  threads: {
    table: "threads" as const,
    toRow: (t: Thread) => ({ id: t.id, title: t.title, model: t.model, messages: t.messages }),
    fromRow: (r: Row): Thread => ({
      id: String(r["id"]),
      title: String(r["title"] ?? "Session"),
      model: String(r["model"] ?? ""),
      messages: (r["messages"] as Thread["messages"]) ?? [],
      createdAt: new Date(String(r["created_at"] ?? Date.now())).getTime(),
    }),
  },
  connectors: {
    table: "connectors" as const,
    toRow: (c: Connector) => ({
      id: c.id,
      name: c.name,
      kind: c.kind,
      base_url: c.baseUrl,
      header_name: c.headerName,
      credential: c.credential,
      enabled: c.enabled,
      mcp_tool_count: c.mcpToolCount ?? null,
    }),
    fromRow: (r: Row): Connector => ({
      id: String(r["id"]),
      name: String(r["name"] ?? ""),
      kind: (r["kind"] as Connector["kind"]) ?? "api",
      baseUrl: String(r["base_url"] ?? ""),
      headerName: String(r["header_name"] ?? "Authorization"),
      credential: String(r["credential"] ?? ""),
      enabled: Boolean(r["enabled"]),
      ...(r["mcp_tool_count"] == null ? {} : { mcpToolCount: Number(r["mcp_tool_count"]) }),
    }),
  },
  skills: {
    table: "skills" as const,
    toRow: (s: Skill) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      instructions: s.instructions,
      permissions: s.permissions,
      active: s.active,
    }),
    fromRow: (r: Row): Skill => ({
      id: String(r["id"]),
      name: String(r["name"] ?? ""),
      description: String(r["description"] ?? ""),
      instructions: String(r["instructions"] ?? ""),
      permissions: (r["permissions"] as string[]) ?? [],
      active: Boolean(r["active"]),
    }),
  },
  automations: {
    table: "automations" as const,
    toRow: (a: Automation) => ({
      id: a.id,
      name: a.name,
      trigger: a.trigger,
      connector_id: a.connectorId,
      action: a.action,
      enabled: a.enabled,
    }),
    fromRow: (r: Row): Automation => ({
      id: String(r["id"]),
      name: String(r["name"] ?? ""),
      trigger: String(r["trigger"] ?? ""),
      connectorId: String(r["connector_id"] ?? ""),
      action: String(r["action"] ?? ""),
      enabled: Boolean(r["enabled"]),
    }),
  },
};

export type SyncKind = keyof typeof MAPPERS;

/**
 * Two-way sync for one collection. On sign-in it merges what's on this device
 * with what's in the cloud (cloud wins on conflicts), then pushes every local
 * change back up.
 */
export function useCloudCollection<T extends { id: string }>(
  kind: SyncKind,
  local: T[],
  setLocal: (next: T[] | ((prev: T[]) => T[])) => void,
  localReady: boolean,
) {
  const { account, ready } = useAccount();
  const mapper = MAPPERS[kind] as unknown as {
    table: string;
    toRow: (item: T) => Row;
    fromRow: (row: Row) => T;
  };
  const merged = useRef<string | null>(null);
  const [status, setStatus] = useState<"local" | "syncing" | "synced" | "error">("local");

  // Pull + merge once per signed-in account.
  useEffect(() => {
    if (!ready || !localReady || !account) return;
    if (merged.current === account.id) return;
    merged.current = account.id;
    let alive = true;
    setStatus("syncing");

    (async () => {
      const { data, error } = await db.from(mapper.table).select("*");
      if (!alive) return;
      if (error) {
        setStatus("error");
        return;
      }
      const remote = ((data ?? []) as Row[]).map((row) => mapper.fromRow(row));
      const remoteIds = new Set(remote.map((r: T) => r.id));
      const localOnly = local.filter((item) => !remoteIds.has(item.id));

      setLocal([...remote, ...localOnly] as T[]);

      if (localOnly.length) {
        await db
          .from(mapper.table)
          .upsert(localOnly.map((item) => ({ ...mapper.toRow(item), user_id: account.id })));
      }
      setStatus("synced");
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.id, ready, localReady]);

  // Push local changes up (debounced).
  useEffect(() => {
    if (!account || merged.current !== account.id || !localReady) return;
    const timer = window.setTimeout(() => {
      if (!local.length) return;
      void db
        .from(mapper.table)
        .upsert(local.map((item) => ({ ...mapper.toRow(item), user_id: account.id })))
        .then(({ error }: { error: unknown }) => setStatus(error ? "error" : "synced"));
    }, 900);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, account?.id, localReady]);

  const removeRemote = useCallback(
    async (id: string) => {
      if (!account) return;
      await db.from(mapper.table).delete().eq("id", id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account?.id, mapper.table],
  );

  return { status: account ? status : ("local" as const), signedIn: Boolean(account), removeRemote };
}
