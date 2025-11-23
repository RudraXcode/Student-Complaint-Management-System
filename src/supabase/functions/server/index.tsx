import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { v4 } from "https://deno.land/std@0.201.0/uuid/mod.ts";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-cb3d09a5/health", (c) => {
  return c.json({ status: "ok" });
});

// Password reset endpoint
app.post("/make-server-cb3d09a5/reset-password", async (c) => {
  try {
    const req = await c.req.json();
    const email: string = String(req?.email || "").trim();
    if (!email || !email.includes("@")) {
      return c.json({ ok: false, error: "Invalid email" }, 400);
    }

    // Generate token and expiry (1 hour)
    const token = v4.generate();
    const expiresAt = Date.now() + 1000 * 60 * 60;

    // Store in KV table
    await kv.set(`reset:${token}`, { email, expiresAt });

    // Build reset URL (frontend base can be provided via env)
    const frontendBase = Deno.env.get("FRONTEND_BASE_URL") || "https://example.com";
    const resetUrl = `${frontendBase.replace(/\/$/, "")}/reset-password?token=${token}`;

    // Attempt to send with SendGrid if key provided
    const sendgridKey = Deno.env.get("SENDGRID_API_KEY");
    if (sendgridKey) {
      const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email }], subject: "SCMS: Password reset" }],
          from: { email: Deno.env.get("EMAIL_FROM") || "no-reply@scms.local" },
          content: [{ type: "text/plain", value: `Click to reset your password: ${resetUrl}` }],
        }),
      });

      if (!sgRes.ok) {
        const txt = await sgRes.text();
        return c.json({ ok: false, error: "SendGrid failed", detail: txt }, 502);
      }

      return c.json({ ok: true, message: "Reset email sent" });
    }

    // No provider configured — return token and reset URL so dev can use it
    return c.json({ ok: true, message: "No email provider configured. Use token to reset.", token, resetUrl });
  } catch (err) {
    console.error(err);
    return c.json({ ok: false, error: String(err) }, 500);
  }
});

// Validate token (return associated email if present and not expired)
app.get("/make-server-cb3d09a5/reset/:token", async (c) => {
  try {
    const token = c.req.param('token');
    const data = await kv.get(`reset:${token}`);
    if (!data) return c.json({ ok: false, error: 'Not found' }, 404);
    if (data.expiresAt && Date.now() > data.expiresAt) {
      return c.json({ ok: false, error: 'Token expired' }, 410);
    }
    return c.json({ ok: true, email: data.email });
  } catch (err) {
    console.error(err);
    return c.json({ ok: false, error: String(err) }, 500);
  }
});

// Confirm reset: consume token and return associated email so frontend can update demo users
app.post('/make-server-cb3d09a5/reset/confirm', async (c) => {
  try {
    const req = await c.req.json();
    const token = String(req?.token || '');
    if (!token) return c.json({ ok: false, error: 'Missing token' }, 400);
    const data = await kv.get(`reset:${token}`);
    if (!data) return c.json({ ok: false, error: 'Invalid token' }, 404);
    if (data.expiresAt && Date.now() > data.expiresAt) {
      return c.json({ ok: false, error: 'Token expired' }, 410);
    }

    const email = data.email;
    // Delete token to make it one-time-use
    await kv.del(`reset:${token}`);
    return c.json({ ok: true, email });
  } catch (err) {
    console.error(err);
    return c.json({ ok: false, error: String(err) }, 500);
  }
});

Deno.serve(app.fetch);