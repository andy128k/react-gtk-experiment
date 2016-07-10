const Gtk = imports.gi.Gtk;

import GtkComponent from '../GtkComponent';

export default class Box extends GtkComponent {
  createNewNode() {
    return new Gtk.Box();
  }
}

