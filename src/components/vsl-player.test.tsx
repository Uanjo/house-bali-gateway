import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VslPlayer } from "./vsl-player";
import { vslConfig } from "@/lib/vsl-config";

describe("VSL watch-time gating", () => {
  beforeEach(() => {
    vslConfig.videoUrl = "/test-video.mp4";
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vslConfig.videoUrl = undefined;
  });

  it("keeps the video placeholder noninteractive without a supplied video", () => {
    vslConfig.videoUrl = undefined;
    const unlock = vi.fn();
    render(<VslPlayer onUnlock={unlock} />);
    expect(screen.getByRole("button", { name: "Vídeo em breve" })).toBeDisabled();
    expect(unlock).not.toHaveBeenCalled();
  });

  it("unlocks exactly once after 60 watched seconds, with no native controls", () => {
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    const unlock = vi.fn();
    const { container } = render(<VslPlayer onUnlock={unlock} />);
    const video = container.querySelector("video");
    if (!video) throw new Error("Expected configured video");
    Object.defineProperty(video, "paused", { configurable: true, value: false });
    expect(video.controls).toBe(false);
    fireEvent.playing(video);
    for (let second = 1; second <= 59; second++) {
      now = second * 1000;
      video.currentTime = second;
      fireEvent.timeUpdate(video);
    }
    expect(unlock).not.toHaveBeenCalled();
    now = 60000;
    video.currentTime = 60;
    fireEvent.timeUpdate(video);
    expect(unlock).toHaveBeenCalledTimes(1);
    now = 61000;
    video.currentTime = 61;
    fireEvent.timeUpdate(video);
    expect(unlock).toHaveBeenCalledTimes(1);
  });

  it("rejects forward and backward seeking, and does not count paused time", () => {
    const unlock = vi.fn();
    const { container } = render(<VslPlayer onUnlock={unlock} />);
    const video = container.querySelector("video");
    if (!video) throw new Error("Expected configured video");
    video.currentTime = 90;
    fireEvent.seeking(video);
    expect(video.currentTime).toBe(0);
    video.currentTime = 60;
    fireEvent.timeUpdate(video);
    expect(unlock).not.toHaveBeenCalled();
    video.currentTime = -5;
    fireEvent.seeking(video);
    expect(video.currentTime).toBe(0);
  });
});