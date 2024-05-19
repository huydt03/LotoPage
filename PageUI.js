function _$(type = 'div', attrs = {}, text = ''){

	let target = document.createElement(type);

	for(let attr in attrs){
		let value = attrs[attr];
		target.setAttribute(attr, value);
	}
	target.innerHTML = text;

	return target;
}

function PageUI(page){

	const ROWS = 9;
	const COLS = 9;

	let target = _$('div', {'class': 'loto-page'});

	function pageRow(){
		return _$('div', {class: 'page-row'});
	}

	function pageItem(num){
		let target = _$('div', {'class': `page-num${num? ' has-num': ''}`}, `<div>${num}</div>`);
		if(num)
			target.onclick = function(){
				target.isActive = !target.isActive;
				target.setAttribute('active', target.isActive);
			}

		return target;
	}

	function update(_page = page){
		page = _page;

		target.innerHTML = '';
		for(let i = 0; i< ROWS; i++){
			let target_row = new pageRow;
			for(let j = 0; j < COLS; j++){
				let num = page[i][j]?? '';
				let target_num = pageItem(num);
				target_row.append(target_num);
			}
			// append empty row
			if(i && i % 3 == 0)
				target.append(_$('div', {class: 'page-row', 'row-empty': 1}));
			target.append(target_row);
		}

		return target;

	}

	update();

	return {
		get target(){ return target; },
		get update(){ return update; },
	};

}