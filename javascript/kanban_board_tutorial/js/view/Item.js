// import DropZone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class Item {
	constructor(id, content) {
		// const bottomDropZone = DropZone.createDropZone();

		this.elements = {};
		this.elements.root = Item.createRoot();
		this.elements.input = this.elements.root.querySelector(".kanban__item-input");
		//idとcontentの個別情報を取得
		this.elements.root.dataset.id = id;
		this.elements.input.textContent = content;
		this.content = content;
		// this.elements.root.appendChild(bottomDropZone);

		const onBlur = () => {
			const newContent = this.elements.input.textContent.trim();

			//新しく打ち込んだものと過去のものが=だった場合はそのままを返す
			if (newContent == this.content) {
				return;
			}
			//異なる場合APIを呼び込む
			this.content = newContent;
			//新しい書き込みを保存する。
			//初めての入力が空白であるため、これによって情報がアップデートされる。
			KanbanAPI.updateItem(id, {
				content: this.content
			});
		};

		this.elements.input.addEventListener("blur", onBlur);
		this.elements.root.addEventListener("dblclick", () => {
			//削除する際に確認のポップアップ表示
			const check = confirm("Are you sure you want to delete this item?");
			//もしチェックがtrueであれば、以下の処理を実行
			if (check) {
				KanbanAPI.deleteItem(id);
				//削除の処理を実行。リロードすると削除されている。
				this.elements.input.removeEventListener("blur", onBlur);
				this.elements.root.parentElement.removeChild(this.elements.root);
			}
		});

		// this.elements.root.addEventListener("dragstart", e => {
		// 	e.dataTransfer.setData("text/plain", id);
		// });

		// this.elements.input.addEventListener("drop", e => {
		// 	e.preventDefault();
		// });
	}

	static createRoot() {
		const range = document.createRange();

		range.selectNode(document.body);

		return range.createContextualFragment(`
			<div class="kanban__item" draggable="true">
				<div class="kanban__item-input" contenteditable></div>
			</div>
		`).children[0];
	}
}