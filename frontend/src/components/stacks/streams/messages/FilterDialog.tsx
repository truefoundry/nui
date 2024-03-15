import Button from "@/components/buttons/Button"
import IconToggle from "@/components/buttons/IconToggle"
import Dialog from "@/components/dialogs/Dialog"
import Box from "@/components/format/Box"
import BoxV from "@/components/format/BoxV"
import Form from "@/components/format/Form"
import DateTimeInput from "@/components/input/DateTimeInput"
import NumberInput from "@/components/input/NumberInput"
import TextInput from "@/components/input/TextInput"
import List from "@/components/lists/List"
import CheckRadioOnIcon from "@/icons/CheckRadioOnIcon"
import { StreamMessagesFilter, StreamMessagesStore } from "@/stores/stacks/streams/messages"
import { useStore } from "@priolo/jon"
import { FunctionComponent, useEffect, useState } from "react"



interface Props {
	store: StreamMessagesStore
}

const FilterDialog: FunctionComponent<Props> = ({
	store: strMsgSo,
}) => {

	// STORE
	const strMsgSa = useStore(strMsgSo)

	// HOOKs
	const [filter, setFilter] = useState<StreamMessagesFilter>(null)
	const [search, setSearch] = useState<string>(null)
	useEffect(() => {
		if (!strMsgSo.state.filtersOpen) return
		setFilter({ ...strMsgSo.state.filter, subjects: [...strMsgSo.state.filter.subjects] })
	}, [strMsgSo.state.filtersOpen])

	// HANDLER
	const handleFilterPropChange = (prop: Partial<StreamMessagesFilter>) => setFilter({ ...filter, ...prop })
	const handleSubjectChange = (subject: string) => {
		const index = filter.subjects.indexOf(subject)
		if (index != -1) filter.subjects.splice(index, 1); else filter.subjects.push(subject)
		setFilter({ ...filter })
	}
	const handleClose = () => {
		strMsgSo.setFiltersOpen(false)
	}
	const handleApply = () => {
		strMsgSo.setFiltersOpen(false)
		strMsgSo.filterApply(filter)
	}
	const handleSearchChange = (value: string) => {
		setSearch(value)
	}

	// RENDER
	if (!filter) return null
	let subjects = Object.keys(strMsgSa.stream?.state?.subjects ?? {})
	if (search?.length > 0) subjects = subjects.filter(s => s.includes(search))

	return (
		<Dialog
			title="FILTERS"
			store={strMsgSo}
			width={200}
			open={strMsgSa.filtersOpen}
			onClose={handleClose}
		>
			<Form className="var0">
				<Box>
					<IconToggle
						check={!filter.byTime}
						onChange={select => handleFilterPropChange({ byTime: false })}
						trueIcon={<CheckRadioOnIcon />}
					/>
					<div className="lbl-prop">SEQUENCE START</div>
				</Box>
				<NumberInput
					style={{ flex: 1 }}
					value={filter.startSeq}
					onChange={startSeq => handleFilterPropChange({ startSeq: +startSeq })}
				/>

				<Box>
					<IconToggle
						check={filter.byTime}
						onChange={select => handleFilterPropChange({ byTime: true })}
						trueIcon={<CheckRadioOnIcon />}
					/>
					<div className="lbl-prop">TIME START</div>
				</Box>
				<DateTimeInput
					style={{ flex: 1 }}
					value={filter.startTime}
					onChange={(startTime: string) => handleFilterPropChange({ startTime: +startTime })}
				/>

				<BoxV>
					<div className="lbl-prop">INTERVAL</div>
					<NumberInput
						style={{ flex: 1 }}
						value={filter.interval}
						onChange={(interval: string) => handleFilterPropChange({ interval: +interval })}
					/>
				</BoxV>

				<BoxV>
					<div className="lbl-prop">SUBJECTS</div>
					<TextInput
						value={search}
						onChange={handleSearchChange}
					/>
					<List<string>
						style={{ maxHeight: 200, overflowY: "auto" }}
						//items={subjects}
						items={["primo", "secondo",]}
						RenderRow={({ item }) => <Box>
							<IconToggle
								check={filter.subjects.indexOf(item) != -1}
								onChange={select => handleSubjectChange(item)}
							/>
							<div className="lbl-prop">{item}</div>
						</Box>}
					/>
				</BoxV>

				<Button children="APPLY" style={{ alignSelf: "start" }}
					onClick={handleApply}
				/>
			</Form>
		</Dialog>
	)
}

export default FilterDialog

