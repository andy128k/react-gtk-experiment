const Gtk = imports.gi.Gtk;

import ReactInjection from 'react/lib/ReactInjection';
import ReactDefaultBatchingStrategy from 'react/lib/ReactDefaultBatchingStrategy';

import instantiateReactComponent from 'react/lib/instantiateReactComponent';
import ReactInstanceHandles from 'react/lib/ReactInstanceHandles';
import ReactUpdates from 'react/lib/ReactUpdates';

import GtkReconcileTransaction from './reconcileTransaction';
import GtkComponent from './GtkComponent';


ReactInjection.HostComponent.injectGenericComponentClass(GtkComponent);
ReactInjection.Updates.injectReconcileTransaction(GtkReconcileTransaction);
ReactInjection.Updates.injectBatchingStrategy(ReactDefaultBatchingStrategy);

export default function(nextElement, callback) {

  const rootId = ReactInstanceHandles.createReactRootID(0);
  const component = instantiateReactComponent(nextElement);

  Gtk.init(null, null);

  let window = new Gtk.Window({title: "React Gtk Demo", width_request: 350, height_request: 350});
  window.connect("delete-event", function() {
    Gtk.main_quit();
    return true;
  });

  ReactUpdates.batchedUpdates(() => {
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(() => {
      let w = component.mountComponent(
        transaction,
        rootId,
        {_idCounter: 0},
        {}
      );
      window.add(w);
      window.show_all();
      if (callback) {
        callback(component.getPublicInstance());
      }
    });
    ReactUpdates.ReactReconcileTransaction.release(transaction);
  });

  Gtk.main();
};

export { default as Box } from './components/Box';
export { default as Label } from './components/Label';
export { default as Entry } from './components/Entry';
export { default as Button } from './components/Button';
export { default as ScrolledWindow } from './components/ScrolledWindow';
export { default as TextView } from './components/TextView';

