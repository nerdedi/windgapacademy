import { describe, it, expect } from "@jest/globals";
import { getAvatarState } from "./AvatarBuilder";

describe("getAvatarState", () => {
  it("should return correct avatar state with all properties", () => {
    const features = {
      skin: "#fff",
      hair: "#000",
      outfit: "casual",
      pronoun: "they/them",
      accessory: "glasses",
      wheelchair: true,
      wheelchairColour: "#1976d2",
      wheelchairSize: 100
    };
    expect(getAvatarState(features)).toEqual(features);
  });

  it("should handle missing optional properties", () => {
    const features = {
      skin: "#fff",
      hair: "#000",
      outfit: "casual",
      pronoun: "she/her"
    };
    expect(getAvatarState(features)).toEqual({
      skin: "#fff",
      hair: "#000",
      outfit: "casual",
      pronoun: "she/her",
      accessory: undefined,
      wheelchair: undefined,
      wheelchairColour: undefined,
      wheelchairSize: undefined
    });
  });
});
