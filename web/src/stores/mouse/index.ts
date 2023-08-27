import { StoreCore, createStore } from "@priolo/jon"
import { ViewStore } from "../docs/docBase"
import docSo from "@/stores/docs"


export interface DragDoc {
	/** indice del DOC da cui è partito il DRAG */
	srcView?: ViewStore
	/** in alternativa indica l'indice della posizione nella "root" */
	index?: number
}

export interface Position {
	x: number
	y: number
}

const setup = {

	state: {
		drag: <DragDoc>null,
		position: <Position>null,
	},

	getters: {
	},

	actions: {
		startDrag(drag: DragDoc, store?: MouseStore) {
			function fnMouseMove(e) {
				store.setPosition({ x: e.clientX, y: e.clientY })
			}
			function fnMouseUp(e) {
				document.removeEventListener('mousemove', fnMouseMove)
				document.removeEventListener('mouseup', fnMouseUp)
				store.stopDrag()
			}
			document.addEventListener('mousemove', fnMouseMove);
			document.addEventListener('mouseup', fnMouseUp);
			store.setDrag(drag)
		},
		stopDrag(_: void, store?: MouseStore) {
			const { srcView, index } = store.state.drag
			store.setPosition(null)
			store.setDrag(null)
			docSo.move({view: srcView, index})
		}
	},

	mutators: {
		setDrag: (drag: DragDoc) => ({ drag }),
		setPosition: (position: Position) => ({ position }),
	},
}

export type MouseState = typeof setup.state
export type MouseGetters = typeof setup.getters
export type MouseActions = typeof setup.actions
export type MouseMutators = typeof setup.mutators
export interface MouseStore extends StoreCore<MouseState>, MouseGetters, MouseActions, MouseMutators {
	state: MouseState
}
const store = createStore(setup) as MouseStore
export default store


