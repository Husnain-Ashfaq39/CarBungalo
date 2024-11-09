// Import necessary Appwrite modules
import { Client, Account, Databases, Storage, Teams } from "appwrite";

// Access environment variables for Next.js
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

// Initialize the Appwrite client only on the client side
let client;
  client = new Client()
    .setEndpoint(endpoint) // Set your Appwrite Endpoint
    .setProject(projectID); // Set your project ID


// Export Appwrite services for client-side use
export const account = client ? new Account(client) : null;
export const databases = client ? new Databases(client) : null;
export const storage = client ? new Storage(client) : null;
export const teams = client ? new Teams(client) : null;

export { databaseId, projectID };
