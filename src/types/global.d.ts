export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: string;
      // Add other metadata fields you expect
    }
    email?: string;
  }
}