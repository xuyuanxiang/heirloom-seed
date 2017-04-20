import { parseNumber, currency } from "../formatter";

describe("formatter util", () => {
    it("should convert illegal input to 0", () => {
        expect(parseNumber("d")).toBe(0);
    });

    it("should convert string input number", () => {
        expect(parseNumber("1234")).toBe(1234);
    });

    it("should convert illegal input to 0.00", () => {
        expect(currency("a")).toBe("0.00");
    });

    it("should convert cent to yuan", () => {
        expect(currency("1333")).toBe("1,333.00");
    });
});
