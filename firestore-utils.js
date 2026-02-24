// firestore-utils.js
// Utility functions for Firestore operations

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

/**
 * Get user by email
 */
export async function getUserByEmail(db, email) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

/**
 * Get user by student ID
 */
export async function getUserByStudentId(db, studentId) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('studentId', '==', studentId));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

/**
 * Create user account
 */
export async function createUserAccount(db, userData) {
  const docRef = await addDoc(collection(db, 'users'), {
    ...userData,
    createdAt: serverTimestamp(),
    emailChangeUsed: false
  });
  return docRef.id;
}

/**
 * Update user account
 */
export async function updateUserAccount(db, userId, updates) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updates);
}

/**
 * Get transaction by ID
 */
export async function getTransaction(db, transactionId) {
  const transRef = doc(db, 'transactions', transactionId);
  const snapshot = await getDoc(transRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

/**
 * Create transaction
 */
export async function createTransaction(db, transactionId, data) {
  const transRef = doc(db, 'transactions', transactionId);
  await setDoc(transRef, {
    ...data,
    claimed: false,
    createdAt: serverTimestamp()
  });
}

/**
 * Claim transaction
 */
export async function claimTransaction(db, transactionId, studentId) {
  const transRef = doc(db, 'transactions', transactionId);
  await updateDoc(transRef, {
    claimed: true,
    claimedBy: studentId,
    claimedAt: serverTimestamp()
  });
}

/**
 * Get class schedule
 */
export async function getClassSchedule(db) {
  const classRef = doc(db, 'settings', 'class-schedule');
  const snapshot = await getDoc(classRef);
  return snapshot.exists() ? snapshot.data() : null;
}

/**
 * Update class schedule
 */
export async function updateClassSchedule(db, scheduleData) {
  const classRef = doc(db, 'settings', 'class-schedule');
  await setDoc(classRef, {
    ...scheduleData,
    updatedAt: serverTimestamp()
  });
}

/**
 * Generate student ID and email from username
 */
export function generateStudentCredentials(username) {
  const timestamp = Date.now().toString().slice(-3);
  const studentId = `student${timestamp}`;
  const email = `${username}@masrur.bro`;
  return { studentId, email };
}

/**
 * Generate random password
 */
export function generatePassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Check if email change is allowed
 */
export async function canChangeEmail(db, userId) {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return !snapshot.data().emailChangeUsed;
  }
  return false;
}

/**
 * Mark email change as used
 */
export async function markEmailChangeUsed(db, userId) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { emailChangeUsed: true });
}
