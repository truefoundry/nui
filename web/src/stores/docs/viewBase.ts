import { ANIM_TIME, ANIM_TIME_CSS, DOC_ANIM, DOC_TYPE, POSITION_TYPE } from "@/types"
import { delay } from "@/utils/time"
import { StoreCore } from "@priolo/jon"
import React from "react"



export enum PARAMS_DOC {
	POSITION = "pos",
}
export enum DOC_VARIANTS {
	DEFAULT = "",
	LINK = "_link",
}

const setup = {

	state: {
		uuid: <string>null,
		type: DOC_TYPE.EMPTY,
		params: <{ [name: string]: any[] }>{},

		/** indica se la CARD è draggabile o no */
		draggable: true,
		/** l'a corrente stato di animazione */
		docAnim: DOC_ANIM.EXIT,
		width: 300,

		position: POSITION_TYPE.DETACHED,
		parent: <ViewStore>null,
		linked: <ViewStore>null,
	},

	getters: {
		getParam(name: string, store?: ViewStore) {
			return store.state.params?.[name]?.[0]
		},
		getStyAni: (_: void, store?: ViewStore) => {

			console.log("getStyAni", store.state.docAnim)
			switch (store.state.docAnim) {
				case DOC_ANIM.EXIT:
				case DOC_ANIM.EXITING:
					return { 
						width: 0, 
						transform: `translate(${-store.state.width}px, 0px)` 
					}
				case DOC_ANIM.SHOWING:
					return null //return { width: 0 }
				case DOC_ANIM.DRAGGING:
					return { 
						border: '2px dashed #10f3f3',
						backgroundColor: '#1e1e1e',
					}
				default:
					return null
				
			}
		},
		getTitle: (_: void, store?: ViewStore) => "Boooh!",
	},

	actions: {
		setLinked: (view: ViewStore, store?: ViewStore) => {
			if (!view) {
				if (!!store.state.linked) {
					store.state.linked.state.position = null
					store.state.linked.state.parent = null
				}
				store.state.linked = null
			} else {
				view.state.parent = store
				view.state.position = POSITION_TYPE.LINKED
				store.state.linked = view
			}
			return store
		},
		docAnim: async (docAnim: DOC_ANIM, store?: ViewStore) => {
			let animTime = 0
			let noSet = false
			const currAnim = store.state.docAnim
			let nextAnim = null

			if (docAnim == DOC_ANIM.SHOWING && currAnim == DOC_ANIM.SHOW) {
				return
			} else if (docAnim == DOC_ANIM.EXITING && currAnim == DOC_ANIM.EXIT) {
				return
			} else if (docAnim == DOC_ANIM.SHOWING && currAnim == DOC_ANIM.EXITING) {
				animTime = ANIM_TIME 
				noSet = true
			} else if (docAnim == DOC_ANIM.EXITING && currAnim == DOC_ANIM.SHOWING) {
				animTime = ANIM_TIME
				noSet = true
			} else if (docAnim == DOC_ANIM.EXITING) {
				animTime = ANIM_TIME
				nextAnim = DOC_ANIM.EXIT
			} else if (docAnim == DOC_ANIM.SHOWING) {
				animTime = ANIM_TIME
				nextAnim = DOC_ANIM.SHOW
			}

			if (animTime > 0) {
				if (nextAnim == null) nextAnim = docAnim
				if (!noSet) store.setDocAnim(docAnim)
				await delay(ANIM_TIME)
				store.setDocAnim(nextAnim)
			} else {
				store.setDocAnim(docAnim)
			}
		}
	},

	mutators: {
		setParams(ps: { [name: string]: any }, store?: ViewStore) {
			const params = { ...store.state.params, ...ps }
			return { params }
		},
		setWidth: (width: number) => ({ width }),
		setDocAnim: (docAnim: DOC_ANIM) => ({ docAnim }),
	},
}

export type ViewState = Partial<typeof setup.state>
export type ViewGetters = typeof setup.getters
export type ViewActions = typeof setup.actions
export type ViewMutators = typeof setup.mutators

/**
 * E' lo STORE "abstract" ereditato da tutti gli altri STORE che vogliono essere visualizzati come VIEW
 */
export interface ViewStore extends StoreCore<ViewState>, ViewGetters, ViewActions, ViewMutators {
	state: ViewState
}

export default setup

