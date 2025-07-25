import type { UUID } from "../../types";

export interface UserProperties {
  id: UUID;
  name: string;
  email: string;
  boundry_ids: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserJSON {
  id: UUID;
  name: string;
  email: string;
  boundry_ids: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export class User {
  private id: UUID;
  private name: string;
  private email: string;
  private boundry_ids: string[];
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: UUID,
    name: string,
    email: string,
    boundry_ids: string[] = [],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.boundry_ids = boundry_ids;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromProperties(properties: UserProperties): User {
    return new User(
      properties.id,
      properties.name,
      properties.email,
      properties.boundry_ids,
      properties.createdAt,
      properties.updatedAt
    );
  }

  static fromJSON(json: UserJSON): User {
    return new User(
      json.id,
      json.name,
      json.email,
      json.boundry_ids,
      new Date(json.createdAt),
      new Date(json.updatedAt)
    );
  }

  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getEmail() {
    return this.email;
  }
  getBoundryIds() {
    return this.boundry_ids;
  }
  getCreatedAt() {
    return this.createdAt;
  }
  getUpdatedAt() {
    return this.updatedAt;
  }

  setName(name: string) {
    this.name = name;
    this.updatedAt = new Date();
  }
  setEmail(email: string) {
    this.email = email;
    this.updatedAt = new Date();
  }
  setBoundryIds(boundry_ids: string[]) {
    this.boundry_ids = boundry_ids;
    this.updatedAt = new Date();
  }

  hasBoundary(boundaryId: string): boolean {
    return this.boundry_ids.includes(boundaryId);
  }

  addBoundary(boundaryId: string) {
    if (!this.hasBoundary(boundaryId)) {
      this.boundry_ids.push(boundaryId);
      this.updatedAt = new Date();
    }
  }

  removeBoundary(boundaryId: string) {
    if (this.hasBoundary(boundaryId)) {
      this.boundry_ids = this.boundry_ids.filter((id) => id !== boundaryId);
      this.updatedAt = new Date();
    }
  }

  toJSON(): UserProperties {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      boundry_ids: this.boundry_ids,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
