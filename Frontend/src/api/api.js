import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const fetchResources = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "academic_resources"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
};

export const updateResource = async (id, data) => {
  try {
    const docRef = doc(db, "academic_resources", id);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Error updating resource:", error);
    return false;
  }
};

export const deleteResource = async (id) => {
  try {
    await deleteDoc(doc(db, "academic_resources", id));
    return true;
  } catch (error) {
    console.error("Error deleting resource:", error);
    return false;
  }
};

export const fetchNews = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "association_news"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const updateNews = async (id, data) => {
  try {
    const docRef = doc(db, "association_news", id);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Error updating news:", error);
    return false;
  }
};

export const deleteNews = async (id) => {
  try {
    await deleteDoc(doc(db, "association_news", id));
    return true;
  } catch (error) {
    console.error("Error deleting news:", error);
    return false;
  }
};

export const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events_archive"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const updateEvent = async (id, data) => {
  try {
    const docRef = doc(db, "events_archive", id);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    return false;
  }
};

export const deleteEvent = async (id) => {
  try {
    await deleteDoc(doc(db, "events_archive", id));
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
};
