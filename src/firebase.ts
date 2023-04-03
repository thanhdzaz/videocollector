import { getAnalytics } from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseStorage, getStorage, ref, StorageReference, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore/lite';

import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA_cWBOSYsklCHpKbeW4ZZC58ft1SHPkbs',
  authDomain: 'videocollector-0000.firebaseapp.com',
  projectId: 'videocollector-0000',
  storageBucket: 'videocollector-0000.appspot.com',
  messagingSenderId: '42551320152',
  appId: '1:42551320152:web:b964482944908c5c7a742d',
  measurementId: 'G-17TW22FZCY'
};

export const firebaseApp = (): FirebaseApp => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);


  return app;
};


export const firebaseAppForUser = (): FirebaseApp => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig, 'admin');

  return app;
};

export const getStore = (): Firestore => getFirestore(firebaseApp());

class FirestoreService {
  db = getStore();

  collection = (name: string) => collection(this.db, name);

  add = async (collectionName: string, data: any): Promise<any> => {
    try {
      const db = collection(this.db, collectionName);

      const docRef = await addDoc(db, data);

      this.update(collectionName, docRef.id, { id: docRef.id });

      return Promise.resolve({ ...data, id: docRef.id });
    }
    catch (error) {
      return Promise.reject(error);
    }

  };


  update = async (collectionName: string, docName: string, data: any): Promise<any> => {
    try {
      const docRef = doc(this.db, collectionName, docName);
      return await updateDoc(docRef, data);
    }
    catch (error) {
      return Promise.reject(error);
    }
  };

  addWithId = async (collectionName: string, id: string, data: any): Promise<any> => {
    try {
      const docRef = await setDoc(doc(this.db, collectionName, id), data);
      this.update(collectionName, id, { id });

      return Promise.resolve(docRef);
    }
    catch (error) {
      return Promise.reject(error);
    }

  };

  get = async (collectionName: string): Promise<any> => {

    const coll = collection(this.db, collectionName);
    const docs = await getDocs(coll);
    const res = docs.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return res;

  };

  getByDoc = async (collectionName: string, id: string): Promise<any> => {

    const coll = doc(this.db, collectionName, id);
    const docs = await getDoc(coll);
    const res = docs.data();
    return res;

  };

  delete = async (collectionName: string, id: string): Promise<any> => {
    try {
      await deleteDoc(doc(this.db, collectionName, id));
      return Promise.resolve(true);
    }
    catch (error) {
      return Promise.reject(error);
    }
  };

  createUser = async (user: any): Promise<any | any> => {

    try {
      let result: any = false;
      const auth = getAuth(firebaseAppForUser());
      await createUserWithEmailAndPassword(auth, user.email, user.password ?? '123456')
        .then(async (userCredential) => {
          // Signed in
          const u = userCredential.user;
          await this.addWithId('Users', u.uid, user);
          result = true;
          // ...
        })
        .catch((error: any) => {
          const errorCode = error.code;
          switch (errorCode) {
            case 'auth/email-already-in-use':
              {
                // Notify('error', `Địa chỉ email '${user.email}' đã tồn tại trên hệ thống tài khoản!!`);
                result = false;
                break;
              }
            case 'auth/wrong-password':
              {
                // Notify('error', 'Bạn đã nhập sai mật khẩu vui lòng kiểm tra lại!!');
                break;
              }
            default:
              break;
          }
          // ..
        });
      return Promise.resolve(result);
    }
    catch (error) {
      console.log(error);

      return Promise.reject(error);
    }
  };

}

class Storage {
  storage: FirebaseStorage;
  reference: StorageReference;
  constructor() {
    this.storage = getStorage(firebaseApp());
    this.reference = ref(this.storage);
  }

  async upload(reference: string, file: any) {
    if (!file) {
      throw new Error('File lỗi');
    }
    const { ref: f } = await uploadBytes(ref(this.storage, reference), file);

    return getDownloadURL(f);
  }
}

export const storage = new Storage();

export const firestore = new FirestoreService();

export const auth = getAuth(firebaseApp());
