const Gtk = imports.gi.Gtk;

import GtkComponent from '../GtkComponent';

export default class Entry extends GtkComponent {
  createNewNode() {
    return new Gtk.Entry();
  }
}

