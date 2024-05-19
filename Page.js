function Page(){

	const ROWS = 9;
	const COLS = 9;
	const TAKE = 5;
	const MAX_NUM = 10;

	let page;

	function randomArrayitems(items){
		return items.sort(function() {return 0.5 - Math.random()});
	}

	function change(){
		let _page = [];
		let col_items = [...Array(COLS).keys()];

		for(let i = 0; i< COLS; i++){
			let row = [];
			for(let j = 0; j < MAX_NUM; j++){
				let num = i * MAX_NUM + j;
				row.push(num);
			}
			_page.push(row);
		}

		// remove items[0][0] && add items[COLS][MAX_NUM]
		_page[0].splice(0,1);
		_page[COLS-1][MAX_NUM] = COLS*MAX_NUM;

		// random rows
		for(let i = 0; i < COLS; i++){
			_page[i] = randomArrayitems(_page[i]);
		}

		// make page

		page = {};
		for(let i = 0; i < ROWS; i++){
			let row = {};
			let rand_indexs = randomArrayitems(col_items);
			for(let j = 0; j < TAKE; j++){
				let index = rand_indexs[j];
				let num = _page[index][i];
				row[index] = num;
			}
			page[i] = row;

		}

		return page;
	}

	change();

	return {
		get page(){ return page; },
		get change(){ return change; }
	}

}
