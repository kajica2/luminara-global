import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ padding: "120px 24px", textAlign: "center" }}>
      <p className="eyebrow">404</p>
      <h1 style={{ fontFamily: "var(--font-mono)", marginBottom: 16 }}>Off the manifest.</h1>
      <p style={{ maxWidth: 480, margin: "0 auto 32px" }}>
        That page isn&apos;t here. Try one of the sections in the nav, or head
        back to the front door.
      </p>
      <Link href="/" className="btn btn--primary">Back to home</Link>
    </main>
  );
}
