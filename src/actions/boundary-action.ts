import { boundaryRepository } from "../db/repositories/boundary-repository";
import type { FeatureProperties, PolygonGeometry } from "../types/geojson";

export async function getAllBoundaries() {
  return await boundaryRepository.getAllBoundaries();
}

export async function getBoundaryById(id: string) {
  const boundary = await boundaryRepository.getBoundaryById(id);
  if (!boundary) {
    console.error(`Boundary with ID ${id} not found.`);
    return null;
  }
  return boundary;
}

export async function createBoundary(boundaryData: {
  name: string;
  geometry: PolygonGeometry;
  properties: FeatureProperties;
}) {
  const boundary = await boundaryRepository.createBoundary(boundaryData);
  return boundary;
}

export async function updateBoundary(
  id: string,
  updatedData: Partial<{
    name: string;
    geometry: PolygonGeometry;
    properties: FeatureProperties;
  }>
) {
  try {
    return await boundaryRepository.updateBoundary(id, updatedData);
  } catch (error) {
    console.error(`Error updating boundary with ID ${id}:`, error);
  }
}

export async function deleteBoundary(id: string) {
  if (await boundaryRepository.getBoundaryById(id)) {
    await boundaryRepository.deleteBoundary(id);
    return true;
  }
  console.error(`Boundary with ID ${id} not found.`);
  return false;
}

export async function assignUserToBoundary(userId: string, boundaryId: string) {
  try {
    return await boundaryRepository.assignBoundaryToUser(boundaryId, userId);
  } catch (error) {
    console.error(
      `Error assigning boundary ${boundaryId} to user ${userId}:`,
      error
    );
  }
}
export async function getBoundaryUsers(boundaryId: string) {
  try {
    return await boundaryRepository.getBoundaryUsers(boundaryId);
  } catch (error) {
    console.error(`Error fetching users for boundary ${boundaryId}:`, error);
    return [];
  }
}
export async function removeUserFromBoundary(
  boundaryId: string,
  userId: string
) {
  try {
    return await boundaryRepository.removeUserFromBoundary(boundaryId, userId);
  } catch (error) {
    console.error(
      `Error removing user ${userId} from boundary ${boundaryId}:`,
      error
    );
  }
}
