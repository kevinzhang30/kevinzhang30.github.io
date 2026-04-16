import { describe, it, expect } from "vitest";
import {
  DESTINATIONS,
  DESTINATION_IDS,
  getDestinationById,
  getDestinationByRoute,
  HOME_DESTINATION_ID,
} from "./config";

describe("destination registry", () => {
  it("has exactly five destinations: home plus four celestial bodies", () => {
    expect(DESTINATIONS).toHaveLength(5);
    expect(DESTINATION_IDS).toEqual([
      "home",
      "earth",
      "rocket",
      "satellite",
      "moon",
    ]);
  });

  it("every destination has a unique id", () => {
    const ids = DESTINATIONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every destination has a unique route", () => {
    const routes = DESTINATIONS.map((d) => d.route);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("maps each expected route to the correct destination id", () => {
    expect(getDestinationByRoute("/")?.id).toBe("home");
    expect(getDestinationByRoute("/map")?.id).toBe("earth");
    expect(getDestinationByRoute("/projects")?.id).toBe("rocket");
    expect(getDestinationByRoute("/experience")?.id).toBe("satellite");
    expect(getDestinationByRoute("/gallery")?.id).toBe("moon");
  });

  it("returns undefined for unknown routes", () => {
    expect(getDestinationByRoute("/nope")).toBeUndefined();
    expect(getDestinationByRoute("/admin/experience")).toBeUndefined();
  });

  it("looks up destinations by id", () => {
    expect(getDestinationById("earth")?.route).toBe("/map");
    expect(getDestinationById("home")?.route).toBe("/");
  });

  it("exports HOME_DESTINATION_ID as 'home'", () => {
    expect(HOME_DESTINATION_ID).toBe("home");
  });

  it("every non-home destination has a cameraPosition distinct from home", () => {
    const home = getDestinationById("home");
    expect(home).toBeDefined();
    const homePos = home!.cameraPosition.join(",");
    for (const d of DESTINATIONS) {
      if (d.id === "home") continue;
      expect(d.cameraPosition.join(",")).not.toBe(homePos);
    }
  });
});
