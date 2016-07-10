const Gtk = imports.gi.Gtk;

import GtkComponent from '../GtkComponent';

export default class ScrolledWindow extends GtkComponent {
  createNewNode() {
    return new Gtk.ScrolledWindow();
  }
}

