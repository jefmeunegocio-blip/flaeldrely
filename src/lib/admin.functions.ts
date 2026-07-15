import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const saveContactSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({
      contact: z.object({
        phone: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
        address: z.string().nullable().optional(),
        whatsapp: z.string().nullable().optional(),
        instagram: z.string().nullable().optional(),
        facebook: z.string().nullable().optional(),
        linkedin: z.string().nullable().optional(),
        hours: z.string().nullable().optional(),
      }),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: roles, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (roleErr) throw new Error(roleErr.message);
    const isAdmin = !!roles?.some((r) => r.role === "admin");
    if (!isAdmin) throw new Error("Apenas administradores podem editar as configurações do site.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: currentSettings, error: selectError } = await supabaseAdmin
      .from("site_settings")
      .select("content")
      .eq("id", 1)
      .maybeSingle();
    if (selectError) throw new Error(selectError.message);

    const existingContent = (currentSettings?.content as Record<string, unknown> | null) ?? {};
    const contentPayload = {
      ...(existingContent as Record<string, unknown>),
      contact: {
        ...(((existingContent as Record<string, unknown>).contact as Record<string, string | null> | undefined) ?? {}),
        ...data.contact,
      },
    };

    const { error: saveError } = await supabaseAdmin
      .from("site_settings")
      .upsert({ id: 1, content: contentPayload, updated_at: new Date().toISOString() }, { onConflict: "id" });

    if (saveError) throw new Error(saveError.message);

    return { ok: true };
  });

export const grantAdminByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ email: z.string().email() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    // Verify caller is admin
    const { data: roles, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (roleErr) throw new Error(roleErr.message);
    const isAdmin = !!roles?.some((r) => r.role === "admin");
    if (!isAdmin) throw new Error("Apenas administradores podem conceder acesso.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Find user by email by paginating listUsers
    const target = data.email.toLowerCase().trim();
    let foundId: string | null = null;
    for (let page = 1; page <= 20 && !foundId; page++) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 200,
      });
      if (error) throw new Error(error.message);
      const u = list.users.find((x) => (x.email ?? "").toLowerCase() === target);
      if (u) foundId = u.id;
      if (list.users.length < 200) break;
    }
    if (!foundId) {
      throw new Error("Usuário não encontrado. Peça para ele criar uma conta primeiro.");
    }

    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: foundId, role: "admin" });
    if (insErr && !insErr.message.toLowerCase().includes("duplicate")) {
      throw new Error(insErr.message);
    }
    return { ok: true, email: target };
  });
