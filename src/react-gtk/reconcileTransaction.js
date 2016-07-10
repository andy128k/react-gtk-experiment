import CallbackQueue from 'react/lib/CallbackQueue';
import PooledClass from 'react/lib/PooledClass';
import Transaction from 'react/lib/Transaction';
import ReactUpdateQueue from 'react/lib/ReactUpdateQueue';

/**
 * Provides a `CallbackQueue` queue for collecting `onDOMReady` or analogous
 * callbacks during the performing of the transaction.
 */
const ON_RENDERER_READY_QUEUEING = {
  /**
   * Initializes the internal firmata `connected` queue.
   */
  initialize() {
    this.reactMountReady.reset();
  },

  /**
   * After Hardware is connected, invoke all registered `ready` callbacks.
   */
  close() {
    this.reactMountReady.notifyAll();
  },
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
const TRANSACTION_WRAPPERS = [ON_RENDERER_READY_QUEUEING];

function GtkReconcileTransaction() {
  this.reinitializeTransaction();
  this.reactMountReady = CallbackQueue.getPooled(null);
}

const Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array<object>} List of operation wrap procedures.
   */
  getTransactionWrappers() {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `ready` callbacks with.
   */
  getReactMountReady() {
    return this.reactMountReady;
  },

  /**
   * @return {object} The queue to collect React async events.
   */
  getUpdateQueue() {
    return ReactUpdateQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be reused.
   */
  destructor() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;
  },
};

Object.assign(
  GtkReconcileTransaction.prototype,
  Transaction.Mixin,
  GtkReconcileTransaction,
  Mixin
);

PooledClass.addPoolingTo(GtkReconcileTransaction);

export default GtkReconcileTransaction;

