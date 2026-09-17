import { describe, it, expect, afterEach, vi } from "vitest";
import { getInstagramPosts, toPosts } from "./instagram";

const image = {
  id: "1",
  media_type: "IMAGE",
  media_url: "https://scontent.cdninstagram.com/1.jpg",
  permalink: "https://www.instagram.com/p/1/",
  caption: "Terzo tempo",
  timestamp: "2026-09-01T18:00:00+0000",
};

const video = {
  id: "2",
  media_type: "VIDEO",
  media_url: "https://scontent.cdninstagram.com/2.mp4",
  thumbnail_url: "https://scontent.cdninstagram.com/2.jpg",
  permalink: "https://www.instagram.com/reel/2/",
  timestamp: "2026-09-02T18:00:00+0000",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("toPosts", () => {
  it("shows a video by its thumbnail, never the mp4", () => {
    const [post] = toPosts({ data: [video] }, 6);
    expect(post).toMatchObject({ kind: "video", image: video.thumbnail_url, caption: "" });
  });

  it("drops a post with no still to show", () => {
    const reel = { ...video, id: "3", thumbnail_url: undefined, media_url: undefined };
    expect(toPosts({ data: [reel, image] }, 6).map((p) => p.id)).toEqual(["1"]);
  });

  it("drops an entry in an unknown shape without losing the rest", () => {
    const odd = { ...image, id: "4", media_type: "HOLOGRAM" };
    expect(toPosts({ data: [odd, image] }, 6).map((p) => p.id)).toEqual(["1"]);
  });

  it("stops at the limit", () => {
    const many = Array.from({ length: 5 }, (_, i) => ({ ...image, id: String(i) }));
    expect(toPosts({ data: many }, 3)).toHaveLength(3);
  });

  it("returns nothing for a payload that is not a media list", () => {
    expect(toPosts({ error: { message: "Invalid OAuth access token" } }, 6)).toEqual([]);
  });
});

describe("getInstagramPosts", () => {
  it("returns nothing, without calling the API, when no token is set", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await getInstagramPosts()).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns nothing when the API refuses the request", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "token");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 400 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await getInstagramPosts()).toEqual([]);
  });

  it("returns nothing when the network fails", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "token");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await getInstagramPosts()).toEqual([]);
  });

  it("maps a successful response", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ data: [image, video] })),
    );
    expect((await getInstagramPosts()).map((p) => p.kind)).toEqual(["image", "video"]);
  });
});
