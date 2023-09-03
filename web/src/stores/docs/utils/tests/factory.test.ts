import { DOC_TYPE } from "../../types"
import { fromID, getID } from "../factory"


describe("getID", () => {
	it("ricavo l'id da una view store", () => {
		const viewState = {
			type: DOC_TYPE.CONNECTIONS,
			uuid: "1234-5678"
		}
		const result = getID(viewState)
		const expected = "cns-1234-5678"
		expect(result).toBe(expected)
	})
	// it("caso null", () => {
	// 	const result = stringToViewsState(null)
	// 	expect(result).toHaveLength(0)
	// })
})

describe("fromID", () => {
	it("ricavo una viewStore da una stringa ID", () => {
		const result = fromID("cns-1234-5678")
		const expected = {
			type: DOC_TYPE.CONNECTIONS,
			uuid: "1234-5678"
		}
		expect(result).toEqual(expected)
	})
})

