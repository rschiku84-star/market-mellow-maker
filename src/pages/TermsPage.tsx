import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 9, 2026</p>

          <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using CreatorHub, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">2. Account Registration</h2>
              <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">3. Subscriptions & Payments</h2>
              <p>CreatorHub offers Free, Pro, and Premium subscription plans. Paid plans are billed on a monthly basis. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Use the platform for any unlawful purpose.</li>
                <li>Upload content that infringes on intellectual property rights.</li>
                <li>Attempt to reverse engineer or exploit the platform.</li>
                <li>Share your account credentials with others.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">5. Intellectual Property</h2>
              <p>Content you create using CreatorHub belongs to you. However, you grant us a limited license to process and store your content for the purpose of providing our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
              <p>CreatorHub is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">7. Modifications</h2>
              <p>We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mb-3">8. Contact</h2>
              <p>For questions about these terms, contact us at <a href="mailto:support@creatorhub.com" className="text-primary hover:underline">support@creatorhub.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
