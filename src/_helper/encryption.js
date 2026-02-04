/**
 * Encryption/Decryption utility for Ticket IDs
 * Uses simple base64 encoding/decoding with a secret key
 * For production, consider using crypto-js or similar library
 */

// Secret key - in production, this should be stored in environment variables
const SECRET_KEY = "ra_admin_ticket_secret_2026";

/**
 * Encrypt ticket ID
 * @param {string} ticketId - The ticket ID to encrypt
 * @returns {string} - Encrypted ticket ID
 */
export const encryptTicketId = (ticketId) => {
  if (!ticketId) return "";
  
  try {
    // Convert to string if not already
    const strId = String(ticketId);
    
    // Simple encryption: combine with key and encode
    const combined = strId + SECRET_KEY;
    const encoded = btoa(combined); // Base64 encode
    
    return encoded;
  } catch (error) {
    console.error("Encryption error:", error);
    return ticketId;
  }
};

/**
 * Decrypt ticket ID
 * @param {string} encryptedId - The encrypted ticket ID
 * @returns {string} - Decrypted ticket ID
 */
export const decryptTicketId = (encryptedId) => {
  if (!encryptedId) return "";
  
  try {
    // Decode from Base64
    const decoded = atob(encryptedId);
    
    // Remove the secret key suffix to get original ID
    if (decoded.endsWith(SECRET_KEY)) {
      const ticketId = decoded.slice(0, -SECRET_KEY.length);
      return ticketId;
    }
    
    return encryptedId; // Return as-is if decryption fails
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedId;
  }
};

/**
 * Encrypt multiple ticket IDs
 * @param {array} ticketIds - Array of ticket IDs
 * @returns {array} - Array of encrypted ticket IDs
 */
export const encryptTicketIds = (ticketIds) => {
  if (!Array.isArray(ticketIds)) return [];
  return ticketIds.map(id => encryptTicketId(id));
};

/**
 * Decrypt multiple ticket IDs
 * @param {array} encryptedIds - Array of encrypted ticket IDs
 * @returns {array} - Array of decrypted ticket IDs
 */
export const decryptTicketIds = (encryptedIds) => {
  if (!Array.isArray(encryptedIds)) return [];
  return encryptedIds.map(id => decryptTicketId(id));
};
