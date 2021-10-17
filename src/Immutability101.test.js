const rewire = require("rewire")
const Immutability101 = rewire("./Immutability101")
const enhance = Immutability101.__get__("enhance")
const enhancedEnhance = Immutability101.__get__("enhancedEnhance")
// @ponicode
describe("enhance", () => {
    test("0", () => {
        let callFunction = () => {
            enhance({ key: "Dillenberg" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            enhance({ key: "elio@example.com" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            enhance({ key: "Elio" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            enhance(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("enhancedEnhance", () => {
    test("0", () => {
        let callFunction = () => {
            enhancedEnhance([true, true, true])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            enhancedEnhance([true, false, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            enhancedEnhance([false, true, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            enhancedEnhance([true, true, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            enhancedEnhance([true, false, true])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            enhancedEnhance(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
