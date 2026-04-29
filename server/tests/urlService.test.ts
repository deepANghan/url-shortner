import { it, describe, expect, vi } from "vitest";
import { getOriginalUrl, shortenUrl } from "../src/services/urls.service.js";

vi.mock("../src/config/client", () => ({
    dbClient: {
        urls: {
            create: vi.fn().mockResolvedValue({
                originalUrl: "https://www.google.com",
                shortUrl: "",
                id: "123",
                createdAt: "",
            })
        }
    }
}));

describe("shortenUrl", () => {

    it("should shorten a url", async () => {
        const originalUrl = "https://www.google.com";
        const result = await shortenUrl(originalUrl);
        expect(result.originalUrl).toBe(originalUrl);
    });

});
