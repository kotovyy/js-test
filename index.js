"use strict"

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
    	if (json && Array.isArray(json.items))
    	{
    		json.items.forEach(function(item) {
    			this.addItem(item);
    		}, this);
    	}
	};

	addItem(item) {
		item = new Item (item);
		this.items.push(item);

		this.draw();
	}

	draw() {
		if (!this.layout.wrapper) {
            this.layout.wrapper = document.createElement("div");
            this.layout.wrapper.className = "list-wrapper";
            this.layout.container.appendChild(this.layout.wrapper);
        }
		console.log(this.items);
	}

}

class Item {
	constructor(item) {
		this.title = item.heading;
		this.content = item.content;

		this.layout = {
        	container: null,
            title: null,
            content: null,
            number: null,
            button: null
        };
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