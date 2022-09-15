import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
	static createDropZone() {
		const range = document.createRange();

		range.selectNode(document.body);

		const dropZone = range.createContextualFragment(`
			<div class="kanban__dropzone"></div>
		`).children[0];
		//dropZoneを作る処理
		dropZone.addEventListener("dragover", e => {
			e.preventDefault();
			dropZone.classList.add("kanban__dropzone--active");
		});
		//dropzoneから外れたらdropzoneが消える処理
		dropZone.addEventListener("dragleave", () => {
			dropZone.classList.remove("kanban__dropzone--active");
		});

		dropZone.addEventListener("drop", e => {
			e.preventDefault();
			dropZone.classList.remove("kanban__dropzone--active");
			//.kanban_columnの全ての情報を取得
			const columnElement = dropZone.closest(".kanban__column");
			//カラムのidを教えてくれる処理
			const columnId = Number(columnElement.dataset.id);
			//自分がドロップした先の全ての配列情報を教えてくれる処理
			const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));
			//自分がドロップした先がカラム上のどの配列に所属するかを教えてくれる処理
			const droppedIndex = dropZonesInColumn.indexOf(dropZone);
			//自分がドロップした先の一個上の全ての情報を取得してくれる処理
			const itemId = Number(e.dataTransfer.getData("text/plain"));
			//自分がドロップした先の一個上とドロップしたものの情報を取得する処理
			const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
			const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

			if (droppedItemElement.contains(dropZone)) {
				return;
			}
			//リロードしなくても、ドラッグ&ドロップできる
			insertAfter.after(droppedItemElement);
			//ドラッグ&ドロップしたものをローカルストレージに保存する。
			KanbanAPI.updateItem(itemId, {
				columnId,
				position: droppedIndex
			});
			console.log(insertAfter);
		});

		return dropZone;
	}
}