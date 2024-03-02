import Accordion from "@/components/Accordion"
import IconToggle from "@/components/buttons/IconToggle"
import Box from "@/components/format/Box"
import BoxV from "@/components/format/BoxV"
import Form from "@/components/format/Form"
import Label, { LABELS } from "@/components/format/Label"
import Quote from "@/components/format/Quote"
import NumberInput from "@/components/input/NumberInput"
import TextInput from "@/components/input/TextInput"
import EditList from "@/components/lists/EditList"
import EditStringRow from "@/components/rows/EditStringRow"
import layoutSo, { COLOR_VAR } from "@/stores/layout"
import { StreamStore } from "@/stores/stacks/streams/detail"
import { EDIT_STATE } from "@/types"
import { DISCARD, RETENTION, STORAGE, StreamConfig } from "@/types/Stream"
import { useStore } from "@priolo/jon"
import { FunctionComponent } from "react"
import ListDialog from "../../../dialogs/ListDialog"
import SourcesCmp from "./source/SourcesCmp"
import TextArea from "@/components/input/TextArea"



interface Props {
	store?: StreamStore
}

const EditForm: FunctionComponent<Props> = ({
	store: streamSo,
}) => {

	// STORE
	const streamSa = useStore(streamSo)

	// HOOKs

	// HANDLER
	const handlePropChange = (prop: { [name: string]: any }) => streamSo.setStreamConfig({ ...streamSa.stream.config, ...prop })
	const handleMirrorPropChange = (prop: { [name: string]: any }) => {
		const config = { ...streamSa.stream.config }
		config.mirror = { ...config.mirror, ...prop }
		streamSo.setStreamConfig(config)
	}
	const handleRepublishPropChange = (prop: { [name: string]: any }) => {
		const config = { ...streamSa.stream.config }
		config.republish = { ...config.republish, ...prop }
		streamSo.setStreamConfig(config)
	}


	const handleMirrorCheck = (check: boolean) => {
		if (check) {
			if (!config.mirror) {
				handlePropChange({
					mirror: {
						name: "",
						optStartSeq: 0,
						filterSubject: "",
					}
				})
			}
		} else {
			if (config.mirror) {
				handlePropChange({ mirror: null })
			}
		}
	}

	// RENDER
	if (streamSa.stream?.config == null) return null
	const config: StreamConfig = streamSa.stream.config
	const inRead = streamSa.editState == EDIT_STATE.READ
	const inNew = streamSa.editState == EDIT_STATE.NEW
	const variant = streamSa.colorVar
	const allStreams = streamSa.allStreams

	return <Form>


		<div className="lbl-prop-title">BASIC INFO</div>
		<BoxV>
			<div className="lbl-prop">NAME</div>
			<TextInput
				value={config.name}
				onChange={name => handlePropChange({ name })}
				readOnly={inRead || !inNew}
			/>
		</BoxV>

		<BoxV>
			<div className="lbl-prop">DESCRIPTION</div>
			<TextArea
				value={config.description}
				onChange={description => handlePropChange({ description })}
				readOnly={inRead}
			/>
		</BoxV>

		<BoxV>
			<div className="lbl-prop">STORAGE</div>
			<ListDialog width={80}
				store={streamSo}
				select={Object.values(STORAGE).indexOf(config.storage ?? STORAGE.FILE)}
				items={Object.values(STORAGE)}
				RenderRow={({ item }) => item.toUpperCase()}
				readOnly={inRead || !inNew}
				onSelect={index => handlePropChange({ storage: Object.values(STORAGE)[index] })}
			/>
		</BoxV>

		<BoxV>
			<div className="lbl-prop">FAVORITE SUBS</div>
			<EditList<string>
				items={config.subjects}
				onItemsChange={subjects => handlePropChange({ subjects })}
				variant={variant}
				readOnly={inRead}
				onNewItem={() => "<new>"}
				RenderRow={EditStringRow}
			/>
		</BoxV>

		<BoxV>
			<div className="lbl-prop">SOURCES</div>
			<SourcesCmp store={streamSo} />
		</BoxV>





		<div className="lbl-prop-title">RETENTION</div>
		<BoxV>
			<div className="lbl-prop">POLICY</div>
			<ListDialog width={80}
				store={streamSo}
				select={Object.values(RETENTION).indexOf(config.retention ?? RETENTION.INTEREST)}
				items={Object.values(RETENTION)}
				RenderRow={({ item }) => item}
				readOnly={inRead || !inNew}
				onSelect={index => handlePropChange({ retention: Object.values(RETENTION)[index] })}
			/>
		</BoxV>
		<BoxV>
			<div className="lbl-prop">DISCARD</div>
			<ListDialog width={80}
				store={streamSo}
				select={Object.values(DISCARD).indexOf(config.discard ?? DISCARD.OLD)}
				items={Object.values(DISCARD)}
				RenderRow={({ item }) => item.toUpperCase()}
				readOnly={inRead}
				onSelect={index => {
					console.log(index)
					handlePropChange({ discard: Object.values(DISCARD)[index] })
				}}
			/>
		</BoxV>
		<Box>
			<IconToggle
				check={config.allowRollupHdrs}
				onChange={allowRollupHdrs => handlePropChange({ allowRollupHdrs })}
				readOnly={inRead}
			/>
			<div className="lbl-prop">ALLOW ROLL UP HDRS</div>
		</Box>
		<Box>
			<IconToggle
				check={config.denyDelete}
				onChange={denyDelete => handlePropChange({ denyDelete })}
				readOnly={inRead || !inNew}
			/>
			<div className="lbl-prop">DENY DELETE</div>
		</Box>
		<Box>
			<IconToggle
				check={config.denyPurge}
				onChange={denyPurge => handlePropChange({ denyPurge })}
				readOnly={inRead || !inNew}
			/>
			<div className="lbl-prop">DENY PURGE</div>
		</Box>





		<div className="lbl-prop-title">LIMIT</div>
		<BoxV>
			<div className="lbl-prop">MAX AGE</div>
			<NumberInput
				style={{ flex: 1 }}
				value={config.maxAge}
				onChange={maxAge => handlePropChange({ maxAge })}
				readOnly={inRead}
			/>
		</BoxV>
		<BoxV>
			<div className="lbl-prop">MAX BYTES</div>
			<NumberInput
				style={{ flex: 1 }}
				value={config.maxBytes}
				onChange={maxBytes => handlePropChange({ maxBytes })}
				readOnly={inRead}
			/>
		</BoxV>
		<BoxV>
			<div className="lbl-prop">MAX CONSUMERS</div>
			<NumberInput
				style={{ flex: 1 }}
				value={config.maxConsumers}
				onChange={maxConsumers => handlePropChange({ maxConsumers })}
				readOnly={inRead || !inNew}
			/>
		</BoxV>
		<BoxV>
			<div className="lbl-prop">MAX MSG SIZE</div>
			<NumberInput
				style={{ flex: 1 }}
				value={config.maxMsgSize}
				onChange={maxMsgSize => handlePropChange({ maxMsgSize })}
				readOnly={inRead}
			/>
		</BoxV>
		<BoxV>
			<div className="lbl-prop">MAX MESSAGES</div>
			<NumberInput
				style={{ flex: 1 }}
				value={config.maxMsgs}
				onChange={maxMsgs => handlePropChange({ maxMsgs })}
				readOnly={inRead}
			/>
		</BoxV>
		<BoxV>
			<div className="lbl-prop">MAX MSGS PER SUBJECT</div>
			<NumberInput
				style={{ flex: 1 }}
				value={config.maxMsgsPerSubject}
				onChange={maxMsgsPerSubject => handlePropChange({ maxMsgsPerSubject })}
				readOnly={inRead}
			/>
		</BoxV>




		

		<div className="lbl-prop-title">PLACMENT</div>
		<BoxV>
			<div className="lbl-prop">NUM REPLICAS</div>
			<NumberInput
				style={{ flex: 1 }}
				value={config.numReplicas}
				onChange={numReplicas => handlePropChange({ numReplicas })}
				readOnly={inRead}
			/>
		</BoxV>
		<BoxV>
			<div className="lbl-prop">PLACEMENT</div>
			<Quote>
				<BoxV>
					<Label type={LABELS.SUBTEXT}>NAME</Label>
					<TextInput
						value={config.templateOwner}
						onChange={templateOwner => handlePropChange({ templateOwner })}
						readOnly={inRead}
					/>
				</BoxV>
				{/* <Label type={LABELS.SUBTEXT}>TAGS</Label> */}
				{/* TAGS propr "placement.tags" */}
			</Quote>
		</BoxV>





		<div className="lbl-prop-title">!!!DA CAPIRE!!!</div>
		<Box>
			<IconToggle
				check={config.noAck}
				onChange={noAck => handlePropChange({ noAck })}
				readOnly={inRead}
			/>
			<div className="lbl-prop">NO ACK</div>
		</Box>
		<BoxV>
			<div className="lbl-prop">TEMPLATE OWNER</div>
			<TextInput
				value={config.templateOwner}
				onChange={templateOwner => handlePropChange({ templateOwner })}
				readOnly={inRead}
			/>
		</BoxV>
		<BoxV>
			<div className="lbl-prop">DUPLICATE WINDOW</div>
			<NumberInput
				style={{ flex: 1 }}
				value={config.duplicateWindow}
				onChange={duplicateWindow => handlePropChange({ duplicateWindow })}
				readOnly={inRead}
			/>
		</BoxV>
		<BoxV>
			<Box>
				<IconToggle
					check={!!config.mirror}
					onChange={handleMirrorCheck}
					readOnly={inRead || !inNew}
				/>
				<div className="lbl-prop">MIRROR</div>
			</Box>
			<Accordion open={!!config.mirror}>
				<Quote>
					<BoxV>
						<Label type={LABELS.SUBTEXT}>NAME</Label>
						<ListDialog
							store={streamSo}
							select={allStreams?.indexOf(config?.mirror?.name) ?? -1}
							items={allStreams}
							RenderRow={({ item }) => item}
							readOnly={inRead || !inNew}
							onSelect={index => {
								handleMirrorPropChange({ name: allStreams[index] })
							}}
						/>
						{/*{ <Options<string>*/}
						{/*		value={config.mirror?.name ?? ""}*/}
						{/*		items={["pippo", "pluto", "paperino"]}*/}
						{/*		RenderRow={({ item }) => item}*/}
						{/*		readOnly={inRead || !inNew}*/}
						{/*		onSelect={name => handleMirrorPropChange({ name })}*/}
						{/*	}*/}
					</BoxV>
					<BoxV>
						<Label type={LABELS.SUBTEXT}>START SEQUENCE</Label>
						<NumberInput
							style={{ flex: 1 }}
							value={config.mirror?.optStartSeq}
							onChange={optStartSeq => handleMirrorPropChange({ optStartSeq })}
							readOnly={inRead || !inNew}
						/>
					</BoxV>
					<BoxV>
						<Label type={LABELS.SUBTEXT}>FILTER SUBJECT</Label>
						<TextInput
							value={config.mirror?.filterSubject}
							onChange={filterSubject => handleMirrorPropChange({ filterSubject })}
							readOnly={inRead || !inNew}
						/>
					</BoxV>
				</Quote>
			</Accordion>
		</BoxV>
		<Box>
			<IconToggle
				check={config.sealed}
				onChange={sealed => handlePropChange({ sealed })}
				readOnly={inRead}
			/>
			<div className="lbl-prop">SEALED</div>
		</Box>
		<BoxV>
			<Box>
				<IconToggle
					check={!!config.republish}
					onChange={check => {
						if (check) {
							if (!config.republish) {
								handlePropChange({
									republish: {
										src: "",
										dest: "",
										headersOnly: false,
									}
								})
							}
						} else {
							if (config.republish) {
								handlePropChange({ republish: null })
							}
						}
					}}
					readOnly={inRead}
				/>
				<div className="lbl-prop">REPUBLISH</div>
			</Box>
			<Accordion open={!!config.republish}>
				<Quote>
					<BoxV>
						<Label type={LABELS.SUBTEXT}>SOURCE</Label>
						<TextInput
							value={config.republish?.src}
							onChange={src => handleRepublishPropChange({ src })}
							readOnly={inRead}
						/>
					</BoxV>
					<BoxV>
						<Label type={LABELS.SUBTEXT}>DESTINATION</Label>
						<TextInput
							value={config.republish?.dest}
							onChange={dest => handleRepublishPropChange({ dest })}
							readOnly={inRead}
						/>
					</BoxV>
					<Box>
						<IconToggle
							check={config.republish?.headersOnly}
							onChange={headersOnly => handleRepublishPropChange({ headersOnly })}
							readOnly={inRead}
						/>
						<Label type={LABELS.SUBTEXT}>HEADERS ONLY</Label>
					</Box>
				</Quote>
			</Accordion>
		</BoxV>


	</Form>
}

export default EditForm

const cssList = (readOnly: boolean, variant: number): React.CSSProperties => ({
	backgroundColor: readOnly ? "rgb(0 0 0 / 50%)" : layoutSo.state.theme.palette.var[COLOR_VAR.DEFAULT].bg,
	color: layoutSo.state.theme.palette.var[variant].bg,
})