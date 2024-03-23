import TooltipWrapCmp from "@/components/TooltipWrapCmp"
import CopyButton from "@/components/buttons/CopyButton"
import IconButton from "@/components/buttons/IconButton"
import Base64Cmp from "@/components/formatters/base64/Base64Cmp"
import HexTable from "@/components/formatters/hex/HexTable"
import JsonRow from "@/components/formatters/json/JsonRow"
import TextRow from "@/components/formatters/text/TextRow"
import CloseIcon from "@/icons/CloseIcon"
import { MESSAGE_TYPE, Message } from "@/types/Message"
import { MSG_FORMAT } from "@/utils/editor"
import { dateShow } from "@/utils/time"
import { FunctionComponent, useMemo } from "react"
import cls from "./MessageRow.module.css"


interface Props {
	message?: Message
	format?: MSG_FORMAT
	index?: number
	onClick?: (message: Message) => void
	onDelete?: (message: Message) => void
}

const MessageRow: FunctionComponent<Props> = ({
	message,
	format,
	index,
	onClick,
	onDelete,
}) => {

	// STORE

	// HOOKs

	// HANDLER
	const handleClick = () => onClick?.(message)
	const handleDeleteClick = (e: React.MouseEvent<Element, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		onDelete?.(message)
	}

	// RENDER
	if (!message) return null
	const time = useMemo(
		() => message.receivedAt ? dateShow(message.receivedAt) : null,
		[message.receivedAt]
	)
	const clsBg = index % 2 == 0 ? cls.bg1 : cls.bg2
	const clsRoot = `${cls.root} ${clsBg}`


	if (message.seqNum == MESSAGE_TYPE.SUBJECT_CHANGE) {
		return <div className={`color-bg ${cls.sbj_root}`}>
			<div className="bars-alert-bg" style={{ height: 10 }} />
			<div className={cls.sbj_title}>{message.subject}</div>
			<div className={cls.sbj_list}>{message.payload}</div>
			<div className={cls.footer}>{time}</div>
			<div className="bars-alert-bg" style={{ height: 10 }} />
		</div>
	}

	return (
		<div className={`hover-container ${clsRoot}`}
			onClick={handleClick}
		>
			<div className={cls.title}>
				<div style={{ flex: 1, display: "flex" }}>
					{message.seqNum} <span className={`${cls.subject} hover-container`}>
						{message.subject}
					</span>
				</div>
				<div className={`hover-show ${cls.box_actions} ${clsBg}`}>
					<CopyButton value={message.subject} label="COPY SUBJECT" />
					<CopyButton value={message.payload} />
					{!!onDelete && (
						<TooltipWrapCmp content="DELETE">
							<IconButton onClick={handleDeleteClick}>
								<CloseIcon />
							</IconButton>
						</TooltipWrapCmp>
					)}
				</div>
			</div>

			{{
				[MSG_FORMAT.JSON]: <JsonRow text={message.payload} />,
				[MSG_FORMAT.TEXT]: <TextRow text={message.payload} />,
				[MSG_FORMAT.BASE64]: <Base64Cmp text={message.payload} maxChar={80} />,
				[MSG_FORMAT.HEX]: <HexTable text={message.payload} maxRows={10} />,
			}[format]}

			{time && (
				<div className={cls.footer}>{time}</div>
			)}
		</div>
	)
}

export default MessageRow
