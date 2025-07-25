export interface PolygonGeometry {
  type: "Polygon";
  coordinates: number[][][];
}

export interface FeatureProperties {
  [name: string]: any;
}

export interface GeoJsonFeature {
  type: "Feature";
  geometry: PolygonGeometry;
  properties: FeatureProperties;
  id: string;
}

export interface TileStatsAttribute {
  attribute: string;
  type: string;
  values: string[];
}

export interface TileStatsLayer {
  layer: string;
  sourceType: string;
  attributes: TileStatsAttribute[];
  attributeCount: number;
  geometry: string[];
}

export interface Metadata {
  tileStats: {
    layers: TileStatsLayer[];
    layerCount: number;
  };
}

export interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
  metadata?: Metadata;
}
