import {
  Boundary,
  type BoundaryJSON,
  type BoundaryProperties,
} from "../entities/boundary";
import { userRepository } from "./user-repository";

class BoundaryRepository {
  private static instance: BoundaryRepository | null = null;
  private boundaries: Map<string, Boundary> = new Map();

  constructor() {
    this.loadBoundaries();
  }

  static getInstance(): BoundaryRepository {
    if (!BoundaryRepository.instance) {
      BoundaryRepository.instance = new BoundaryRepository();
    }
    return BoundaryRepository.instance;
  }

  async createBoundary(
    boundaryData: Pick<BoundaryProperties, "name" | "geometry" | "properties">
  ) {
    const boundary = new Boundary(
      this.generateId(),
      boundaryData.name,
      boundaryData.geometry,
      boundaryData.properties
    );
    return this.saveBoundary(boundary).toJSON();
  }

  async getBoundaryById(id: string) {
    return this.boundaries.get(id)?.toJSON() ?? null;
  }

  async updateBoundary(id: string, updatedData: Partial<BoundaryProperties>) {
    const boundaryData = await this.getBoundaryById(id);
    if (boundaryData) {
      const boundary = Boundary.fromProperties(boundaryData);
      if (updatedData.name) boundary.setName(updatedData.name);
      if (updatedData.geometry) boundary.setGeometry(updatedData.geometry);
      if (updatedData.properties)
        boundary.setProperties(updatedData.properties);
      if (updatedData.user_ids?.length) {
        boundary.setUserIds(updatedData.user_ids);
      }
      return this.saveBoundary(boundary).toJSON();
    }
    throw new Error(`Boundary with ID ${id} does not exist.`);
  }

  async getAllBoundaries() {
    return Array.from(this.boundaries.values()).map((boundary) =>
      boundary.toJSON()
    );
  }

  async deleteBoundary(id: string) {
    const boundary = await this.getBoundaryById(id);
    if (boundary) {
      this.boundaries.delete(id);
      this.persisBoundaries();
      return true;
    }
    return false;
  }

  async assignBoundaryToUser(boundaryId: string, userId: string) {
    const boundary = await this.getBoundaryById(boundaryId);
    if (boundary) {
      const updatedBoundary = Boundary.fromProperties(boundary);
      if (!updatedBoundary.hasUser(userId)) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
          throw new Error(`User with ID ${userId} does not exist.`);
        }
        user.boundry_ids.push(boundaryId);
        await userRepository.updateUser(userId, user);
        updatedBoundary.addUser(userId);
        return this.saveBoundary(updatedBoundary).toJSON();
      }
      return boundary;
    }
    throw new Error(`Boundary with ID ${boundaryId} does not exist.`);
  }

  async removeUserFromBoundary(boundaryId: string, userId: string) {
    const boundary = await this.getBoundaryById(boundaryId);
    if (boundary) {
      const updatedBoundary = Boundary.fromProperties(boundary);
      if (updatedBoundary.hasUser(userId)) {
        await userRepository.removeBoundaryFromUser(userId, boundaryId);
        updatedBoundary.removeUser(userId);
        return this.saveBoundary(updatedBoundary).toJSON();
      }
      throw new Error(
        `User with ID ${userId} is not assigned to boundary ${boundaryId}.`
      );
    }
    throw new Error(`Boundary with ID ${boundaryId} does not exist.`);
  }

  async getBoundaryUsers(boundaryId: string) {
    const boundary = await this.getBoundaryById(boundaryId);
    if (boundary) {
      return Promise.all(
        boundary.user_ids
          .map(async (userId) => {
            const user = await userRepository.getUserById(userId);
            return user ? user : null;
          })
          .filter((user) => user !== null)
      );
    }
    throw new Error(`Boundary with ID ${boundaryId} does not exist.`);
  }

  private generateId(): string {
    const bytesArray = new Uint8Array(16);
    const randomValues = crypto.getRandomValues(bytesArray);
    return Array.from(randomValues)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  private saveBoundary(boundary: Boundary): Boundary {
    this.boundaries.set(boundary.getId(), boundary);
    this.persisBoundaries();
    return boundary;
  }

  private persisBoundaries() {
    localStorage.setItem(
      "boundaries",
      JSON.stringify(Array.from(this.boundaries.values()))
    );
  }

  private loadBoundaries() {
    const data = localStorage.getItem("boundaries");
    if (data) {
      this.boundaries.clear();
      const boundariesArray = JSON.parse(data);
      boundariesArray.forEach((json: BoundaryJSON) => {
        this.boundaries.set(json.id, Boundary.fromJSON(json));
      });
    }
  }
}

export const boundaryRepository = BoundaryRepository.getInstance();
