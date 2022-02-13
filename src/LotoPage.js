const EventHandle = require('drhuy-event-handler');

function LotoPage(){

	const PAGE_ROWS 	= 9;

	const PAGE_COLS 	= 9;

	const NUM_PER_ROWS 	= 5;

	const VALUE_EMPTY 	= -1;

	// page(matrix integer)
	let page;

	let events = [
		'onCreated',
		'onBeforeCheck',
		'onAfterCheck',
		'onBeforeInit',
		'onAfterInit'
	];

	let handle;

	let self = {page, handle, check};


	// DEFAULT_PAGE(matrix integer): [[0...9],[10...19]...[80...90]]
	const DEFAULT_PAGE = (()=>{
		let _default_mPage = [];
		for(let i = 0; i< PAGE_COLS; i++){
			let a_col = [];
			for(let j = 0; j<= PAGE_ROWS; j++){
				a_col[j] = i*10 + j;
			}
			_default_mPage[i] = a_col;
		}

		// add 90 after array
		_default_mPage[PAGE_COLS - 1][PAGE_ROWS+1] = 90;

		return _default_mPage;
	})();

	function changePositionArrayItems(_array){
		let array = _array.slice();
		let len = array.length - 1;
		for(let i = len; i >= 0; i--){
			let r = Math.round(Math.random()*i);
			let tmp = array[i];
			array[i] = array[r];
			array[r] = tmp;
		}
		return array;
	}

	function initPage(){
		let tmp_page = [];

		handle.onBeforeInit.fire(page);

		function get_rand_ids_per_row(rowId, ids = {}, count = NUM_PER_ROWS){
			if(count <= 0)
				return ids;
			let r = Math.round(Math.random() * (PAGE_COLS - 1));
			if(ids[r] || !tmp_page[r][rowId]){
				return get_rand_ids_per_row(rowId, ids, count);
			}
			ids[r] = true;
			return get_rand_ids_per_row(rowId, ids, --count);
		}

		function rotate_page(old_page = []){
			let new_page = [];
			for(let i = 0; i< PAGE_ROWS; i++){
				new_page[i] = [];
				for(let j = 0; j < PAGE_COLS; j++){
					new_page[i][j] = old_page[j][i];
				}
			}

			return new_page;
		}

		for(let i = 0; i< PAGE_COLS; i++){
			tmp_page[i] = changePositionArrayItems(DEFAULT_PAGE[i]);
		}

		for(let i = 0; i<= PAGE_ROWS; i++){
			let ids = get_rand_ids_per_row(i);
			for(let j = 0; j< PAGE_COLS; j++){
				if(!ids[j])
					tmp_page[j][i] = VALUE_EMPTY;
			}
		}
		page = rotate_page(tmp_page);

		handle.onAfterInit.fire(page);

		return page;
	}

	function change(){
		return initPage();
	}

	function check(numsCalled = {}){
		let result = false;
		let row = [];
		handle.onBeforeCheck.fire()
		for(i = 0; i < PAGE_ROWS; i++){
			let r = true;
			for(j = 0; j < PAGE_COLS; j++){
				let n = page[i][j];
				if(n != VALUE_EMPTY && !numsCalled[n])
				{
					r = false;
					break;
				}
			}
			if(r){
				row.push(i);
				result = true;
			}
		}
		handle.onAfterCheck.fire({result, row});
		return result;
	}

	(function init(){
		handle = new EventHandle(self, events)
		page = initPage();
		handle.onCreated.fire(page);

		Object.defineProperties(self, {
			page: {
				get: function(){return page}
			},
			handle: {
				get: function(){ return handle; }
			},
			check: {
				get: function(){ return check; }
			},
			change: {
				get: function(){ return change; }
			}
		});


	})();

	return self;

}

module.exports = LotoPage;