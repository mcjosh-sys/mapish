import type { FeatureProperties, PolygonGeometry } from "../../types/geojson";

export interface BoundaryProperties {
  id: string;
  name: string;
  geometry: PolygonGeometry;
  properties: FeatureProperties;
  user_ids: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BoundaryJSON {
  id: string;
  name: string;
  geometry: PolygonGeometry;
  properties: FeatureProperties;
  user_ids: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export class Boundary {
  private id: string;
  private name: string;
  private geometry: PolygonGeometry;
  private properties: FeatureProperties;
  private user_ids: string[];
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    name: string,
    geometry: PolygonGeometry,
    properties: FeatureProperties,
    user_ids: string[] = [],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.name = name;
    this.geometry = geometry;
    this.properties = properties;
    this.user_ids = user_ids;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromProperties(properties: BoundaryProperties): Boundary {
    return new Boundary(
      properties.id,
      properties.name,
      properties.geometry,
      properties.properties,
      properties.user_ids,
      properties.createdAt,
      properties.updatedAt
    );
  }

  static fromJSON(json: BoundaryJSON): Boundary {
    return new Boundary(
      json.id,
      json.name,
      json.geometry,
      json.properties,
      json.user_ids,
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

  getGeometry() {
    return this.geometry;
  }

  getProperties() {
    return this.properties;
  }

  getUserIds() {
    return this.user_ids;
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

  setGeometry(geometry: PolygonGeometry) {
    this.geometry = geometry;
    this.updatedAt = new Date();
  }

  setProperties(properties: FeatureProperties) {
    this.properties = properties;
    this.updatedAt = new Date();
  }
  setUserIds(user_ids: string[]) {
    this.user_ids = user_ids;
    this.updatedAt = new Date();
  }

  hasUser(userId: string): boolean {
    return this.user_ids.includes(userId);
  }

  addUser(userId: string) {
    if (!this.hasUser(userId)) {
      this.user_ids.push(userId);
      this.updatedAt = new Date();
    }
  }

  removeUser(userId: string) {
    if (this.hasUser(userId)) {
      this.user_ids = this.user_ids.filter((id) => id !== userId);
      this.updatedAt = new Date();
    }
  }

  toJSON(): BoundaryProperties {
    return {
      id: this.id,
      name: this.name,
      geometry: this.geometry,
      properties: this.properties,
      user_ids: this.user_ids,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
