import React, {FC, useState} from 'react';
import {IData} from "../data";
import styles from "../App.module.scss";
import cn from 'classnames'
interface ICurrentItem{
	grpI:number
	itmI:number
}

const DragNDrop:FC<{data:IData[]}> = ({data}) => {
	const [list, setList] = useState(data)
	const [dragging, setDragging] = useState<boolean>(false)
	const [dragItem, setDragItem] = useState<ICurrentItem | null>()
	const [dragNode, setDragNode] = useState<EventTarget | null>()

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>, params:ICurrentItem) => {
		setDragItem(params)
		setDragNode(prevState => {
			prevState = e.target
			prevState.addEventListener('dragend', handleDragEnd)
			return prevState
		})
		setTimeout(() => setDragging(true),0)
	}

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, params:ICurrentItem) => {
		if(dragging && dragNode !== e.target){
			setList(prev => {
				const currentItem = dragItem
				if(currentItem) {
					let newList: IData[] = JSON.parse(JSON.stringify(prev))
					const deletedItem = newList[currentItem.grpI].items.splice(currentItem.itmI,1)[0]
					newList[params.grpI].items.splice(params.itmI,0, deletedItem)
					setDragItem(params)
					return newList
				} else {
					return prev
				}
			})
		}
	}

	const handleDragEnd = () => {
		setDragging(false)
		setDragItem(null)
		setDragNode(prevState => {
			prevState?.removeEventListener('dragend', handleDragEnd)
			prevState = null
			return prevState
		})
	}

	const getStyleItem = (params:ICurrentItem) => {
		const currentItem = dragItem
		if(currentItem?.itmI === params.itmI && currentItem.grpI === params.grpI){
			return cn(styles.item, styles.currentItem)
		}
		return styles.item
	}
	return (
		<section className={styles.dragAndDrop}>
			{list.map((grp,grpI) => (
				<div
					key={grp.title}
					className={styles.group}
					onDragEnter={dragging && !grp.items.length ? (e) => handleDragEnter(e,{grpI, itmI:0}) : () => {}}
				>
					<h3 className={styles.title}>{grp.title}</h3>
					{grp.items.map((itm, itmI) => (
						<div
							onDragStart={(e) => handleDragStart(e, {grpI, itmI})}
							onDragEnter={(e) => handleDragEnter(e,{grpI, itmI})}
							draggable
							key={itmI}
							className={dragging?getStyleItem({itmI,grpI}):styles.item}
						>
							<p>{itm}</p>
						</div>
					))}
				</div>
			))}
		</section>
	);
};

export default DragNDrop;
