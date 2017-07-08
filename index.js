"use strict";

class List {
	constructor(options) {
		this.layout = {
			container: options.container,
			wrapper: null,
			name: null,
		};

		this.items = [];

		this.loadData(options);
	};

	loadData(json) {
		if (json && Array.isArray(json.items)) {
			json.items.forEach(function(item) {
				this.addItem(item);
			}, this);
		}
	};

	addItem(item) {

		let itemObj = new Item (item);

		itemObj.setList(this);

 		this.items.push(itemObj);
		this.draw();
	}

		//удаление item
	removeItem (removedItem) {
		this.items = this.items.filter((item) => {
			return item.id !== removedItem.id;
		});

	}

	getItemById(id) {
		  for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].id === id) return i;
		  }
		  console.log("тут");
	}

	moveItem(itemId, beforeItemId) {
		let item = this.items[this.getItemById(itemId)];

		if (itemId === beforeItemId) {
			return;
		} 

		this.removeItem(item);

		let beforeItemIndex = -1;
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].id === beforeItemId) {
					beforeItemIndex = i;
					break;
				}
			}

		this.items.splice(beforeItemIndex, 0, item);

		this.draw();
	}

	draw() {
		if (!this.layout.wrapper) {
			this.layout.wrapper = document.createElement("div");
			this.layout.wrapper.className = "list";
			this.layout.container.appendChild(this.layout.wrapper);

			this.layout.name = document.createElement("div");
			this.layout.name.className = "list__title";
			this.layout.name.textContent = "Structure";
			this.layout.wrapper.appendChild(this.layout.name);
		}

		//Обнулить контейнер 
		this.layout.wrapper.innerHTML = '';


		for (let itemId in this.items) {
			var item = this.items[itemId];
			this.layout.wrapper.appendChild(item.render());

			//+1 потому что нумерация начиналась с 0, а нужно с 1.
			item.layout.number.textContent = +itemId + 1;
		}

	}

}

class Item {
	constructor(options) {
		this.title = options.heading;
		this.content = options.content;
		this.id = options.id;
		this.list = null;
		this.counter = 0;

		this.layout = {
			container: null,
			header: null,
			title: null,
			content: null,
			content_wrapper: null,
			number: null,
			button: null,
			menu: null,
			wrapper: null,
			buttons: null,
			textarea: null,
			wrapper_edit: null
		};
	}

	setList(list) {
		this.list = list;
	}

	//Установка обработчиков событий
	initEvents() {
		this.layout.container.addEventListener('click', this.onCLick.bind(this));
	}

	getId() {
		return this.id;
	}

	createElement(tag, props, text, ...children) {
		var element = document.createElement(tag);

		for(var pr in props){
			element.setAttribute(pr, props[pr]);
		}

		if (text !== 0) {
			element.textContent = text;
		}
		
		if (children.length > 0) {
			children.forEach(function(child){
				element.appendChild(child);
			});
		}

		return element;
	}

	render() {
		if (!this.layout.container) {

			this.layout.number = this.createElement("div", { class: "item__number" });
			this.layout.title = this.createElement("div", { class: "item__title"}, this.title);
			this.layout.header = this.createElement("div", { class: "item__header" }, 0, this.layout.number, this.layout.title);

			this.layout.edit = this.createElement("div", { class: "item__edit"}, "Edit");
			this.layout.delete = this.createElement("div", { class: "item__delete"}, "Delete");
			this.layout.menu = this.createElement("div", { class: "item__menu" }, 0, this.layout.edit, this.layout.delete);

			this.layout.content = this.createElement("div", { class: "item__content"}, this.content);
			this.layout.button = this.createElement("div", { class: "item__button" });
			this.layout.content_wrapper = this.createElement("div", { class: "item__content-wrapper" }, 0, this.layout.content, this.layout.button, this.layout.menu);

			this.layout.wrapper = this.createElement("div", { class: "item__inner-wrapper" }, 0, this.layout.header, this.layout.content_wrapper);

			//форма редактирования		
			this.layout.save = this.createElement("button", { class: "item__save-button"}, "Save" );
			this.layout.cancel = this.createElement("button", { class: "item__cancel-button"}, "Cancel" );
			this.layout.buttons = this.createElement("div", { class: "item__buttons" }, 0, this.layout.save, this.layout.cancel);

			this.layout.input_title = this.createElement("input", { class: "item__input-title", type:"text", name:"new_title", value: this.title });
			this.layout.textarea = this.createElement("textarea", { class: "item__textarea", type:"text", name:"new_content"}, this.content);

			this.layout.wrapper_edit = this.createElement("div", { class: "item__inner-wrapper-editable" }, 0, this.layout.input_title, this.layout.textarea, this.layout.buttons);

			this.layout.container = this.createElement("div", { class: "item" }, 0, this.layout.wrapper, this.layout.wrapper_edit);

			
			this.layout.header.addEventListener('dragstart', this.dragStart.bind(this), false);
			this.layout.container.addEventListener('dragover', this.dragOver.bind(this), false);
			this.layout.container.addEventListener('dragenter', this.dragEnter.bind(this), false);
			this.layout.container.addEventListener('dragleave', this.dragLeave.bind(this), false);
			this.layout.container.addEventListener('drop', this.drop.bind(this), false);

			this.layout.header.setAttribute("draggable", "true");
			this.layout.header.style.cursor = "move";

			this.initEvents();
		}

		return this.layout.container;
	}

