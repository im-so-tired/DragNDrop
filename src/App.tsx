import React from 'react';
import styles from './App.module.scss'
import {data} from './data'
import DragNDrop from "./Components/DragNDrop";
function App() {
	return (
		<div className={styles.App}>
			<DragNDrop data={data} />
		</div>
	);
}

export default App;
