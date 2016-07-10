const Gtk = imports.gi.Gtk;

import GtkComponent from '../GtkComponent';

export default class Label extends GtkComponent {
  createNewNode() {
    return new Gtk.Label();
  }
}

