import { it, describe, expect } from "vitest";
import { getOriginalUrl, shortenUrl } from "../src/services/urls.service.js";

describe("shortenUrl", () => {

    it("should shorten a url", async () => {
        const originalUrl = "https://www.google.com";
        const result = await shortenUrl(originalUrl);
        expect(result.originalUrl).toBe(originalUrl);
    });

});
