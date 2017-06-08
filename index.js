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
		this.items.push(item);

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
		
/*		this.items.forEach(function(item) {
            this.layout.wrapper.appendChild(item.render());
        }, this);*/

        for (let itemId in this.items)
        {
        	var item = this.items[itemId];

        	console.log(this.layout.wrapper);
            this.layout.wrapper.appendChild(item.render());
        }

	}

}

class Item {
	constructor(item, counter) {
		this.title = item.heading;
		this.content = item.content;
		this.counter = counter;

		this.layout = {
        	container: null,
        	header: null,
            title: null,
            content: null,
            number: null,
            button: null
        };
	}

	render() {
		if (!this.layout.container)
        {
        	this.layout.container = document.createElement("div");
            this.layout.container.className = "item";

            this.layout.header = document.createElement("div");
            this.layout.header.className = "item__header";
            this.layout.container.appendChild(this.layout.header);

            this.layout.number = document.createElement("div");
            this.layout.number.className = "item__number";

            this.layout.number.textContent = this.counter;
            this.layout.header.appendChild(this.layout.number);

            this.layout.title = document.createElement("div");
            this.layout.title.className = "item__title";
            this.layout.title.textContent = this.title;
            this.layout.header.appendChild(this.layout.title);

            this.layout.content = document.createElement("div");
            this.layout.content.className = "item__content";
            this.layout.content.textContent = this.content;
            this.layout.container.appendChild(this.layout.content);
        }

        return this.layout.container;
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