	dragStart(e) {
		this.list.dragObj = this;
		//устанавливаем тип действия и записываем данные переносимого объекта
		e.dataTransfer.effectAllowed = 'move';

		var data = this.list.dragObj.getId();
		e.dataTransfer.setData('obj', data);
	}

	dragOver(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move'; //указатель браузера принимает нужный вид при переносе
		return false;
	}

	drop(e) {
		e.preventDefault();

		var dragObj = this.list.dragObj;
		this.list.moveItem(dragObj.getId(), this.getId());

		this.layout.container.classList.remove("add-border");

		console.log(this.counter);
		this.counter = 0;

		return false;
	}

	dragEnter(e) {
		e.stopPropagation();
		e.preventDefault();
		this.counter++;

		if (this.list.dragObj != this) {
			this.layout.container.classList.add("add-border");
		}
	}

	dragLeave(e) {
		e.stopPropagation();

		this.counter--;

		if (this.counter === 0) {
			this.layout.container.classList.remove("add-border");
		}
	}

	onCLick(event) {
		var target = event.target;
		var itemNode = target.parentNode.parentNode.parentNode;

		if(target.classList.contains('item__button')) {
			target.nextElementSibling.classList.toggle('item__menu--show');
		};

		if(target.classList.contains('item__delete')) {
			this.list.removeItem(this);
			this.list.draw();
		};

		if(target.classList.contains('item__edit')) {
			var itemEdit = target.parentNode.parentNode.parentNode.parentNode;
			itemEdit.classList.toggle('item-editable');
		};

		if(target.classList.contains('item__save-button')) {

			var newTitle = itemNode.querySelector(".item__input-title").value;
			this.setTitle(newTitle);

			var newContent = itemNode.querySelector(".item__textarea").value;;
			this.setContent(newContent);

			itemNode.classList.toggle('item-editable');
			itemNode.querySelector(".item__menu").classList.toggle('item__menu--show');

		};

		if(target.classList.contains('item__cancel-button')) {
			itemNode.classList.toggle('item-editable');
			itemNode.querySelector(".item__menu").classList.toggle('item__menu--show');
		};
	}

	setTitle(title) {
		this.title = title;
		this.layout.title.innerHTML = title;
	}

	setContent(content) {
		this.content = content;
		this.layout.content.innerHTML = content;
	}

	/**
	* Возможность подписываться на событие
	*/
	on (name, callback) {
		this.elem.addEventListener(name, callback);
	}

	/**
	* Создаем событие
	*/
	trigger(name, data) {
		let widgetEvent = new CustomEvent(name, {
			bubbles: true,
			detail: data
		});
		this.layout.container.dispatchEvent(widgetEvent);
	}

}


var elementList = new List ({
	items: [
		{
			"id": "Roboid",
			"heading": "Roboid",
			"content": "Sit occaecat magna laborum dolore excepteur est culpa voluptate nostrud anim est eu. Commodo in occaecat laborum minim nostrud ipsum. Pariatur occaecat labore ex ex. Enim et ea nisi anim tempor ea tempor eu incididunt elit mollit laboris enim tempor."
		},
		{
			"id": "Netplode",
			"heading": "Netplode",
			"content": "Elit et mollit cillum non quis commodo anim incididunt et laboris. Cupidatat deserunt veniam consectetur qui qui ut mollit. Consequat laboris Lorem et cupidatat aliquip ea. Enim excepteur pariatur velit sit in duis adipisicing proident aute nostrud incididunt pariatur esse."
		},
		{
			"id": "Qaboos",
			"heading": "Qaboos",
			"content": "Duis do cillum anim reprehenderit. Deserunt qui consequat magna adipisicing commodo elit ad Lorem id ullamco laboris. Veniam aliqua dolore voluptate deserunt sit. Duis quis proident Lorem Lorem Lorem sint pariatur nisi occaecat ut ut nulla esse."
		},
		{
			"id": "Obliq",
			"heading": "Obliq",
			"content": "Sit non amet sit consectetur irure dolore nulla exercitation do commodo cupidatat occaecat velit. Ex excepteur do quis ullamco anim magna aute ad qui. Mollit do labore consequat id adipisicing nisi est sit do esse quis. Proident culpa nisi reprehenderit esse voluptate."
		},
		{
			"id": "Kangle",
			"heading": "Kangle",
			"content": "Ea sunt magna laboris irure pariatur amet ipsum dolor elit. Eu labore sit aute pariatur laboris Lorem minim nisi anim veniam nostrud. Eiusmod fugiat dolor ex mollit commodo. Eiusmod reprehenderit nisi deserunt ut velit."
		}
	],
	container: document.getElementById("list")
})


