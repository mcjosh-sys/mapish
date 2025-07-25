import MaplibreDraw from "maplibre-gl-draw";
import { useEffect, useRef, useState } from "react";

import { useData } from "@/contexts/data-context";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import { Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type {
  GeoJsonFeature,
  GeoJsonFeatureCollection,
} from "../types/geojson";
import env from "../utils/validateEnv";
import { CreateBoundaryDialog } from "./CreateBoundaryDialog";

type FilterByType<T, TypeValue> = T extends { type: TypeValue } ? T : never;

type DrawingMapProps = {
  readonly?: boolean;
};

const DrawingMap = ({ readonly = false }: DrawingMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>(null);
  const drawRef = useRef<MaplibreDraw>(null);
  const lagosBoundsRef = useRef<FilterByType<
    turf.AllGeoJSON,
    "Feature"
  > | null>(null);

  const { boundaries } = useData();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const lagosBounds = [
      [2.7, 6.2],
      [4.4, 6.9],
    ];
    const map = new Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${env.VITE_MAPTILER_KEY}`,
      center: [3.6, 6.5],
      zoom: 10,
      maxBounds: lagosBounds as any,
    });
    mapRef.current = map;
    map.addControl(new NavigationControl(), "top-right");
    const draw = new MaplibreDraw({
      displayControlsDefault: false,
      controls: {
        polygon: !readonly,
        trash: !readonly,
      },
    });
    drawRef.current = draw;
    map.addControl(draw as any);
    !readonly && draw.changeMode("draw_polygon");
    map.on("draw.create", () => handleDraw(draw));
    map.on("draw.update", () => handleDraw(draw));

    map.on("load", async () => {
      const res = await fetch(
        `https://api.maptiler.com/data/01983d40-bce0-7585-9aea-e4257d22518e/features.json?key=${env.VITE_MAPTILER_KEY}`
      );
      const geojson: GeoJsonFeatureCollection = await res.json();

      map.addSource("lagos-data", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "lagos-fill",
        type: "fill",
        source: "lagos-data",
        paint: {
          "fill-color": "#0080ff",
          "fill-opacity": 0.1,
        },
      });

      //   map.addLayer({
      //     id: "lagos-border",
      //     type: "line",
      //     source: "lagos-data",
      //     paint: {
      //       "line-color": "#003366",
      //       "line-width": 2,
      //     },
      //   });

      const worldBounds = turf.bboxPolygon([2, -90, 30, 90]);
      const polygons = geojson.features.map((feature) =>
        turf.polygon(feature.geometry.coordinates)
      );
      const lagosUnion =
        polygons.length === 1
          ? polygons[0]
          : turf.union(turf.featureCollection(polygons));

      if (!lagosUnion) {
        console.error("Failed to create union of Lagos features.");
        return;
      }
      lagosBoundsRef.current = lagosUnion;

      const mask = turf.difference(
        turf.featureCollection([worldBounds, lagosUnion])
      );

      if (!mask) {
        console.error("Failed to create mask for Lagos.");
        return;
      }
      map.addSource("lagos-mask", {
        type: "geojson",
        data: mask,
      });
      map.addLayer({
        id: "outside-mask",
        type: "fill",
        source: "lagos-mask",
        paint: {
          "fill-color": "#f5f5f5",
          "fill-opacity": 0.9,
        },
      });

      map.moveLayer("outside-mask", "lagos-fill");

      const bounds = turf.bbox(lagosUnion);

      map.setMaxBounds([
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ]);
      map.setZoom(12);
      const center = turf.center(lagosUnion);
      map.setCenter(center.geometry.coordinates as [number, number]);
      drawBoundaries(map);
    });

    return () => map.remove();
  }, [boundaries]);

  const handleDraw = async (draw: MaplibreDraw) => {
    const data = draw.getAll();
    if (data.features.length) {
      const drawnFeature = data.features[0];
      if (readonly) {
        draw.delete(drawnFeature.id as string);
      }
      if (!lagosBoundsRef.current) {
        alert("Lagos bounds not loaded yet.");
        return;
      }
      const isInside = turf.booleanWithin(drawnFeature, lagosBoundsRef.current);
      if (!isInside) {
        draw.delete(drawnFeature.id as string);
        alert("The drawn polygon is outside Lagos bounds.");
        return;
      }
      const polygon = data.features[0];
      //   const coordinates =
      //     polygon.geometry.type === "Polygon"
      //       ? polygon.geometry.coordinates[0]
      //       : [];

      if (polygon.geometry.type === "Polygon") {
        setOpenDialog(true);
      }
    }
  };

  const drawBoundaries = (map: Map) => {
    if (boundaries.length) {
      const features: GeoJsonFeature[] = boundaries.map((boundary) => {
        const feature: GeoJsonFeature = {
          id: boundary.id,
          type: "Feature",
          properties: { locked: true, name: boundary.name },
          geometry: boundary.geometry,
        };
        return feature;
      });
      const geojson: GeoJsonFeatureCollection = {
        type: "FeatureCollection",
        features,
      };

      map.addSource("restored-polygons", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "restored-polygons-fill",
        type: "fill",
        source: "restored-polygons",
        paint: {
          "fill-color": "#29a19c",
          "fill-opacity": 0.4,
        },
      });

      map.addLayer({
        id: "restored-polygons-outline",
        type: "line",
        source: "restored-polygons",
        paint: {
          "line-color": "#007070",
          "line-width": 2,
        },
      });

      map.addLayer({
        id: "restored-polygons-labels",
        type: "symbol",
        source: "restored-polygons",
        layout: {
          "text-field": ["get", "name"], // 👈 label from properties.name
          "text-size": 12,
          "text-font": ["Open Sans Bold"],
          "text-offset": [0, 0.8],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#000",
        },
      });
    }
  };

  return (
    <>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      <CreateBoundaryDialog
        open={openDialog}
        setOpen={(open) => setOpenDialog(open)}
        draw={drawRef.current}
      />
    </>
  );
};

export default DrawingMap;
