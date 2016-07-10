import React from 'react';
import renderGtk, {Box, Label, Entry, Button, ScrolledWindow, TextView} from './react-gtk';

const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Gda = imports.gi.Gda;

class DemoWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      text: '',
      count: '',
      t: false
    };
  }

  componentDidMount() {
    this.setupDatabase();
    this.selectData();
  }

  render() {
    const { id, name } = this.state;

    return (
      <Box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
        <Label label="<b>Insert a record</b>" xalign={0} use_markup={true} box__padding={5} />
        <Box orientation={Gtk.Orientation.HORIZONTAL} spacing={5} box__padding={5}>
          <Label label="ID:" box__padding={5} />
          <Entry box__padding={5} text={id} signal__changed={this._changed.bind(this, 'id')} />

          <Label label="Name:" box__padding={5} />
          <Entry activates_default={true} box__padding={5} text={name} signal__changed={this._changed.bind(this, 'name')} />

          <Button label="Insert" can_default={true} signal__clicked={this._insertClicked.bind(this)} box__padding={5} />
        </Box>

        <Box orientation={Gtk.Orientation.HORIZONTAL} spacing={5} box__padding={5}>
          <Button label="Toggle" signal__clicked={this._toggleClicked.bind(this)} box__padding={5} />
          {this.state.t ? <Label label="AAA" /> : null}
        </Box>

        <Label label="<b>Browse the table</b>" xalign={0} use_markup={true} box__padding={5} />

        <ScrolledWindow shadow_type={Gtk.ShadowType.IN} box__padding={5}>
          <TextView editable={false} text={this.state.text} />
        </ScrolledWindow>

        <Label label={this.state.count} xalign={0} use_markup={true} />
      </Box>
    );
    // this.text.buffer.text = text;
    // insert_button.grab_default ();
  }

  _toggleClicked() {
    this.setState({t: !this.state.t});
  }

  _changed(what, entry) {
    this.setState({[what]: entry.text});
  }

  setupDatabase() {
    this.connection = new Gda.Connection ({provider: Gda.Config.get_provider("SQLite"),
                                           cnc_string:"DB_DIR=" + GLib.get_home_dir () + ";DB_NAME=gnome_demo"});
    this.connection.open ();

    try {
      var dm = this.connection.execute_select_command ("select * from demo");
    } catch (e) {
      this.connection.execute_non_select_command ("create table demo (id integer, name varchar(100))");
    }
  }

  selectData() {
    var dm = this.connection.execute_select_command  ("select * from demo order by 1, 2");
    var iter = dm.create_iter ();

    var text = "";

    while (iter.move_next ()) {
      var id_field = Gda.value_stringify (iter.get_value_at (0));
      var name_field = Gda.value_stringify (iter.get_value_at (1));

      text += id_field + "\t=>\t" + name_field + '\n';
    }

    this.setState({
      text: text,
      count: "<i>" + dm.get_n_rows () + " record(s)</i>"
    });
  }

  _showError(msg) {
    var dialog = new Gtk.MessageDialog ({message_type: Gtk.MessageType.ERROR,
                                         buttons: Gtk.ButtonsType.CLOSE,
                                         text: msg,
                                         transient_for: this.window,
                                         modal: true,
                                         destroy_with_parent: true});
    dialog.run ();
    dialog.destroy ();
  }

  _insertClicked() {
    if (!this._validateFields())
      return;

    var b = new Gda.SqlBuilder ({stmt_type:Gda.SqlStatementType.INSERT});
    b.set_table ("demo");
    b.add_field_value_as_gvalue ("id", this.state.id);
    b.add_field_value_as_gvalue ("name", this.state.name);
    var stmt = b.get_statement ();
    this.connection.statement_execute_non_select(stmt, null);

    this._clearFields ();
    this.selectData ();
  }

  _validateFields() {
    if (this.state.id == "" || this.state.name == "") {
      this._showError("All fields are mandatory");
      return false;
    }
    if (isNaN(parseInt(this.state.id))) {
      this._showError("Enter a number");
      // this.id_entry.grab_focus();
      return false;
    }
    return true;
  }

  _clearFields() {
    this.setState({id: '', name: ''});
    // this.id_entry.grab_focus ();
  }
}

//    this.window = new Gtk.Window ({title: "Data Access Demo", height_request: 350});
renderGtk(<DemoWindow />);

