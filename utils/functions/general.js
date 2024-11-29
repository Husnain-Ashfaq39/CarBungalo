import db from "@/utils/appwrite/Services/dbServices"; // Ensure the correct path

import { Query } from "appwrite";

export const addUserToCollection = async (userId, name, email) => {
  try {
    // Use the 'list' method with a query to check if the user already exists
    const existingUsers = await db.Users.list([
      Query.equal("userId", userId), // Query to check if there's a document with the same userId
    ]);

    if (existingUsers.total > 0) {
      console.log("User already exists with the same userId:", existingUsers.documents[0]);
      
    }
    else
    {

        
        // User data to add
        const userData = {
            userId: userId,
            role: "customer",
            name: name,
            email: email,
            // telephone: "", // Omit if not needed
        };
        
        // Use the 'create' method to add the user if no duplicate exists
        const response = await db.Users.create(userData,userId);
        
        console.log("User added to Users collection:", response);
        return response;
    }
  } catch (error) {
    console.error("Error adding user to Users collection:", error);
    throw new Error("Failed to save user data.");
  }
};

  