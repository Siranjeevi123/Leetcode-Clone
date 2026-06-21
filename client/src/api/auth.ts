import { api } from "./client";
import type { User } from "../types";

export async function signup(body: {
  firstName: string;
  emailId: string;
  password: string;
}) {
  return api<{ message: string; user: Pick<User, "_id" | "firstName" | "emailId"> }>(
    "/auth/signup",
    { method: "POST", body: JSON.stringify(body) }
  );
}

export async function login(body: { emailId: string; password: string }) {
  return api<{ message: string; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function logout() {
  return api<{ success: boolean; message: string }>("/auth/logout", {
    method: "POST",
  });
}

export async function getProfile() {
  return api<{ success: boolean; user: User }>("/auth/getProfile");
}

export async function deleteAccount() {
  return api<{ success: boolean; message: string }>("/auth/", {
    method: "DELETE",
  });
}

export async function adminSignup(body: {
  firstName: string;
  emailId: string;
  password: string;
  role?: "admin";
}) {
  return api<{ message: string; user: Pick<User, "_id" | "firstName" | "emailId"> }>(
    "/auth/admin/signup",
    { method: "POST", body: JSON.stringify(body) }
  );
}
