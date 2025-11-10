const { getDefaultConfig } = require('expo/metro-config');
const { withMonicon } = require('@monicon/metro');

const config = getDefaultConfig(__dirname);
const configWithMonicon = withMonicon(config, {
  icons: [
    'mdi:home-outline',          // Home tab
    'mdi:refresh',               // Transactions tab (refresh for history)
    'mdi:help-circle-outline',   // Customer Service tab
    'mdi:whatsapp',              // WhatsApp contact
    'mdi:phone-outline',         // Call contact
    'mdi:email-outline',         // E-mail contact
    'mdi:message-text-outline'   // SMS contact
  ],
  collections: ['mdi']  // Loads all Material Design icons (or remove to keep bundle small)
});

module.exports = configWithMonicon;