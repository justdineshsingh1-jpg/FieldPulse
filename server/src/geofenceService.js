/**
 * Geofencing & Telematics Logic Engine
 */

class GeofenceService {
  /**
   * Ray-casting algorithm to determine if a point [lat, lng] is inside a polygon [[lat, lng], ...]
   */
  static isPointInPolygon(point, polygon) {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Haversine formula to compute distance in meters between two lat/lng pairs
   */
  static calculateDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  /**
   * Evaluates incoming coordinate ping against all active project geofences
   * @param {Object} locationPing - { entityType: 'crew'|'equipment', entityId, name, lat, lng }
   * @param {Array} projects - List of active projects
   */
  static processLocationPing(locationPing, projects) {
    const { entityType, entityId, name, lat, lng } = locationPing;
    const results = [];

    for (const proj of projects) {
      const isInside = this.isPointInPolygon([lat, lng], proj.location.geofence);
      const distance = this.calculateDistanceMeters(
        lat,
        lng,
        proj.location.center[0],
        proj.location.center[1]
      );

      results.push({
        projectId: proj.id,
        projectName: proj.name,
        isInside,
        distanceMeters: distance
      });
    }

    const activeProject = results.find(r => r.isInside);

    return {
      entityType,
      entityId,
      name,
      timestamp: new Date().toLocaleTimeString(),
      currentCoords: [lat, lng],
      status: activeProject ? "inside_geofence" : "outside_geofence",
      project: activeProject ? activeProject.projectName : null,
      projectId: activeProject ? activeProject.projectId : null,
      distanceToNearestCenter: Math.min(...results.map(r => r.distanceMeters))
    };
  }
}

module.exports = GeofenceService;
