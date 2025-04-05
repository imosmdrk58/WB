export const config = {
  clientId: "123456789012345678",
  websiteUrl: "https://merlin-bot.com",
  supportServer: "https://discord.gg/merlin-support",
  sounds: {
    welcome: "https://cdn.freesound.org/previews/521/521641_4921277-lq.mp3"
  },
  sessionSecret: "merlin-bot-secret-key-change-this",
  version: "1.0.0",
  prefix: "!",
  databaseType: "memory",
  port: 5000
};

export function updateConfig(configData: any): void {
  if (configData.discord) {
    config.clientId = configData.discord.clientId || config.clientId;
    config.prefix = configData.discord.prefix || config.prefix;
  }

  if (configData.website) {
    config.websiteUrl = configData.website.url || config.websiteUrl;
    config.port = configData.website.port || config.port;
    config.sessionSecret = configData.website.sessionSecret || config.sessionSecret;
  }

  if (configData.meta) {
    config.version = configData.meta.version || config.version;
    config.supportServer = configData.meta.supportServer || config.supportServer;
  }

  if (configData.sounds) {
    config.sounds = { ...config.sounds, ...configData.sounds };
  }

  if (configData.database) {
    config.databaseType = configData.database.type || config.databaseType;
  }

  console.log("Yapılandırma güncellendi.");
}