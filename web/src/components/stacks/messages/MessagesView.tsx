import FrameworkCard from "@/components/FrameworkCard"
import Button from "@/components/buttons/Button"
import FindInput from "@/components/input/FindInput"
import cnnSo, { ConnectionState } from "@/stores/connections"
import { MessagesState, MessagesStore } from "@/stores/stacks/messages"
import { HistoryMessage } from "@/stores/stacks/messages/utils"
import { Subscription } from "@/types"
import { debounce } from "@/utils/time"
import { useStore } from "@priolo/jon"
import React, { FunctionComponent, useEffect, useRef, useState } from "react"
import Dialog from "../../dialogs/Dialog"
import SubscriptionsList from "../../lists/sunscriptions/SubscriptionsList"
import FormatDialog from "./FormatDialog"
import ItemsList from "./ItemsList"
import DropIcon from "@/icons/DropIcon"
import layoutSo from "@/stores/layout"
import { VIEW_SIZE } from "@/stores/stacks/viewBase"


interface Props {
	store?: MessagesStore
	style?: React.CSSProperties,
}

const MessagesView: FunctionComponent<Props> = ({
	store: msgSo,
	style,
}) => {

	// STORE
	const msgSa = useStore(msgSo) as MessagesState
	const cnnSa = useStore(cnnSo) as ConnectionState

	// HOOKs
	const [textFind, setTextFind] = useState(msgSa.textSearch ?? "")
	const dropRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!dropRef.current || msgSo.state.size != VIEW_SIZE.ICONIZED) return
		//const idInt = setInterval(() => {
			const animation = dropRef.current.animate([
				{ transform: 'translateY(0px)', visibility: "visible" },
				{ transform: 'translateY(600px)', opacity: 0 }
			], {
				duration: 1000,
				easing: layoutSo.state.theme.transitions[1]
			});
			animation.play();
		//}, 2000)
		//return () => clearInterval(idInt)
	}, [msgSo.state.history])

	// HANDLER
	//#region  SUBSCRIPTIONS
	const handleClickSubs = (e: React.MouseEvent, select: boolean) => {
		if (select) return
		msgSo.setSubscriptionsOpen(!select)
	}
	const handleCloseSubsDialog = () => {
		msgSo.setSubscriptionsOpen(false)
	}
	const handleChangeSubs = (newSubs: Subscription[]) => {
		msgSo.setSubscriptions(newSubs)
		debounce("MessagesView:handleChangeSubs", () => {
			msgSo.sendSubscriptions()
		}, 2000)
	}
	//#endregion

	const handleFormatsClick = () => msgSo.setFormatsOpen(true)
	const handleSendClick = () => msgSo.openMessageSend()
	const hendleMessageClick = (message: HistoryMessage) => msgSo.openMessageDetail(message)
	const handleSearchChange = (value: string) => {
		setTextFind(value)
		debounce(`text-find-${msgSa.uuid}`, () => msgSo.setTextSearch(value), 2000)
	}

	// RENDER
	const formatSel = msgSa.format.toUpperCase()
	const variant = msgSo.getColorVar()
	const history = msgSo.getHistoryFiltered()

	return <FrameworkCard
		store={msgSo}
		actionsRender={<>
			<FindInput
				value={textFind}
				onChange={handleSearchChange}
				variant={variant}
			/>
			<Button
				select={msgSa.formatsOpen}
				label={formatSel}
				variant={variant}
				onClick={handleFormatsClick}
			/>
			<Button
				select={msgSa.subscriptionsOpen}
				label="SUBJECTS"
				onClick={handleClickSubs}
				variant={variant}
			/>
			<Button
				label="SEND"
				onClick={handleSendClick}
				variant={variant}
			/>
		</>}
		iconizedRender={
			<div ref={dropRef} style={{ marginTop: 15, visibility: "hidden" }}>
				<DropIcon fill={layoutSo.state.theme.palette.var[variant].bg}/>
			</div>
		}
	>

		<ItemsList
			messages={history}
			format={msgSa.format}
			onMessageClick={hendleMessageClick}
			style={{ marginLeft: '-10px', marginRight: '-10px' }}
		/>

		<Dialog
			title="SUBJECTS"
			width={200}
			open={msgSa.subscriptionsOpen}
			store={msgSo}
			onClose={handleCloseSubsDialog}
		>
			<SubscriptionsList
				subscriptions={msgSa.subscriptions}
				onChange={handleChangeSubs}
			/>
		</Dialog>

		<FormatDialog store={msgSo} />

	</FrameworkCard>
}

export default MessagesView
