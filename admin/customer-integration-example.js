// Example: customer website data loader for Part 4.
// Import firebase.js from this admin folder only after adapting the path for your customer site.
import {db} from "./firebase.js";
import {collection,getDocs,doc,getDoc} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export async function getCustomerCatalog(){
  const [ps,cs,ss]=await Promise.all([
    getDocs(collection(db,"products")),
    getDocs(collection(db,"categories")),
    getDoc(doc(db,"settings","site"))
  ]);
  return {
    products: ps.docs.map(d=>d.data()),
    categories: cs.docs.map(d=>d.data()),
    settings: ss.exists()?ss.data():{}
  };
}
