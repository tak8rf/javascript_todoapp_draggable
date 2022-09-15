export default class KanbanAPI{
    //itemの中をとってくる処理
    static getItems(columnId) {
        //https://ginpen.com/2018/12/04/array-find/
        //ローカルストレージの中からcolumIdを取得
		const column = read().find(column => column.id == columnId);
        //カラムがなければ空を返す
		if (!column) {
			return [];
		}

		return column.items;
	}

    //itemの中にデータを入力する処理
    static insertItem(columnId, content) {
		//ローカルストレージの情報をdataという定数へ代入
		const data = read();
		const column = data.find(column => column.id == columnId);
		const item = {
			//0~10000までの整数をランダムに選ぶ。
			//0~9999.9999のいずれかの数字がランダムに選ばれ、Math.floorによって、小数点が切り捨てられる。
			id: Math.floor(Math.random() * 100000),
			content
		};

		if (!column) {
			throw new Error("Column does not exist.");
		}

		column.items.push(item);
		save(data);

		return item;
	}

	static updateItem(itemId, newProps) {
		const data = read();
		const [item, currentColumn] = (() => {
			for (const column of data) {
				const item = column.items.find(item => item.id == itemId);
                //itemの情報と、そのitemを含んだカラムの情報を取得
				if (item) {
					return [item, column];
				}
			}
		})();
        //itemがなければ、エラー分を表示
		if (!item) {
			throw new Error("Item not found.");
		}
        //新しい情報に置き換え処理。もしなければ、そのままキープ
		item.content = newProps.content === undefined ? item.content : newProps.content;

		// Update column and position
        //trueなら以下の処理を実行
		if (
			newProps.columnId !== undefined
			&& newProps.position !== undefined
		) {
			const targetColumn = data.find(column => column.id == newProps.columnId);
            //空ならエラー分
			if (!targetColumn) {
				throw new Error("Target column not found.");
			}

			// Delete the item from it's current column
			currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

			// Move item into it's new column and position
			targetColumn.items.splice(newProps.position, 0, item);
		}

		save(data);
	}

    
	static deleteItem(itemId) {
		const data = read();

		for (const column of data) {
			const item = column.items.find(item => item.id == itemId);

			if (item) {
				column.items.splice(column.items.indexOf(item), 1);
			}
		}

		save(data);
	}
}

function read() {
    //ローカルストレージからデータを取得
	const json = localStorage.getItem("kanban-data");
    //データが入っていない場合は、デフォルトで3項目を表示
	if (!json) {
		return [
			{
				id: 1,
				items: []
			},
			{
				id: 2,
				items: []
			},
			{
				id: 3,
				items: []
			},
		];
	}
    //文字列で変換されているデータを使いやすいように変換
	return JSON.parse(json);
}

function save(data) {
	localStorage.setItem("kanban-data", JSON.stringify(data));
}