import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import PageHero from "@/components/page-hero";

/*
 * Plain-language policy describing what this site actually does (see
 * app/api/leads, lib/attribution.ts, components/analytics.tsx, the Google
 * map embed, cart localStorage). Update it whenever a new tool is added.
 * Not legal advice — have the owner (and ideally a lawyer) review it.
 */

const UPDATED = "October 21, 2026";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects your information when you order, request catering or sign up for updates.`,
  path: "/privacy/",
});

export default function PrivacyPage() {
  const { address } = SITE;
  return (
    <>
      <PageHero
        crumb="Privacy policy"
        path="/privacy/"
        eyebrow="Legal"
        title="Privacy policy"
        lede={`Last updated ${UPDATED}. This explains what information ${SITE.name} collects through this website, how we use it, and the choices you have.`}
      />
      <section className="section">
        <div className="container prose">
          <h2>Who we are</h2>
          <p>
            {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a restaurant and caterer at {address.street},{" "}
            {address.city}, {address.region} {address.postalCode}. Questions about this policy? Email{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call{" "}
            <a href={`tel:${SITE.phoneE164}`}>{SITE.phone}</a>.
          </p>

          <h2>Information you give us</h2>
          <ul>
            <li>
              <strong>Catering quotes and pre-order requests:</strong> your name, email, phone number, event or
              pickup date, guest count, location, the dishes in your cart and anything you write in the message.
            </li>
            <li>
              <strong>Email sign-ups</strong> (newsletter, shipping waitlist): your email address and, if you
              provide it, your first name.
            </li>
            <li>
              <strong>Orders and payments</strong> are completed on our payment provider&apos;s checkout (Square).
              We don&apos;t receive or store your card details. Delivery orders are fulfilled by DoorDash, which
              handles your delivery information under its own privacy policy.
            </li>
          </ul>

          <h2>Information collected automatically</h2>
          <ul>
            <li>
              <strong>Stored in your browser:</strong> your cart, and how you first and most recently arrived
              at our site (for example a campaign link&apos;s tags such as <code>utm_source</code>, an ad click
              ID, or the referring website). This stays on your device until you clear it, and is sent to us
              only if you submit a form.
            </li>
            <li>
              <strong>Analytics and advertising tools</strong> (when enabled): Google Analytics and the Meta
              (Facebook/Instagram) Pixel use cookies and similar technologies to record pages you visit and
              actions such as adding to cart or sending a request. This helps us measure our marketing and show
              relevant ads on those platforms.
            </li>
            <li>
              <strong>Google Maps:</strong> our map (and, when enabled, live reviews and hours) comes from Google, which may set its own cookies
              and collect usage data under the{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Server logs:</strong> our hosting provider (Vercel) processes standard technical data such
              as IP address and browser type to deliver and secure the site.
            </li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To respond to your requests, prepare your order and confirm pickup, delivery and payment.</li>
            <li>To send emails you signed up for, such as specials, new menu items and shipping updates.</li>
            <li>To understand which campaigns and pages work, and to improve our menu, site and marketing.</li>
            <li>To keep the site secure and prevent spam and abuse.</li>
          </ul>

          <h2>Who we share it with</h2>
          <p>
            We share information only with service providers that help us run the business, and only for that
            purpose: our website host, our customer-relationship (CRM) system where requests are recorded, the
            team messaging tool that notifies us of new requests, our payment provider (Square), DoorDash for
            deliveries, and — when enabled — Google and Meta for analytics and advertising.
          </p>
          <p>
            We do not sell your personal information for money. Using advertising cookies to measure and target
            ads may count as &ldquo;sharing&rdquo; or &ldquo;targeted advertising&rdquo; under some state privacy
            laws; you can opt out as described below.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>
              <strong>Emails:</strong> every marketing email includes an unsubscribe link, or email us and
              we&apos;ll remove you.
            </li>
            <li>
              <strong>Text messages:</strong> we don&apos;t currently send marketing texts. If we start, we&apos;ll
              ask for your consent separately.
            </li>
            <li>
              <strong>Cookies and ads:</strong> you can block or delete cookies in your browser, use the{" "}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                Google Analytics opt-out add-on
              </a>
              , adjust{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                Google ad settings
              </a>{" "}
              and{" "}
              <a href="https://www.facebook.com/adpreferences" target="_blank" rel="noopener noreferrer">
                Meta ad preferences
              </a>
              , or opt out of interest-based ads at{" "}
              <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">
                aboutads.info
              </a>
              .
            </li>
            <li>
              <strong>Access, correction and deletion:</strong> email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
              to ask what we hold about you, correct it, or delete it. We&apos;ll respond within a reasonable time.
            </li>
          </ul>

          <h2>How long we keep it</h2>
          <p>
            We keep request and customer information as long as needed to serve you and run the business, and
            delete it when you ask us to unless we must keep it for legal or accounting reasons.
          </p>

          <h2>Security</h2>
          <p>
            The site uses HTTPS, and access to our systems is limited to people who need it. No method of
            transmission or storage is completely secure, but we work to protect your information.
          </p>

          <h2>Children</h2>
          <p>This site is not directed to children under 13, and we don&apos;t knowingly collect their information.</p>

          <h2>Changes</h2>
          <p>
            If we change this policy we&apos;ll update the date above. Significant changes will be highlighted on
            this page.
          </p>

          <p className="prose-back">
            <Link href="/">← Back to {SITE.name}</Link>
          </p>
        </div>
      </section>
    </>
  );
}
