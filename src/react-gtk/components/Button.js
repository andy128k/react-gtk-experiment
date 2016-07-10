const Gtk = imports.gi.Gtk;

import GtkComponent from '../GtkComponent';

export default class Button extends GtkComponent {
  createNewNode() {
    return new Gtk.Button();
  }
}

