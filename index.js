"use strict"

class List {
	constructor(options) {
		this.layout = {
        	container: options.container,
        	wrapper: null,
            name: null,
        };

		this.items = [];
		this.counter = 0;

		this.loadData(options);
	};

	loadData(json) {
    	if (json && Array.isArray(json.items))
    	{
    		json.items.forEach(function(item) {
    			this.addItem(item);
    		}, this);
    	}
	};

    addItem(item) {

    	this.counter++;
		item = new Item (item, this.counter);

		item.setList(this);

 		this.items.push(item);
    	this.draw();
    }

        //удаление item
	removeItem (removedItem) {
        this.items = this.items.filter((item) => {
            return item.id !== removedItem.id;
        });

        console.log("мы тут");
	}

    moveItem(itemId, beforeItemId) {
        let item = this.items[itemId - 1];

        let beforeItem = this.items[beforeItemId - 1];	 

        this.removeItem(item);

		let beforeItemIndex = -1;
    		for (let i = 0; i < this.items.length; i++)
    		{
    			if (this.items[i].id === beforeItemId)
    			{
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

        for (let itemId in this.items)
        {
        	var item = this.items[itemId];
            this.layout.wrapper.appendChild(item.render());
        }
	}

}

class Item {
	constructor(item, counter) {
		this.title = item.heading;
		this.content = item.content;
		this.id = counter;
		this.list = null;

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
            textarea: null
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

	render() {
		if (!this.layout.container)
        {
        	this.layout.container = document.createElement("div");
            this.layout.container.className = "item";

            this.layout.wrapper = document.createElement("div");
            this.layout.wrapper.className = "item__inner-wrapper";
            this.layout.container.appendChild(this.layout.wrapper);

            this.layout.header = document.createElement("div");
            this.layout.header.className = "item__header";
            this.layout.wrapper.appendChild(this.layout.header);

            this.layout.number = document.createElement("div");
            this.layout.number.className = "item__number";

            this.layout.number.textContent = this.id;
            this.layout.header.appendChild(this.layout.number);

            this.layout.title = document.createElement("div");
            this.layout.title.className = "item__title";
            this.layout.title.textContent = this.title;
            this.layout.header.appendChild(this.layout.title);

            this.layout.content_wrapper = document.createElement("div");
            this.layout.content_wrapper.className = "item__content-wrapper";
            this.layout.wrapper.appendChild(this.layout.content_wrapper);

            this.layout.content = document.createElement("div");
            this.layout.content.className = "item__content";
            this.layout.content.textContent = this.content;
            this.layout.content_wrapper.appendChild(this.layout.content);

            this.layout.button = document.createElement("div");
            this.layout.button.className = "item__button";
            this.layout.content_wrapper.appendChild(this.layout.button);

            this.layout.menu = document.createElement("div");
            this.layout.menu.className = "item__menu";
            this.layout.content_wrapper.appendChild(this.layout.menu);

            this.layout.edit = document.createElement("div");
            this.layout.edit.className = "item__edit";
            this.layout.edit.textContent = "Edit";
            this.layout.menu.appendChild(this.layout.edit);

            this.layout.delete = document.createElement("div");
            this.layout.delete.className = "item__delete";
            this.layout.delete.textContent = "Delete";
            this.layout.menu.appendChild(this.layout.delete);

            //форма редактирования
            this.layout.wrapper = document.createElement("div");
            this.layout.wrapper.className = "item__inner-wrapper-editable";
            this.layout.container.appendChild(this.layout.wrapper);

            this.layout.input_title = document.createElement("input");
            this.layout.input_title.className = "item__input-title";
            this.layout.input_title.value = this.title;
            this.layout.input_title.setAttribute("type", "text");
            this.layout.input_title.setAttribute("name", "new_title");
            this.layout.wrapper.appendChild(this.layout.input_title);

            this.layout.textarea = document.createElement("textarea");
            this.layout.textarea.className = "item__textarea";
            this.layout.textarea.value = this.content;
            this.layout.textarea.setAttribute("type", "text");
            this.layout.textarea.setAttribute("name", "new_content");
            this.layout.wrapper.appendChild(this.layout.textarea);

            this.layout.buttons = document.createElement("div");
            this.layout.buttons.className = "item__buttons";
            this.layout.wrapper.appendChild(this.layout.buttons);

            this.layout.save = document.createElement("button");
            this.layout.save.className = "item__save-button";
            this.layout.save.textContent = "Save";
            this.layout.buttons.appendChild(this.layout.save);

            this.layout.cancel = document.createElement("button");
            this.layout.cancel.className = "item__cancel-button";
            this.layout.cancel.textContent = "Cancel";
            this.layout.buttons.appendChild(this.layout.cancel);


            this.layout.header.addEventListener('dragstart', this.dragStart.bind(this), false);
			this.layout.header.addEventListener('dragover', this.dragOver.bind(this), false);
			this.layout.header.addEventListener('drop', this.drop.bind(this), false);

			this.layout.header.setAttribute("draggable", "true");
			this.layout.header.style.cursor = "move";

			this.initEvents();
        }

        return this.layout.container;
	}

	dragStart(e) {
		//console.log("dragStart");

		this.list.dragObj = this;
		//устанавливаем тип действия и записываем данные переносимого объекта
		e.dataTransfer.effectAllowed = 'move';

		var data = this.list.dragObj.getId();

		e.dataTransfer.setData('obj', data);
	}

	dragOver(e) {
		//console.log("dragOver");

		e.preventDefault();
		e.dataTransfer.dropEffect = 'move'; //указатель браузера принимает нужный вид при переносе
		return false;
	}

	drop(e) {
		console.log("drop");

		e.preventDefault();

		var dataGet = e.dataTransfer.getData('obj');

		var dragObj = this.list.dragObj;
		this.list.moveItem(dragObj.getId(), this.getId());

		return false;
	}

	onCLick(event) {
        var target = event.target;
        var itemNode = target.parentNode.parentNode.parentNode.parentNode;

		if(target.classList.contains('item__button')) {
			target.nextElementSibling.classList.toggle('item__menu--show');
		};

		if(target.classList.contains('item__delete')) {
			this.list.removeItem(this);
			this.list.draw();
		};

		if(target.classList.contains('item__edit')) {
			
			itemNode.classList.toggle('item-editable');
		};

		if(target.classList.contains('item__save-button')) {
			var newTitle = itemNode.childNodes[0].childNodes[1].childNodes[0].value;
			this.setTitle(newTitle);

			var newContent = itemNode.childNodes[0].childNodes[1].childNodes[1].value;
			this.setContent(newContent);

			itemNode.childNodes[0].classList.toggle('item-editable');
			itemNode.childNodes[0].childNodes[0].childNodes[1].childNodes[2].classList.toggle('item__menu--show');
		};

		if(target.classList.contains('item__cancel-button')) {
			itemNode.childNodes[0].classList.toggle('item-editable');
			itemNode.childNodes[0].childNodes[0].childNodes[1].childNodes[2].classList.toggle('item__menu--show');
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
			"heading": "Roboid",
			"content": "Sit occaecat magna laborum dolore excepteur est culpa voluptate nostrud anim est eu. Commodo in occaecat laborum minim nostrud ipsum. Pariatur occaecat labore ex ex. Enim et ea nisi anim tempor ea tempor eu incididunt elit mollit laboris enim tempor."
		},
		{
			"heading": "Netplode",
			"content": "Elit et mollit cillum non quis commodo anim incididunt et laboris. Cupidatat deserunt veniam consectetur qui qui ut mollit. Consequat laboris Lorem et cupidatat aliquip ea. Enim excepteur pariatur velit sit in duis adipisicing proident aute nostrud incididunt pariatur esse."
		},
		{
			"heading": "Qaboos",
			"content": "Duis do cillum anim reprehenderit. Deserunt qui consequat magna adipisicing commodo elit ad Lorem id ullamco laboris. Veniam aliqua dolore voluptate deserunt sit. Duis quis proident Lorem Lorem Lorem sint pariatur nisi occaecat ut ut nulla esse."
		},
		{
			"heading": "Obliq",
			"content": "Sit non amet sit consectetur irure dolore nulla exercitation do commodo cupidatat occaecat velit. Ex excepteur do quis ullamco anim magna aute ad qui. Mollit do labore consequat id adipisicing nisi est sit do esse quis. Proident culpa nisi reprehenderit esse voluptate."
		},
		{
			"heading": "Kangle",
			"content": "Ea sunt magna laboris irure pariatur amet ipsum dolor elit. Eu labore sit aute pariatur laboris Lorem minim nisi anim veniam nostrud. Eiusmod fugiat dolor ex mollit commodo. Eiusmod reprehenderit nisi deserunt ut velit."
		}
	],
	container: document.getElementById("list")
})


