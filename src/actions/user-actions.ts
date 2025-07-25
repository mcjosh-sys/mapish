import { userRepository } from "../db/repositories/user-repository";

export async function getUsers() {
  const users = await userRepository.getAllUsers();
  return users;
}

export async function getUserById(id: string) {
  const user = await userRepository.getUserById(id);
  if (!user) {
    console.error(`User with ID ${id} not found.`);
    return null;
  }
  return user;
}

export async function createUser(userData: { name: string; email: string }) {
  const user = await userRepository.createUser(userData);
  return user;
}

export async function updateUser(
  id: string,
  updatedData: Partial<{ name: string; email: string }>
) {
  try {
    return await userRepository.updateUser(id, updatedData);
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
  }
}

export async function assignBoundaryToUser(userId: string, boundaryId: string) {
  try {
    return await userRepository.assignBoundaryToUser(userId, boundaryId);
  } catch (error) {
    console.error(
      `Error assigning boundary ${boundaryId} to user ${userId}:`,
      error
    );
  }
}

export async function deleteUser(id: string) {
  if (await userRepository.getUserById(id)) {
    await userRepository.deleteUser(id);
    return true;
  }
  console.error(`User with ID ${id} not found.`);
  return false;
}

export async function getUserBoundaries(userId: string) {
  try {
    return await userRepository.getUserBoundaries(userId);
  } catch (error) {
    console.error(`Error fetching boundaries for user ${userId}:`, error);
    return [];
  }
}
