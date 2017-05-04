export function extend(u) {
	for (let prop in plugs) {
		if (! (prop in u)) {
			u.prototype[prop] = plugs[prop];
		}
	}
}

let plugs = {

	css: function(prop, value) {
		if (typeof value === 'number') {
			value += 'px';
		}
		this.each(node => {
			node.style[prop] = value;
		});
		return this;
	},

	empty: function() {
		this.each(node => {
			while (node.firstChild) {
				node.removeChild(node.firstChild);
			}
		});
		return this;
	},

	appends: function() {
		let args = Array.prototype.slice.call(arguments),
			children;
		this.each(node => {
			children = args.reduce((frag, arg) => {
				frag.appendChild(arg);
				return frag;
			}, document.createDocumentFragment());
			node.appendChild(children);
		});
		return this;
	}

}