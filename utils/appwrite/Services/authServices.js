// src/appwrite/Services/authServices.js

import { account, teams } from "../config";
import { Query } from "appwrite";

export async function registerUser(username, email, password) {
  const user = await account.create("unique()", email, password, username);
  localStorage.setItem("authToken", user.$id);
  return user;
}

/**
 * Signs in a user and retrieves their roles.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The session object along with user and roles information.
 */
export const signIn = async (email, password) => {
  try {
    // Delete existing session if any
    try {
      const currentSession = await account.getSession('current');
      if (currentSession) {
        await account.deleteSession('current');
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
      }
    } catch (error) {
      // No existing session
    }

    // Authenticate the user
    const session = await account.createEmailPasswordSession(email, password);
    localStorage.setItem("authToken", session.$id);
    localStorage.setItem("userId", session.userId);

    // Get user roles
    const userRoles = await getUserRoles(session.userId);
    console.log('Roles assigned to user:', userRoles); // Debugging statement

    if (!userRoles || userRoles.length === 0) {
      // Delete session if no roles assigned
      await account.deleteSession(session.$id);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      throw new Error("User has no roles assigned.");
    }

    // Store user roles
    localStorage.setItem("userRoles", JSON.stringify(userRoles));

    return {
      session,
      userId: session.userId,
      roles: userRoles,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await account.deleteSession('current');
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRoles");
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    await account.get();
    return true;
  } catch (error) {
    return false;
  }
};

export const sendPasswordRecoveryEmail = async (email) => {
  const resetPasswordUrl = `${window.location.origin}/reset-password`;
  try {
    await account.createRecovery(email, resetPasswordUrl);
  } catch (error) {
    throw error;
  }
};