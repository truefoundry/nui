import { FunctionComponent } from "react"
import ListRow from "./ListRow"



export interface RenderRowBaseProps<T> {
	item: T
	isSelect?: boolean
}

interface Props<T> {
	items: T[]
	RenderRow?: FunctionComponent<RenderRowBaseProps<T>>
	readOnly?: boolean
	/** indice selezionato */
	select?: number
	onSelect?: (index: number, e:React.MouseEvent<HTMLElement>) => void
	style?: React.CSSProperties
}

function List<T>({
	items,
	RenderRow = ({item}) => item.toString(),
	readOnly,
	select,
	onSelect,
	style = {},
}: Props<T>) {

	// STORES

	// HOOKS

	// HANDLERS
	const handleSelect = (index: number, e:React.MouseEvent<HTMLElement>) => {
		onSelect?.(index, e)
	}

	// RENDER
	if (!items) return null

	return <div style={{ ...cssContainer, ...style }}>

		{items.map((item, index) =>
			<ListRow
				key={index}
				onClick={(e) => handleSelect(index, e)}
				readOnly={readOnly}
				isSelect={select==index}
			>
				<RenderRow
					item={item}
					isSelect={index == select}
				/>
			</ListRow>
		)}

	</div>
}

export default List

const cssContainer: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
}
