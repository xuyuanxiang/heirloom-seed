const debug = require("./debug")
// @ponicode
describe("debug.createDebug", () => {
    test("0", () => {
        let callFunction = () => {
            debug.createDebug("Hello, world!")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            debug.createDebug("Foo bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            debug.createDebug("foo bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            debug.createDebug("This is a Text")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            debug.createDebug(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
