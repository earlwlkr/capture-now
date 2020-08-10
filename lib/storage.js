const admin = require('firebase-admin');

class Storage {
  constructor() {
    if (!admin.apps.length) {
      console.log('init app 1');
      try {
        const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (err) {
        console.error('error init firebase', err);
      }
    }

    this.db = admin.firestore();
  }

  async list(tableName) {
    try {
      const snapshot = await this.db.collection(tableName).get();
      const items = [];
      snapshot.forEach(i => items.push(i.data()));
      return [null, items];
    } catch (err) {
      return [err, null];
    }
  }

  async add(table, item) {
    try {
      await this.db
        .collection(table)
        .doc(item.id + '')
        .set(item);
      return [null, true];
    } catch (err) {
      console.error(err);
      return [err, null];
    }
  }

  async setAll(table, data) {
    try {
      const batch = this.db.batch();

      for (let item of data) {
        batch.set(this.db.collection(table).doc(item.id + ''), item);
      }

      await batch.commit();
      return [null, true];
    } catch (err) {
      console.log(err);
      return [err, null];
    }
  }
}

const storage = new Storage();
module.exports = storage;
