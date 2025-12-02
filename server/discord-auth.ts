import { storage } from "./storage";
import type { User } from "@shared/schema";

let connectionSettings: any;

async function getDiscordConnectionSettings() {
  if (
    connectionSettings &&
    connectionSettings.settings.expires_at &&
    new Date(connectionSettings.settings.expires_at).getTime() > Date.now()
  ) {
    return connectionSettings;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken || !hostname) {
    throw new Error("Replit environment not configured for Discord auth");
  }

  const response = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=discord`,
    {
      headers: {
        Accept: "application/json",
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  );

  const data = await response.json();
  connectionSettings = data.items?.[0];

  if (!connectionSettings) {
    throw new Error("Discord connection not configured");
  }

  return connectionSettings;
}

export async function getDiscordAccessToken(): Promise<string> {
  const settings = await getDiscordConnectionSettings();
  const accessToken =
    settings?.settings?.access_token ||
    settings?.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error("Discord access token not found");
  }

  return accessToken;
}

export async function getDiscordUser(): Promise<{
  id: string;
  username: string;
  avatar: string | null;
  email?: string;
}> {
  const accessToken = await getDiscordAccessToken();

  const response = await fetch("https://discord.com/api/v10/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Discord user: ${response.status}`);
  }

  const discordUser = await response.json();

  return {
    id: discordUser.id,
    username: discordUser.username || discordUser.global_name || "Unknown",
    avatar: discordUser.avatar,
    email: discordUser.email,
  };
}

export async function authenticateWithDiscord(): Promise<User> {
  const discordUser = await getDiscordUser();

  let user = await storage.getUserByDiscordId(discordUser.id);

  if (user) {
    user = await storage.updateUser(user.id, {
      username: discordUser.username,
      avatar: discordUser.avatar || undefined,
    });
    return user!;
  }

  user = await storage.createUser({
    discordId: discordUser.id,
    username: discordUser.username,
    avatar: discordUser.avatar || undefined,
    role: "user",
  });

  return user;
}
