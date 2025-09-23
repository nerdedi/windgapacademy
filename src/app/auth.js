// Simple mock auth for build compatibility
// eslint-disable-next-line no-unused-vars
export async function signInEmail(email, password) {
  console.warn("signInEmail not available - using mock");
  return Promise.resolve({ user: { uid: "mock-user", email } });
}

export async function signOutUser() {
  console.warn("signOutUser not available - using mock");
  return Promise.resolve();
}
