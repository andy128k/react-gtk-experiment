const Gtk = imports.gi.Gtk;

import GtkComponent from '../GtkComponent';

export default class TextView extends GtkComponent {
  createNewNode() {
    return new Gtk.TextView();
  }

  setProp(prop, value) {
    if (prop === 'text') {
      this.node.buffer.text = value;
    } else {
      super.setProp(prop, value);
    }
  }
}

