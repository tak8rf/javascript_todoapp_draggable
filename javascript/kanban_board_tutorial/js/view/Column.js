import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./DropZone.js";
import Item from "./Item.js";

export default class Column {
	constructor(id, title) {
		const topDropZone = DropZone.createDropZone();

		this.elements = {};
		//作成したHTML全体を取得
		this.elements.root = Column.createRoot();
		//指定したクラスの要素を取得
		this.elements.title = this.elements.root.querySelector(".kanban__column-title");
		this.elements.items = this.elements.root.querySelector(".kanban__column-items");
		this.elements.addItem = this.elements.root.querySelector(".kanban__add-item");
		//Kanban.jsのidとtitleを取得
		this.elements.root.dataset.id = id;
		this.elements.title.textContent = title;
		//カラムのトップに追加できるようにcolum.jsにも作っておく。
		this.elements.items.appendChild(topDropZone);

		//クリックすることでitemを作成
		this.elements.addItem.addEventListener("click", () => {
			const newItem = KanbanAPI.insertItem(id, "");
			//作成されたnewItemを返す
			this.renderItem(newItem);
		});
		//itemを取得
		KanbanAPI.getItems(id).forEach(item => {
			this.renderItem(item);
		});
	}
	//HTMLを作成
	static createRoot() {
		
		const range = document.createRange();

		range.selectNode(document.body);

		return range.createContextualFragment(`
			<div class="kanban__column">
				<div class="kanban__column-title"></div>
				<div class="kanban__column-items"></div>
				<button class="kanban__add-item" type="button">+ Add</button>
			</div>
		`).children[0];
	}

	renderItem(data) {
		const item = new Item(data.id, data.content);

		this.elements.items.appendChild(item.elements.root);
	}
}