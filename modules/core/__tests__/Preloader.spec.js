import React from "react";
import { shallow } from "enzyme";
import Preloader from "../Preloader";

describe("Preloader suite", () => {
    it("should display none", () => {
        const view = shallow(
            <Preloader/>
        );
        expect(view.type()).toBe("div");
        expect(view.prop("style")).toEqual({ display: "none" });
    });
    it("should display preloader", () => {
        const view = shallow(
            <Preloader visible/>
        );
        expect(view.find(".preloader-container").type()).toBe("div");
        expect(view.find(".preloader.active").type()).toBe("div");
    });
});