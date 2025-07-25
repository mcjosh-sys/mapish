import type { UUID } from "../../types";
import { toPromise } from "../../utils";
import { User, type UserJSON, type UserProperties } from "../entities/user";
import { boundaryRepository } from "./boundary-repository";

export class UserRepository {
  private users: Map<string, User> = new Map();
  private static instance: UserRepository | null = null;

  constructor() {
    this.loadUsers();
  }

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async createUser(userData: Pick<UserProperties, "name" | "email">) {
    const user = new User(this.generateId(), userData.name, userData.email);
    return toPromise(this.saveUser(user).toJSON());
  }

  async getUserById(id: string) {
    return toPromise(this.users.get(id)?.toJSON());
  }

  async updateUser(id: string, updatedData: Partial<UserProperties>) {
    const userData = await this.getUserById(id);
    if (userData) {
      const user = User.fromProperties(userData);
      if (updatedData.name) user.setName(updatedData.name);
      if (updatedData.email) user.setEmail(updatedData.email);
      if (updatedData.boundry_ids?.length) {
        user.setBoundryIds(updatedData.boundry_ids);
      }
      return toPromise(this.saveUser(user).toJSON());
    }
    throw new Error(`User with ID ${id} does not exist.`);
  }

  async assignBoundaryToUser(userId: string, boundaryId: string) {
    const userData = await this.getUserById(userId);
    if (userData) {
      const user = User.fromProperties(userData);
      const boundary = await boundaryRepository.getBoundaryById(boundaryId);
      if (boundary) {
        if (!user.hasBoundary(boundaryId)) {
          try {
            boundary.user_ids.push(userId);
            await boundaryRepository.updateBoundary(boundaryId, boundary);
            user.addBoundary(boundaryId);
          } catch (error) {
            throw error;
          }
        }
        return toPromise(this.saveUser(user).toJSON());
      }
      throw new Error(`Boundary with ID ${boundaryId} does not exist.`);
    }
    throw new Error(`User with ID ${userId} does not exist.`);
  }

  async removeBoundaryFromUser(userId: string, boundaryId: string) {
    const userData = await this.getUserById(userId);
    if (userData) {
      const user = User.fromProperties(userData);
      const boundary = await boundaryRepository.getBoundaryById(boundaryId);
      if (!boundary) {
        throw new Error(`Boundary with ID ${boundaryId} does not exist.`);
      }
      if (user.hasBoundary(boundaryId)) {
        await boundaryRepository.removeUserFromBoundary(boundaryId, userId);
        user.removeBoundary(boundaryId);
        return toPromise(this.saveUser(user).toJSON());
      }
    }
    throw new Error(
      `User with ID ${userId} does not have boundary ${boundaryId}.`
    );
  }

  async getAllUsers() {
    return toPromise(
      Array.from(this.users.values()).map((user) => user.toJSON())
    );
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    if (user) {
      this.users.delete(id);
      this.persisUsers();
      return toPromise(true);
    }
    return toPromise(false);
  }

  async getUserBoundaries(userId: string) {
    const user = await this.getUserById(userId);
    if (user) {
      const boundaryIds = user.boundry_ids;
      const boundaries = await Promise.all(
        boundaryIds.map((id) => boundaryRepository.getBoundaryById(id))
      );
      return toPromise(boundaries.filter((b) => b !== null));
    }
    throw new Error(`User with ID ${userId} does not exist.`);
  }

  private generateId(): UUID {
    return crypto.randomUUID();
  }

  private saveUser(user: User): User {
    this.users.set(user.getId(), user);
    this.persisUsers();
    return user;
  }

  private persisUsers() {
    localStorage.setItem(
      "users",
      JSON.stringify(Array.from(this.users.values()))
    );
  }

  private loadUsers() {
    const data = localStorage.getItem("users");
    if (data) {
      this.users.clear();
      const json = JSON.parse(data);
      if (Array.isArray(json) && json.length) {
        return JSON.parse(data).map((userData: UserJSON) => {
          this.users.set(userData.id, User.fromJSON(userData));
        });
      }
    }
    return this.generateRandomUsers();
  }

  private generateRandomUsers() {
    this.users.clear();

    const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones"];
    const randomEmails = [
      "alice@example.com",
      "bob@example.com",
      "charlie@example.com",
      "diana@example.com",
      "eve@example.com",
    ];

    for (let i = 0; i < firstNames.length; i++) {
      const fullName = `${firstNames[i]} ${lastNames[i]}`;
      const user = new User(this.generateId(), fullName, randomEmails[i]);
      this.users.set(user.getId(), user);
    }

    this.persisUsers();
  }
}

export const userRepository = UserRepository.getInstance();
